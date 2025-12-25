import { generateSpeechAudio } from "@/lib/gemini-service-server"

export const runtime = "nodejs"

export async function POST(request: Request) {
  try {
    const { text } = await request.json()

    if (!text) {
      return new Response(JSON.stringify({ error: "Text is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    const base64Audio = await generateSpeechAudio(text)

    if (!base64Audio) {
      return new Response(JSON.stringify({ error: "Failed to generate speech" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    return new Response(JSON.stringify({ audio: base64Audio }), {
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("TTS API error:", error)
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
