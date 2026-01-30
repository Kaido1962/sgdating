"use client"

import SuperAdminRoute from "@/components/SuperAdminRoute"
import { Lock, Search, Filter } from "lucide-react"

const LOGS = [
    { id: 1, action: "USER_BANNED", admin: "datingappadmin@guardian-angelstudios.co.za", target: "user_123", time: "10 mins ago", ip: "192.168.1.1" },
    { id: 2, action: "SYSTEM_CONFIG_UPDATE", admin: "itumeleng@owner.com", target: "Global Settings", time: "1 hour ago", ip: "10.0.0.45" },
    { id: 3, action: "PAYMENT_REFUND", admin: "finance@sgdating.co.za", target: "TXN_998877", time: "3 hours ago", ip: "192.168.1.20" },
    { id: 4, action: "AI_MODERATION_UPDATE", admin: "itumeleng@owner.com", target: "Banned Words", time: "Yesterday", ip: "10.0.0.45" },
]

export default function SuperAdminAuditPage() {
    return (
        <SuperAdminRoute>
            <div className="p-8 space-y-8">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">System Audit Logs</h1>
                    <p className="text-gray-500 mt-1">Track administrative actions and system events for compliance.</p>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
                        <div className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                            <Lock className="w-4 h-4" /> Secure Audit Trail
                        </div>
                        <div className="flex gap-2">
                            <button className="flex items-center gap-1 text-xs bg-white border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-50">
                                <Filter className="w-3 h-3" /> Filter
                            </button>
                            <button className="flex items-center gap-1 text-xs bg-white border border-gray-300 px-3 py-1.5 rounded-md hover:bg-gray-50">
                                <Search className="w-3 h-3" /> Search
                            </button>
                        </div>
                    </div>

                    <table className="w-full text-left text-sm">
                        <thead className="bg-gray-100 text-gray-500 uppercase text-xs">
                            <tr>
                                <th className="px-6 py-3 font-semibold">Action</th>
                                <th className="px-6 py-3 font-semibold">Admin</th>
                                <th className="px-6 py-3 font-semibold">Target</th>
                                <th className="px-6 py-3 font-semibold">IP Address</th>
                                <th className="px-6 py-3 font-semibold text-right">Time</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {LOGS.map(log => (
                                <tr key={log.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 font-mono text-gray-700 font-medium">{log.action}</td>
                                    <td className="px-6 py-4 text-gray-600">{log.admin}</td>
                                    <td className="px-6 py-4 text-gray-600">{log.target}</td>
                                    <td className="px-6 py-4 text-gray-400 font-mono text-xs">{log.ip}</td>
                                    <td className="px-6 py-4 text-right text-gray-500">{log.time}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </SuperAdminRoute>
    )
}
