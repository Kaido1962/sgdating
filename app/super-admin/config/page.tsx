"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Settings, ArrowLeft, Save } from "lucide-react"
import SuperAdminRoute from "@/components/SuperAdminRoute"

import { useRouter } from "next/navigation"
import { Switch } from "@/components/ui/switch"
import { toast } from "sonner"
import { doc, onSnapshot, setDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function SystemConfigPage() {
    const router = useRouter()
    const [maintenanceMode, setMaintenanceMode] = useState(false)
    const [registrationsOpen, setRegistrationsOpen] = useState(true)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "config", "system"), (doc) => {
            if (doc.exists()) {
                const data = doc.data()
                setMaintenanceMode(data.maintenanceMode ?? false)
                setRegistrationsOpen(data.registrationsOpen ?? true)
            }
        })
        return () => unsubscribe()
    }, [])

    const handleSave = async () => {
        setLoading(true)
        try {
            await setDoc(doc(db, "config", "system"), {
                maintenanceMode,
                registrationsOpen
            }, { merge: true })
            toast.success("Settings saved successfully!")
        } catch (error) {
            console.error(error)
            toast.error("Failed to save settings")
        } finally {
            setLoading(false)
        }
    }

    return (
        <SuperAdminRoute>
            <div className="p-8 space-y-8">
                <div className="max-w-3xl mx-auto space-y-8">

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                <Settings className="w-8 h-8 text-gray-600" />
                                System Configuration
                            </h1>
                            <p className="text-gray-500">Manage global application settings and feature flags.</p>
                        </div>
                    </div>

                    {/* Settings Cards */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 space-y-6">
                        <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                            <div>
                                <h3 className="font-bold text-gray-900">Maintenance Mode</h3>
                                <p className="text-sm text-gray-500">Disable access for all non-admin users.</p>
                            </div>
                            <Switch checked={maintenanceMode} onCheckedChange={setMaintenanceMode} />
                        </div>

                        <div className="flex items-center justify-between pb-6 border-b border-gray-100">
                            <div>
                                <h3 className="font-bold text-gray-900">User Registrations</h3>
                                <p className="text-sm text-gray-500">Allow new users to sign up.</p>
                            </div>
                            <Switch checked={registrationsOpen} onCheckedChange={setRegistrationsOpen} />
                        </div>

                        <div className="pt-4 flex justify-end">
                            <Button onClick={handleSave} disabled={loading} className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
                                <Save className="w-4 h-4" /> {loading ? "Saving..." : "Save Changes"}
                            </Button>
                        </div>
                    </div>

                </div>
            </div>
        </SuperAdminRoute>
    )
}
