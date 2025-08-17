import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseServer'
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rateLimit'
import { validateInput, moonPhaseSchema } from '@/lib/validation'
import { logSecurityEvent, sanitizeInput } from '@/lib/security'

export async function POST(req: NextRequest) {
  try {
    // Add authentication check
    const supabase = createServerSupabase(req)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      logSecurityEvent('UNAUTHORIZED_ACCESS', { path: '/api/generate-moon-phase' }, req as any)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Rate limiting
    const rateLimitKey = `moon-phase:${user.id}`
    const rateLimitAllowed = checkRateLimit(rateLimitKey, 10, 60 * 1000) // 10 requests per minute
    
    if (!rateLimitAllowed) {
      logSecurityEvent('RATE_LIMIT_EXCEEDED', { userId: user.id, path: '/api/generate-moon-phase' }, req as any)
      return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { 
        status: 429,
        headers: getRateLimitHeaders(rateLimitKey, 10, 60 * 1000)
      })
    }

    const body = await req.json()
    
    // Input validation
    const validation = validateInput(moonPhaseSchema, body)
    if (!validation.success) {
      logSecurityEvent('INVALID_INPUT', { 
        userId: user.id, 
        errors: validation.errors,
        path: '/api/generate-moon-phase' 
      }, req as any)
      return NextResponse.json({ 
        error: "Invalid input", 
        details: validation.errors 
      }, { status: 400 })
    }

    const { date } = validation.data
    
    const prompt = `For the date ${date}, describe the current moon phase in a poetic, mystical, and concise way. Include the phase name and a short spiritual message for dreamers.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a poetic astrologer and moon phase expert.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 80,
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    const moonPhase = data.choices?.[0]?.message?.content?.trim() || 'The moon is in a mysterious phase, guiding your dreams.'
    
    logSecurityEvent('MOON_PHASE_GENERATED', { 
      userId: user.id, 
      date 
    }, req as any)
    
    return NextResponse.json({ moonPhase })
  } catch (error) {
    console.error('Error in generate-moon-phase API:', error)
    logSecurityEvent('API_ERROR', { 
      path: '/api/generate-moon-phase', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, req as any)
    return NextResponse.json({ error: "Failed to generate moon phase" }, { status: 500 })
  }
}
