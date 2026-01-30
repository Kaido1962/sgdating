"use client"

import { Button } from "@/components/ui/button"
import { X, Star, Sparkles, Heart, MessageCircle } from "lucide-react"

interface PaymentPromptModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onUpgrade: () => void
}

export function PaymentPromptModal({ open, onOpenChange, onUpgrade }: PaymentPromptModalProps) {
    if (!open) return null

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full overflow-hidden shadow-2xl">
                {/* Header */}
                <div className="relative bg-gradient-to-br from-[#a22929] to-[#ae645c] p-6 text-white">
                    <button
                        onClick={() => onOpenChange(false)}
                        className="absolute top-4 right-4 p-1 hover:bg-white/20 rounded-full transition-colors"
                    >
                        <X className="w-5 h-5" />
                    </button>
                    <div className="flex items-center gap-3 mb-2">
                        <div className="p-3 bg-white/20 rounded-full">
                            <Star className="w-8 h-8" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold">Upgrade to Premium</h2>
                            <p className="text-sm text-white/80">Unlock all features</p>
                        </div>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <p className="text-gray-700 text-center">
                        This feature is available for <span className="font-bold text-[#a22929]">Premium members</span> only.
                    </p>

                    <div className="space-y-3">
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <Sparkles className="w-5 h-5 text-[#a22929] flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-sm text-gray-800">Unlimited Stories</p>
                                <p className="text-xs text-gray-600">Share as many stories as you want</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <Heart className="w-5 h-5 text-[#a22929] flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-sm text-gray-800">See Who Likes You</p>
                                <p className="text-xs text-gray-600">Know who's interested before you match</p>
                            </div>
                        </div>
                        <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                            <MessageCircle className="w-5 h-5 text-[#a22929] flex-shrink-0 mt-0.5" />
                            <div>
                                <p className="font-semibold text-sm text-gray-800">Unlimited Messaging</p>
                                <p className="text-xs text-gray-600">Chat without limits</p>
                            </div>
                        </div>
                    </div>

                    <div className="pt-4 space-y-2">
                        <Button
                            onClick={() => {
                                onOpenChange(false)
                                onUpgrade()
                            }}
                            className="w-full bg-gradient-to-r from-[#a22929] to-[#ae645c] text-white py-6 text-lg font-bold shadow-lg hover:shadow-xl transition-all"
                        >
                            Upgrade Now
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={() => onOpenChange(false)}
                            className="w-full text-gray-600"
                        >
                            Maybe Later
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    )
}
