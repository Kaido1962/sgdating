"use client"

import { useState, useEffect } from "react"
import { X, ChevronLeft, ChevronRight } from "lucide-react"
import { Story } from "@/hooks/useStories"

interface StoryViewerProps {
    stories: Story[]
    initialIndex: number
    onClose: () => void
}

export function StoryViewer({ stories, initialIndex, onClose }: StoryViewerProps) {
    const [currentIndex, setCurrentIndex] = useState(initialIndex)
    const [progress, setProgress] = useState(0)

    const currentStory = stories[currentIndex]

    // Auto-advance progress bar
    useEffect(() => {
        setProgress(0)
        const duration = 5000 // 5 seconds per story
        const interval = 50 // Update every 50ms
        const increment = (interval / duration) * 100

        const timer = setInterval(() => {
            setProgress((prev) => {
                if (prev >= 100) {
                    // Auto-advance to next story
                    if (currentIndex < stories.length - 1) {
                        setCurrentIndex(currentIndex + 1)
                    } else {
                        onClose()
                    }
                    return 0
                }
                return prev + increment
            })
        }, interval)

        return () => clearInterval(timer)
    }, [currentIndex, stories.length, onClose])

    const goToPrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1)
        }
    }

    const goToNext = () => {
        if (currentIndex < stories.length - 1) {
            setCurrentIndex(currentIndex + 1)
        } else {
            onClose()
        }
    }

    // Keyboard navigation
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") goToPrevious()
            if (e.key === "ArrowRight") goToNext()
            if (e.key === "Escape") onClose()
        }

        window.addEventListener("keydown", handleKeyDown)
        return () => window.removeEventListener("keydown", handleKeyDown)
    }, [currentIndex])

    if (!currentStory) return null

    return (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-4 right-4 z-50 p-2 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
            >
                <X className="w-6 h-6 text-white" />
            </button>

            {/* Previous Button */}
            {currentIndex > 0 && (
                <button
                    onClick={goToPrevious}
                    className="absolute left-4 z-50 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                >
                    <ChevronLeft className="w-6 h-6 text-white" />
                </button>
            )}

            {/* Next Button */}
            {currentIndex < stories.length - 1 && (
                <button
                    onClick={goToNext}
                    className="absolute right-4 z-50 p-3 bg-black/50 hover:bg-black/70 rounded-full transition-colors"
                >
                    <ChevronRight className="w-6 h-6 text-white" />
                </button>
            )}

            {/* Story Content */}
            <div className="relative w-full max-w-lg h-full max-h-[90vh] flex flex-col">
                {/* Progress Bars */}
                <div className="absolute top-0 left-0 right-0 z-40 flex gap-1 p-2">
                    {stories.map((_, index) => (
                        <div key={index} className="flex-1 h-1 bg-white/30 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-white transition-all duration-100"
                                style={{
                                    width: index < currentIndex ? "100%" : index === currentIndex ? `${progress}%` : "0%",
                                }}
                            />
                        </div>
                    ))}
                </div>

                {/* User Info */}
                <div className="absolute top-8 left-0 right-0 z-40 p-4 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-300 overflow-hidden border-2 border-white">
                        {currentStory.userPhotoURL && (
                            <img src={currentStory.userPhotoURL} className="w-full h-full object-cover" />
                        )}
                    </div>
                    <div className="flex-1">
                        <p className="font-semibold text-white text-sm">{currentStory.displayName}</p>
                        <p className="text-xs text-white/80">
                            {currentStory.timestamp?.seconds
                                ? new Date(currentStory.timestamp.seconds * 1000).toLocaleTimeString()
                                : "Just now"}
                        </p>
                    </div>
                </div>

                {/* Story Image */}
                <div className="flex-1 flex items-center justify-center bg-black">
                    <img
                        src={currentStory.photoURL}
                        alt="Story"
                        className="max-w-full max-h-full object-contain"
                    />
                </div>

                {/* Click areas for navigation */}
                <div className="absolute inset-0 flex">
                    <div className="flex-1 cursor-pointer" onClick={goToPrevious} />
                    <div className="flex-1 cursor-pointer" onClick={goToNext} />
                </div>
            </div>
        </div>
    )
}
