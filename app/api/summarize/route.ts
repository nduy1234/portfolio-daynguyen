import { getFastSummary } from "@/lib/gemini-service-server"

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

    const summary = await getFastSummary(text)

    return new Response(JSON.stringify({ summary }), {
      headers: {
        "Content-Type": "application/json",
      },
    })
  } catch (error) {
    console.error("Summarize API error:", error)
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })
  }
}
