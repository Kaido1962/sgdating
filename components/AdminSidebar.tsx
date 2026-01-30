"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
    Users,
    Shield,
    MessageSquare,
    FileText,
    Settings,
    LogOut,
    LayoutDashboard,
    AlertTriangle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { signOut } from "firebase/auth"
import { auth } from "@/lib/firebase"

const menuItems = [
    { icon: LayoutDashboard, label: "Overview", href: "/admin" },
    { icon: Users, label: "User Management", href: "/admin/users" },
    { icon: AlertTriangle, label: "Security Alerts", href: "/admin/moderation" },
    { icon: MessageSquare, label: "Support", href: "/admin/support" },
    { icon: FileText, label: "Content & Events", href: "/admin/content" },
    { icon: ({ className }: { className?: string }) => <span className={`font-bold text-lg flex items-center justify-center ${className}`}>R</span>, label: "Financials", href: "/admin/payments" },
]

export function AdminSidebar() {
    const pathname = usePathname()
    const router = useRouter()

    const handleLogout = async () => {
        await signOut(auth)
        router.push("/")
    }

    return (
        <div className="w-64 bg-gray-900 border-r border-gray-800 h-screen fixed left-0 top-0 flex flex-col z-50">
            {/* Logo Area */}
            <div className="p-6 border-b border-gray-800 flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-[#a22929] to-red-900 flex items-center justify-center shadow-lg shadow-red-900/20">
                    <Shield className="w-5 h-5 text-white" />
                </div>
                <div>
                    <h2 className="font-bold text-white leading-tight">Admin Panel</h2>
                    <p className="text-xs text-gray-400">Operational</p>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const isRoot = item.href === "/admin"
                    const isActive = isRoot
                        ? pathname === item.href
                        : pathname?.startsWith(item.href)

                    return (
                        <Link key={item.href} href={item.href}>
                            <div className={`
                                flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all duration-200
                                ${isActive
                                    ? 'bg-[#a22929] text-white font-medium shadow-md shadow-red-900/20'
                                    : 'text-gray-400 hover:bg-gray-800 hover:text-white'
                                }
                            `}>
                                <item.icon className="w-5 h-5" />
                                <span className="text-sm">{item.label}</span>
                            </div>
                        </Link>
                    )
                })}
            </nav>

            {/* Footer Actions */}
            <div className="p-4 border-t border-gray-800 space-y-2">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-xs text-gray-400 hover:bg-gray-800 hover:text-white"
                    onClick={() => router.push('/dashboard')}
                >
                    <LayoutDashboard className="w-4 h-4 mr-2" />
                    Public Site
                </Button>
                <Button
                    variant="ghost"
                    className="w-full justify-start text-xs text-red-400 hover:bg-red-900/20 hover:text-red-300"
                    onClick={handleLogout}
                >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                </Button>
            </div>
        </div>
    )
}
