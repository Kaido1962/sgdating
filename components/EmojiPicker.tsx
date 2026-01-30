"use client"

import { useState } from "react"
import { Smile } from "lucide-react"

interface EmojiPickerProps {
    onEmojiSelect: (emoji: string) => void
    buttonClassName?: string
}

const emojiCategories = {
    "Smileys": ["😀", "😃", "😄", "😁", "😅", "😂", "🤣", "😊", "😇", "🙂", "🙃", "😉", "😌", "😍", "🥰", "😘", "😗", "😙", "😚", "😋", "😛", "😝", "😜", "🤪", "🤨", "🧐", "🤓", "😎", "🥳", "😏", "😒", "😞", "😔", "😟", "😕", "🙁", "😣", "😖", "😫", "😩", "🥺", "😢", "😭", "😤", "😠", "😡", "🤬", "🤯", "😳", "🥵", "🥶", "😱", "😨", "😰", "😥", "😓"],
    "Hearts": ["❤️", "🧡", "💛", "💚", "💙", "💜", "🖤", "🤍", "🤎", "💔", "❣️", "💕", "💞", "💓", "💗", "💖", "💘", "💝", "💟"],
    "Gestures": ["👍", "👎", "👌", "✌️", "🤞", "🤟", "🤘", "🤙", "👈", "👉", "👆", "👇", "☝️", "👏", "🙌", "👐", "🤲", "🤝", "🙏", "✍️", "💪", "🦾", "🦿", "🦵", "🦶"],
    "Activities": ["⚽", "🏀", "🏈", "⚾", "🥎", "🎾", "🏐", "🏉", "🥏", "🎱", "🪀", "🏓", "🏸", "🏒", "🏑", "🥍", "🏏", "🪃", "🥅", "⛳", "🪁", "🏹", "🎣", "🤿", "🥊", "🥋", "🎽", "🛹", "🛼", "🛷", "⛸️", "🥌", "🎿", "⛷️", "🏂"],
    "Food": ["🍕", "🍔", "🍟", "🌭", "🍿", "🧈", "🧂", "🥓", "🥚", "🍳", "🧇", "🥞", "🧈", "🍞", "🥐", "🥨", "🥯", "🥖", "🧀", "🥗", "🍝", "🍜", "🍲", "🍛", "🍣", "🍱", "🥟", "🦪", "🍤", "🍙", "🍚", "🍘", "🍥", "🥠", "🥮", "🍢", "🍡", "🍧", "🍨", "🍦", "🥧", "🧁", "🍰", "🎂", "🍮", "🍭", "🍬", "🍫", "🍿", "🍩", "🍪"],
    "Travel": ["✈️", "🚀", "🛸", "🚁", "🛶", "⛵", "🚤", "🛥️", "🛳️", "⛴️", "🚢", "🚂", "🚃", "🚄", "🚅", "🚆", "🚇", "🚈", "🚉", "🚊", "🚝", "🚞", "🚋", "🚌", "🚍", "🚎", "🚐", "🚑", "🚒", "🚓", "🚔", "🚕", "🚖", "🚗", "🚘", "🚙", "🛻", "🚚", "🚛", "🚜"],
}

export function EmojiPicker({ onEmojiSelect, buttonClassName }: EmojiPickerProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [activeCategory, setActiveCategory] = useState<keyof typeof emojiCategories>("Smileys")

    const handleEmojiClick = (emoji: string) => {
        onEmojiSelect(emoji)
        setIsOpen(false)
    }

    return (
        <div className="relative">
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={buttonClassName || "p-2 hover:bg-gray-100 rounded-full transition-colors"}
            >
                <Smile className="w-5 h-5 text-gray-600" />
            </button>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="absolute bottom-full mb-2 left-0 z-50 bg-white rounded-xl shadow-2xl border border-gray-200 w-80">
                        {/* Category Tabs */}
                        <div className="flex gap-1 p-2 border-b overflow-x-auto">
                            {Object.keys(emojiCategories).map((category) => (
                                <button
                                    key={category}
                                    onClick={() => setActiveCategory(category as keyof typeof emojiCategories)}
                                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${activeCategory === category
                                            ? "bg-[#a22929] text-white"
                                            : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                                        }`}
                                >
                                    {category}
                                </button>
                            ))}
                        </div>

                        {/* Emoji Grid */}
                        <div className="p-3 max-h-64 overflow-y-auto">
                            <div className="grid grid-cols-8 gap-1">
                                {emojiCategories[activeCategory].map((emoji, index) => (
                                    <button
                                        key={index}
                                        onClick={() => handleEmojiClick(emoji)}
                                        className="text-2xl p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    )
}
