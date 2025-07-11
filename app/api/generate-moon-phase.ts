import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { date } = await req.json()
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
  return NextResponse.json({ moonPhase })
} 