import { GoogleGenAI, Modality, type Chat } from "@google/genai"
import type { ImageSize } from "../types"
import { Buffer } from "buffer"

export const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required")
  }
  return new GoogleGenAI({ apiKey })
}

// --- TTS Service (Server-side) ---
export const generateSpeechAudio = async (text: string): Promise<string | null> => {
  const ai = getAI()
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: "Puck" },
          },
        },
      },
    })

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data
    if (!base64Audio) return null

    // Convert base64 PCM to buffer
    const pcmBuffer = Buffer.from(base64Audio, "base64")

    // Convert PCM to WAV format (16-bit PCM, 24kHz, mono)
    const wavBuffer = pcmToWav(pcmBuffer, 24000, 1, 16)

    // Return as base64 WAV
    return wavBuffer.toString("base64")
  } catch (error) {
    console.error("TTS Error:", error)
    throw error
  }
}

// Helper function to convert PCM to WAV
function pcmToWav(pcmBuffer: Buffer, sampleRate: number, channels: number, bitsPerSample: number): Buffer {
  const blockAlign = channels * (bitsPerSample / 8)
  const byteRate = sampleRate * blockAlign
  const dataSize = pcmBuffer.length
  const headerSize = 44
  const fileSize = headerSize + dataSize

  const wavBuffer = Buffer.alloc(headerSize + dataSize)

  // RIFF chunk descriptor
  wavBuffer.write("RIFF", 0)
  wavBuffer.writeUInt32LE(fileSize - 8, 4)
  wavBuffer.write("WAVE", 8)

  // fmt sub-chunk
  wavBuffer.write("fmt ", 12)
  wavBuffer.writeUInt32LE(16, 16) // Sub-chunk size
  wavBuffer.writeUInt16LE(1, 20) // Audio format (1 = PCM)
  wavBuffer.writeUInt16LE(channels, 22)
  wavBuffer.writeUInt32LE(sampleRate, 24)
  wavBuffer.writeUInt32LE(byteRate, 28)
  wavBuffer.writeUInt16LE(blockAlign, 32)
  wavBuffer.writeUInt16LE(bitsPerSample, 34)

  // data sub-chunk
  wavBuffer.write("data", 36)
  wavBuffer.writeUInt32LE(dataSize, 40)
  pcmBuffer.copy(wavBuffer, 44)

  return wavBuffer
}

// --- Chat Service ---
export const createChatSession = (): Chat => {
  const ai = getAI()
  return ai.chats.create({
    model: "gemini-3-pro-preview",
    config: {
      systemInstruction:
        "You are an AI assistant for Day Nguyen's portfolio. Answer questions about his experience as a software engineer professionally and concisely.",
    },
  })
}

// --- Fast Lite Service ---
export const getFastSummary = async (text: string): Promise<string> => {
  const ai = getAI()
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-lite-latest",
      contents: `Summarize this professional experience in one punchy sentence: ${text}`,
    })
    return response.text || ""
  } catch (e) {
    console.error(e)
    return "Expert software developer."
  }
}

// --- Image Generation Service ---
export const generateProjectImage = async (prompt: string, size: ImageSize): Promise<string | null> => {
  const ai = getAI()

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-image-preview",
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: "16:9",
          imageSize: size,
        },
      },
    })

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`
      }
    }
    return null
  } catch (error) {
    console.error("Image Gen Error:", error)
    throw error
  }
}

// --- Video Generation Service ---
export const generateVideoDemo = async (
  prompt: string,
  aspectRatio: "16:9" | "9:16" = "16:9",
): Promise<string | null> => {
  const ai = getAI()

  let operation = await ai.models.generateVideos({
    model: "veo-3.1-fast-generate-preview",
    prompt: prompt,
    config: {
      numberOfVideos: 1,
      resolution: "720p",
      aspectRatio: aspectRatio,
    },
  })

  while (!operation.done) {
    await new Promise((resolve) => setTimeout(resolve, 5000))
    operation = await ai.operations.getVideosOperation({ operation: operation })
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri
  if (!downloadLink) return null

  const videoRes = await fetch(`${downloadLink}&key=${process.env.GEMINI_API_KEY}`)
  const blob = await videoRes.blob()
  const buffer = await blob.arrayBuffer()
  return Buffer.from(buffer).toString("base64")
}
