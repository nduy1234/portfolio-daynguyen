"use client"

import { useState } from "react"
import { Mic, Activity, Radio, AlertCircle } from "lucide-react"

export default function LiveVoice() {
  const [isActive, setIsActive] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toggleSession = async () => {
    if (isActive) {
      setIsActive(false)
    } else {
      setError(null)
      setIsConnecting(true)

      try {
        // Request microphone permissions
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        stream.getTracks().forEach((track) => track.stop())

        setIsConnecting(false)
        setIsActive(true)

        // Live voice would need WebSocket or Server-Sent Events implementation
        // For now, showing it as unavailable
        setTimeout(() => {
          setError(
            "Live voice chat requires WebSocket support. This feature is currently in development. Please use the text chat instead.",
          )
          setIsActive(false)
        }, 2000)
      } catch (e) {
        console.error("Failed to access microphone", e)
        setError("Failed to access microphone. Please check your permissions.")
        setIsConnecting(false)
      }
    }
  }

  return (
    <div className="relative group">
      <div
        className={`absolute -inset-1 bg-gradient-to-r from-blue-600 to-cyan-500 rounded-[2rem] blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200 ${isActive ? "animate-pulse opacity-75" : ""}`}
      ></div>

      <div className="relative flex flex-col items-center justify-center p-8 bg-slate-900/90 backdrop-blur-xl rounded-[1.8rem] border border-white/10 max-w-sm w-full transition-all">
        <div className="relative mb-8">
          {isActive && (
            <>
              <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-20"></div>
              <div className="absolute -inset-4 bg-blue-500 rounded-full animate-pulse opacity-10 delay-75"></div>
            </>
          )}
          <div
            className={`w-28 h-28 rounded-full flex items-center justify-center transition-all duration-500 border-4 ${isActive ? "border-blue-500/50 bg-slate-800" : error ? "border-red-500/50 bg-slate-800/50" : "border-slate-700 bg-slate-800/50"}`}
          >
            <div
              className={`w-20 h-20 rounded-full flex items-center justify-center transition-all duration-300 ${isActive ? "bg-blue-600 shadow-[0_0_30px_rgba(37,99,235,0.6)]" : error ? "bg-red-600" : "bg-slate-700"}`}
            >
              {isConnecting ? (
                <Activity className="animate-spin text-white" size={32} />
              ) : error ? (
                <AlertCircle size={32} className="text-white" />
              ) : isActive ? (
                <div className="flex gap-1 items-center">
                  <div className="w-1 h-3 bg-white rounded-full animate-[music_1s_ease-in-out_infinite]"></div>
                  <div className="w-1 h-5 bg-white rounded-full animate-[music_1.2s_ease-in-out_infinite_0.1s]"></div>
                  <div className="w-1 h-4 bg-white rounded-full animate-[music_0.8s_ease-in-out_infinite_0.2s]"></div>
                </div>
              ) : (
                <Mic size={32} className="text-slate-400" />
              )}
            </div>
          </div>
        </div>

        <div className="text-center space-y-2 mb-8">
          <h3 className="text-white text-xl font-bold tracking-wide">
            {isActive ? "Listening..." : "Live Voice Chat"}
          </h3>
          <p className={`text-sm ${error ? "text-red-400" : "text-slate-400"}`}>
            {error
              ? error
              : isConnecting
                ? "Establishing secure connection..."
                : isActive
                  ? "Speak now. I'm listening."
                  : "Click start to talk to my AI assistant."}
          </p>
        </div>

        <button
          onClick={toggleSession}
          disabled={isConnecting}
          className={`w-full py-4 rounded-xl font-bold transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed ${isActive ? "bg-red-500 hover:bg-red-600 text-white shadow-red-500/20" : "bg-white hover:bg-blue-50 text-slate-900"}`}
        >
          {isActive ? (
            <>
              <Radio size={18} /> End Call
            </>
          ) : (
            <>
              <Mic size={18} /> Start Call
            </>
          )}
        </button>
      </div>
      <style jsx>{`
            @keyframes music {
                0%, 100% { height: 12px; }
                50% { height: 24px; }
            }
        `}</style>
    </div>
  )
}
