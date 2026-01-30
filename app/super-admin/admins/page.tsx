"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Shield, ArrowLeft, Plus } from "lucide-react"
import SuperAdminRoute from "@/components/SuperAdminRoute"

import { useRouter } from "next/navigation"
import { toast } from "sonner"

export default function ManageAdminsPage() {
    const router = useRouter()
    const [admins, setAdmins] = useState([
        { id: 1, name: "Thando Dlamini", email: "datingappadmin@guardian-angelstudios.co.za", role: "Admin", status: "Active" },
        { id: 2, name: "Super Admin", email: "datingappsuperadmin@guardian-angelstudios.co.za", role: "Super Admin", status: "Active" },
        { id: 3, name: "Guardian Angel", email: "guardianangelstudios731@gmail.com", role: "Super Admin", status: "Active" },
    ])

    return (
        <SuperAdminRoute>
            <div className="p-8 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" onClick={() => router.back()}>
                            <ArrowLeft className="w-5 h-5" />
                        </Button>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                                <Shield className="w-8 h-8 text-purple-600" />
                                Manage Admins
                            </h1>
                            <p className="text-gray-500">View and manage administrative privileges.</p>
                        </div>
                    </div>
                    <Button className="bg-purple-600 hover:bg-purple-700 text-white gap-2" onClick={() => toast.info("Add Admin feature coming soon!", { description: "This will open a modal to invite a new admin." })}>
                        <Plus className="w-4 h-4" /> Add New Admin
                    </Button>
                </div>

                {/* Admins List */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50/50 border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Email</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Role</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {admins.map((admin) => (
                                <tr key={admin.id} className="hover:bg-gray-50/50">
                                    <td className="px-6 py-4 font-semibold text-gray-900">{admin.name}</td>
                                    <td className="px-6 py-4 text-gray-600">{admin.email}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${admin.role === 'Super Admin' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                                            {admin.role}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                            {admin.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <Button variant="ghost" size="sm" className="text-gray-400 hover:text-purple-600" onClick={() => toast.info(`Editing ${admin.name}`, { description: "Edit functionality coming soon." })}>Edit</Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </SuperAdminRoute>
    )
}
