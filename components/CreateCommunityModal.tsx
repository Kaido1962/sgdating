"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Loader2, Users } from "lucide-react"
import { collection, addDoc, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { toast } from "sonner"
import { useAuth } from "@/context/AuthContext"

interface CreateCommunityModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onCommunityCreated?: () => void
}

export function CreateCommunityModal({ open, onOpenChange, onCommunityCreated }: CreateCommunityModalProps) {
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        description: "",
        category: "",
        imageUrl: "",
        isPrivate: false
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setLoading(true)
        try {
            await addDoc(collection(db, "communities"), {
                name: formData.name,
                description: formData.description,
                category: formData.category,
                imageUrl: formData.imageUrl || "",
                privacy: formData.isPrivate ? "private" : "public",
                members: [user.uid],
                createdBy: user.uid,
                createdByName: user.displayName || "Unknown",
                createdAt: serverTimestamp()
            })

            toast.success("Community created successfully!")

            // Reset form
            setFormData({
                name: "",
                description: "",
                category: "",
                imageUrl: "",
                isPrivate: false
            })

            onOpenChange(false)
            onCommunityCreated?.()
        } catch (error) {
            console.error("Error creating community:", error)
            toast.error("Failed to create community")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-xl">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-bold">Create New Community</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="name">Community Name *</Label>
                        <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            placeholder="Hiking Enthusiasts"
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description *</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            placeholder="A community for people who love hiking and outdoor adventures..."
                            rows={4}
                            required
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="category">Category</Label>
                        <Input
                            id="category"
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            placeholder="Outdoor Activities, Sports, etc."
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="imageUrl">Community Image URL (Optional)</Label>
                        <Input
                            id="imageUrl"
                            type="url"
                            value={formData.imageUrl}
                            onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                            placeholder="https://example.com/community-image.jpg"
                        />
                    </div>

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-3">
                            <Users className="w-5 h-5 text-gray-600" />
                            <div>
                                <Label htmlFor="privacy" className="font-semibold">Private Community</Label>
                                <p className="text-xs text-gray-500">Only approved members can join</p>
                            </div>
                        </div>
                        <Switch
                            id="privacy"
                            checked={formData.isPrivate}
                            onCheckedChange={(checked) => setFormData({ ...formData, isPrivate: checked })}
                        />
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
                                "Create Community"
                            )}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
