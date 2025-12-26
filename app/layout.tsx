import type React from "react"
import type { Metadata } from "next"
import { Geist } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import "./globals.css"
import Navigation from "@/components/navigation"
import Footer from "@/components/footer"
import ChatWidget from "@/components/chat-widget"

const geist = Geist({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Day Nguyen - Portfolio",
  description: "AI-enhanced portfolio featuring Gemini-powered voice interactions",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${geist.className} font-sans antialiased`}>
        <div className="min-h-screen bg-slate-50 flex flex-col selection:bg-blue-100 selection:text-blue-900">
          <Navigation />
          <main className="flex-grow pt-24">{children}</main>
          <Footer />
          <ChatWidget />
        </div>
        <Analytics />
      </body>
    </html>
  )
}
