"use client"

import { useState } from "react"
import AdminRoute from "@/components/AdminRoute"

import { Button } from "@/components/ui/button"
import { ArrowLeft, CreditCard, DollarSign, Download, TrendingUp } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminPaymentsPage() {
    const router = useRouter()

    // Mock Data for Payments
    const [payments] = useState([
        { id: "PAY-001", user: "Thando Dlamini", amount: "R200.00", plan: "Premium", date: "2024-05-15", status: "Completed" },
        { id: "PAY-002", user: "Lerato Khoza", amount: "R50.00", plan: "Starter", date: "2024-05-14", status: "Completed" },
        { id: "PAY-003", user: "Sipho Mkhize", amount: "R500.00", plan: "VIP/Elite", date: "2024-05-14", status: "Completed" },
        { id: "PAY-004", user: "Nomsa Zulu", amount: "R100.00", plan: "Plus", date: "2024-05-13", status: "Failed" },
        { id: "PAY-005", user: "Kevin Naidoo", amount: "R200.00", plan: "Premium", date: "2024-05-12", status: "Completed" },
    ])

    const handleExport = () => {
        // Create CSV content
        const headers = ["Transaction ID", "User", "Plan", "Date", "Amount", "Status"]
        const rows = payments.map(p => [p.id, p.user, p.plan, p.date, p.amount, p.status])
        const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n")

        // Create download link
        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement("a")
        link.setAttribute("href", url)
        link.setAttribute("download", `payments_report_${new Date().toISOString().split('T')[0]}.csv`)
        link.style.visibility = 'hidden'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
    }

    return (
        <AdminRoute>
            <div className="p-8 space-y-8">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                            <CreditCard className="w-8 h-8 text-[#a22929]" />
                            Payments & Revenue
                        </h1>
                        <p className="text-gray-500 mt-1">Track subscriptions and financial performance.</p>
                    </div>
                    <Button variant="outline" className="gap-2" onClick={handleExport}>
                        <Download className="w-4 h-4" /> Export Report
                    </Button>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center text-green-600">
                                <span className="font-bold text-2xl">R</span>
                            </div>
                            <span className="text-green-600 text-sm font-bold bg-green-50 px-2 py-1 rounded-full">+12%</span>
                        </div>
                        <p className="text-sm text-gray-500 font-medium uppercase">Total Revenue</p>
                        <h3 className="text-3xl font-bold text-gray-900">R 45,250</h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
                                <TrendingUp className="w-6 h-6" />
                            </div>
                            <span className="text-blue-600 text-sm font-bold bg-blue-50 px-2 py-1 rounded-full">+5%</span>
                        </div>
                        <p className="text-sm text-gray-500 font-medium uppercase">Active Subscriptions</p>
                        <h3 className="text-3xl font-bold text-gray-900">1,240</h3>
                    </div>

                    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                        <div className="flex items-center justify-between mb-4">
                            <div className="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
                                <CreditCard className="w-6 h-6" />
                            </div>
                            <span className="text-gray-400 text-sm font-bold bg-gray-50 px-2 py-1 rounded-full">Today</span>
                        </div>
                        <p className="text-sm text-gray-500 font-medium uppercase">Daily Sales</p>
                        <h3 className="text-3xl font-bold text-gray-900">R 3,500</h3>
                    </div>
                </div>

                {/* Payments Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-xl font-bold text-gray-900">Recent Transactions</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50 border-b border-gray-100">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Transaction ID</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">User</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Plan</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Date</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Amount</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {payments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-gray-50/50">
                                        <td className="px-6 py-4 text-sm font-mono text-gray-500">{payment.id}</td>
                                        <td className="px-6 py-4 font-semibold text-gray-900">{payment.user}</td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-bold bg-gray-100 text-gray-700 border border-gray-200">
                                                {payment.plan}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{payment.date}</td>
                                        <td className="px-6 py-4 font-bold text-gray-900">{payment.amount}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${payment.status === 'Completed' ? 'bg-green-100 text-green-700' :
                                                payment.status === 'Failed' ? 'bg-red-100 text-red-700' : 'bg-yellow-100 text-yellow-700'
                                                }`}>
                                                {payment.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AdminRoute>
    )
}
