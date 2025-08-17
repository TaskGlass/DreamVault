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

export function sanitizeInput(input: string): string {
  return input
    .replace(/[<>]/g, '') // Remove potential HTML tags
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, '') // Remove event handlers
    .trim()
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

export function getSecurityHeaders(): Record<string, string> {
  return {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  }
}

export function getCORSHeaders(allowedOrigin: string): Record<string, string> {
  return {
    'Access-Control-Allow-Origin': allowedOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With',
    'Access-Control-Allow-Credentials': 'true'
  }
}
