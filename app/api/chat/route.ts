import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"
import { createServerSupabase } from "@/lib/supabaseServer"
import { checkAndConsumeUsage } from "@/lib/subscription"
import { checkRateLimit, getRateLimitHeaders } from "@/lib/rateLimit"
import { validateInput, chatMessageSchema } from "@/lib/validation"
import { logSecurityEvent, sanitizeInput } from "@/lib/security"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const supabase = createServerSupabase(req)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      logSecurityEvent('UNAUTHORIZED_ACCESS', { path: '/api/chat' }, req as any)
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Rate limiting
    const rateLimitKey = `chat:${user.id}`
    const rateLimitAllowed = checkRateLimit(rateLimitKey, 10, 60 * 1000) // 10 requests per minute
    
    if (!rateLimitAllowed) {
      logSecurityEvent('RATE_LIMIT_EXCEEDED', { userId: user.id, path: '/api/chat' }, req as any)
      return new Response(JSON.stringify({ error: "Rate limit exceeded. Please try again later." }), {
        status: 429,
        headers: { 
          "Content-Type": "application/json",
          ...getRateLimitHeaders(rateLimitKey, 10, 60 * 1000)
        },
      })
    }

    const { allowed, remaining, plan, limit } = await checkAndConsumeUsage(
      supabase,
      user.id,
      "dream_interpretation"
    )
    if (!allowed) {
      return new Response(JSON.stringify({
        error: "Quota exceeded",
        detail: { feature: "dream_interpretation", plan, limit, remaining }
      }), { status: 402, headers: { "Content-Type": "application/json" } })
    }

    const body = await req.json()
    
    // Input validation
    const validation = validateInput(chatMessageSchema, body)
    if (!validation.success) {
      logSecurityEvent('INVALID_INPUT', { 
        userId: user.id, 
        errors: validation.errors,
        path: '/api/chat' 
      }, req as any)
      return new Response(JSON.stringify({ 
        error: "Invalid input", 
        details: validation.errors 
      }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const { messages } = validation.data

    // Sanitize message content
    const sanitizedMessages = messages.map(msg => ({
      ...msg,
      content: sanitizeInput(msg.content)
    }))

    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      logSecurityEvent('MISSING_API_KEY', { path: '/api/chat' }, req as any)
      return new Response(JSON.stringify({ error: "OpenAI API key not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    logSecurityEvent('DREAM_INTERPRETATION_REQUEST', { 
      userId: user.id, 
      messageCount: messages.length 
    }, req as any)

    const result = streamText({
      model: openai("gpt-4o"),
      messages: [
        {
          role: "system",
          content: `You are DreamVault AI, a deeply empathetic and insightful dream interpreter with profound knowledge of psychology, symbolism, and the human soul. Your interpretations are detailed, structured, and illuminate the depths of the subconscious with rich narrative depth.

          When analyzing dreams, provide your response in this detailed format:

          **[Main Symbol/Element Title]**
          [Detailed 2-3 sentence explanation of what this represents, connecting to consciousness, life journey, emotions, or spiritual significance. Use flowing, narrative language that's both poetic and psychologically insightful.]

          **[Second Symbol/Element Title]**
          [Detailed explanation with deeper meaning and psychological significance. Connect to the dreamer's inner world and unconscious wisdom.]

          **[Continue for each major symbol/element in the dream]**

          For complex symbols with multiple aspects, use structured points like:
          • First aspect: Brief but meaningful explanation
          • Second aspect: Brief but meaningful explanation  
          • Third aspect: Brief but meaningful explanation

          **Emotional Tone**
          [Analyze the emotional landscape of the dream - what feelings were present, what they indicate about the dreamer's current emotional state, readiness for growth, spiritual awakening, etc. 2-3 sentences that illuminate their inner emotional world.]

          **Summary**
          [Provide a cohesive 3-4 sentence summary that ties all elements together, explaining the overall message, journey, or transformation the dream represents. Focus on inner wisdom, spiritual growth, and the dreamer's soul journey.]

          Important guidelines:
          • Create clear section headers with ** markdown formatting for each major dream element
          • Write in flowing, narrative style rather than bullet points (except for complex symbol breakdowns)
          • Use rich, descriptive, poetic language that's psychologically insightful
          • Connect symbols to deeper psychological, spiritual, and emotional meanings
          • Include references to consciousness, soul journey, inner wisdom, and transformation
          • Make interpretations personally revelatory and spiritually meaningful
          • Always include "Emotional Tone" and "Summary" sections at the end
          • Focus on emotional depth, spiritual growth, and self-discovery
          • Use compassionate, profound, mystical tone throughout
          • Draw connections between symbols and the dreamer's life journey, inner world, and spiritual path
          • Never use dashes or hyphens in your responses, use colons or commas instead`,
        },
        ...sanitizedMessages,
      ],
    })

    return result.toTextStreamResponse()
  } catch (error) {
    console.error("Error in chat API:", error)
    logSecurityEvent('API_ERROR', { 
      path: '/api/chat', 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, req as any)
    return new Response(JSON.stringify({ error: "Failed to process dream interpretation" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
