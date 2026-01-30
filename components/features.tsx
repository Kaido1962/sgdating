"use client"

import { motion } from "framer-motion"
import { Brain, ShieldCheck, Zap, Video, Eye, Lock } from "lucide-react"

const features = [
  {
    icon: Brain,
    emoji: "🤖❤️",
    title: "AI Matching",
    description: "Our advanced algorithm finds your perfect match based on deep compatibility.",
  },
  {
    icon: ShieldCheck,
    emoji: "✔️",
    title: "Verified Profiles",
    description: "All profiles are verified for authenticity and safety.",
  },
  {
    icon: Zap,
    emoji: "🚀",
    title: "Profile Boosts",
    description: "Get more visibility and matches with our boost feature.",
  },
  {
    icon: Video,
    emoji: "🎥",
    title: "Video Profiles",
    description: "Show your personality with video introductions.",
  },
  {
    icon: Eye,
    emoji: "👀",
    title: "Read Receipts",
    description: "Know when your messages are read and stay connected.",
  },
  {
    icon: Lock,
    emoji: "🔐",
    title: "Safe & Secure",
    description: "Your privacy and security are our top priorities.",
  },
]

export default function Features() {
  return (
    <section id="features" className="py-24 bg-gradient-to-b from-white to-[#c5c4c4]/40">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#ae645c] to-[#a22929] bg-clip-text text-transparent text-balance">
            Features You'll Love 💖
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto text-pretty">
            Everything you need to find meaningful connections
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all cursor-pointer"
            >
              <div className="mb-4 inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-[#ae645c] to-[#a22929] rounded-full">
                <feature.icon className="w-8 h-8 text-white" />
              </div>

              <div className="text-3xl mb-3">{feature.emoji}</div>

              <h3 className="text-xl font-bold mb-3 text-gray-800">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
