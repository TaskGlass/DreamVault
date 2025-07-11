import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { zodiac } = await req.json()
  const prompt = `Generate a short, uplifting daily affirmation for someone with the zodiac sign ${zodiac}. Make it spiritual, positive, and unique for today.`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o',
      messages: [
        { role: 'system', content: 'You are a spiritual guide and affirmation expert.' },
        { role: 'user', content: prompt },
      ],
      max_tokens: 60,
      temperature: 0.8,
    }),
  })

  const data = await response.json()
  const affirmation = data.choices?.[0]?.message?.content?.trim() || 'You are enough. Trust your journey.'
  return NextResponse.json({ affirmation })
} 