import { NextRequest, NextResponse } from 'next/server'
import { 
  logSecurityEvent, 
  sanitizeInput, 
  checkRequestSize, 
  validateRequest,
  createSecurityAlert,
  SecurityMonitor
} from './security'
import { checkRateLimit } from './rateLimit'
import { createServerSupabase } from './supabaseServer'

interface SecurityMiddlewareOptions {
  enableEnhancedChecks?: boolean
  enableRequestValidation?: boolean
  enableSecurityAlerts?: boolean
  rateLimitConfig?: {
    requests: number
    windowMs: number
  }
}

export async function optionalApiSecurityMiddleware(
  req: NextRequest,
  handler: (req: NextRequest, user: any) => Promise<NextResponse>,
  options: SecurityMiddlewareOptions = {}
) {
  const {
    enableEnhancedChecks = false,
    enableRequestValidation = false,
    enableSecurityAlerts = false,
    rateLimitConfig = { requests: 20, windowMs: 60 * 1000 }
  } = options

  const monitor = SecurityMonitor.getInstance()
  const startTime = Date.now()

  try {
    // Basic request size check (always enabled)
    if (!checkRequestSize(req)) {
      logSecurityEvent('REQUEST_TOO_LARGE', { path: req.nextUrl.pathname }, req)
      return NextResponse.json({ error: 'Request too large' }, { status: 413 })
    }

    // Enhanced request validation (optional)
    if (enableRequestValidation) {
      const validation = validateRequest(req)
      if (!validation.valid) {
        const alert = createSecurityAlert(
          'medium',
          'SUSPICIOUS_REQUEST',
          { path: req.nextUrl.pathname, issues: validation.issues },
          undefined,
          req.ip || req.headers.get('x-forwarded-for') || 'unknown'
        )
        monitor.logAlert(alert)
        
        logSecurityEvent('SUSPICIOUS_REQUEST', { 
          path: req.nextUrl.pathname, 
          issues: validation.issues 
        }, req)
        
        return NextResponse.json({ error: 'Invalid request' }, { status: 400 })
      }
    }

    // Authentication check (always enabled)
    const supabase = createServerSupabase(req)
    const { data: { user }, error } = await supabase.auth.getUser()
    
    if (error || !user) {
      logSecurityEvent('UNAUTHORIZED_ACCESS', { path: req.nextUrl.pathname }, req)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Enhanced rate limiting (optional)
    if (enableEnhancedChecks) {
      const rateLimitKey = `${req.nextUrl.pathname}:${user.id}`
      const rateLimitAllowed = checkRateLimit(rateLimitKey, rateLimitConfig.requests, rateLimitConfig.windowMs)
      
      if (!rateLimitAllowed) {
        const alert = createSecurityAlert(
          'medium',
          'RATE_LIMIT_EXCEEDED',
          { userId: user.id, path: req.nextUrl.pathname },
          user.id,
          req.ip || req.headers.get('x-forwarded-for') || 'unknown'
        )
        monitor.logAlert(alert)
        
        logSecurityEvent('RATE_LIMIT_EXCEEDED', { 
          userId: user.id, 
          path: req.nextUrl.pathname 
        }, req)
        
        return NextResponse.json({ error: 'Rate limit exceeded' }, { status: 429 })
      }
    }

    // Call the actual handler
    const response = await handler(req, user)
    
    // Log successful requests (optional)
    if (enableSecurityAlerts) {
      const duration = Date.now() - startTime
      if (duration > 5000) { // Log slow requests
        const alert = createSecurityAlert(
          'low',
          'SLOW_REQUEST',
          { 
            path: req.nextUrl.pathname, 
            duration, 
            userId: user.id 
          },
          user.id,
          req.ip || req.headers.get('x-forwarded-for') || 'unknown'
        )
        monitor.logAlert(alert)
      }
    }

    return response
  } catch (error) {
    const duration = Date.now() - startTime
    
    // Log security-related errors
    if (enableSecurityAlerts) {
      const alert = createSecurityAlert(
        'high',
        'API_ERROR',
        { 
          path: req.nextUrl.pathname, 
          error: error instanceof Error ? error.message : 'Unknown error',
          duration
        },
        user?.id,
        req.ip || req.headers.get('x-forwarded-for') || 'unknown'
      )
      monitor.logAlert(alert)
    }
    
    logSecurityEvent('API_ERROR', { 
      path: req.nextUrl.pathname, 
      error: error instanceof Error ? error.message : 'Unknown error',
      duration
    }, req)
    
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Utility function to apply security headers to responses
export function applySecurityHeaders(response: NextResponse): NextResponse {
  const securityHeaders = {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
    'X-DNS-Prefetch-Control': 'off',
    'X-Download-Options': 'noopen',
    'X-Permitted-Cross-Domain-Policies': 'none'
  }

  Object.entries(securityHeaders).forEach(([key, value]) => {
    response.headers.set(key, value)
  })

  return response
}

// Utility function to sanitize response data
export function sanitizeResponseData(data: any): any {
  if (typeof data === 'string') {
    return sanitizeInput(data)
  }
  
  if (Array.isArray(data)) {
    return data.map(item => sanitizeResponseData(item))
  }
  
  if (typeof data === 'object' && data !== null) {
    const sanitized: any = {}
    for (const [key, value] of Object.entries(data)) {
      sanitized[key] = sanitizeResponseData(value)
    }
    return sanitized
  }
  
  return data
}
