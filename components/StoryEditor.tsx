"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { X, Type, Palette, Sparkles, Check } from "lucide-react"

interface StoryEditorProps {
    imageUrl: string
    onSave: (customizedImage: string, metadata: StoryMetadata) => void
    onCancel: () => void
}

export interface StoryMetadata {
    text?: string
    textColor?: string
    textPosition?: { x: number; y: number }
    fontSize?: number
    filter?: string
}

export function StoryEditor({ imageUrl, onSave, onCancel }: StoryEditorProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [text, setText] = useState("")
    const [textColor, setTextColor] = useState("#FFFFFF")
    const [fontSize, setFontSize] = useState(32)
    const [filter, setFilter] = useState("none")
    const [textPosition, setTextPosition] = useState({ x: 50, y: 50 })
    const [isDragging, setIsDragging] = useState(false)

    const filters = [
        { name: "None", value: "none", css: "" },
        { name: "Bright", value: "bright", css: "brightness(1.2)" },
        { name: "Dark", value: "dark", css: "brightness(0.8)" },
        { name: "Warm", value: "warm", css: "sepia(0.3)" },
        { name: "Cool", value: "cool", css: "hue-rotate(180deg)" },
        { name: "B&W", value: "bw", css: "grayscale(1)" },
    ]

    const colors = ["#FFFFFF", "#000000", "#FF0000", "#00FF00", "#0000FF", "#FFFF00", "#FF00FF", "#00FFFF"]

    useEffect(() => {
        renderCanvas()
    }, [imageUrl, text, textColor, fontSize, filter, textPosition])

    const renderCanvas = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const ctx = canvas.getContext("2d")
        if (!ctx) return

        const img = new Image()
        img.crossOrigin = "anonymous"
        img.onload = () => {
            canvas.width = img.width
            canvas.height = img.height

            // Apply filter
            const selectedFilter = filters.find(f => f.value === filter)
            if (selectedFilter) {
                ctx.filter = selectedFilter.css
            }
            ctx.drawImage(img, 0, 0)
            ctx.filter = "none"

            // Draw text
            if (text) {
                ctx.font = `bold ${fontSize}px Arial`
                ctx.fillStyle = textColor
                ctx.strokeStyle = textColor === "#FFFFFF" ? "#000000" : "#FFFFFF"
                ctx.lineWidth = 3
                ctx.textAlign = "center"
                ctx.strokeText(text, (textPosition.x / 100) * canvas.width, (textPosition.y / 100) * canvas.height)
                ctx.fillText(text, (textPosition.x / 100) * canvas.width, (textPosition.y / 100) * canvas.height)
            }
        }
        img.src = imageUrl
    }

    const handleSave = () => {
        const canvas = canvasRef.current
        if (!canvas) return

        const customizedImage = canvas.toDataURL("image/jpeg", 0.9)
        const metadata: StoryMetadata = {
            text,
            textColor,
            textPosition,
            fontSize,
            filter,
        }
        onSave(customizedImage, metadata)
    }

    const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
        const canvas = canvasRef.current
        if (!canvas) return

        const rect = canvas.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100
        setTextPosition({ x, y })
    }

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 border-b">
                    <h2 className="text-xl font-bold text-[#242228]">Customize Your Story</h2>
                    <button onClick={onCancel} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Main Content */}
                <div className="flex-1 overflow-auto p-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Canvas Preview */}
                        <div className="space-y-4">
                            <div className="relative bg-gray-100 rounded-xl overflow-hidden aspect-[9/16] max-h-[600px]">
                                <canvas
                                    ref={canvasRef}
                                    onClick={handleCanvasClick}
                                    className="w-full h-full object-contain cursor-crosshair"
                                />
                            </div>
                            <p className="text-sm text-gray-500 text-center">Click on the image to position your text</p>
                        </div>

                        {/* Controls */}
                        <div className="space-y-6">
                            {/* Text Input */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-[#242228] mb-2">
                                    <Type className="w-4 h-4" />
                                    Add Text
                                </label>
                                <input
                                    type="text"
                                    value={text}
                                    onChange={(e) => setText(e.target.value)}
                                    placeholder="Type your message..."
                                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-[#a22929] focus:border-transparent"
                                    maxLength={50}
                                />
                                <p className="text-xs text-gray-400 mt-1">{text.length}/50 characters</p>
                            </div>

                            {/* Font Size */}
                            <div>
                                <label className="text-sm font-semibold text-[#242228] mb-2 block">Font Size</label>
                                <input
                                    type="range"
                                    min="20"
                                    max="80"
                                    value={fontSize}
                                    onChange={(e) => setFontSize(Number(e.target.value))}
                                    className="w-full"
                                />
                                <p className="text-xs text-gray-500 mt-1">{fontSize}px</p>
                            </div>

                            {/* Text Color */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-[#242228] mb-2">
                                    <Palette className="w-4 h-4" />
                                    Text Color
                                </label>
                                <div className="flex gap-2 flex-wrap">
                                    {colors.map((color) => (
                                        <button
                                            key={color}
                                            onClick={() => setTextColor(color)}
                                            className={`w-10 h-10 rounded-full border-2 transition-all ${textColor === color ? "border-[#a22929] scale-110" : "border-gray-200"
                                                }`}
                                            style={{ backgroundColor: color }}
                                        >
                                            {textColor === color && <Check className="w-5 h-5 text-white mx-auto" />}
                                        </button>
                                    ))}
                                </div>
                            </div>

                            {/* Filters */}
                            <div>
                                <label className="flex items-center gap-2 text-sm font-semibold text-[#242228] mb-2">
                                    <Sparkles className="w-4 h-4" />
                                    Filters
                                </label>
                                <div className="grid grid-cols-3 gap-2">
                                    {filters.map((f) => (
                                        <button
                                            key={f.value}
                                            onClick={() => setFilter(f.value)}
                                            className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all ${filter === f.value
                                                    ? "bg-[#a22929] text-white border-[#a22929]"
                                                    : "bg-white text-gray-700 border-gray-200 hover:border-[#a22929]"
                                                }`}
                                        >
                                            {f.name}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-end gap-3 p-4 border-t bg-gray-50">
                    <Button variant="ghost" onClick={onCancel}>
                        Cancel
                    </Button>
                    <Button onClick={handleSave} className="bg-[#a22929] hover:bg-[#8b2323] text-white px-6">
                        Share Story
                    </Button>
                </div>
            </div>
        </div>
    )
}
