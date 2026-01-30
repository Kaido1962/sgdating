"use client"

import Navbar from "@/components/navbar"
import Footer from "@/components/footer"
import { motion } from "framer-motion"
import { Shield, Lock, Eye, AlertTriangle, Phone, MessageSquare } from "lucide-react"

export default function SafetyPage() {
    const onlineTips = [
        {
            icon: <Lock className="w-6 h-6 text-[#a22929]" />,
            title: "Keep it on the platform",
            text: "Get to know matches on the app before moving to WhatsApp or other messengers. Our chat filters help protect you from scams and harassment."
        },
        {
            icon: <Eye className="w-6 h-6 text-[#a22929]" />,
            title: "Protect personal info",
            text: "Never share your home address, financial details, or ID number with someone you haven't met and trust completely."
        },
        {
            icon: <AlertTriangle className="w-6 h-6 text-[#a22929]" />,
            title: "Watch for red flags",
            text: "Be wary of users who ask for money, rush the relationship, or refuse to meet in person or confirm their identity."
        }
    ]

    const meetingTips = [
        {
            step: "01",
            title: "Meet in public",
            text: "Always meet in a busy public place like a coffee shop or mall for the first few dates."
        },
        {
            step: "02",
            title: "Tell a friend",
            text: "Share your location and plans with a trusted friend or family member before you go."
        },
        {
            step: "03",
            title: "Stay in control",
            text: "Arrange your own transportation to and from the date. Don't rely on your date for a ride home."
        }
    ]

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-[#242228]">
            <Navbar />

            <main className="flex-grow pt-16">
                {/* Hero Section */}
                <section className="bg-[#242228] text-white py-20 relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-96 h-96 bg-[#a22929]/20 rounded-full blur-3xl -mr-20 -mt-20" />
                    <div className="container mx-auto px-4 relative z-10">
                        <div className="max-w-3xl">
                            <motion.div
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ duration: 0.6 }}
                                className="flex items-center gap-3 mb-4 text-[#a22929] font-semibold tracking-wider uppercase text-sm"
                            >
                                <Shield className="w-5 h-5" />
                                <span>Safety Center</span>
                            </motion.div>
                            <motion.h1
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.1 }}
                                className="text-4xl md:text-5xl font-bold mb-6 leading-tight"
                            >
                                Your Safety is Our Priority
                            </motion.h1>
                            <motion.p
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.6, delay: 0.2 }}
                                className="text-xl text-gray-300 leading-relaxed"
                            >
                                Dating should be fun and safe. We've compiled these essential tips and guidelines to help you navigate your journey with confidence using SG Dating App.
                            </motion.p>
                        </div>
                    </div>
                </section>

                {/* Online Safety Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-3xl font-bold mb-12 text-center text-[#242228]">Online Safety Basics</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {onlineTips.map((tip, idx) => (
                                <motion.div
                                    key={idx}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: idx * 0.1 }}
                                    className="bg-gray-50 p-8 rounded-2xl border border-gray-100 hover:border-[#ae645c]/30 transition-colors"
                                >
                                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center mb-6">
                                        {tip.icon}
                                    </div>
                                    <h3 className="text-xl font-bold mb-3">{tip.title}</h3>
                                    <p className="text-gray-600 leading-relaxed">{tip.text}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Meeting in Person Section */}
                <section className="py-20 bg-gray-50 border-y border-gray-100">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto">
                            <h2 className="text-3xl font-bold mb-12 text-center text-[#242228]">Meeting in Person</h2>
                            <div className="space-y-6">
                                {meetingTips.map((tip, idx) => (
                                    <motion.div
                                        key={idx}
                                        initial={{ opacity: 0, x: -20 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: idx * 0.15 }}
                                        className="flex items-start gap-6 bg-white p-6 rounded-2xl shadow-sm"
                                    >
                                        <span className="text-4xl font-bold text-[#e5e5e5] select-none">{tip.step}</span>
                                        <div>
                                            <h3 className="text-xl font-bold mb-2 text-[#a22929]">{tip.title}</h3>
                                            <p className="text-gray-600">{tip.text}</p>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* Reporting Section */}
                <section className="py-20 bg-white">
                    <div className="container mx-auto px-4 text-center max-w-2xl">
                        <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
                            <AlertTriangle className="w-8 h-8 text-[#a22929]" />
                        </div>
                        <h2 className="text-3xl font-bold mb-4">See something wrong?</h2>
                        <p className="text-gray-600 mb-8 text-lg">
                            If you encounter a suspicious profile or experience harassment, please report it immediately. We take every report seriously.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-[#a22929] text-white rounded-full font-semibold hover:bg-[#8b2323] transition-colors">
                                <MessageSquare className="w-5 h-5" />
                                Contact Support
                            </button>
                            <button className="flex items-center justify-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-full font-semibold hover:bg-gray-200 transition-colors">
                                <Phone className="w-5 h-5" />
                                Emergency Numbers
                            </button>
                        </div>
                        <p className="mt-8 text-sm text-gray-500">
                            In an immediate emergency, always contact local law enforcement (10111) first.
                        </p>
                    </div>
                </section>
            </main>

            <Footer />
        </div>
    )
}
