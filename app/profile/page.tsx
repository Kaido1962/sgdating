"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { db } from "@/lib/firebase"
import { doc, getDoc, setDoc } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import ProtectedRoute from "@/components/ProtectedRoute"
import { ChevronLeft, Loader2, Save, ImagePlus, X } from "lucide-react"
import Image from "next/image"

export default function ProfilePage() {
    const { user, loading: authLoading } = useAuth()
    const router = useRouter()
    const [saving, setSaving] = useState(false)
    const [fetching, setFetching] = useState(true)
    const [successMessage, setSuccessMessage] = useState("")

    // Form State
    const [formData, setFormData] = useState({
        displayName: "",
        bio: "",
        age: "",
        gender: "",
        location: "South Africa",
        lookingFor: "Relationship",
        photoURL: "", // Main profile pic (Base64)
        gallery: [] as string[] // Array of Base64 strings
    })

    // Helper: Compress Image to Base64
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, isGallery: boolean = false) => {
        const file = e.target.files?.[0]
        if (!file) return

        // Limit file size (e.g., 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert("File is too large. Please choose an image under 5MB.")
            return
        }

        const reader = new FileReader()
        reader.onload = (event) => {
            const img = new window.Image()
            img.onload = () => {
                const canvas = document.createElement("canvas")
                let width = img.width
                let height = img.height

                // Resize logic: Max width 800px
                const MAX_WIDTH = 800
                const MAX_HEIGHT = 800

                if (width > height) {
                    if (width > MAX_WIDTH) {
                        height *= MAX_WIDTH / width
                        width = MAX_WIDTH
                    }
                } else {
                    if (height > MAX_HEIGHT) {
                        width *= MAX_HEIGHT / height
                        height = MAX_HEIGHT
                    }
                }

                canvas.width = width
                canvas.height = height
                const ctx = canvas.getContext("2d")
                ctx?.drawImage(img, 0, 0, width, height)

                // Compress to JPEG with 0.7 quality
                const dataUrl = canvas.toDataURL("image/jpeg", 0.7)

                if (isGallery) {
                    if (formData.gallery.length >= 4) {
                        alert("You can only have up to 4 gallery photos.")
                        return
                    }
                    setFormData(prev => ({ ...prev, gallery: [...prev.gallery, dataUrl] }))
                } else {
                    setFormData(prev => ({ ...prev, photoURL: dataUrl }))
                }
            }
            img.src = event.target?.result as string
        }
        reader.readAsDataURL(file)
    }

    const removeGalleryImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            gallery: prev.gallery.filter((_, i) => i !== index)
        }))
    }

    useEffect(() => {
        const fetchProfile = async () => {
            if (user) {
                try {
                    const docRef = doc(db, "users", user.uid)
                    const docSnap = await getDoc(docRef)

                    if (docSnap.exists()) {
                        const data = docSnap.data()
                        setFormData({
                            displayName: data.displayName || "",
                            bio: data.bio || "",
                            age: data.age?.toString() || "",
                            gender: data.gender || "",
                            location: data.location || "South Africa",
                            lookingFor: data.lookingFor || "Relationship",
                            photoURL: data.photoURL || "",
                            gallery: data.gallery || []
                        })
                    }
                } catch (error) {
                    console.error("Error fetching profile:", error)
                } finally {
                    setFetching(false)
                }
            } else if (!authLoading) {
                setFetching(false)
            }
        }

        fetchProfile()
    }, [user, authLoading])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!user) return

        setSaving(true)
        setSuccessMessage("")

        try {
            const docRef = doc(db, "users", user.uid)
            await setDoc(docRef, {
                displayName: formData.displayName,
                bio: formData.bio || "",
                age: formData.age ? parseInt(formData.age) : null,
                gender: formData.gender || "",
                location: formData.location || "",
                lookingFor: formData.lookingFor || "",
                photoURL: formData.photoURL,
                gallery: formData.gallery
            }, { merge: true })

            setSuccessMessage("Profile updated successfully!")
            setTimeout(() => setSuccessMessage(""), 3000)
        } catch (error: any) {
            console.error("Error updating profile:", error)
            setSuccessMessage(`Failed to update: ${error.message}`)
        } finally {
            setSaving(false)
        }
    }

    if (fetching || authLoading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#a22929]" />
            </div>
        )
    }

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-gray-50/50 pb-10">
                <div className="bg-white shadow">
                    <div className="max-w-3xl mx-auto px-4 py-4 flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ChevronLeft className="h-6 w-6 text-gray-600" />
                        </Button>
                        <h1 className="text-xl font-bold text-[#242228]">Edit Profile</h1>
                    </div>
                </div>

                <div className="max-w-3xl mx-auto px-4 py-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="bg-white rounded-2xl shadow-sm border border-[#c5c4c4]/40 p-6 space-y-6">

                            {/* Photo Section */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-[#242228] border-b pb-2">Photos</h2>

                                <div className="flex flex-col md:flex-row gap-6">
                                    {/* Main Profile Pic */}
                                    <div className="flex flex-col items-center gap-2">
                                        <span className="text-sm font-medium text-gray-700">Main Profile Picture</span>
                                        <div className="relative w-32 h-32 rounded-full overflow-hidden border-2 border-[#a22929] bg-gray-100 flex items-center justify-center">
                                            {formData.photoURL ? (
                                                <Image src={formData.photoURL} alt="Profile" fill className="object-cover" />
                                            ) : (
                                                <ImagePlus className="h-8 w-8 text-gray-400" />
                                            )}
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e, false)}
                                                className="absolute inset-0 opacity-0 cursor-pointer"
                                            />
                                        </div>
                                        <span className="text-xs text-gray-500">Click to change</span>
                                    </div>

                                    {/* Gallery */}
                                    <div className="flex-1">
                                        <span className="text-sm font-medium text-gray-700 block mb-2">Gallery (Max 4)</span>
                                        <div className="grid grid-cols-4 gap-2">
                                            {formData.gallery.map((img, idx) => (
                                                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200">
                                                    <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover" />
                                                    <button
                                                        type="button"
                                                        onClick={() => removeGalleryImage(idx)}
                                                        className="absolute top-1 right-1 bg-black/50 text-white rounded-full p-0.5 hover:bg-black/70"
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </button>
                                                </div>
                                            ))}

                                            {formData.gallery.length < 4 && (
                                                <div className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center cursor-pointer hover:border-[#a22929] hover:bg-red-50 relative">
                                                    <ImagePlus className="h-6 w-6 text-gray-400" />
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleImageUpload(e, true)}
                                                        className="absolute inset-0 opacity-0 cursor-pointer"
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-[#242228] border-b pb-2">Basic Details</h2>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Display Name</label>
                                        <input
                                            type="text"
                                            name="displayName"
                                            value={formData.displayName}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#ae645c] focus:outline-none"
                                            placeholder="Your name"
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Age</label>
                                        <input
                                            type="number"
                                            name="age"
                                            value={formData.age}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#ae645c] focus:outline-none"
                                            placeholder="e.g. 25"
                                        />
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Gender</label>
                                        <select
                                            name="gender"
                                            value={formData.gender}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#ae645c] focus:outline-none"
                                        >
                                            <option value="">Select gender</option>
                                            <option value="Male">Male</option>
                                            <option value="Female">Female</option>
                                            <option value="Non-binary">Non-binary</option>
                                            <option value="Other">Other</option>
                                        </select>
                                    </div>

                                    <div className="space-y-2">
                                        <label className="text-sm font-medium text-gray-700">Looking For</label>
                                        <select
                                            name="lookingFor"
                                            value={formData.lookingFor}
                                            onChange={handleChange}
                                            className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#ae645c] focus:outline-none"
                                        >
                                            <option value="Relationship">Relationship</option>
                                            <option value="Casual">Casual</option>
                                            <option value="Friends">Friends</option>
                                            <option value="Networking">Networking</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Location</label>
                                    <input
                                        type="text"
                                        name="location"
                                        value={formData.location}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#ae645c] focus:outline-none"
                                        placeholder="City, Country"
                                    />
                                </div>
                            </div>

                            <div className="space-y-4 pt-4">
                                <h2 className="text-lg font-semibold text-[#242228] border-b pb-2">About You</h2>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">Bio</label>
                                    <textarea
                                        name="bio"
                                        rows={4}
                                        value={formData.bio}
                                        onChange={handleChange}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:ring-2 focus:ring-[#ae645c] focus:outline-none resize-none"
                                        placeholder="Tell us about yourself..."
                                    />
                                    <p className="text-xs text-gray-500">Keep it short and sweet. Mention your hobbies!</p>
                                </div>
                            </div>

                            {successMessage && (
                                <div className="p-3 bg-green-50 text-green-700 text-sm rounded-lg border border-green-200">
                                    {successMessage}
                                </div>
                            )}

                            <div className="pt-4 flex justify-end">
                                <Button
                                    type="submit"
                                    disabled={saving}
                                    className="bg-gradient-to-r from-[#ae645c] to-[#a22929] text-white shadow-md shadow-[#a22929]/30"
                                >
                                    {saving ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Save className="mr-2 h-4 w-4" /> Save Changes
                                        </>
                                    )}
                                </Button>
                            </div>

                        </div>
                    </form>
                </div>
            </div>
        </ProtectedRoute>
    )
}
