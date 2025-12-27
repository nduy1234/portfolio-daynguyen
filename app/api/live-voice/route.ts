import type { NextRequest } from "next/server"

export const runtime = "nodejs"

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY

    if (!apiKey) {
      return new Response(JSON.stringify({ error: "GEMINI_API_KEY not configured" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      })
    }

    const body = await req.json()
    const { audioData } = body

    // Use Gemini API for audio-to-audio processing
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  inlineData: {
                    mimeType: "audio/wav",
                    data: audioData,
                  },
                },
                {
                  text: "You are Day Nguyen's AI assistant. Provide helpful responses about Day's professional background, skills, and experience. Keep responses conversational and under 30 seconds when spoken.",
                },
              ],
            },
          ],
          generationConfig: {
            responseModalities: ["AUDIO"],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: "Puck",
                },
              },
            },
          },
        }),
      },
    )

    if (!response.ok) {
      const errorData = await response.json()
      console.error("Gemini API error:", errorData)

      if (response.status === 429) {
        return new Response(
          JSON.stringify({
            error: "QUOTA_EXCEEDED",
            message: "API quota exceeded. Please try again later or upgrade your plan.",
          }),
          {
            status: 429,
            headers: { "Content-Type": "application/json" },
          },
        )
      }

      throw new Error(`Gemini API error: ${response.status}`)
    }

    const data = await response.json()

    // Extract audio response
    const audioPart = data.candidates?.[0]?.content?.parts?.find(
      (part: any) => part.inlineData?.mimeType === "audio/wav",
    )

    if (!audioPart) {
      throw new Error("No audio response from Gemini")
    }

    return new Response(
      JSON.stringify({
        audio: audioPart.inlineData.data,
      }),
      {
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    console.error("Live voice error:", error)
    return new Response(JSON.stringify({ error: "Failed to process voice request" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
