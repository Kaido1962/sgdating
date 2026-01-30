"use client"

import { motion } from "framer-motion"
import { Quote } from "lucide-react"

const testimonials = [
  {
    name: "Thandi & Sipho",
    image: "https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?w=400&q=80",
    quote: "We matched in a weekend and planned our first Drakensberg trip the next month. Truly meant to be. 💍",
    location: "Johannesburg, South Africa",
  },
  {
    name: "Amahle & Pieter",
    image: "https://images.unsplash.com/photo-1522621032211-ac0031dfbddc?w=400&q=80",
    quote: "The AI matching felt spot on. We bonded over rugby, jazz, and sunsets on Sea Point promenade. ❤️",
    location: "Cape Town, South Africa",
  },
  {
    name: "Lerato & Kagiso",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e?w=400&q=80",
    quote: "Found my person faster than I imagined. Coffee dates in Maboneng turned into forever. 💕",
    location: "Pretoria, South Africa",
  },
]

export default function Testimonials() {
  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-[#ae645c] to-[#a22929] bg-clip-text text-transparent text-balance">
            Love Stories 💗
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto text-pretty">
            Real couples who found their happily ever after
          </p>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="relative"
            >
              <div className="bg-gradient-to-br from-[#c5c4c4] to-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all h-full">
                <div className="absolute -top-4 -left-4 w-12 h-12 bg-gradient-to-br from-[#ae645c] to-[#a22929] rounded-full flex items-center justify-center shadow-lg">
                  <Quote className="w-6 h-6 text-white" />
                </div>

                <div className="mb-6 relative h-48 rounded-xl overflow-hidden">
                  <img
                    src={testimonial.image || "/placeholder.svg"}
                    alt={testimonial.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#a22929]/30 to-transparent" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-6xl">❤️</div>
                  </div>
                </div>

                <p className="text-gray-700 mb-6 italic leading-relaxed text-pretty">"{testimonial.quote}"</p>

                <div>
                  <h4 className="font-bold text-gray-800 text-lg">{testimonial.name}</h4>
                  <p className="text-gray-500 text-sm">{testimonial.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="text-center mt-16"
        >
          <div className="inline-flex items-center gap-2 bg-gradient-to-r from-[#c5c4c4] to-white rounded-full px-8 py-4 shadow-lg">
            <span className="text-3xl">😍</span>
            <p className="text-gray-700 font-medium">
              Join <span className="font-bold text-[#a22929]">10,000+</span> happy couples
            </p>
            <span className="text-3xl">💕</span>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
