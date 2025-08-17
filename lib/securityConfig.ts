// Security Configuration for DreamVault
export const SECURITY_CONFIG = {
  // Rate Limiting
  rateLimits: {
    chat: { requests: 10, windowMs: 60 * 1000 }, // 10 requests per minute
    horoscope: { requests: 5, windowMs: 60 * 1000 }, // 5 requests per minute
    affirmation: { requests: 10, windowMs: 60 * 1000 }, // 10 requests per minute
    moonPhase: { requests: 10, windowMs: 60 * 1000 }, // 10 requests per minute
    checkout: { requests: 3, windowMs: 60 * 1000 }, // 3 requests per minute
    default: { requests: 20, windowMs: 60 * 1000 } // 20 requests per minute
  },

  // Input Validation
  inputLimits: {
    maxTitleLength: 200,
    maxDescriptionLength: 5000,
    maxBioLength: 500,
    maxNameLength: 100,
    maxMessageLength: 4000,
    maxMessagesPerRequest: 50,
    maxSymbolsPerDream: 20,
    maxSymbolLength: 100
  },

  // CORS Settings
  cors: {
    allowedOrigins: [
      'http://localhost:3000',
      'https://yourdomain.com', // Replace with your actual domain
      process.env.ALLOWED_ORIGIN
    ].filter(Boolean),
    allowedMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    allowCredentials: true
  },

  // Security Headers
  securityHeaders: {
    'X-Frame-Options': 'DENY',
    'X-Content-Type-Options': 'nosniff',
    'Referrer-Policy': 'strict-origin-when-cross-origin',
    'Permissions-Policy': 'camera=(), microphone=(), geolocation=()',
    'X-XSS-Protection': '1; mode=block',
    'Strict-Transport-Security': 'max-age=31536000; includeSubDomains'
  },

  // Request Limits
  requestLimits: {
    maxBodySize: 1024 * 1024, // 1MB
    maxUrlLength: 2048,
    maxHeaderSize: 8192
  },

  // Authentication
  auth: {
    sessionTimeout: 24 * 60 * 60 * 1000, // 24 hours
    refreshTokenThreshold: 5 * 60 * 1000, // 5 minutes before expiry
    maxLoginAttempts: 5,
    lockoutDuration: 15 * 60 * 1000 // 15 minutes
  },

  // Logging
  logging: {
    enabled: true,
    logLevel: process.env.NODE_ENV === 'production' ? 'warn' : 'info',
    sensitiveFields: ['password', 'token', 'secret', 'key'],
    maxLogSize: 1000 // Max number of log entries to keep in memory
  },

  // API Security
  api: {
    requireAuth: true,
    validateOrigin: true,
    logAllRequests: true,
    sanitizeInputs: true,
    rateLimitByUser: true
  }
}

// Environment-specific overrides
export function getSecurityConfig() {
  const config = { ...SECURITY_CONFIG }
  
  if (process.env.NODE_ENV === 'development') {
    config.rateLimits = {
      ...config.rateLimits,
      chat: { requests: 100, windowMs: 60 * 1000 }, // More lenient in dev
      horoscope: { requests: 50, windowMs: 60 * 1000 }
    }
    config.logging.logLevel = 'debug'
  }
  
  if (process.env.NODE_ENV === 'production') {
    config.cors.allowedOrigins = config.cors.allowedOrigins.filter(
      origin => origin !== 'http://localhost:3000'
    )
  }
  
  return config
}

// Utility functions
export function isProduction() {
  return process.env.NODE_ENV === 'production'
}

export function isDevelopment() {
  return process.env.NODE_ENV === 'development'
}

export function getRateLimitConfig(feature: keyof typeof SECURITY_CONFIG.rateLimits) {
  const config = getSecurityConfig()
  return config.rateLimits[feature] || config.rateLimits.default
}
