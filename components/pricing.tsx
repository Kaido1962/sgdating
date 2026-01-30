"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { Check, Crown } from "lucide-react"
import { Button } from "@/components/ui/button"

const plans = [
  {
    name: "Premium Access",
    emoji: "👑",
    price: "R100",
    period: "/month",
    color: "from-[#a22929] to-[#8b2323]",
    popular: true,
    features: [
      "Unlimited daily likes",
      "See who liked you",
      "Read receipts",
      "5 Profile Boosts per month",
      "AI match recommendations",
      "Voice notes & priority chat",
      "Verified Badge",
      "No ads",
    ],
  },
]

export default function Pricing() {
  return (
    <section id="pricing" className="py-24 bg-[#c5c4c4]/60">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#ae645c] to-[#a22929] bg-clip-text text-transparent text-balance">
            Simple, Transparent Pricing 💎
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto text-pretty">
            One premium plan to unlock everything. No hidden tiers.
          </p>
        </motion.div>

        <div className="flex justify-center">
          {plans.map((plan, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="relative w-full max-w-md"
            >
              <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-10">
                <span className="bg-gradient-to-r from-[#ae645c] to-[#a22929] text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                  ALL INCLUSIVE
                </span>
              </div>

              <div className="bg-white rounded-3xl p-8 shadow-xl hover:shadow-2xl transition-all h-full flex flex-col ring-4 ring-[#a22929]/10 border border-[#a22929]/20">
                <div className="absolute -top-3 -right-3">
                  <Crown className="w-12 h-12 text-[#a22929] fill-[#a22929]" />
                </div>

                <div className="text-center mb-6">
                  <div className="text-5xl mb-4">{plan.emoji}</div>
                  <h3 className="text-3xl font-bold mb-2 text-gray-800">{plan.name}</h3>
                  <div className="flex items-baseline justify-center">
                    <span className="text-5xl font-bold bg-gradient-to-r from-[#ae645c] to-[#a22929] bg-clip-text text-transparent">
                      {plan.price}
                    </span>
                    <span className="text-gray-500 ml-1 font-medium">{plan.period}</span>
                  </div>
                </div>

                <ul className="space-y-4 mb-8 flex-grow">
                  {plan.features.map((feature, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="bg-[#a22929]/10 p-1 rounded-full text-[#a22929]">
                        <Check className="w-4 h-4 stroke-[3]" />
                      </div>
                      <span className="text-gray-700 font-medium">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button
                  asChild
                  className={`w-full bg-gradient-to-r ${plan.color} hover:opacity-90 text-white py-6 text-lg font-bold shadow-lg rounded-xl`}
                >
                  <Link href="/sign-up">Get Premium Access</Link>
                </Button>
                <p className="text-xs text-center text-gray-400 mt-4">
                  Cancel anytime. Secure manual payment.
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
