"use client"

import { useEffect, useState } from "react"
import AdminRoute from "@/components/AdminRoute"
import { Button } from "@/components/ui/button"
import { Calendar, Users, MapPin, Eye, Loader2, Plus, Check, X } from "lucide-react"
import { collection, query, where, onSnapshot, orderBy, doc, updateDoc, getDocs } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { toast } from "sonner"
import { CreateEventModal } from "@/components/CreateEventModal"
import { CreateCommunityModal } from "@/components/CreateCommunityModal"

interface Event {
    id: string
    title: string
    description: string
    date: any
    location: string
    imageUrl?: string
    status: "pending" | "approved" | "rejected"
    createdBy: string
    createdByName: string
    maxAttendees?: number
    attendees: string[]
}

interface Community {
    id: string
    name: string
    description: string
    category?: string
    imageUrl?: string
    privacy: "public" | "private"
    members: string[]
    createdBy: string
    createdByName: string
}

export default function AdminContentPage() {
    const [events, setEvents] = useState<Event[]>([])
    const [communities, setCommunities] = useState<Community[]>([])
    const [loading, setLoading] = useState(true)
    const [showEventModal, setShowEventModal] = useState(false)
    const [showCommunityModal, setShowCommunityModal] = useState(false)
    const [processingEventId, setProcessingEventId] = useState<string | null>(null)

    // Fetch pending events
    useEffect(() => {
        const q = query(
            collection(db, "events"),
            where("status", "==", "pending")
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const eventsData: Event[] = []
            snapshot.forEach((doc) => {
                eventsData.push({ id: doc.id, ...doc.data() } as Event)
            })
            // Sort client-side to avoid composite index requirements
            eventsData.sort((a, b) => {
                const dateA = a.date?.seconds || 0
                const dateB = b.date?.seconds || 0
                return dateB - dateA
            })
            setEvents(eventsData)
            setLoading(false)
        }, (error) => {
            console.error("Error fetching events:", error)
            setLoading(false)
            toast.error("Failed to load events")
        })

        return () => unsubscribe()
    }, [])

    // Fetch communities
    useEffect(() => {
        const q = query(collection(db, "communities"), orderBy("createdAt", "desc"))

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const communitiesData: Community[] = []
            snapshot.forEach((doc) => {
                communitiesData.push({ id: doc.id, ...doc.data() } as Community)
            })
            setCommunities(communitiesData)
        })

        return () => unsubscribe()
    }, [])

    const handleApproveEvent = async (eventId: string) => {
        setProcessingEventId(eventId)
        try {
            await updateDoc(doc(db, "events", eventId), {
                status: "approved"
            })
            toast.success("Event approved!", { description: "Event is now visible to users" })
            // TODO: Send email notifications to invitees
        } catch (error) {
            console.error("Error approving event:", error)
            toast.error("Failed to approve event")
        } finally {
            setProcessingEventId(null)
        }
    }

    const handleRejectEvent = async (eventId: string) => {
        setProcessingEventId(eventId)
        try {
            await updateDoc(doc(db, "events", eventId), {
                status: "rejected"
            })
            toast.success("Event rejected")
        } catch (error) {
            console.error("Error rejecting event:", error)
            toast.error("Failed to reject event")
        } finally {
            setProcessingEventId(null)
        }
    }

    const formatDate = (date: any) => {
        if (!date) return "N/A"
        const d = date.toDate ? date.toDate() : new Date(date)
        return d.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" })
    }

    if (loading) {
        return (
            <AdminRoute>
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="w-8 h-8 animate-spin text-[#a22929]" />
                </div>
            </AdminRoute>
        )
    }

    return (
        <AdminRoute>
            <div className="p-8 space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Content & Community</h1>
                    <p className="text-gray-500 mt-1">Manage events, communities, and featured stories.</p>
                </div>

                {/* Events Section */}
                <div>
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">
                            Upcoming Events {events.length > 0 && `(${events.length} Pending Approval)`}
                        </h2>
                        <div className="flex gap-2">
                            <Button variant="outline" onClick={() => setShowEventModal(true)}>
                                <Plus className="w-4 h-4 mr-2" />
                                Create Event
                            </Button>
                        </div>
                    </div>

                    {events.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">No pending events</p>
                            <p className="text-sm text-gray-400 mt-1">Create an event to get started</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {events.map((event) => (
                                <div key={event.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm group">
                                    <div className="h-32 bg-gradient-to-br from-[#a22929] to-[#ae645c] relative">
                                        {event.imageUrl && (
                                            <img src={event.imageUrl} alt={event.title} className="w-full h-full object-cover" />
                                        )}
                                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur px-2 py-1 rounded text-xs font-bold text-orange-600">
                                            Pending
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <h3 className="font-bold text-gray-900 mb-1">{event.title}</h3>
                                        <p className="text-xs text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4">
                                            <Calendar className="w-3 h-3" /> {formatDate(event.date)}
                                            <MapPin className="w-3 h-3 ml-2" /> {event.location}
                                        </div>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                className="w-full bg-green-600 hover:bg-green-700"
                                                onClick={() => handleApproveEvent(event.id)}
                                                disabled={processingEventId === event.id}
                                            >
                                                {processingEventId === event.id ? (
                                                    <Loader2 className="w-4 h-4 animate-spin" />
                                                ) : (
                                                    <>
                                                        <Check className="w-4 h-4 mr-1" />
                                                        Approve
                                                    </>
                                                )}
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                className="w-full hover:bg-red-50 hover:text-red-600 hover:border-red-600"
                                                onClick={() => handleRejectEvent(event.id)}
                                                disabled={processingEventId === event.id}
                                            >
                                                <X className="w-4 h-4 mr-1" />
                                                Reject
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Communities Section */}
                <div className="pt-8 border-t border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-xl font-bold text-gray-900">
                            Active Communities {communities.length > 0 && `(${communities.length})`}
                        </h2>
                        <Button variant="outline" onClick={() => setShowCommunityModal(true)}>
                            <Plus className="w-4 h-4 mr-2" />
                            Create Community
                        </Button>
                    </div>

                    {communities.length === 0 ? (
                        <div className="bg-white rounded-xl border border-gray-200 p-8 text-center">
                            <Users className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                            <p className="text-gray-500 font-medium">No communities yet</p>
                            <p className="text-sm text-gray-400 mt-1">Create a community to bring people together</p>
                        </div>
                    ) : (
                        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                            {communities.map((community) => (
                                <div
                                    key={community.id}
                                    className="p-4 flex items-center justify-between border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
                                >
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                            {community.imageUrl ? (
                                                <img src={community.imageUrl} alt={community.name} className="w-full h-full object-cover rounded-lg" />
                                            ) : (
                                                <Users className="w-5 h-5" />
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-gray-900">{community.name}</p>
                                            <p className="text-xs text-gray-500">
                                                {community.members.length.toLocaleString()} Members • {community.privacy === "public" ? "Public" : "Private"}
                                                {community.category && ` • ${community.category}`}
                                            </p>
                                        </div>
                                    </div>
                                    <Button variant="ghost" size="sm">
                                        <Eye className="w-4 h-4 mr-2" /> View
                                    </Button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Modals */}
            <CreateEventModal
                open={showEventModal}
                onOpenChange={setShowEventModal}
                onEventCreated={() => toast.success("Event created and submitted for approval")}
            />
            <CreateCommunityModal
                open={showCommunityModal}
                onOpenChange={setShowCommunityModal}
                onCommunityCreated={() => toast.success("Community created successfully")}
            />
        </AdminRoute>
    )
}
