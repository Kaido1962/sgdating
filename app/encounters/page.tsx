"use client"

import { useState, useEffect } from "react"
import { useMatches } from "@/hooks/useMatches"
import ProtectedRoute from "@/components/ProtectedRoute"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Heart, X, Star, Info } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"

export default function EncountersPage() {
    const { matches, loading } = useMatches()
    const [currentIndex, setCurrentIndex] = useState(0)
    const router = useRouter()

    const currentMatch = matches[currentIndex]

    const handleSwipe = (direction: 'left' | 'right') => {
        // In a real app, this would trigger a backend mutation (Like/Pass)
        if (direction === 'right') {
            // Like logic
            console.log("Liked", currentMatch?.displayName)
        }
        setCurrentIndex(prev => prev + 1)
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#f0f2f5] pt-20 pb-20">
                <Navbar />
                <div className="max-w-md mx-auto px-4 h-[75vh] flex flex-col">
                    <div className="flex items-center justify-between mb-4">
                        <h1 className="text-2xl font-bold text-[#242228]">Encounters</h1>
                        <Button variant="ghost" size="icon"><Info className="w-5 h-5" /></Button>
                    </div>

                    {loading ? (
                        <div className="flex-1 flex items-center justify-center">
                            <div className="animate-pulse text-[#a22929]">Finding people nearby...</div>
                        </div>
                    ) : !currentMatch ? (
                        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-white rounded-3xl shadow-sm border">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Star className="w-10 h-10 text-yellow-400 fill-current" />
                            </div>
                            <h2 className="text-xl font-bold mb-2">You've seen everyone!</h2>
                            <p className="text-gray-500 mb-6">Check back later for more people.</p>
                            <Button onClick={() => router.push('/matches')}>Browse All Members</Button>
                        </div>
                    ) : (
                        <div className="flex-1 relative bg-white rounded-3xl shadow-xl border overflow-hidden group">
                            {/* Main Card Image */}
                            <div className="absolute inset-0">
                                {currentMatch.photoURL ? (
                                    <Image
                                        src={currentMatch.photoURL}
                                        alt={currentMatch.displayName}
                                        fill
                                        className="object-cover"
                                        priority
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                                        <span className="text-4xl font-bold text-gray-400">{currentMatch.displayName[0]}</span>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                            </div>

                            {/* Card Info */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 text-white pb-24">
                                <h2 className="text-3xl font-bold flex items-end gap-2">
                                    {currentMatch.displayName} <span className="text-xl font-normal opacity-90">{currentMatch.age}</span>
                                </h2>
                                <p className="text-white/80 flex items-center gap-1 mt-1">
                                    {currentMatch.location}
                                </p>
                                {currentMatch.bio && (
                                    <p className="mt-3 text-white/90 line-clamp-2 text-sm">{currentMatch.bio}</p>
                                )}
                            </div>

                            {/* Controls */}
                            <div className="absolute bottom-6 left-0 right-0 flex justify-center items-center gap-6">
                                <Button
                                    className="h-14 w-14 rounded-full bg-white text-red-500 shadow-lg hover:bg-red-50 hover:scale-110 transition-all border-none"
                                    onClick={() => handleSwipe('left')}
                                >
                                    <X className="w-8 h-8" />
                                </Button>
                                <Button
                                    className="h-14 w-14 rounded-full bg-[#a22929] text-white shadow-lg hover:bg-[#8e2020] hover:scale-110 transition-all border-none"
                                    onClick={() => handleSwipe('right')}
                                >
                                    <Heart className="w-8 h-8 fill-current" />
                                </Button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    )
}
