import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(req: NextRequest) {
  const { zodiacSign, userId, forceRefresh } = await req.json()
  
  if (!zodiacSign || !userId) {
    return NextResponse.json({ error: 'Zodiac sign and user ID are required' }, { status: 400 })
  }

  const today = new Date().toISOString().split('T')[0] // YYYY-MM-DD format

  try {
    // If forceRefresh is true, delete existing horoscope first
    if (forceRefresh) {
      const { error: deleteError } = await supabase
        .from('daily_horoscopes')
        .delete()
        .eq('zodiac_sign', zodiacSign)
        .eq('date', today)
      
      if (deleteError) {
        console.error('Error deleting existing horoscope:', deleteError)
      }
    } else {
      // Check if we already have a horoscope for today for this zodiac sign
      const { data: existingHoroscope } = await supabase
        .from('daily_horoscopes')
        .select('*')
        .eq('zodiac_sign', zodiacSign)
        .eq('date', today)
        .single()

      if (existingHoroscope) {
        // Return existing horoscope
        return NextResponse.json({
          horoscope: existingHoroscope.content,
          luckyElement: existingHoroscope.lucky_element,
          dreamFocus: existingHoroscope.dream_focus,
          cached: true
        })
      }
    }

    // Generate new horoscope
    const prompt = `Write a detailed daily horoscope for ${zodiacSign} in the style of a personal, flowing spiritual reading. Make it warm, specific, and deeply engaging.

Requirements:
- Write in plain text with NO markdown, asterisks, or special formatting
- 4-6 sentences for the main reading, then add a "Cosmic tip:" with a philosophical quote
- Address ${zodiacSign} directly by name at least once
- Include specific, relatable activities and advice (like spending time in nature, creative pursuits, relationships, diet, mindfulness)
- Blend practical life advice with spiritual/cosmic insights
- Use poetic, metaphorical language ("inner chi", "soul's compass", "energy flows")
- Make it personal and encouraging, acknowledging their unique gifts
- Include references to dreams, intuition, or spiritual growth
- End with "Cosmic tip: [inspirational quote or wisdom]"
- Keep the tone warm, mystical, and uplifting like a wise friend giving guidance

Example style: "Spend some extra time cuddling with your pets today, Pisces. And for those whose pets have transitioned to happier playgrounds, your beloved four-legged bundles of joy send you love across the realms. This is also a cue for those considering a switch in their diet to a vegetarian or more conscious one, perhaps give it a short run to see if it is for keeps. On another note, the more you think of vibrant thoughts, the more you attract happier thoughts and experiences in your life. You are immensely gifted, Pisces, and you must remember that at every given step in time. Let your popcorn brain rest a while, and allow your inner chi to flow in the direction of your soul.

Cosmic tip: You need not always do. Sometimes the best way to do is to be."`

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
      },
              body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { role: 'system', content: 'You are a wise, intuitive astrologer who writes deeply personal and engaging horoscopes. Your readings feel like heartfelt advice from a spiritual mentor who truly understands each sign\'s unique gifts and challenges. You blend practical wisdom with cosmic insights.' },
          { role: 'user', content: prompt },
        ],
        max_tokens: 400,
        temperature: 0.8,
      }),
    })

    const data = await response.json()
    const horoscope = data.choices?.[0]?.message?.content?.trim() || 'The universe weaves a beautiful tapestry of opportunities around you today, dear soul. Your intuitive gifts are particularly heightened, making this an excellent time for self-reflection and spiritual exploration. Trust the gentle whispers of your inner wisdom as they guide you toward experiences that nourish your spirit. Take a moment to appreciate the small miracles that surround you - perhaps a meaningful conversation, a moment of creative inspiration, or simply the warmth of sunlight on your skin. You are exactly where you need to be on your journey.\n\nCosmic tip: The magic you seek is already within you; you need only remember how to access it.'
    
    // Generate additional details consistently based on zodiac sign and date
    const elements = ['Fire', 'Water', 'Earth', 'Air', 'Spirit', 'Silver', 'Gold']
    const dreamFocuses = ['Water', 'Light', 'Animals', 'Symbols', 'Colors', 'Numbers', 'Journeys', 'Transformation']
    
    // Create deterministic selection based on zodiac sign and date
    const zodiacIndex = ['Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'].indexOf(zodiacSign)
    const dateNum = new Date(today).getDate()
    
    const luckyElement = elements[(zodiacIndex + dateNum) % elements.length]
    const dreamFocus = dreamFocuses[(zodiacIndex + dateNum + 3) % dreamFocuses.length]

    // Save to database
    const { error: insertError } = await supabase
      .from('daily_horoscopes')
      .insert([
        {
          zodiac_sign: zodiacSign,
          date: today,
          content: horoscope,
          lucky_element: luckyElement,
          dream_focus: dreamFocus,
          created_at: new Date().toISOString()
        }
      ])

    if (insertError) {
      console.error('Error saving horoscope:', insertError)
      // Still return the generated horoscope even if saving fails
    }

    return NextResponse.json({ 
      horoscope,
      luckyElement,
      dreamFocus,
      cached: false,
      refreshed: forceRefresh || false
    })
  } catch (error) {
    console.error('Error generating daily horoscope:', error)
    return NextResponse.json({ error: 'Failed to generate daily horoscope' }, { status: 500 })
  }
} 