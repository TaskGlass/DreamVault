import { NextRequest } from 'next/server'

interface RateLimitRecord {
  count: number
  resetTime: number
}

const rateLimitMap = new Map<string, RateLimitRecord>()

export function checkRateLimit(
  identifier: string, 
  limit: number, 
  windowMs: number
): boolean {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)
  
  if (!record || now > record.resetTime) {
    rateLimitMap.set(identifier, { count: 1, resetTime: now + windowMs })
    return true
  }
  
  if (record.count >= limit) {
    return false
  }
  
  record.count++
  return true
}

export function getRateLimitHeaders(identifier: string, limit: number, windowMs: number) {
  const record = rateLimitMap.get(identifier)
  const now = Date.now()
  
  if (!record || now > record.resetTime) {
    return {
      'X-RateLimit-Limit': limit.toString(),
      'X-RateLimit-Remaining': limit.toString(),
      'X-RateLimit-Reset': new Date(now + windowMs).toISOString()
    }
  }
  
  return {
    'X-RateLimit-Limit': limit.toString(),
    'X-RateLimit-Remaining': Math.max(0, limit - record.count).toString(),
    'X-RateLimit-Reset': new Date(record.resetTime).toISOString()
  }
}

export function cleanupExpiredRecords() {
  const now = Date.now()
  for (const [key, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(key)
    }
  }
}

// Clean up expired records every 5 minutes
setInterval(cleanupExpiredRecords, 5 * 60 * 1000)
