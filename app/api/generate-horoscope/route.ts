import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { zodiacSign } = await req.json()
  
  if (!zodiacSign) {
    return NextResponse.json({ error: 'Zodiac sign is required' }, { status: 400 })
  }

  const prompt = `Generate a personalized daily horoscope for ${zodiacSign} focused on dreams, intuition, and spiritual insights. Include:
1. A brief encouraging message about their cosmic energy today
2. How this affects their dream work and interpretation abilities
3. A specific element or symbol to pay attention to in dreams
4. A lucky element and dream focus
Keep it mystical, positive, and relevant to dream interpretation. Limit to 2-3 sentences for the main message.`

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a mystical astrologer specializing in dream work and spiritual guidance.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 200,
        temperature: 0.7,
      }),
    })

    const data = await response.json()
    const horoscope = data.choices?.[0]?.message?.content?.trim() || 'The cosmos holds special energy for you today, enhancing your intuitive abilities and dream interpretation skills.'
    
    // Generate additional details
    const elements = ['Fire', 'Water', 'Earth', 'Air', 'Spirit']
    const dreamFocuses = ['Water', 'Light', 'Animals', 'Symbols', 'Colors', 'Numbers']
    const luckyElement = elements[Math.floor(Math.random() * elements.length)]
    const dreamFocus = dreamFocuses[Math.floor(Math.random() * dreamFocuses.length)]
    
    return NextResponse.json({ 
      horoscope,
      luckyElement,
      dreamFocus
    })
  } catch (error) {
    console.error('Error generating horoscope:', error)
    return NextResponse.json({ error: 'Failed to generate horoscope' }, { status: 500 })
  }
} 