"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Heart, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function FooterCTA() {
  return (
    <section className="relative py-24 overflow-hidden">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1518568814500-bf0f8d125f46?w=1920&q=80"
          alt="Romantic sunset"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#a22929]/95 via-[#ae645c]/90 to-[#242228]/95" />
      </div>

      {/* Floating Hearts */}
      <motion.div
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          duration: 3,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="absolute top-10 left-10 text-6xl opacity-30"
      >
        💖
      </motion.div>
      <motion.div
        animate={{
          y: [0, 20, 0],
          rotate: [0, -10, 0],
        }}
        transition={{
          duration: 4,
          repeat: Number.POSITIVE_INFINITY,
          ease: "easeInOut",
        }}
        className="absolute bottom-10 right-10 text-6xl opacity-30"
      >
        💝
      </motion.div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center text-white max-w-4xl mx-auto"
        >
          <motion.div
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
            className="inline-block mb-6"
          >
            <Heart className="w-20 h-20 text-white fill-white" />
          </motion.div>

          <h2 className="text-4xl md:text-6xl font-bold mb-6 leading-tight text-balance">
            Your Love Story
            <span className="block">Starts Now ❤️</span>
          </h2>

          <p className="text-xl md:text-2xl mb-10 text-white/90 leading-relaxed text-pretty">
            Don't wait for love to find you. Join millions of singles and discover your perfect match today! ✨
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <Button
              size="lg"
              asChild
              className="bg-[#c5c4c4] text-[#242228] hover:bg-[#c5c4c4]/90 text-xl px-12 py-8 shadow-2xl shadow-[#242228]/25 hover:shadow-3xl transition-all font-bold group"
            >
              <Link href="/sign-up">
                Start Free
                <Sparkles className="ml-2 w-5 h-5 group-hover:rotate-12 transition-transform" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="bg-transparent border-3 border-[#c5c4c4] text-[#c5c4c4] hover:bg-[#c5c4c4]/20 text-xl px-12 py-8 font-bold"
            >
              <Link href="/sign-in">Go Premium 👑</Link>
            </Button>
          </div>

          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-8 text-white/90">
            <div className="flex items-center gap-2">
              <span className="text-3xl">✅</span>
              <span className="font-medium">Free to join</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl">💯</span>
              <span className="font-medium">No credit card required</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-3xl">🔒</span>
              <span className="font-medium">100% secure</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
