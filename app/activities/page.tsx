"use client"
import ProtectedRoute from "@/components/ProtectedRoute"
import Navbar from "@/components/navbar"
import { useFriendSystem } from "@/hooks/useFriendSystem"
import { Bell, Heart, UserPlus, MessageSquare } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { collection, query, onSnapshot, orderBy, limit } from "firebase/firestore"
import { useAuth } from "@/context/AuthContext"

export default function ActivitiesPage() {
    const { user } = useAuth()
    const { incomingRequests, acceptRequest, rejectRequest } = useFriendSystem()
    const [socialNotifications, setSocialNotifications] = useState<any[]>([])

    useEffect(() => {
        if (!user) return
        const q = query(collection(db, "users", user.uid, "notifications"), orderBy("timestamp", "desc"), limit(20))
        const unsubscribe = onSnapshot(q, (snap) => {
            const loaded: any[] = []
            snap.forEach(d => loaded.push({ id: d.id, ...d.data() }))
            setSocialNotifications(loaded)
        })
        return () => unsubscribe()
    }, [user])

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-[#f0f2f5] pt-20 pb-10">
                <Navbar />
                <div className="max-w-2xl mx-auto px-4">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-2xl font-bold text-[#242228]">Activities</h1>
                        <Button variant="ghost" size="sm" className="text-[#a22929]">Activity History</Button>
                    </div>

                    <div className="space-y-6">
                        {/* Section: Friend Requests */}
                        {incomingRequests.length > 0 && (
                            <div>
                                <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">Friend Requests</h3>
                                <div className="space-y-3">
                                    {incomingRequests.map(req => (
                                        <div key={req.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 animate-in fade-in slide-in-from-left-2">
                                            <div className="w-12 h-12 bg-gray-200 rounded-full overflow-hidden border flex-shrink-0">
                                                {req.fromUser?.photoURL ? <img src={req.fromUser.photoURL} className="h-full w-full object-cover" /> : <div className="h-full w-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">{req.fromUser?.displayName?.[0] || "?"}</div>}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-[#242228] text-sm"><span className="font-bold">{req.fromUser?.displayName || "A user"}</span> sent you a friend request.</p>
                                                <p className="text-xs text-gray-500">Just now</p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button size="sm" onClick={() => acceptRequest(req.id)} className="bg-[#a22929] hover:bg-[#8b2323] rounded-full">Confirm</Button>
                                                <Button size="sm" variant="ghost" onClick={() => rejectRequest(req.id)} className="rounded-full">Delete</Button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Recent Activity Notifications */}
                        <div>
                            <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-3 px-1">Recent Activity</h3>
                            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden divide-y">
                                {socialNotifications.length === 0 ? (
                                    <div className="p-10 text-center">
                                        <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-300">
                                            <Bell className="w-8 h-8" />
                                        </div>
                                        <p className="text-gray-500">No new notifications.</p>
                                    </div>
                                ) : (
                                    socialNotifications.map(notif => (
                                        <div key={notif.id} className="p-4 hover:bg-gray-50 flex items-center gap-4">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${notif.type === 'post_like' ? 'bg-red-100 text-[#a22929]' :
                                                notif.type === 'profile_like' ? 'bg-orange-100 text-orange-600' : 'bg-blue-100 text-blue-600'
                                                }`}>
                                                {notif.type === 'post_like' && <Heart className="w-5 h-5 fill-current" />}
                                                {notif.type === 'profile_like' && <Heart className="w-5 h-5" />}
                                                {notif.type === 'comment' && <MessageSquare className="w-5 h-5" />}
                                            </div>
                                            <div className="flex-1">
                                                <p className="text-sm text-[#242228]">
                                                    <span className="font-bold">{notif.fromName}</span>
                                                    {notif.type === 'post_like' ? ' liked your post.' :
                                                        notif.type === 'profile_like' ? ' liked your profile photo.' :
                                                            ' commented on your post.'}
                                                </p>
                                                <p className="text-xs text-gray-400">
                                                    {notif.timestamp?.seconds ? new Date(notif.timestamp.seconds * 1000).toLocaleString() : 'Just now'}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </ProtectedRoute>
    )
}
