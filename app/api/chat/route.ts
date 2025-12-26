import { createChatSession } from "@/lib/gemini-service-server"
import type { GenerateContentResponse } from "@google/genai"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const { message } = await request.json()

    if (!message) {
      return new Response("Message is required", { status: 400 })
    }

    // Create a new chat session for each request (stateless)
    const chat = createChatSession()

    // Stream the response
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
      async start(controller) {
        try {
          const result = await chat.sendMessageStream({ message })

          for await (const chunk of result) {
            const c = chunk as GenerateContentResponse
            if (c.text) {
              controller.enqueue(encoder.encode(c.text))
            }
          }

          controller.close()
        } catch (error) {
          console.error("Chat streaming error:", error)
          controller.error(error)
        }
      },
    })

    return new Response(stream, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Transfer-Encoding": "chunked",
      },
    })
  } catch (error) {
    console.error("Chat API error:", error)
    return new Response("Internal server error", { status: 500 })
  }
}
