"use client"

import { useState, useEffect, useRef } from "react"
import { db } from "@/lib/firebase"
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, doc, updateDoc, deleteDoc, getDocs } from "firebase/firestore"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"

export interface FriendRequest {
    id: string
    from: string
    to: string
    status: 'pending' | 'accepted' | 'rejected'
    timestamp: any
    fromUser?: any // Profile of sender
}

export function useFriendSystem() {
    const { user } = useAuth()
    const [incomingRequests, setIncomingRequests] = useState<FriendRequest[]>([])
    const [outgoingRequests, setOutgoingRequests] = useState<string[]>([])
    const [friends, setFriends] = useState<string[]>([])
    const [loading, setLoading] = useState(true)

    // 1. Listen for Incoming Requests
    const lastCountRef = useRef(-1)

    useEffect(() => {
        if (!user) return

        const q = query(
            collection(db, "friend_requests"),
            where("to", "==", user.uid),
            where("status", "==", "pending")
        )

        const unsubscribe = onSnapshot(q, async (snapshot) => {
            const reqs: FriendRequest[] = []

            for (const docSnap of snapshot.docs) {
                const data = docSnap.data() as Omit<FriendRequest, 'id'>
                // Fetch Sender Profile
                const senderDoc = await getDocs(query(collection(db, "users"), where("uid", "==", data.from)))
                let fromUser = null
                if (!senderDoc.empty) {
                    fromUser = senderDoc.docs[0].data()
                }

                reqs.push({
                    id: docSnap.id,
                    ...data,
                    fromUser
                })
            }

            // Notification Logic
            if (lastCountRef && lastCountRef.current !== -1 && reqs.length > lastCountRef.current) {
                const newReq = reqs[reqs.length - 1];
                toast.success("New Like! 🎉", {
                    description: `${newReq.fromUser?.displayName || "Someone"} liked your profile.`,
                    action: {
                        label: "View",
                        onClick: () => window.location.href = "/likes"
                    }
                })
            }
            if (lastCountRef) lastCountRef.current = reqs.length;

            setIncomingRequests(reqs)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [user])

    // 2. Listen for Outgoing Requests
    useEffect(() => {
        if (!user) return

        const q = query(
            collection(db, "friend_requests"),
            where("from", "==", user.uid),
            where("status", "==", "pending")
        )

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const outgoing: string[] = []
            snapshot.forEach(doc => {
                outgoing.push(doc.data().to)
            })
            setOutgoingRequests(outgoing)
        })

        return () => unsubscribe()
    }, [user])

    // 3. Listen for Friends (Accepted Requests involves me as 'from' or 'to')
    useEffect(() => {
        if (!user) return

        // Complex query: fetch where (from==me OR to==me) AND status=='accepted'
        // Firestore doesn't support logically OR in one go easily without multiple queries or client merge.
        // For MVP speed, let's fetch strictly where 'to' == me OR 'from' == me separately or just one side if we force a standard.
        // Better: We track 'friends' in a subcollection or array on the user doc.
        // fallback: Standard Query for Accepted requests.

        // Let's just listen to "friend_requests" where status == accepted and I am involved.
        const q1 = query(collection(db, "friend_requests"), where("to", "==", user.uid), where("status", "==", "accepted"))
        const q2 = query(collection(db, "friend_requests"), where("from", "==", user.uid), where("status", "==", "accepted"))

        // We can't merge two listeners easily in one state hook without care.
        // For this MVP, let's just assume we only query "matches" from a "friends" collection if we had one.
        // Let's use a simpler approach: "Active Chats" usually implies friendship.
        // But for "My Friends" list:

        async function fetchFriends() {
            const [snap1, snap2] = await Promise.all([getDocs(q1), getDocs(q2)])
            const friendIds = new Set<string>()
            snap1.forEach(d => friendIds.add(d.data().from))
            snap2.forEach(d => friendIds.add(d.data().to))
            setFriends(Array.from(friendIds))
        }
        fetchFriends()

    }, [user])

    const sendRequest = async (toUid: string) => {
        if (!user) return
        try {
            // Check if already sent
            // (Skipped for speed)
            await addDoc(collection(db, "friend_requests"), {
                from: user.uid,
                to: toUid,
                status: 'pending',
                timestamp: serverTimestamp()
            })
            toast.success("Friend Request Sent!")
        } catch (error) {
            console.error(error)
            toast.error("Failed to send request")
        }
    }

    const acceptRequest = async (requestId: string) => {
        try {
            await updateDoc(doc(db, "friend_requests", requestId), {
                status: 'accepted'
            })
            toast.success("Friend Request Accepted!")
            // Optionally Create a Chat room immediately
        } catch (error) {
            console.error(error)
            toast.error("Error accepting request")
        }
    }

    const rejectRequest = async (requestId: string) => {
        try {
            await deleteDoc(doc(db, "friend_requests", requestId))
            toast.success("Request removed")
        } catch (error) {
            console.error(error)
        }
    }

    return {
        incomingRequests,
        outgoingRequests,
        friends,
        loading,
        sendRequest,
        acceptRequest,
        rejectRequest
    }
}
