"use client"

import { Button } from "@/components/ui/button"
import { Settings, Hammer } from "lucide-react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { toast } from "sonner"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { addDoc, collection } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function MaintenancePage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [loading, setLoading] = useState(false)

    const handleNotify = async () => {
        if (!email || !email.includes("@")) {
            toast.error("Please enter a valid email address.")
            return
        }

        setLoading(true)
        try {
            await addDoc(collection(db, "waiting_list"), {
                email,
                createdAt: new Date(),
                source: "maintenance_page"
            })
            toast.success("You're on the list!", { description: "We'll notify you when we're back." })
            setEmail("")
        } catch (error) {
            console.error("Error adding email:", error)
            toast.error("Something went wrong. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 relative overflow-hidden">
            {/* Background Particles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {[...Array(5)].map((_, i) => (
                    <motion.div
                        key={i}
                        className="absolute bg-[#a22929]/10 rounded-full"
                        style={{
                            width: Math.random() * 100 + 50,
                            height: Math.random() * 100 + 50,
                            top: `${Math.random() * 100}%`,
                            left: `${Math.random() * 100}%`,
                        }}
                        animate={{
                            y: [0, -20, 0],
                            scale: [1, 1.1, 1],
                            rotate: [0, 360],
                        }}
                        transition={{
                            duration: Math.random() * 5 + 5,
                            repeat: Infinity,
                            ease: "easeInOut",
                        }}
                    />
                ))}
            </div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-xl w-full bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 md:p-12 text-center space-y-8 relative z-10 border border-[#a22929]/10"
            >
                {/* Animated Construction Icons */}
                <div className="relative w-32 h-32 mx-auto flex items-center justify-center">
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                        className="absolute text-[#a22929]"
                    >
                        <Settings className="w-24 h-24 text-opacity-80" />
                    </motion.div>

                    <motion.div
                        animate={{ rotate: -360 }}
                        transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                        className="absolute top-0 right-0 text-[#ae645c]"
                    >
                        <Settings className="w-12 h-12 text-opacity-80" />
                    </motion.div>

                    <motion.div
                        animate={{
                            rotate: [0, -15, 0],
                            x: [0, -5, 0],
                            y: [0, -2, 0]
                        }}
                        transition={{ duration: 1.5, repeat: Infinity }}
                        className="absolute bottom-2 right-4 text-[#242228] bg-white rounded-full p-1 shadow-sm"
                    >
                        <Hammer className="w-8 h-8" />
                    </motion.div>
                </div>

                <div className="space-y-4">
                    <motion.div
                        initial={{ scale: 0.95 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <h1 className="text-4xl md:text-5xl font-black bg-clip-text text-transparent bg-gradient-to-r from-[#a22929] to-[#ae645c] mb-2">
                            Under Construction
                        </h1>
                        <p className="text-gray-500 text-lg md:text-xl">
                            We're building something amazing! <br />
                            Please check back shortly.
                        </p>
                    </motion.div>
                </div>

                <div className="flex flex-col gap-4 max-w-sm mx-auto">
                    <div className="flex gap-2">
                        <Input
                            type="email"
                            placeholder="Enter your email"
                            className="bg-white border-gray-300 focus:ring-[#a22929]"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button
                            className="bg-[#242228] text-white hover:bg-[#a22929] transition-colors"
                            onClick={handleNotify}
                            disabled={loading}
                        >
                            {loading ? "Saving..." : "Notify Me"}
                        </Button>
                    </div>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="text-gray-400 hover:text-[#a22929] text-xs"
                        onClick={() => router.push('/sign-in')}
                    >
                        Admin Login
                    </Button>
                </div>

                <div className="pt-8 border-t border-gray-100">
                    <p className="text-xs text-gray-400">
                        Error Code: 503 Service Unavailable • Guardian Angel Studios
                    </p>
                </div>
            </motion.div>
        </div>
    )
}
