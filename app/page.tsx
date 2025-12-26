"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Volume2, Loader2, PauseCircle, Sparkles, Send, User, Bot, ArrowRight } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import LiveVoice from "@/components/live-voice"
import type { ChatMessage } from "@/types"

export default function About() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [audioContext, setAudioContext] = useState<AudioContext | null>(null)
  const [sourceNode, setSourceNode] = useState<AudioBufferSourceNode | null>(null)

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "welcome",
      role: "model",
      text: "Hello! I've been trained on Day's professional background. Ask me anything about his skills, experience, or projects.",
      timestamp: new Date(),
    },
  ])
  const [chatInput, setChatInput] = useState("")
  const [isChatTyping, setIsChatTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const bioText =
    "I'm a versatile professional who enjoys connecting people, technology, and creative ideas to solve meaningful problems. I bring a mix of strategic thinking, technical skills, and creative vision to the work I do, whether I'm building systems, shaping content, or improving processes. My background spans automation, marketing, design, and business analysis, giving me a broad perspective across higher education, public service, and tech environments. I've worked closely with cross-functional teams to translate complex needs into practical, user-centered solutions. Across roles, I'm motivated by creating inclusive, high-impact work that blends innovation with real value."

  const getAudioContextConstructor = (): typeof AudioContext => {
    const w = window as unknown as { webkitAudioContext?: typeof AudioContext }
    const ctor = window.AudioContext ?? w.webkitAudioContext
    if (!ctor) {
      throw new Error("Web Audio API is not supported in this browser.")
    }
    return ctor
  }

  const handlePlayTTS = async () => {
    if (isPlaying && audioContext) {
      await audioContext.suspend()
      setIsPlaying(false)
      return
    }

    if (audioContext && audioContext.state === "suspended") {
      await audioContext.resume()
      setIsPlaying(true)
      return
    }

    setIsLoading(true)
    try {
      console.log("[v0] Fetching TTS audio...")
      const response = await fetch("/api/tts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: bioText }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate speech")
      }

      const { audio: base64Audio } = await response.json()
      console.log("[v0] Received base64 audio, length:", base64Audio.length)

      const audioData = Uint8Array.from(atob(base64Audio), (c) => c.charCodeAt(0))
      console.log("[v0] Decoded audio data, buffer length:", audioData.buffer.byteLength)

      const AudioContextCtor = getAudioContextConstructor()
      const ctx = new AudioContextCtor()
      console.log("[v0] Created AudioContext, decoding audio data...")

      const audioBuffer = await ctx.decodeAudioData(audioData.buffer)
      console.log("[v0] Successfully decoded audio buffer")

      const source = ctx.createBufferSource()
      source.buffer = audioBuffer
      source.connect(ctx.destination)
      source.onended = () => {
        console.log("[v0] Audio playback ended")
        setIsPlaying(false)
      }
      source.start(0)

      setAudioContext(ctx)
      setSourceNode(source)
      setIsPlaying(true)
      console.log("[v0] Started audio playback")
    } catch (e) {
      console.error("Failed to play TTS", e)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    return () => {
      if (sourceNode) {
        try {
          sourceNode.stop()
        } catch {
          // ignore
        }
      }
      if (audioContext) {
        audioContext.close()
      }
    }
  }, [audioContext, sourceNode])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleChatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: chatInput,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setChatInput("")
    setIsChatTyping(true)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMsg.text }),
      })

      if (!response.ok) {
        throw new Error("Failed to get response")
      }

      const modelMsgId = (Date.now() + 1).toString()
      let fullText = ""

      setMessages((prev) => [
        ...prev,
        {
          id: modelMsgId,
          role: "model",
          text: "",
          timestamp: new Date(),
        },
      ])

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (reader) {
        while (true) {
          const { done, value } = await reader.read()
          if (done) break

          const chunk = decoder.decode(value, { stream: true })
          fullText += chunk

          setMessages((prev) => prev.map((msg) => (msg.id === modelMsgId ? { ...msg, text: fullText } : msg)))
        }
      }
    } catch (error) {
      console.error("Chat Error", error)
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "model",
          text: "I'm having trouble connecting to Gemini right now. Please try again later.",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsChatTyping(false)
    }
  }

  const handleSuggestedQuestion = (question: string) => {
    setChatInput(question)
  }

  return (
    <div className="flex flex-col items-center overflow-x-hidden">
      {/* Hero Section */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-32 animate-fade-in-up">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <div className="order-2 md:order-1 relative w-full max-w-[250px] mx-auto md:mx-0 group">
            <div className="absolute -inset-4 bg-gradient-to-tr from-blue-200 to-indigo-100 rounded-full scale-100 group-hover:scale-105 transition-all duration-700 -z-10 opacity-70 blur-lg"></div>

            <Image
              src="/professional-headshot.png"
              alt="Day Nguyen"
              width={250}
              height={250}
              priority
              className="rounded-full shadow-2xl w-full object-cover aspect-square transition-transform duration-700 ease-out hover:scale-[1.01]"
            />
          </div>

          <div className="order-1 md:order-2 space-y-8 text-center md:text-left">
            <div>
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold text-slate-900 tracking-tighter leading-none mb-4">
                Hello, <br /> I&apos;m{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600">Day</span>
              </h1>
            </div>

            <div className="text-slate-600 leading-relaxed text-base md:text-lg">{bioText}</div>

            <div className="flex flex-wrap gap-4 pt-4 justify-center md:justify-start">
              <button
                onClick={handlePlayTTS}
                disabled={isLoading}
                className="flex items-center space-x-2 bg-slate-900 text-white px-8 py-4 rounded-full hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-70 shadow-lg hover:shadow-xl hover:-translate-y-1"
              >
                {isLoading ? (
                  <Loader2 className="animate-spin" size={20} />
                ) : isPlaying ? (
                  <PauseCircle size={20} />
                ) : (
                  <Volume2 size={20} />
                )}
                <span className="font-medium">
                  {isPlaying ? "Pause Bio" : isLoading ? "Loading..." : "Listen to Bio"}
                </span>
              </button>
              <Link
                href="/projects"
                className="flex items-center space-x-2 bg-white text-slate-900 border border-slate-200 px-8 py-4 rounded-full hover:border-slate-300 hover:bg-slate-50 transition-all shadow-sm hover:shadow-md"
              >
                <span className="font-medium">View Work</span>
                <ArrowRight size={18} />
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Inline Chat Section */}
      <section className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-24 animate-fade-in-up delay-100">
        <div className="bg-white rounded-[2.5rem] shadow-2xl shadow-slate-200 border border-slate-100 overflow-hidden flex flex-col md:flex-row min-h-[650px]">
          <div className="bg-slate-900 text-white p-10 md:w-[35%] flex flex-col justify-between relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob"></div>
            <div className="absolute -bottom-8 -left-8 w-64 h-64 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000"></div>

            <div className="relative z-10">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-blue-500/20">
                <Sparkles size={28} className="text-white" />
              </div>
              <h3 className="text-3xl font-bold font-heading mb-4">Ask Gemini.</h3>
              <p className="text-slate-400 leading-relaxed">
                Powered by Google&apos;s Gemini 3 Pro. This AI agent has read my resume, project details, and portfolio to
                answer your questions instantly.
              </p>
            </div>

            <div className="hidden md:block relative z-10 mt-12">
              <p className="text-xs text-slate-500 uppercase tracking-widest font-bold mb-6">Suggested Queries</p>
              <ul className="space-y-4">
                {[
                  "What are your core technical skills?",
                  "Tell me about your experience at Databricks.",
                  "How do you approach UI/UX design?",
                ].map((q, i) => (
                  <li
                    key={i}
                    className="group cursor-pointer p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all border border-transparent hover:border-white/10"
                    onClick={() => handleSuggestedQuestion(q)}
                  >
                    <div className="flex items-center gap-3 text-sm text-slate-300 group-hover:text-white">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full group-hover:shadow-[0_0_8px_rgba(59,130,246,0.8)] transition-all"></span>
                      {q}
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex-1 flex flex-col bg-slate-50/50 relative">
            <div className="flex-1 overflow-y-auto p-8 space-y-6 scroll-smooth">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"} animate-fade-in-up`}
                >
                  <div
                    className={`flex max-w-[85%] md:max-w-[75%] ${msg.role === "user" ? "flex-row-reverse" : "flex-row"} items-end gap-3`}
                  >
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${msg.role === "user" ? "bg-slate-200 text-slate-600" : "bg-gradient-to-br from-blue-600 to-indigo-600 text-white"}`}
                    >
                      {msg.role === "user" ? <User size={16} /> : <Bot size={16} />}
                    </div>
                    <div
                      className={`px-6 py-4 rounded-2xl text-[15px] leading-relaxed shadow-sm ${
                        msg.role === "user"
                          ? "bg-white text-slate-800 rounded-br-none border border-slate-100"
                          : "bg-white text-slate-800 rounded-bl-none border border-slate-100"
                      }`}
                    >
                      {msg.text}
                    </div>
                  </div>
                </div>
              ))}
              {isChatTyping && (
                <div className="flex justify-start animate-pulse">
                  <div className="flex items-end gap-3">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-indigo-600 flex items-center justify-center shadow-sm text-white">
                      <Bot size={16} />
                    </div>
                    <div className="bg-white px-6 py-4 rounded-2xl rounded-bl-none border border-slate-100 shadow-sm">
                      <div className="flex space-x-1">
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                        <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            <div className="p-6 bg-white border-t border-slate-100">
              <form onSubmit={handleChatSubmit} className="relative flex items-center gap-4">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ask something about Day's work..."
                  className="w-full pl-6 pr-4 py-4 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:ring-2 focus:ring-blue-100 focus:border-blue-400 focus:outline-none transition-all placeholder:text-slate-400 text-slate-700"
                />
                <button
                  type="submit"
                  disabled={!chatInput.trim() || isChatTyping}
                  className="p-4 bg-slate-900 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-slate-900 transition-colors shadow-md hover:shadow-lg active:scale-95 flex-shrink-0"
                >
                  <Send size={20} />
                </button>
              </form>
            </div>
          </div>
        </div>
      </section>

      {/* Live Voice Demo Section */}
      <section className="w-full bg-slate-950 text-white py-32 relative overflow-hidden mt-20">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[128px]"></div>
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-screen filter blur-[128px]"></div>
        </div>

        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 flex flex-col items-center">
          <span className="px-4 py-1.5 rounded-full border border-white/10 bg-white/5 text-sm font-medium text-blue-300 mb-6 backdrop-blur-sm">
            Experimental Feature
          </span>
          <h2 className="text-4xl md:text-6xl font-bold font-heading mb-6 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">
            Conversational AI
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto mb-16 text-lg leading-relaxed">
            Experience real-time, low-latency voice interaction powered by Gemini Live API. Speak naturally and get
            instant audio responses.
          </p>
          <div className="w-full flex justify-center">
            <LiveVoice />
          </div>
        </div>
      </section>
    </div>
  )
}
