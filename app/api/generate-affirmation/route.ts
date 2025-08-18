import { NextRequest, NextResponse } from 'next/server'
import { createServerSupabase } from '@/lib/supabaseServer'
import { checkAndConsumeUsage } from '@/lib/subscription'
import { checkRateLimit, getRateLimitHeaders } from '@/lib/rateLimit'
import { validateInput, affirmationSchema } from '@/lib/validation'
import { logSecurityEvent, sanitizeInput } from '@/lib/security'

export async function POST(req: NextRequest) {
  try {
    // Add authentication check
    const supabase = createServerSupabase(req)
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      logSecurityEvent('UNAUTHORIZED_ACCESS', { path: '/api/generate-affirmation' }, req as any)
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Rate limiting
    const rateLimitKey = `affirmation:${user.id}`
    const rateLimitAllowed = checkRateLimit(rateLimitKey, 10, 60 * 1000) // 10 requests per minute
    
    if (!rateLimitAllowed) {
      logSecurityEvent('RATE_LIMIT_EXCEEDED', { userId: user.id, path: '/api/generate-affirmation' }, req as any)
      return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { 
        status: 429,
        headers: getRateLimitHeaders(rateLimitKey, 10, 60 * 1000)
      })
    }

    // Check and consume usage
    const { allowed, remaining, plan, limit } = await checkAndConsumeUsage(
      supabase,
      user.id,
      "affirmation"
    )
    if (!allowed) {
      return NextResponse.json({
        error: "Quota exceeded",
        detail: { feature: "affirmation", plan, limit, remaining }
      }, { status: 402 })
    }

    const body = await req.json()
    
    // Input validation
    const validation = validateInput(affirmationSchema, body)
    if (!validation.success) {
      logSecurityEvent('INVALID_INPUT', { 
        userId: user.id, 
        errors: validation.errors,
        path: '/api/generate-affirmation' 
      }, req as any)
      return NextResponse.json({ 
        error: "Invalid input", 
        details: validation.errors 
      }, { status: 400 })
    }

    const { zodiac } = validation.data
    
    const prompt = `Generate a short, uplifting daily affirmation for someone with the zodiac sign ${zodiac}. Make it spiritual, positive, and unique for today.`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 150,
        temperature: 0.7
      })
    })

    if (!response.ok) {
      throw new Error('Failed to generate affirmation')
    }

    const data = await response.json()
    const affirmation = data.choices[0]?.message?.content?.trim()

    if (!affirmation) {
      throw new Error('No affirmation generated')
    }

    logSecurityEvent('AFFIRMATION_GENERATED', { 
      userId: user.id, 
      zodiac,
      remaining
    }, req as any)

    return NextResponse.json({ 
      affirmation,
      remaining,
      plan
    })
  } catch (error) {
    console.error('Error generating affirmation:', error)
    logSecurityEvent('API_ERROR', { 
      path: '/api/generate-affirmation', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, req as any)
    return NextResponse.json({ error: 'Failed to generate affirmation' }, { status: 500 })
  }
}
