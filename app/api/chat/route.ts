import { openai } from "@ai-sdk/openai"
import { streamText } from "ai"

export const maxDuration = 30

export async function POST(req: Request) {
  try {
    const { messages } = await req.json()

    // Check if API key is available
    if (!process.env.OPENAI_API_KEY) {
      return new Response(JSON.stringify({ error: "OpenAI API key not configured" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      })
    }

    console.log("Processing dream interpretation request...")

    const result = streamText({
      model: openai("gpt-4o"),
      messages: [
        {
          role: "system",
          content: `You are DreamVault AI, an expert dream interpreter with deep knowledge of psychology, symbolism, and spiritual meanings. 

          When analyzing dreams, provide:
          1. A meaningful interpretation of the overall dream narrative
          2. Key symbols and their psychological/spiritual meanings
          3. Emotional themes and what they represent
          4. Connections to the dreamer's potential waking life situations
          5. Actionable insights for personal growth and self-discovery

          Keep responses insightful but accessible, with a mystical yet grounded tone. Focus on personal growth, psychological insights, and spiritual significance. Be encouraging and help the dreamer understand their subconscious messages.

          Structure your response in a flowing, narrative style rather than bullet points. Make it feel like a personalized reading from a wise dream interpreter.

          Limit your response to about 200-300 words for a concise but meaningful interpretation.`,
        },
        ...messages,
      ],
    })

    return result.toDataStreamResponse()
  } catch (error) {
    console.error("Error in chat API:", error)
    return new Response(JSON.stringify({ error: "Failed to process dream interpretation" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
