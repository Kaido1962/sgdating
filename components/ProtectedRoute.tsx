import { useAuth } from "@/context/AuthContext"
import { useRouter, usePathname } from "next/navigation"
import { useEffect, useState } from "react"
import { doc, onSnapshot } from "firebase/firestore"
import { db } from "@/lib/firebase"

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
    const { user, loading } = useAuth()
    const router = useRouter()
    const pathname = usePathname()
    const [maintenanceMode, setMaintenanceMode] = useState(false)
    const [configLoading, setConfigLoading] = useState(true)

    // Check Maintenance Mode
    useEffect(() => {
        const unsubscribe = onSnapshot(doc(db, "config", "system"), (doc) => {
            if (doc.exists()) {
                setMaintenanceMode(doc.data().maintenanceMode ?? false)
            }
            setConfigLoading(false)
        })
        return () => unsubscribe()
    }, [])

    useEffect(() => {
        if (!loading && !configLoading) {
            if (!user) {
                router.push("/sign-in")
                return
            }

            // Check Email Verification
            // Skip check for admin or if user provider is not password (e.g. Google) - though user.emailVerified usually handles this
            if (user && !user.emailVerified) {
                // You might want to allow access to some pages like /verify-email or /profile-setup
                // For now, we'll redirect to a verification pending page or just showing a message
                // But wait, if they are not verified, where do they go?
                // Ideally we have an interstitial page "Please verify email"
                // For simplicity, let's redirect to /verify-email-pending if we had one, or keeping them out of dashboard.

                // Let's check if the current route is NOT a verification page
                if (!pathname?.includes('/verify-email') && !pathname?.includes('/sign-out')) {
                    // Verify if it's a password user first to avoid blocking social logins if they are auto-verified
                    // Actually firebase user.emailVerified is true for Google auth usually.
                    // IMPORTANT: blocking access might be annoying if email delivery fails.
                    // For now, let's just toast or redirect to a specific page.
                    // router.push("/verify-email-pending") 
                    // OR we can just Return null and render a "Verify Email" overlay
                }
            }

            // If Maintenance Mode is ON
            if (maintenanceMode) {
                const email = user.email?.toLowerCase()
                const isAdmin = email === "datingappadmin@guardian-angelstudios.co.za" || email === "datingappsuperadmin@guardian-angelstudios.co.za" || email === "guardianangelstudios731@gmail.com"

                // If not admin and not already on maintenance page, redirect
                // NOTE: ProtectedRoute is usually used on pages that require login.
                // If maintenance page itself is unprotected, we just push there.
                if (!isAdmin) {
                    router.push("/maintenance")
                }
            }
        }
    }, [user, loading, configLoading, maintenanceMode, router])

    if (loading || configLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#a22929]"></div>
            </div>
        )
    }

    // While we wait for redirect or if redirect happens, we might flash content.
    // For tighter security, we can return null here too.
    if (maintenanceMode) {
        const email = user?.email?.toLowerCase()
        const isAdmin = email === "datingappadmin@guardian-angelstudios.co.za" || email === "datingappsuperadmin@guardian-angelstudios.co.za" || email === "guardianangelstudios731@gmail.com"
        if (!isAdmin) return null
    }

    return user ? <>{children}</> : null
}
