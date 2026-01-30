"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, getDocs } from "firebase/firestore"
import { useAuth } from "@/context/AuthContext"

export function useProfileViews() {
    const { user } = useAuth()
    const [viewsCount, setViewsCount] = useState(0)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!user) return

        // Query views where viewedId is current user
        const q = query(
            collection(db, "profile_views"),
            where("viewedId", "==", user.uid)
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
            setViewsCount(snapshot.size)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [user])

    const recordView = async (viewedUid: string) => {
        if (!user || user.uid === viewedUid) return

        try {
            // Optional: Check if already viewed recently to prevent spamming
            // For now, we trust the caller or just add it (aggregated counts often ignore basic spam in MVP)
            // A better check:
            const q = query(
                collection(db, "profile_views"),
                where("viewedId", "==", viewedUid),
                where("viewerId", "==", user.uid)
            )
            const snap = await getDocs(q)
            if (!snap.empty) {
                // Already viewed by me
                // Could update timestamp instead of adding new doc
                return
            }

            await addDoc(collection(db, "profile_views"), {
                viewedId: viewedUid,
                viewerId: user.uid,
                timestamp: serverTimestamp()
            })
        } catch (error) {
            console.error("Error recording view:", error)
        }
    }

    return {
        viewsCount,
        loading,
        recordView
    }
}
