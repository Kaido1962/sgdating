"use client"

import { useEffect, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { collection, getDocs, query, where, documentId } from "firebase/firestore"
import { db } from "@/lib/firebase"
import ProtectedRoute from "@/components/ProtectedRoute"
import Navbar from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Heart, X } from "lucide-react"
import { useRouter } from "next/navigation"

interface LikingUser {
    id: string
    displayName: string
    photoURL?: string
    age?: number
    bio?: string
}

export default function LikesPage() {
    const { user } = useAuth()
    const router = useRouter()
    const [likers, setLikers] = useState<LikingUser[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchLikers = async () => {
            if (!user) return

            // In a real app, you'd have a 'likes' subcollection or 'likedBy' array.
            // For this demo/ MVP, we will simulate "People who liked you" by fetching random users
            // OR using the actual friend requests/matches data if available.
            // Let's rely on fetching *other* users effectively to populate this for now, 
            // as we haven't implemented a robust "Likes You" backend hook yet apart from Friend Requests.
            // We'll treat "Incoming Friend Requests" as "Likes" for now, PLUS some randoms for the "Premium" feel.

            try {
                // Fetch users who sent friend requests (Real data)
                const requestsRef = collection(db, "friend_requests")
                const q = query(requestsRef, where("to", "==", user.uid), where("status", "==", "pending"))
                const snapshot = await getDocs(q)
                const requestUids = snapshot.docs.map(doc => doc.data().from)

                if (requestUids.length > 0) {
                    // Fetch their profiles
                    // Firestore 'in' query works up to 10 items. 
                    const usersRef = collection(db, "users")
                    const usersQ = query(usersRef, where("uid", "in", requestUids.slice(0, 10)))
                    const usersSnap = await getDocs(usersQ)
                    const realLikers = usersSnap.docs.map(d => d.data() as LikingUser)
                    setLikers(realLikers)
                } else {
                    // If no real requests, show empty or placeholder?
                    // Better to show empty state with CTA to boost.
                    setLikers([])
                }
            } catch (error) {
                console.error(error)
            } finally {
                setLoading(false)
            }
        }
        fetchLikers()
    }, [user])

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#f0f2f5] pt-20 pb-10">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4">
                    <div className="mb-6 flex items-center justify-between">
                        <div>
                            <h1 className="text-2xl font-bold text-[#242228]">Likes You</h1>
                            <p className="text-gray-500">See who's interested in you.</p>
                        </div>
                        <div className="bg-yellow-100 text-yellow-700 px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                            <Heart className="w-4 h-4 fill-current" />
                            {likers.length} New Likes
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-20 text-gray-400">Loading your admirers...</div>
                    ) : likers.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-10 text-center">
                            <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                                <Heart className="w-10 h-10 text-gray-300" />
                            </div>
                            <h2 className="text-xl font-bold text-[#242228] mb-2">No new likes yet</h2>
                            <p className="text-gray-500 mb-6">Boost your profile to get more visibility!</p>
                            <Button className="bg-[#a22929] hover:bg-[#8b2323] text-white">Boost Profile</Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {likers.map(liker => (
                                <div key={liker.id} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group relative">
                                    {/* Blur Effect for specific "Premium" feel if we wanted, but let's show them clearly for now since it's "Likes" page */}
                                    <div className="aspect-[3/4] bg-gray-200 relative">
                                        {liker.photoURL ? (
                                            <img src={liker.photoURL} alt={liker.displayName} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center bg-gray-100 text-gray-400 font-bold text-3xl">
                                                {liker.displayName?.[0]}
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-4">
                                            <div className="flex gap-2 w-full">
                                                <Button size="sm" className="flex-1 bg-white text-black hover:bg-gray-100 rounded-full">
                                                    <X className="w-4 h-4" />
                                                </Button>
                                                <Button size="sm" className="flex-1 bg-[#a22929] text-white hover:bg-[#8b2323] rounded-full" onClick={() => router.push(`/users/${liker.id}`)}>
                                                    <Heart className="w-4 h-4 fill-current" />
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="p-3">
                                        <h3 className="font-bold text-[#242228]">{liker.displayName}</h3>
                                        <p className="text-xs text-gray-500">{liker.age ? `${liker.age} • ` : ''}Johannesburg</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    )
}
