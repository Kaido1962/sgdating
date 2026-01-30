"use client"

import { Button } from "@/components/ui/button"
import { Database, ArrowLeft, RefreshCw, Trash2, Download } from "lucide-react"
import SuperAdminRoute from "@/components/SuperAdminRoute"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function DatabasePage() {
    const router = useRouter()

    const handleAction = (action: string) => {
        toast.promise(new Promise((resolve) => setTimeout(resolve, 2000)), {
            loading: `${action}...`,
            success: `${action} completed!`,
            error: "Operation failed",
        })
    }

    return (
        <SuperAdminRoute>
            <div className="p-8 space-y-8">
                <div className="max-w-4xl mx-auto space-y-8">

                    {/* Header */}
                    <div className="flex items-center gap-4 mb-8">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                <Database className="w-8 h-8 text-gray-600" />
                                Database Management
                            </h1>
                            <p className="text-gray-500">Perform maintenance tasks and view database health.</p>
                        </div>
                    </div>

                    {/* Actions Grid */}
                    <div className="grid md:grid-cols-2 gap-6">

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600 mb-4">
                                <Download className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Backup Database</h3>
                            <p className="text-sm text-gray-500 mb-6">Create a full snapshot of the Firestore database users, posts, and chats.</p>
                            <Button variant="outline" className="w-full" onClick={() => handleAction("Backing up database")}>
                                Start Backup
                            </Button>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                            <div className="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600 mb-4">
                                <RefreshCw className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Clear Cache</h3>
                            <p className="text-sm text-gray-500 mb-6">Reset server-side caches and temporary files to free up space.</p>
                            <Button variant="outline" className="w-full" onClick={() => handleAction("Clearing cache")}>
                                Clear Cache
                            </Button>
                        </div>

                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 md:col-span-2 border-red-100 bg-red-50/30">
                            <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center text-red-600 mb-4">
                                <Trash2 className="w-6 h-6" />
                            </div>
                            <h3 className="font-bold text-gray-900 mb-2">Prune Deleted Accounts</h3>
                            <p className="text-sm text-gray-500 mb-6">Permanently remove data associated with soft-deleted user accounts. This action is irreversible.</p>
                            <Button variant="destructive" className="w-full" onClick={() => handleAction("Pruning accounts")}>
                                Prune Data
                            </Button>
                        </div>

                    </div>

                </div>
            </div>
        </SuperAdminRoute>
    )
}
