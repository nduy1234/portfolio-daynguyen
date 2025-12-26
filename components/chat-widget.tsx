"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { MessageSquare, X, Send, Bot, Sparkles } from "lucide-react"
import type { ChatMessage } from "@/types"

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const sessionInitializedRef = useRef(false)

  const toggleChat = () => {
    if (!isOpen && !sessionInitializedRef.current) {
      sessionInitializedRef.current = true
      setMessages([
        {
          id: "init",
          role: "model",
          text: "Hi there! I'm Day's AI assistant. Ask me anything about his projects or experience.",
          timestamp: new Date(),
        },
      ])
    }
    setIsOpen(!isOpen)
  }

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isOpen])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim()) return

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: input,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMsg])
    setInput("")
    setIsTyping(true)
    setError(null)

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMsg.text,
          isNewSession: messages.length === 1,
        }),
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
      setError("Failed to connect to the chat service. Please try again.")
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now().toString(),
          role: "model",
          text: "Sorry, I'm having trouble connecting right now.",
          timestamp: new Date(),
        },
      ])
    } finally {
      setIsTyping(false)
    }
  }

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {isOpen && (
        <div
          className="bg-white rounded-3xl shadow-2xl w-80 md:w-96 mb-6 flex flex-col overflow-hidden border border-slate-100 transition-all origin-bottom-right animate-fade-in-up"
          style={{ height: "520px" }}
        >
          <div className="bg-slate-900 p-5 flex justify-between items-center relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500 rounded-full mix-blend-overlay filter blur-xl opacity-20"></div>
            <h3 className="text-white font-bold flex items-center gap-2 relative z-10">
              <div className="p-1.5 bg-white/10 rounded-lg">
                <Sparkles size={16} className="text-blue-300" />
              </div>
              Ask AI
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-slate-400 hover:text-white transition-colors relative z-10"
            >
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-5 space-y-4 bg-slate-50">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                {msg.role === "model" && (
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 mr-2 mt-auto mb-1">
                    <Bot size={12} className="text-white" />
                  </div>
                )}
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed shadow-sm ${msg.role === "user" ? "bg-slate-900 text-white rounded-br-none" : "bg-white border border-slate-200 text-slate-800 rounded-bl-none"}`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {isTyping && (
              <div className="flex justify-start items-end">
                <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center flex-shrink-0 mr-2 mb-1">
                  <Bot size={12} className="text-white" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-none px-4 py-3 shadow-sm">
                  <div className="flex space-x-1.5">
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75"></div>
                    <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          <form onSubmit={handleSubmit} className="p-3 bg-white border-t border-slate-100">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 p-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-300 transition-all placeholder:text-slate-400"
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="p-3 bg-slate-900 text-white rounded-xl hover:bg-blue-600 disabled:opacity-50 disabled:hover:bg-slate-900 transition-colors shadow-md"
              >
                <Send size={16} />
              </button>
            </div>
          </form>
        </div>
      )}

      <button
        onClick={toggleChat}
        className="group relative bg-slate-900 hover:bg-blue-600 text-white p-4 rounded-full shadow-xl hover:shadow-2xl hover:shadow-blue-500/30 transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center"
      >
        <div className="absolute inset-0 rounded-full border border-white/10"></div>
        {isOpen ? <X size={24} /> : <MessageSquare size={24} />}
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 border-2 border-white rounded-full"></span>
        )}
      </button>
    </div>
  )
}
