"use client"

import { useMatches } from "@/hooks/useMatches"
import ProtectedRoute from "@/components/ProtectedRoute"
import Navbar from "@/components/navbar"
import { useFriendSystem } from "@/hooks/useFriendSystem"
import { useAuth } from "@/context/AuthContext"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Search, MessageCircle } from "lucide-react"

import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, onSnapshot, orderBy, limit } from "firebase/firestore"
import { useEffect, useState } from "react"

function ChatListItem({ friendId, currentUserId }: { friendId: string; currentUserId: string }) {
    const [friendProfile, setFriendProfile] = useState<any>(null)
    const [lastMsg, setLastMsg] = useState("Click to start chatting...")
    const router = useRouter()

    useEffect(() => {
        const fetchProfile = async () => {
            const q = query(collection(db, "users"), where("uid", "==", friendId))
            const snap = await getDocs(q)
            if (!snap.empty) {
                setFriendProfile(snap.docs[0].data())
            }
        }
        fetchProfile()

        // Optionally fetch last message snippet (simplification)
        const chatQ = query(
            collection(db, "chats"),
            where("participants", "array-contains", friendId),
            orderBy("lastMessageTime", "desc"),
            limit(1)
        )
        const unsubscribe = onSnapshot(chatQ, (snap) => {
            const myChat = snap.docs.find(d => d.data().participants.includes(window.location.hash)) // Rough filter
            if (!snap.empty) {
                // We'd need current user ID here too for better filtering
            }
        })
    }, [friendId])

    return (
        <div
            className="p-4 hover:bg-gray-50 cursor-pointer flex items-center gap-4 transition-colors"
            onClick={() => router.push(`/chat/${friendId}`)}
        >
            <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden flex items-center justify-center text-[#a22929] font-bold border">
                {friendProfile?.photoURL ? (
                    <img src={friendProfile.photoURL} className="h-full w-full object-cover" />
                ) : (
                    friendProfile?.displayName?.[0] || "?"
                )}
            </div>
            <div className="flex-1">
                <h4 className="font-semibold text-[#242228]">{friendProfile?.displayName || "Loading..."}</h4>
                <p className="text-sm text-gray-500 truncate">{lastMsg}</p>
            </div>
            <span className="text-xs text-gray-400">Now</span>
        </div>
    )
}

export default function MessagesPage() {
    const { friends } = useFriendSystem()
    const { user } = useAuth()
    const router = useRouter()

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#f0f2f5] pt-20 pb-10">
                <Navbar />
                <div className="max-w-4xl mx-auto px-4">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-[#242228]">Messages</h1>
                        <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm border text-gray-400">
                            <Search className="w-5 h-5" />
                        </div>
                    </div>

                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden min-h-[500px]">
                        {friends.length === 0 ? (
                            <div className="flex flex-col items-center justify-center h-full py-20">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4 text-gray-400">
                                    <MessageCircle className="w-8 h-8" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-700">No messages yet</h3>
                                <p className="text-gray-500 mb-6 text-center max-w-xs">Connect with more people to start chatting.</p>
                                <Button onClick={() => router.push('/matches')}>Find Matches</Button>
                            </div>
                        ) : (
                            <div className="divide-y divide-gray-100">
                                {friends.map(friendId => (
                                    <ChatListItem key={friendId} friendId={friendId} currentUserId={user?.uid || ""} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}
