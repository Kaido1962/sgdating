"use client"

import { useEffect, useState } from "react"
import SuperAdminRoute from "@/components/SuperAdminRoute"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Bot, Shield, Zap, RefreshCw, Loader2, CheckCircle2 } from "lucide-react"
import { doc, getDoc, setDoc, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { toast } from "sonner"

export default function SuperAdminAIPage() {
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    // Config State
    const [matchingWeights, setMatchingWeights] = useState({ geo: 80, interest: 50 })
    const [bannedKeywords, setBannedKeywords] = useState("kill, hate, scam, money, transfer, bank, western union, die, attack")
    const [smartMatchingEnabled, setSmartMatchingEnabled] = useState(true)
    const [moderationEnabled, setModerationEnabled] = useState(true)

    // Stats State
    const [stats, setStats] = useState({
        matchesCreated: 1204,
        threatsBlocked: 14,
        falsePositiveRate: 0.2
    })

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const docRef = doc(db, "system_settings", "ai_config")
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    const data = docSnap.data()
                    setMatchingWeights(data.matchingWeights || { geo: 80, interest: 50 })
                    setBannedKeywords((data.bannedKeywords || []).join(", "))
                    setSmartMatchingEnabled(data.smartMatchingEnabled ?? true)
                    setModerationEnabled(data.moderationEnabled ?? true)
                }

                // Fetch real stats if available, otherwise use defaults/mock
                const statsRef = doc(db, "system_settings", "ai_stats")
                const statsSnap = await getDoc(statsRef)
                if (statsSnap.exists()) {
                    setStats(statsSnap.data() as any)
                }

            } catch (error) {
                console.error("Error fetching AI settings:", error)
                toast.error("Failed to load AI settings")
            } finally {
                setLoading(false)
            }
        }

        fetchSettings()
    }, [])

    const saveSettings = async (section: "matching" | "moderation") => {
        setSaving(true)
        try {
            const docRef = doc(db, "system_settings", "ai_config")

            // Prepare update data based on what's being saved to avoid overwriting other fields if we did partial updates, 
            // but setDoc with merge is safer.
            const keywordsArray = bannedKeywords.split(",").map(k => k.trim()).filter(k => k.length > 0)

            const updateData = {
                matchingWeights,
                bannedKeywords: keywordsArray,
                smartMatchingEnabled,
                moderationEnabled,
                lastUpdated: new Date()
            }

            await setDoc(docRef, updateData, { merge: true })

            if (section === "moderation") {
                toast.success("Content moderation rules updated")
            } else {
                toast.success("Matching algorithm calibrated")
            }

        } catch (error) {
            console.error("Error saving settings:", error)
            toast.error("Failed to save changes")
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <SuperAdminRoute>
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="w-8 h-8 animate-spin text-[#a22929]" />
                </div>
            </SuperAdminRoute>
        )
    }

    return (
        <SuperAdminRoute>
            <div className="p-8 space-y-8">
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Bot className="w-8 h-8 text-[#a22929]" />
                        <h1 className="text-3xl font-bold text-gray-900">AI & Platform Intelligence</h1>
                    </div>
                    <p className="text-gray-500">Configure the matching engine, content moderation AI, and automated safety systems.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

                    {/* Matching Engine Settings */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center text-purple-600">
                                    <Zap className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Smart Matching Engine</h3>
                                    <p className="text-sm text-gray-500">Algorithm that pairs users</p>
                                </div>
                            </div>
                            <Switch
                                checked={smartMatchingEnabled}
                                onCheckedChange={setSmartMatchingEnabled}
                            />
                        </div>

                        <div className="space-y-4 pt-4 border-t border-gray-100">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">Geographic Weighting</span>
                                    <span className="text-sm text-gray-500">{matchingWeights.geo}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={matchingWeights.geo}
                                    onChange={(e) => setMatchingWeights(prev => ({ ...prev, geo: parseInt(e.target.value) }))}
                                    className="w-full accent-purple-600 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="space-y-3">
                                <div className="flex items-center justify-between">
                                    <span className="text-sm font-medium text-gray-700">Interest Overlap</span>
                                    <span className="text-sm text-gray-500">{matchingWeights.interest}%</span>
                                </div>
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    value={matchingWeights.interest}
                                    onChange={(e) => setMatchingWeights(prev => ({ ...prev, interest: parseInt(e.target.value) }))}
                                    className="w-full accent-purple-600 h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer"
                                />
                            </div>
                        </div>
                        <Button
                            className="w-full bg-purple-600 hover:bg-purple-700"
                            onClick={() => saveSettings("matching")}
                            disabled={saving}
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <RefreshCw className="w-4 h-4 mr-2" />}
                            Calibrate Algorithm
                        </Button>
                    </div>

                    {/* Content Moderation AI */}
                    <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center text-[#a22929]">
                                    <Shield className="w-6 h-6" />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Safety & Moderation AI</h3>
                                    <p className="text-sm text-gray-500">Automated threat detection</p>
                                </div>
                            </div>
                            <Switch
                                checked={moderationEnabled}
                                onCheckedChange={setModerationEnabled}
                            />
                        </div>

                        <div className="pt-4 border-t border-gray-100">
                            <label className="text-sm font-medium text-gray-900 mb-2 block">Global Banned Keywords (CSV)</label>
                            <Textarea
                                className="min-h-[120px] text-sm font-mono bg-gray-50 border-gray-200 focus:border-[#a22929] focus:ring-[#a22929]"
                                value={bannedKeywords}
                                onChange={(e) => setBannedKeywords(e.target.value)}
                                placeholder="Enter comma-separated words..."
                            />
                            <p className="text-xs text-gray-500 mt-2">Separate words with commas. Changes apply immediately to chat filters.</p>
                        </div>

                        <Button
                            className="w-full bg-[#a22929] hover:bg-[#912323]"
                            onClick={() => saveSettings("moderation")}
                            disabled={saving}
                        >
                            {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <CheckCircle2 className="w-4 h-4 mr-2" />}
                            Update Banned List
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                    <h3 className="font-bold text-gray-900 mb-4">AI Performance Metrics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Matches Created</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.matchesCreated.toLocaleString()}</p>
                            <p className="text-xs text-green-600 flex items-center gap-1"><RefreshCw className="w-3 h-3" /> Last 24h</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Threats Blocked</p>
                            <p className="text-2xl font-bold text-[#a22929]">{stats.threatsBlocked.toLocaleString()}</p>
                            <p className="text-xs text-gray-400">High Confidence</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">False Positives</p>
                            <p className="text-2xl font-bold text-gray-900">{stats.falsePositiveRate}%</p>
                            <p className="text-xs text-gray-400">Rate</p>
                        </div>
                    </div>
                </div>

            </div>
        </SuperAdminRoute>
    )
}
