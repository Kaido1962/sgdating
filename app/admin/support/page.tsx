"use client"

import AdminRoute from "@/components/AdminRoute"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquare, Mail, Search, Clock } from "lucide-react"

// Mock Data for now
const TICKETS = [
    { id: 'T-1024', user: 'sarah_j', subject: 'Payment failed for Premium', status: 'open', priority: 'high', date: '2 hours ago' },
    { id: 'T-1023', user: 'mike_88', subject: 'How to change profile pic?', status: 'pending', priority: 'low', date: '5 hours ago' },
    { id: 'T-1022', user: 'love_seeker', subject: 'Report: User harassment', status: 'closed', priority: 'high', date: '1 day ago' },
]

export default function AdminSupportPage() {
    return (
        <AdminRoute>
            <div className="p-8 space-y-8">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Help Desk</h1>
                        <p className="text-gray-500 mt-1">Manage user support tickets and inquiries.</p>
                    </div>
                    <Button className="bg-[#a22929] hover:bg-[#8f2424]">Compose Message</Button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-gray-500 text-sm font-medium">Open Tickets</h3>
                        <p className="text-3xl font-bold text-[#a22929] mt-2">12</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-gray-500 text-sm font-medium">Avg Response Time</h3>
                        <p className="text-3xl font-bold text-gray-900 mt-2">1.5h</p>
                    </div>
                    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
                        <h3 className="text-gray-500 text-sm font-medium">Resolved Today</h3>
                        <p className="text-3xl font-bold text-green-600 mt-2">45</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100 flex items-center justify-between bg-gray-50/50">
                        <div className="flex items-center gap-2 text-gray-500">
                            <MessageSquare className="w-5 h-5" />
                            <span className="font-medium">Recent Tickets</span>
                        </div>
                    </div>
                    {TICKETS.map((ticket, i) => (
                        <div key={ticket.id} className={`p-4 flex items-center justify-between hover:bg-gray-50 transition-colors ${i !== TICKETS.length - 1 ? 'border-b border-gray-100' : ''}`}>
                            <div className="flex items-center gap-4">
                                <div className={`w-2 h-2 rounded-full ${ticket.status === 'open' ? 'bg-green-500' : ticket.status === 'pending' ? 'bg-orange-500' : 'bg-gray-300'}`} />
                                <div>
                                    <p className="font-semibold text-gray-900">{ticket.subject}</p>
                                    <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs text-gray-500 font-mono">{ticket.id}</span>
                                        <span className="text-xs text-gray-400">•</span>
                                        <span className="text-xs text-gray-600">by {ticket.user}</span>
                                    </div>
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-xs text-gray-400 flex items-center gap-1">
                                    <Clock className="w-3 h-3" /> {ticket.date}
                                </span>
                                <Badge variant={ticket.priority === 'high' ? 'destructive' : 'secondary'} className="uppercase text-[10px]">
                                    {ticket.priority}
                                </Badge>
                                <Button size="sm" variant="ghost">View</Button>
                            </div>
                        </div>
                    ))}
                </div>

            </div>
        </AdminRoute>
    )
}
