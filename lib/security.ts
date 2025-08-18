import { NextRequest } from 'next/server'

export interface SecurityEvent {
  event: string
  details: any
  userId?: string
  timestamp: string
  ip?: string
  userAgent?: string
  path?: string
  method?: string
}

export interface SecurityAlert {
  level: 'low' | 'medium' | 'high' | 'critical'
  event: string
  details: any
  timestamp: string
  userId?: string
  ip?: string
}

export function logSecurityEvent(
  event: string, 
  details: any, 
  req?: NextRequest,
  userId?: string
) {
  const securityEvent: SecurityEvent = {
    event,
    details,
    userId,
    timestamp: new Date().toISOString(),
    ip: req?.ip || req?.headers.get('x-forwarded-for') || req?.headers.get('x-real-ip') || 'unknown',
    userAgent: req?.headers.get('user-agent') || 'unknown',
    path: req?.nextUrl?.pathname || 'unknown',
    method: req?.method || 'unknown'
  }

  // Log to console in development, could be extended to log to external service
  console.log(`[SECURITY] ${event}:`, securityEvent)
  
  // In production, you might want to send this to a security monitoring service
  // await sendToSecurityService(securityEvent)
}

// Enhanced input sanitization
export function sanitizeInput(input: string): string {
  if (typeof input !== 'string') return ''
  
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .replace(/['";\\]/g, '') // Remove SQL injection patterns
    .replace(/--/g, '') // Remove SQL comments
    .replace(/\/\*/g, '') // Remove SQL comment start
    .replace(/\*\//g, '') // Remove SQL comment end
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .trim()
}

// Enhanced HTML sanitization
export function sanitizeHtml(input: string): string {
  if (typeof input !== 'string') return ''
  
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '') // Remove script tags
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '') // Remove iframe tags
    .replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, '') // Remove object tags
    .replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, '') // Remove embed tags
    .replace(/javascript:/gi, '') // Remove javascript protocol
    .replace(/vbscript:/gi, '') // Remove vbscript protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
}

// Email validation
export function validateEmail(email: string): boolean {
  if (typeof email !== 'string') return false
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email) && email.length <= 254
}

// Password strength validation
export function validatePasswordStrength(password: string): { valid: boolean; issues: string[] } {
  const issues: string[] = []
  
  if (typeof password !== 'string') {
    issues.push('Password must be a string')
    return { valid: false, issues }
  }
  
  if (password.length < 8) {
    issues.push('Password must be at least 8 characters long')
  }
  
  if (password.length > 128) {
    issues.push('Password must be less than 128 characters')
  }
  
  if (!/[A-Z]/.test(password)) {
    issues.push('Password must contain at least one uppercase letter')
  }
  
  if (!/[a-z]/.test(password)) {
    issues.push('Password must contain at least one lowercase letter')
  }
  
  if (!/\d/.test(password)) {
    issues.push('Password must contain at least one number')
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
    issues.push('Password must contain at least one special character')
  }
  
  return { valid: issues.length === 0, issues }
}

export function validateOrigin(origin: string | null, allowedOrigins: string[]): boolean {
  if (!origin) return false
  return allowedOrigins.includes(origin)
}

export function generateNonce(): string {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
}

export function validateCSRFToken(token: string | null, sessionToken: string | null): boolean {
  if (!token || !sessionToken) return false
  // In a real implementation, you'd want to use a proper CSRF token validation
  // This is a simplified version
  return token === sessionToken
}

export function checkRequestSize(req: NextRequest, maxSize: number = 1024 * 1024): boolean {
  const contentLength = req.headers.get('content-length')
  if (contentLength) {
    const size = parseInt(contentLength, 10)
    return size <= maxSize
  }
  return true
}

// Enhanced request validation
export function validateRequest(req: NextRequest): { valid: boolean; issues: string[] } {
  const issues: string[] = []
  
  // Check request size
  if (!checkRequestSize(req)) {
    issues.push('Request too large')
  }
  
  // Check for suspicious headers
  const suspiciousHeaders = ['x-forwarded-host', 'x-original-url', 'x-rewrite-url']
  for (const header of suspiciousHeaders) {
    if (req.headers.get(header)) {
      issues.push(`Suspicious header detected: ${header}`)
    }
  }
  
  // Check for suspicious user agents
  const suspiciousUserAgents = ['sqlmap', 'nikto', 'nmap', 'scanner']
  const userAgent = req.headers.get('user-agent')?.toLowerCase() || ''
  for (const agent of suspiciousUserAgents) {
    if (userAgent.includes(agent)) {
      issues.push(`Suspicious user agent detected: ${agent}`)
    }
  }
  
  return { valid: issues.length === 0, issues }
}

// Rate limiting helper
export function isRateLimitExceeded(identifier: string, limit: number, windowMs: number): boolean {
  // This is a simplified version - in production, use Redis or a proper rate limiting service
  const now = Date.now()
  const key = `rate_limit:${identifier}`
  
  // For now, we'll use a simple in-memory approach
  // In production, this should use Redis or a similar service
  return false // Placeholder - actual implementation would check against stored data
}

export function getSecurityHeaders(): Record<string, string> {
  return {
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
}

export function getCORSHeaders(allowedOrigin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Max-Age': '86400'
  }
}

// Security monitoring class
export class SecurityMonitor {
  private static instance: SecurityMonitor
  private alerts: SecurityAlert[] = []
  
  static getInstance(): SecurityMonitor {
    if (!SecurityMonitor.instance) {
      SecurityMonitor.instance = new SecurityMonitor()
    }
    return SecurityMonitor.instance
  }
  
  logAlert(alert: SecurityAlert) {
    this.alerts.push(alert)
    
    // Log to console in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`[SECURITY ALERT] ${alert.level.toUpperCase()}:`, alert)
    }
    
    // In production, you could send to external services
    if (alert.level === 'high' || alert.level === 'critical') {
      this.sendAlert(alert)
    }
  }
  
  private async sendAlert(alert: SecurityAlert) {
    // In production, integrate with services like:
    // - Sentry for error tracking
    // - PagerDuty for critical alerts
    // - Slack/Discord for team notifications
    // - AWS CloudWatch for monitoring
    
    // For now, just log it
    console.log(`[CRITICAL ALERT] ${alert.event}:`, alert.details)
  }
  
  getRecentAlerts(minutes: number = 60): SecurityAlert[] {
    const cutoff = Date.now() - (minutes * 60 * 1000)
    return this.alerts.filter(alert => 
      new Date(alert.timestamp).getTime() > cutoff
    )
  }
  
  getAlertCount(level?: 'low' | 'medium' | 'high' | 'critical'): number {
    if (level) {
      return this.alerts.filter(alert => alert.level === level).length
    }
    return this.alerts.length
  }
}

// Utility function to create security alerts
export function createSecurityAlert(
  level: 'low' | 'medium' | 'high' | 'critical',
  event: string,
  details: any,
  userId?: string,
  ip?: string
): SecurityAlert {
  return {
    level,
    event,
    details,
    timestamp: new Date().toISOString(),
    userId,
    ip
  }
}
