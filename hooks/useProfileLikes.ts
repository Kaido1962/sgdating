"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, query, onSnapshot, addDoc, serverTimestamp, doc, deleteDoc, getDocs, where } from "firebase/firestore"
import { useAuth } from "@/context/AuthContext"

export function useProfileLikes(targetUid?: string) {
    const { user } = useAuth()
    const [likesCount, setLikesCount] = useState(0)
    const [isLiked, setIsLiked] = useState(false)

    useEffect(() => {
        if (!targetUid) return

        const q = query(collection(db, "users", targetUid, "profile_likes"))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            setLikesCount(snapshot.size)
            if (user) {
                const myLike = snapshot.docs.find(doc => doc.id === user.uid)
                setIsLiked(!!myLike)
            }
        })

        return () => unsubscribe()
    }, [targetUid, user])

    const toggleProfileLike = async () => {
        if (!user || !targetUid) return

        const likeRef = doc(db, "users", targetUid, "profile_likes", user.uid)

        try {
            if (isLiked) {
                await deleteDoc(likeRef)
            } else {
                await addDoc(collection(db, "users", targetUid, "profile_likes"), {
                    userId: user.uid,
                    displayName: user.displayName,
                    timestamp: serverTimestamp()
                })

                // Add Notification
                if (user.uid !== targetUid) {
                    await addDoc(collection(db, "users", targetUid, "notifications"), {
                        type: "profile_like",
                        fromId: user.uid,
                        fromName: user.displayName,
                        read: false,
                        timestamp: serverTimestamp()
                    })
                }
            }
        } catch (error) {
            console.error("Error toggling profile like:", error)
        }
    }

    return { likesCount, isLiked, toggleProfileLike }
}
