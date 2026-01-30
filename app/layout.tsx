import type React from "react"
import type { Metadata } from "next"
import { Playfair_Display, Inter } from "next/font/google"
import "./globals.css"
import { AuthProvider } from "@/context/AuthContext"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  weight: ["400", "500", "600", "700"],
})
const interMono = Inter({
  subsets: ["latin"],
  variable: "--font-mono",
  weight: ["400", "500"],
})
const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  weight: ["400", "700"],
})

export const metadata: Metadata = {
  title: "SG Dating App - Find Your Perfect Match ❤️",
  description:
    "Where meaningful connections turn into beautiful love stories. Join millions finding their perfect match with AI-powered dating.",
  generator: "sgdating.app",
  icons: {
    icon: "/datinglogo.jpeg",
    apple: "/datinglogo.jpeg",
  },
}

import { Toaster } from "sonner"
import { NotificationListener } from "@/components/NotificationListener"

// ... imports

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${interMono.variable} ${playfair.variable}`} suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <AuthProvider>
          <NotificationListener />
          {children}
          <Toaster position="top-center" />
          {/* Botpress Webchat Scripts */}
          <script src="https://cdn.botpress.cloud/webchat/v2.2/inject.js"></script>
          <script src="https://files.bpcontent.cloud/2026/01/15/13/20260115133623-39SAFEXB.js"></script>
        </AuthProvider>
      </body>
    </html>
  )
}
