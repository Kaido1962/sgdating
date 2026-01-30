"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function SuperAdminRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()
    const router = useRouter()

    // Placeholder for Super Admin Email - to be updated by user
    const SUPER_ADMIN_EMAILS = ["datingappsuperadmin@guardian-angelstudios.co.za", "guardianangelstudios731@gmail.com"]

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/sign-in")
            } else if (!SUPER_ADMIN_EMAILS.includes(user.email?.toLowerCase() || "")) {
                // If logged in but not super admin, redirect to dashboard
                // They might be a regular admin, but this route is strict
                router.push("/dashboard")
            }
        }
    }, [user, loading, router])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600"></div>
            </div>
        )
    }

    if (!user || !SUPER_ADMIN_EMAILS.includes(user.email?.toLowerCase() || "")) {
        return null
    }

    return <>{children}</>
}
