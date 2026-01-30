"use client"

import { motion } from "framer-motion"
import { UserPlus, Heart, MessageCircle } from "lucide-react"

const steps = [
  {
    icon: UserPlus,
    emoji: "💘",
    title: "Create Profile",
    description: "Sign up in seconds and create your authentic profile with photos and interests.",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=600&q=80",
  },
  {
    icon: Heart,
    emoji: "💞",
    title: "Discover Matches",
    description: "Our AI finds your perfect matches based on compatibility and shared interests.",
    image: "https://images.unsplash.com/photo-1522621032211-ac0031dfbddc?w=600&q=80",
  },
  {
    icon: MessageCircle,
    emoji: "❤️",
    title: "Chat & Connect",
    description: "Start meaningful conversations and watch sparks fly! Your love story begins here.",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=600&q=80",
  },
]

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-gradient-to-b from-white to-[#c5c4c4]/25">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#ae645c] to-[#a22929] bg-clip-text text-transparent text-balance">
            How It Works ✨
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto text-pretty">
            Three simple steps to finding your perfect match
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-[#c5c4c4] to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-shadow h-full">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[#ae645c] to-[#a22929] rounded-full flex items-center justify-center text-white font-bold text-xl shadow-lg">
                  {index + 1}
                </div>

                <div className="mb-6 relative h-48 rounded-xl overflow-hidden">
                  <img src={step.image || "/placeholder.svg"} alt={step.title} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                  <div className="absolute bottom-4 left-4 text-4xl">{step.emoji}</div>
                </div>

                <div className="mb-4 inline-block p-3 bg-white rounded-full shadow-md">
                  <step.icon className="w-8 h-8 text-[#a22929]" />
                </div>

                <h3 className="text-2xl font-bold mb-3 text-gray-800">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>

              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2 text-[#ae645c] text-3xl z-10">
                  →
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
