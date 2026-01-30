"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Calendar, MapPin, Users as UsersIcon, Loader2, X } from "lucide-react"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { toast } from "sonner"
import { useAuth } from "@/context/AuthContext"

interface CreateEventModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onEventCreated?: () => void
}

export function CreateEventModal({ open, onOpenChange, onEventCreated }: CreateEventModalProps) {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        date: "",
        time: "",
        location: "",
        maxAttendees: "",
        imageUrl: ""
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setLoading(true)
        try {
            // Combine date and time
            const eventDateTime = new Date(`${formData.date}T${formData.time}`)

            await addDoc(collection(db, "events"), {
                title: formData.title,
                description: formData.description,
                date: eventDateTime,
                location: formData.location,
                imageUrl: formData.imageUrl || "",
                createdBy: user.uid,
                createdByName: user.displayName || "Unknown",
                createdAt: serverTimestamp(),
                status: "pending",
                invitees: [],
                attendees: [],
                maxAttendees: formData.maxAttendees ? parseInt(formData.maxAttendees) : null
            })

            toast.success("Event created successfully!", { description: "Waiting for admin approval" })

            // Reset form
            setFormData({
                title: "",
                description: "",
                date: "",
                time: "",
                location: "",
                maxAttendees: "",
                imageUrl: ""
            })

            onOpenChange(false)
            onEventCreated?.()
        } catch (error) {
            console.error("Error creating event:", error)
            toast.error("Failed to create event")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Create New Event</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="title">Event Title *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            placeholder="Singles Mixer JHB"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="Join us for an exciting evening of mingling and connections..."
                            rows={4}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="date">Date *</Label>
                            <div className="relative">
                                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                                <Input
                                    id="date"
                                    type="date"
                                    value={formData.date}
                                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                                    className="pl-10"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="time">Time *</Label>
                            <Input
                                id="time"
                                type="time"
                                value={formData.time}
                                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="location">Location *</Label>
                        <div className="relative">
                            <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                id="location"
                                value={formData.location}
                                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                placeholder="Sandton, Johannesburg"
                                className="pl-10"
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="maxAttendees">Max Attendees (Optional)</Label>
                        <div className="relative">
                            <UsersIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                            <Input
                                id="maxAttendees"
                                type="number"
                                value={formData.maxAttendees}
                                onChange={(e) => setFormData({ ...formData, maxAttendees: e.target.value })}
                                placeholder="50"
                                className="pl-10"
                                min="1"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">Event Image URL (Optional)</Label>
                        <Input
                            id="imageUrl"
                            type="url"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            placeholder="https://example.com/event-image.jpg"
                        />
                        <p className="text-xs text-gray-500">Paste a URL to an event cover image</p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={() => onOpenChange(false)}
                            className="flex-1"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={loading}
                            className="flex-1 bg-[#a22929] hover:bg-[#8b2323]"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                "Create Event"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
