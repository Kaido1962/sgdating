"use client"

import { useState } from "react"
import { X, Search } from "lucide-react"
import { Button } from "@/components/ui/button"

interface FeelingSelectorProps {
    onSelect: (feeling: { text: string; emoji: string }) => void
    onClose: () => void
}

const feelings = [
    { text: "happy", emoji: "😊" },
    { text: "loved", emoji: "🥰" },
    { text: "excited", emoji: "🤩" },
    { text: "blessed", emoji: "🙏" },
    { text: "grateful", emoji: "😌" },
    { text: "motivated", emoji: "💪" },
    { text: "relaxed", emoji: "😎" },
    { text: "proud", emoji: "😤" },
    { text: "silly", emoji: "🤪" },
    { text: "cool", emoji: "😏" },
    { text: "sad", emoji: "😢" },
    { text: "tired", emoji: "😴" },
    { text: "hungry", emoji: "😋" },
    { text: "sick", emoji: "🤒" },
    { text: "angry", emoji: "😠" },
]

const activities = [
    { text: "eating", emoji: "🍕" },
    { text: "drinking", emoji: "☕" },
    { text: "traveling", emoji: "✈️" },
    { text: "watching", emoji: "📺" },
    { text: "reading", emoji: "📖" },
    { text: "listening to music", emoji: "🎵" },
    { text: "working out", emoji: "🏋️" },
    { text: "celebrating", emoji: "🎉" },
    { text: "playing", emoji: "🎮" },
    { text: "shopping", emoji: "🛍️" },
    { text: "cooking", emoji: "🍳" },
    { text: "studying", emoji: "📚" },
]

export function FeelingSelector({ onSelect, onClose }: FeelingSelectorProps) {
    const [searchQuery, setSearchQuery] = useState("")
    const [activeTab, setActiveTab] = useState<"feelings" | "activities">("feelings")

    const currentList = activeTab === "feelings" ? feelings : activities
    const filteredList = currentList.filter(item =>
        item.text.toLowerCase().includes(searchQuery.toLowerCase())
    )

    return (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-md w-full max-h-[80vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold text-[#242228]">How are you feeling?</h2>
                    <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex gap-2 p-4 border-b">
                    <button
                        onClick={() => setActiveTab("feelings")}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${activeTab === "feelings"
                                ? "bg-[#a22929] text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        Feelings
                    </button>
                    <button
                        onClick={() => setActiveTab("activities")}
                        className={`flex-1 py-2 px-4 rounded-lg font-medium transition-colors ${activeTab === "activities"
                                ? "bg-[#a22929] text-white"
                                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                            }`}
                    >
                        Activities
                    </button>
                </div>

                {/* Search */}
                <div className="p-4">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder={`Search ${activeTab}...`}
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#a22929] focus:border-transparent"
                        />
                    </div>
                </div>

                {/* List */}
                <div className="flex-1 overflow-y-auto p-4">
                    <div className="grid grid-cols-2 gap-2">
                        {filteredList.map((item, index) => (
                            <button
                                key={index}
                                onClick={() => onSelect(item)}
                                className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:border-[#a22929] hover:bg-[#a22929]/5 transition-colors text-left"
                            >
                                <span className="text-2xl">{item.emoji}</span>
                                <span className="font-medium text-[#242228] capitalize">{item.text}</span>
                            </button>
                        ))}
                    </div>
                    {filteredList.length === 0 && (
                        <p className="text-center text-gray-500 py-8">No results found</p>
                    )}
                </div>
            </div>
        </div>
    )
}
