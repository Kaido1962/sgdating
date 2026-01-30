"use client"

import Navbar from "@/components/navbar"
import ProtectedRoute from "@/components/ProtectedRoute"
import { useAuth } from "@/context/AuthContext"
import { useMatches } from "@/hooks/useMatches"
import { useFriendSystem } from "@/hooks/useFriendSystem"
import { Button } from "@/components/ui/button"
import { MessageCircle, User, Loader2, Sparkles, UserPlus, Clock, Check, UserCheck } from "lucide-react"
import { useRouter } from "next/navigation"

export default function MatchesPage() {
    const { user } = useAuth()
    const router = useRouter()
    // In a real app, this would be a specific 'getConnectedMatches' hook
    // For now, we reuse useMatches but pretend they are connected matches for the UI demo
    const { matches, loading } = useMatches()
    const { friends, outgoingRequests, incomingRequests, sendRequest, acceptRequest } = useFriendSystem()

    const getRelationshipStatus = (uid: string) => {
        if (friends.includes(uid)) return 'friend'
        if (outgoingRequests.includes(uid)) return 'sent'
        if (incomingRequests.find(r => r.from === uid)) return 'received'
        return 'none'
    }

    const handleAction = (uid: string, status: string) => {
        if (status === 'none') {
            sendRequest(uid)
        } else if (status === 'received') {
            const req = incomingRequests.find(r => r.from === uid)
            if (req) acceptRequest(req.id)
        } else if (status === 'friend') {
            router.push(`/chat/${uid}`)
        }
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#f0f2f5] pt-20 pb-10">
                <Navbar />

                <div className="max-w-7xl mx-auto px-4">
                    <div className="mb-8 flex items-end justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-[#242228] mb-2">Discover People</h1>
                            <p className="text-gray-500">Add friends to start a conversation!</p>
                        </div>
                        <div className="text-[#a22929] font-bold text-xl">
                            {matches.length} Nearby
                        </div>
                    </div>

                    {loading ? (
                        <div className="text-center py-20">
                            <Loader2 className="animate-spin w-10 h-10 text-[#a22929] mx-auto" />
                        </div>
                    ) : matches.length === 0 ? (
                        <div className="text-center py-20 text-gray-500 bg-white rounded-xl shadow-sm">
                            <Sparkles className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                            <h3 className="text-lg font-bold text-gray-700">No New Matches</h3>
                            <p className="max-w-md mx-auto mt-2">Check back later for more people nearby.</p>
                            <Button onClick={() => router.push('/dashboard')} className="mt-6 bg-[#a22929] text-white">
                                Go to Feed
                            </Button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                            {matches.map((match) => {
                                const status = getRelationshipStatus(match.uid)

                                return (
                                    <div key={match.uid} className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden group hover:shadow-md transition-all">
                                        <div className="aspect-square relative overflow-hidden bg-gray-100 cursor-pointer" onClick={() => router.push(`/users/${match.uid}`)}>
                                            {match.photoURL ? (
                                                <img src={match.photoURL} className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center text-gray-400">No Photo</div>
                                            )}
                                            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/60 to-transparent p-3 pt-8">
                                                <div className="text-white font-bold text-lg leading-none">{match.displayName}, {match.age}</div>
                                                <div className="text-white/80 text-xs flex items-center gap-1 mt-1">
                                                    <div className="h-2 w-2 bg-green-500 rounded-full"></div> Online
                                                </div>
                                            </div>
                                        </div>
                                        <div className="p-3 flex gap-2">
                                            {status === 'friend' ? (
                                                <Button
                                                    className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                                                    size="sm"
                                                    onClick={() => handleAction(match.uid, status)}
                                                >
                                                    <MessageCircle className="w-4 h-4 mr-2" /> Chat
                                                </Button>
                                            ) : status === 'sent' ? (
                                                <Button
                                                    className="flex-1 bg-gray-100 text-gray-500 cursor-default"
                                                    size="sm"
                                                    variant="ghost"
                                                >
                                                    <Clock className="w-4 h-4 mr-2" /> Pending
                                                </Button>
                                            ) : status === 'received' ? (
                                                <Button
                                                    className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                                                    size="sm"
                                                    onClick={() => handleAction(match.uid, status)}
                                                >
                                                    <Check className="w-4 h-4 mr-2" /> Accept
                                                </Button>
                                            ) : (
                                                <Button
                                                    className="flex-1 bg-[#a22929] hover:bg-[#8b2323] text-white"
                                                    size="sm"
                                                    onClick={() => handleAction(match.uid, status)}
                                                >
                                                    <UserPlus className="w-4 h-4 mr-2" /> Add
                                                </Button>
                                            )}

                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="text-gray-500 border-gray-200 hover:text-[#a22929] hover:border-[#a22929]"
                                                onClick={() => router.push(`/users/${match.uid}`)}
                                            >
                                                <User className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )
                            })}
                        </div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    )
}
