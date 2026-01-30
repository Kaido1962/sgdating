"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { motion } from "framer-motion"
import { Heart, Globe, Shield, Users } from "lucide-react"

export default function AboutPage() {
    const values = [
        {
            icon: <Heart className="w-8 h-8 text-[#a22929]" />,
            title: "Genuine Connections",
            description: "We believe in fostering real relationships, going beyond surface-level swipes to find meaningful matches."
        },
        {
            icon: <Shield className="w-8 h-8 text-[#a22929]" />,
            title: "Safety First",
            description: "Your security is our top priority. We employ advanced verification and moderation to keep our community safe."
        },
        {
            icon: <Globe className="w-8 h-8 text-[#a22929]" />,
            title: "Inclusive Community",
            description: "Love knows no boundaries. We are committed to building a diverse and welcoming space for everyone."
        },
        {
            icon: <Users className="w-8 h-8 text-[#a22929]" />,
            title: "User-Centric Design",
            description: "Every feature we build is designed with you in mind, creating a seamless and enjoyable dating experience."
        }
    ]

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-[#242228]">
            <Navbar />

            <main className="flex-grow pt-16">
                {/* Hero Section */}
                <section className="relative py-24 bg-gradient-to-br from-[#242228] to-[#1a191d] text-white overflow-hidden">
                    <div className="absolute inset-0 opacity-10 bg-[url('https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center" />
                    <div className="container mx-auto px-4 relative z-10 text-center">
                        <motion.h1
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6 }}
                            className="text-4xl md:text-6xl font-bold mb-6"
                        >
                            Bringing People Together
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                            className="text-xl md:text-2xl text-gray-300 max-w-3xl mx-auto leading-relaxed"
                        >
                            At SG Dating App, our mission is to create a safe, engaging, and premium platform where authentic connections blossom into lasting love.
                        </motion.p>
                    </div>
                </section>

                {/* Story Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <div className="grid md:grid-cols-2 gap-12 items-center">
                            <motion.div
                                initial={{ opacity: 0, x: -30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                            >
                                <div className="relative">
                                    <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#a22929]/10 rounded-full -z-10" />
                                    <img
                                        src="https://images.unsplash.com/photo-1529333166437-7750a6dd5a70?q=80&w=2069&auto=format&fit=crop"
                                        alt="Couple laughing"
                                        className="rounded-3xl shadow-xl w-full h-auto object-cover"
                                    />
                                </div>
                            </motion.div>
                            <motion.div
                                initial={{ opacity: 0, x: 30 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6 }}
                                className="space-y-6"
                            >
                                <h2 className="text-3xl md:text-4xl font-bold text-[#242228]">Our Story</h2>
                                <div className="w-20 h-1.5 bg-[#a22929] rounded-full" />
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    Founded in 2025 by Guardian Angel Studios, SG Dating App was born out of a desire to redefine the modern dating landscape in South Africa. We noticed that many platforms lacked the personal touch and strictly safe environment that genuine relationship-seekers craved.
                                </p>
                                <p className="text-lg text-gray-600 leading-relaxed">
                                    By combining verified profiles, premium matchmaking algorithms, and a community-first approach, we've built a space where you can confidently search for your partner. We are more than just an app; we are your wingman in the digital age.
                                </p>
                            </motion.div>
                        </div>
                    </div>
                </section>

                {/* Values Section */}
                <section className="py-20 bg-gray-50">
                    <div className="container mx-auto px-4">
                        <div className="text-center mb-16">
                            <h2 className="text-3xl md:text-4xl font-bold text-[#242228] mb-4">Our Core Values</h2>
                            <p className="text-gray-600 max-w-2xl mx-auto">The principles that guide everything we do.</p>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {values.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.5, delay: index * 0.1 }}
                                    className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-md transition-shadow border border-gray-100"
                                >
                                    <div className="bg-[#a22929]/5 w-16 h-16 rounded-full flex items-center justify-center mb-6 mx-auto">
                                        {item.icon}
                                    </div>
                                    <h3 className="text-xl font-semibold mb-3 text-center">{item.title}</h3>
                                    <p className="text-gray-600 text-center text-sm leading-relaxed">{item.description}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Team Section Placeholder */}
                <section className="py-20 bg-white border-t border-gray-100">
                    <div className="container mx-auto px-4 text-center">
                        <h2 className="text-3xl md:text-4xl font-bold text-[#242228] mb-12">Meet the Team</h2>
                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {/* This is where the team image/button requested recently would fit naturally, or we can use placeholders */}
                            <div className="bg-gray-50 rounded-3xl p-8 flex flex-col items-center">
                                <div className="w-32 h-32 bg-gray-200 rounded-full mb-6 overflow-hidden">
                                    <img src="/placeholder-avatar.png" alt="Team Member" className="w-full h-full object-cover opacity-50" />
                                </div>
                                <h3 className="font-bold text-xl mb-1">Guardian Angel Studios</h3>
                                <p className="text-[#a22929] text-sm font-medium uppercase tracking-wider mb-4">Development Team</p>
                                <p className="text-gray-500 text-sm">Passionate developers and designers building the future of connection.</p>
                            </div>
                            {/* Add more team members as needed */}
                        </div>
                        <div className="mt-12">
                            <p className="text-gray-500 mb-6">Want to see who's behind the magic?</p>
                            {/* Re-using the button logic mentioned in past conversations if needed, but keeping it simple for now */}
                        </div>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
