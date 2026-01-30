"use client"

import { useAuth } from "@/context/AuthContext"
import { AdminSidebar } from "@/components/AdminSidebar"
import { SuperAdminSidebar } from "@/components/SuperAdminSidebar"
import { useEffect, useState } from "react"

// Hardcoded for now, matches the one in AdminRoute/SuperAdminRoute
const SUPER_ADMIN_EMAILS = ["datingappsuperadmin@guardian-angelstudios.co.za", "guardianangelstudios731@gmail.com"]

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const { user, loading } = useAuth()
    const [isSuperAdmin, setIsSuperAdmin] = useState(false)

    useEffect(() => {
        if (!loading && user) {
            // Case insensitive check
            setIsSuperAdmin(SUPER_ADMIN_EMAILS.includes(user.email?.toLowerCase() || ""))
        }
    }, [user, loading])

    // While checking auth, we can render a loading state or just nothing to prevent flash
    // However, usually it's fast enough. We'll render AdminSidebar by default to avoid layout shift?
    // No, better to wait or default to false (AdminSidebar).

    if (loading) return null;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {isSuperAdmin ? <SuperAdminSidebar /> : <AdminSidebar />}
            <div className="flex-1 ml-64">
                {children}
            </div>
        </div>
    );
}
