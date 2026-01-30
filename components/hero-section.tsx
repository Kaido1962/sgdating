"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Heart, Sparkles, Play } from "lucide-react"
import { Button } from "@/components/ui/button"

const FloatingHeart = ({ delay = 0, x = 0 }: { delay?: number; x?: number }) => (
  <motion.div
    className="absolute text-[#ae645c] opacity-25"
    initial={{ y: 100, x, opacity: 0 }}
    animate={{
      y: -100,
      opacity: [0, 0.6, 0],
    }}
    transition={{
      duration: 4,
      delay,
      repeat: Number.POSITIVE_INFINITY,
      ease: "easeInOut",
    }}
  >
    <Heart className="w-8 h-8 fill-current" />
  </motion.div>
)

export default function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=1920&q=80"
          alt="Romantic couple"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-[#a22929]/85 via-[#ae645c]/80 to-[#242228]/90" />
      </div>

      {/* Floating Hearts Animation */}
      {[...Array(8)].map((_, i) => (
        <FloatingHeart key={i} delay={i * 0.5} x={Math.random() * 100 - 50} />
      ))}

      <div className="container mx-auto px-4 z-10">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6"
            >
              <Sparkles className="w-4 h-4" />
              <span className="text-sm font-medium">AI-Powered Matchmaking ✨</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight text-balance">
              Find Your
              <span className="block bg-gradient-to-r from-[#c5c4c4] to-white bg-clip-text text-transparent">
                Soulmate ❤️
              </span>
            </h1>

            <p className="text-xl md:text-2xl mb-8 text-white/90 leading-relaxed text-pretty">
              Where meaningful connections turn into beautiful love stories. Join millions finding their perfect match!
              💘
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                asChild
                className="bg-[#c5c4c4] text-[#242228] hover:bg-[#c5c4c4]/90 text-lg px-8 py-6 shadow-xl shadow-[#242228]/25 hover:shadow-2xl transition-all"
              >
                <Link href="/sign-up">Start Free ✨</Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="bg-transparent border-2 border-[#c5c4c4] text-[#c5c4c4] hover:bg-[#c5c4c4]/10 text-lg px-8 py-6"
              >
                <Link href="/sign-in">Go Premium 👑</Link>
              </Button>
              <Button
                size="lg"
                className="bg-black text-white hover:bg-gray-900 text-lg px-8 py-6 shadow-xl transition-all flex items-center gap-2"
              >
                <Play className="w-5 h-5 fill-current" />
                <span>Download App</span>
              </Button>
            </div>

            <div className="mt-8 flex items-center gap-6">
              <div className="flex -space-x-2">
                <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&q=80"
                    alt="User 1"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&q=80"
                    alt="User 2"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-5a69c17a67c6?w=100&q=80"
                    alt="User 3"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="w-10 h-10 rounded-full border-2 border-white overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=100&q=80"
                    alt="User 4"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <p className="text-white/90">
                <span className="font-bold">10M+</span> people found love 💕
              </p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="relative hidden md:block"
          >
            <motion.div
              animate={{
                y: [0, -20, 0],
              }}
              transition={{
                duration: 3,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="relative z-10"
            >
              <img
                src="/modern-dating-app-mobile-mockup-with-profiles.jpg"
                alt="Dating app mockup"
                className="mx-auto rounded-3xl shadow-2xl"
              />
            </motion.div>

            {/* Decorative floating elements */}
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="absolute top-10 -right-10 text-6xl"
            >
              💖
            </motion.div>
            <motion.div
              animate={{ rotate: -360 }}
              transition={{ duration: 15, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
              className="absolute bottom-10 -left-10 text-6xl"
            >
              💝
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
