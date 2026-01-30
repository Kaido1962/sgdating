"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import ProtectedRoute from "@/components/ProtectedRoute"
import { ChevronLeft, Heart, MapPin, MessageCircle, User as UserIcon, Flag } from "lucide-react"
import Image from "next/image"
import { useMatches } from "@/hooks/useMatches"
import { useProfileViews } from "@/hooks/useProfileViews"
import { useProfileLikes } from "@/hooks/useProfileLikes"
import { useAuth } from "@/context/AuthContext"

interface UserProfile {
    uid: string
    displayName: string
    age: number | null
    gender: string
    location: string
    bio: string
    lookingFor: string
    photoURL?: string
    gallery?: string[]
}

export default function UserProfilePage() {
    const params = useParams()
    const router = useRouter()
    const [profile, setProfile] = useState<UserProfile | null>(null)
    const [loading, setLoading] = useState(true)
    const { blockUser, passUser } = useMatches()
    const { recordView } = useProfileViews()
    const { likesCount, isLiked, toggleProfileLike } = useProfileLikes(params.id as string)
    const { user: currentUser } = useAuth()

    useEffect(() => {
        const fetchProfile = async () => {
            if (!params.id) return

            try {
                const docRef = doc(db, "users", params.id as string)
                const docSnap = await getDoc(docRef)

                if (docSnap.exists()) {
                    setProfile(docSnap.data() as UserProfile)
                    // Record View
                    if (params.id) {
                        recordView(params.id as string)
                    }
                }
            } catch (error) {
                console.error("Error fetching user profile:", error)
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [params.id])

    if (loading) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-white">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a22929]"></div>
            </div>
        )
    }

    if (!profile) {
        return (
            <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-white p-4">
                <h1 className="text-xl font-bold text-[#242228]">User not found</h1>
                <Button onClick={() => router.back()}>Go Back</Button>
            </div>
        )
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50/50 pb-20">

                {/* Header Image / Navigation */}
                <div className="relative h-96 w-full bg-gray-200">
                    {profile.photoURL ? (
                        <div className="relative h-full w-full">
                            <Image
                                src={profile.photoURL}
                                alt={profile.displayName}
                                fill
                                className="object-cover"
                                priority
                            />
                            <button
                                onClick={(e) => {
                                    e.stopPropagation()
                                    toggleProfileLike()
                                }}
                                className={`absolute bottom-4 right-4 z-20 p-3 rounded-full shadow-lg transition-all transform active:scale-95 ${isLiked ? 'bg-[#a22929] text-white' : 'bg-white/80 text-gray-700 hover:bg-white'}`}
                            >
                                <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                                {likesCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-white text-[#a22929] text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-gray-100">
                                        {likesCount}
                                    </span>
                                )}
                            </button>
                        </div>
                    ) : (
                        <div className="flex h-full w-full items-center justify-center bg-gray-300">
                            <UserIcon className="h-20 w-20 text-gray-400" />
                        </div>
                    )}

                    <div className="absolute top-4 left-4 z-10">
                        <Button
                            size="icon"
                            variant="secondary"
                            className="rounded-full bg-white/80 hover:bg-white shadow-sm backdrop-blur-sm"
                            onClick={() => router.back()}
                        >
                            <ChevronLeft className="h-6 w-6 text-black" />
                        </Button>
                    </div>

                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-6 pt-20 text-white">
                        <h1 className="text-3xl font-bold">{profile.displayName}, {profile.age}</h1>
                        <div className="flex items-center gap-2 text-white/90">
                            <MapPin className="h-4 w-4" />
                            <span>{profile.location || "South Africa"}</span>
                        </div>
                    </div>
                </div>

                <div className="mx-auto max-w-2xl px-4 py-6 space-y-6">

                    {/* Quick Stats */}
                    <div className="flex gap-2 flex-wrap">
                        <span className="rounded-full bg-[#ae645c]/10 px-4 py-1.5 text-sm font-medium text-[#a22929] border border-[#ae645c]/20">
                            {profile.gender}
                        </span>
                        <span className="rounded-full bg-[#ae645c]/10 px-4 py-1.5 text-sm font-medium text-[#a22929] border border-[#ae645c]/20">
                            Looking for: {profile.lookingFor}
                        </span>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2">
                        <h2 className="text-lg font-semibold text-[#242228]">About {profile.displayName}</h2>
                        <p className="leading-relaxed text-gray-600">
                            {profile.bio || "This user hasn't written a bio yet."}
                        </p>
                    </div>

                    {/* Gallery - Only show if images exist */}
                    {profile.gallery && profile.gallery.length > 0 && (
                        <div className="space-y-3">
                            <h2 className="text-lg font-semibold text-[#242228]">Gallery</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {profile.gallery.map((img, idx) => (
                                    <div key={idx} className="relative aspect-square overflow-hidden rounded-xl bg-gray-100 shadow-sm border border-gray-100">
                                        <Image
                                            src={img}
                                            alt={`Gallery ${idx}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Admin Actions */}
                    {(currentUser?.email === "datingappadmin@guardian-angelstudios.co.za" || currentUser?.email === "datingappsuperadmin@guardian-angelstudios.co.za" || currentUser?.email === "guardianangelstudios731@gmail.com") && (
                        <div className="pt-4 border-t border-gray-100 space-y-3">
                            <h3 className="text-sm font-bold text-gray-900 uppercase tracking-wider">Admin Actions</h3>
                            <div className="grid grid-cols-2 gap-3">
                                <Button
                                    variant="outline"
                                    className="border-orange-200 bg-orange-50 text-orange-700 hover:bg-orange-100"
                                    onClick={() => {
                                        if (confirm("Deactivate this account? User will not be able to login.")) {
                                            // Mock deactivation
                                            alert("User account deactivated.")
                                        }
                                    }}
                                >
                                    Deactivate Account
                                </Button>
                                <Button
                                    variant="outline"
                                    className="border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                                    onClick={() => {
                                        if (confirm("PERMANENTLY DELETE this account? This cannot be undone.")) {
                                            // Mock deletion
                                            alert("User account deleted.")
                                        }
                                    }}
                                >
                                    Delete Account
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Safety Actions */}
                    <div className="pt-4 border-t border-gray-100">
                        <Button
                            variant="ghost"
                            className="w-full text-red-500 hover:text-red-600 hover:bg-red-50 justify-start px-0"
                            onClick={() => {
                                if (confirm("Are you sure you want to block this user?")) {
                                    blockUser(params.id as string)
                                    router.push('/dashboard')
                                }
                            }}
                        >
                            <Flag className="mr-2 h-4 w-4" /> Block or Report User
                        </Button>
                    </div>
                </div>

                {/* Sticky Action Footer */}
                <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                    <div className="mx-auto max-w-2xl flex gap-3">
                        <Button
                            variant="outline"
                            size="lg"
                            className="flex-1 border-[#a22929] text-[#a22929] hover:bg-red-50"
                            onClick={() => {
                                passUser(params.id as string)
                                router.push('/dashboard')
                            }}
                        >
                            <Heart className="mr-2 h-5 w-5" /> Pass
                        </Button>
                        <Button
                            size="lg"
                            className="bg-[#a22929] hover:bg-[#8b2323] text-white px-8"
                            onClick={() => router.push(`/chat/${params.id}`)}
                        >
                            Message
                        </Button>
                        <Button
                            size="lg"
                            variant="ghost"
                            className={`px-4 rounded-xl border ${isLiked ? 'bg-red-50 border-red-200 text-[#a22929]' : 'border-gray-200 text-gray-500'}`}
                            onClick={toggleProfileLike}
                        >
                            <Heart className={`w-6 h-6 ${isLiked ? 'fill-current' : ''}`} />
                        </Button>
                    </div>
                </div>

            </div>
        </ProtectedRoute>
    )
}
