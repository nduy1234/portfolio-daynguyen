import { GoogleGenAI, Modality, type Chat } from "@google/genai"
import type { ImageSize } from "../types"
import { decode, decodeAudioData, encode } from "./audioUtils"

export const getAI = () => {
  const apiKey = process.env.GEMINI_API_KEY
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY environment variable is required")
  }
  return new GoogleGenAI({ apiKey })
}

// --- TTS Service ---
export const generateSpeech = async (text: string): Promise<AudioBuffer | null> => {
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

    const outputAudioContext = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 })
    const audioBuffer = await decodeAudioData(decode(base64Audio), outputAudioContext, 24000, 1)
    return audioBuffer
  } catch (error) {
    console.error("TTS Error:", error)
    throw error
  }
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
      model: "gemini-2.5-flash-lite-latest", // mapping gemini-flash-lite to latest alias
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
  // Use a fresh instance to ensure we pick up any user-selected key if required (for 2K/4K)
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
  // Fresh instance for Veo key
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

  // Polling
  while (!operation.done) {
    await new Promise((resolve) => setTimeout(resolve, 5000)) // Poll every 5s
    operation = await ai.operations.getVideosOperation({ operation: operation })
  }

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri
  if (!downloadLink) return null

  // Fetch with key
  const videoRes = await fetch(`${downloadLink}&key=${process.env.GEMINI_API_KEY}`)
  const blob = await videoRes.blob()
  return URL.createObjectURL(blob)
}

// --- Live API Helper (Partial logic, connection happens in component) ---
export const createBlob = (data: Float32Array): any => {
  const l = data.length
  const int16 = new Int16Array(l)
  for (let i = 0; i < l; i++) {
    int16[i] = data[i] * 32768
  }
  return {
    data: encode(new Uint8Array(int16.buffer)),
    mimeType: "audio/pcm;rate=16000",
  }
}
