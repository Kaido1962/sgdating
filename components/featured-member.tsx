"use client"

import { motion } from "framer-motion"

const profiles = [
  {
    name: "Featured member",
    location: "Johannesburg, South Africa",
    tagline: "Example profile card showcasing how your photos will appear.",
    image: "/dating1.jpeg",
  },
  {
    name: "Featured member",
    location: "Cape Town, South Africa",
    tagline: "Use high‑quality photos and a short intro line to stand out.",
    image: "/dating2.jpeg",
  },
]

export default function FeaturedMember() {
  return (
    <section className="py-20 bg-gradient-to-br from-[#242228] via-[#2f2b31] to-[#242228]">
      <div className="container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-10">
          <div className="text-white space-y-4 max-w-xl">
            <p className="text-sm font-semibold tracking-[0.25em] uppercase text-[#c5c4c4]">
              Featured SG Profile
            </p>
            <h2 className="text-3xl md:text-4xl font-bold leading-tight">
              Meet some of the{" "}
              <span className="bg-gradient-to-r from-[#ae645c] to-[#a22929] bg-clip-text text-transparent">
                real people
              </span>{" "}
              on SG Dating App
            </h2>
            <p className="text-[#c5c4c4]/90 text-lg leading-relaxed">
              Curated, high‑intent singles from across South Africa. Verified photos, rich prompts, and authentic
              stories so you can focus on connections that matter.
            </p>
            <ul className="space-y-2 text-sm text-[#c5c4c4]">
              <li>• Hand‑picked profiles shown here are examples of how your dating card can look.</li>
              <li>• Optimised for our Silver, Baltic Sea, Mexican Red, and Matrix brand palette.</li>
              <li>• Add up to 6 photos and prompts to stand out in the grid or swipe view.</li>
            </ul>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full lg:max-w-xl">
            {profiles.map((profile, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="rounded-3xl overflow-hidden bg-[#2f2b31] border border-[#c5c4c4]/30 shadow-2xl"
              >
                <div className="relative h-64">
                  <img
                    src={profile.image}
                    alt={profile.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#242228]/90 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-lg font-semibold text-white">{profile.name}</p>
                    <p className="text-sm text-[#c5c4c4]">{profile.location}</p>
                    <p className="mt-2 text-sm text-[#c5c4c4]/90">{profile.tagline}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}


