"use client"

import { useEffect, useRef } from "react"
import { useAuth } from "@/context/AuthContext"
import { db } from "@/lib/firebase"
import { collection, query, where, onSnapshot } from "firebase/firestore"
import { toast } from "sonner"
import { usePathname } from "next/navigation"

export function NotificationListener() {
    const { user } = useAuth()
    const pathname = usePathname()

    // Ref to track previous unread counts so we only notify on INCREASE
    const prevUnreadCounts = useRef<Record<string, number>>({})

    // 1. Listen to Direct Messages (Already implemented)
    useEffect(() => {
        if (!user) return
        const q = query(collection(db, "chats"), where("participants", "array-contains", user.uid))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "modified") {
                    const data = change.doc.data()
                    const chatId = change.doc.id
                    const currentUnread = data[`unread_${user.uid}`] || 0
                    const previousUnread = prevUnreadCounts.current[chatId] || 0
                    if (currentUnread > previousUnread && !pathname.includes(chatId)) {
                        toast.message("New Message", {
                            description: data.lastMessage || "You have a new message",
                            action: { label: "View", onClick: () => window.location.href = `/chat/${chatId}` }
                        })
                    }
                    prevUnreadCounts.current[chatId] = currentUnread
                }
            })
        })
        return () => unsubscribe()
    }, [user, pathname])

    // 2. Listen to Social Notifications
    useEffect(() => {
        if (!user) return
        const q = query(collection(db, "users", user.uid, "notifications"), where("read", "==", false))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            snapshot.docChanges().forEach((change) => {
                if (change.type === "added") {
                    const data = change.doc.data()
                    let msg = ""
                    let description = ""
                    let actionLabel = "View"
                    let actionUrl = "/dashboard"

                    if (data.type === "post_like") {
                        msg = "Post Liked! ❤️"
                        description = `${data.fromName} liked your post.`
                    } else if (data.type === "profile_like") {
                        msg = "Profile Liked! 🔥"
                        description = `${data.fromName} liked your profile photo.`
                    } else if (data.type === "comment") {
                        msg = "New Comment! 💬"
                        description = `${data.fromName} commented on your post.`
                    }

                    if (msg) {
                        toast.success(msg, {
                            description: description,
                            action: { label: actionLabel, onClick: () => window.location.href = actionUrl }
                        })
                    }
                }
            })
        })
        return () => unsubscribe()
    }, [user])

    return null // Headless component
}
