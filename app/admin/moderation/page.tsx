"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
    collection,
    getDocs,
    query,
    orderBy,
    limit,
    where,
    updateDoc,
    doc
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import AdminRoute from "@/components/AdminRoute"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield, AlertTriangle, CheckCircle, Clock } from "lucide-react"
import { toast } from "sonner"

export default function AdminModerationPage() {
    const router = useRouter()
    const [alerts, setAlerts] = useState<any[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchAlerts()
    }, [])

    const fetchAlerts = async () => {
        setLoading(true)
        try {
            const q = query(collection(db, "admin_alerts"), orderBy("timestamp", "desc"))
            const snapshot = await getDocs(q)
            const alertsData: any[] = []
            snapshot.forEach((doc) => {
                alertsData.push({ id: doc.id, ...doc.data() })
            })
            setAlerts(alertsData)
        } catch (error) {
            console.error("Error fetching alerts:", error)
            toast.error("Failed to fetch alerts")
        } finally {
            setLoading(false)
        }
    }

    const handleResolve = async (alertId: string) => {
        try {
            await updateDoc(doc(db, "admin_alerts", alertId), { status: 'resolved' })
            setAlerts(alerts.map(a => a.id === alertId ? { ...a, status: 'resolved' } : a))
            toast.success("Alert marked as resolved")
        } catch (error) {
            toast.error("Error resolving alert")
        }
    }

    // Filter alerts
    const pendingAlerts = alerts.filter(a => a.status !== 'resolved')
    const resolvedAlerts = alerts.filter(a => a.status === 'resolved')

    return (
        <AdminRoute>
            <div className="p-8 space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Content Moderation</h1>
                    <p className="text-gray-500 mt-1">Review flagged content and handle safety reports.</p>
                </div>

                <Tabs defaultValue="pending" className="w-full">
                    <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                        <TabsTrigger value="pending">Pending Review ({pendingAlerts.length})</TabsTrigger>
                        <TabsTrigger value="resolved">Resolved History</TabsTrigger>
                    </TabsList>

                    <TabsContent value="pending" className="mt-6 space-y-4">
                        {loading ? (
                            <p>Loading alerts...</p>
                        ) : pendingAlerts.length === 0 ? (
                            <div className="flex flex-col items-center justify-center p-12 bg-white rounded-xl border border-dashed border-gray-300">
                                <CheckCircle className="w-12 h-12 text-green-500 mb-4" />
                                <h3 className="text-lg font-bold text-gray-900">All Good!</h3>
                                <p className="text-gray-500">No pending content flags to review.</p>
                            </div>
                        ) : (
                            pendingAlerts.map(alert => (
                                <Card key={alert.id} className="border-l-4 border-l-[#a22929]">
                                    <CardHeader className="pb-3">
                                        <div className="flex justify-between items-start">
                                            <div className="flex items-center gap-2">
                                                <AlertTriangle className="w-5 h-5 text-[#a22929]" />
                                                <CardTitle className="text-lg text-[#a22929]">{alert.type.toUpperCase()}</CardTitle>
                                            </div>
                                            <span className="text-xs text-gray-400">
                                                {alert.timestamp?.seconds ? new Date(alert.timestamp.seconds * 1000).toLocaleString() : 'Just now'}
                                            </span>
                                        </div>
                                        <CardDescription>User: {alert.userEmail}</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="bg-red-50 p-3 rounded-lg border border-red-100 mb-4">
                                            <p className="text-gray-800 font-medium">"{alert.content}"</p>
                                            <p className="text-xs text-red-600 mt-1">Flagged Reason: {alert.reason}</p>
                                        </div>
                                        <div className="flex justify-end gap-3">
                                            <Button variant="outline" onClick={() => router.push(`/users/${alert.userId}`)}>View User Profile</Button>
                                            <Button onClick={() => handleResolve(alert.id)} className="bg-green-600 hover:bg-green-700">Mark Resolved</Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </TabsContent>

                    <TabsContent value="resolved" className="mt-6 space-y-4">
                        {resolvedAlerts.map(alert => (
                            <Card key={alert.id} className="opacity-75">
                                <CardHeader className="pb-3">
                                    <div className="flex justify-between items-start">
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="w-5 h-5 text-green-600" />
                                            <CardTitle className="text-lg text-gray-700">{alert.type}</CardTitle>
                                        </div>
                                        <span className="text-xs text-gray-400">
                                            {alert.timestamp?.seconds ? new Date(alert.timestamp.seconds * 1000).toLocaleDateString() : 'Just now'}
                                        </span>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-gray-600 text-sm mb-2">"{alert.content}"</p>
                                    <div className="flex justify-start">
                                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">Resolved</span>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </TabsContent>
                </Tabs>

            </div>
        </AdminRoute>
    )
}
