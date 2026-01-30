"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"

export default function AdminRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()
    const router = useRouter()

    const ADMIN_EMAILS = ["datingappadmin@guardian-angelstudios.co.za", "itumeleng.mahwa@gmail.com"]
    const SUPER_ADMIN_EMAILS = ["datingappsuperadmin@guardian-angelstudios.co.za", "guardianangelstudios731@gmail.com"]

    useEffect(() => {
        if (!loading) {
            if (!user) {
                router.push("/sign-in")
            } else {
                const email = user.email?.toLowerCase()
                if (!ADMIN_EMAILS.includes(email || "") && !SUPER_ADMIN_EMAILS.includes(email || "")) {
                    router.push("/dashboard")
                }
            }
        }
    }, [user, loading, router])

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#a22929]"></div>
            </div>
        )
    }

    const email = user?.email?.toLowerCase()
    if (!user || (!ADMIN_EMAILS.includes(email || "") && !SUPER_ADMIN_EMAILS.includes(email || ""))) {
        return null
    }

    return <>{children}</>
}
