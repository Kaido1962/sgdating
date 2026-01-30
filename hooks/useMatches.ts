"use client"

import { useEffect, useState } from "react"
import { db } from "@/lib/firebase"
import { collection, query, getDocs, where, limit, doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"

export interface UserProfile {
    uid: string
    displayName: string
    age: number | null
    gender: string
    location: string
    bio: string
    lookingFor: string
    photoURL?: string
    interests?: string[]
    latitude?: number
    longitude?: number
    score?: number
    geoScore?: number
    interestScore?: number
}

export function useMatches() {
    const { user } = useAuth()
    const [matches, setMatches] = useState<UserProfile[]>([])
    const [loading, setLoading] = useState(true)
    const [blockedIds, setBlockedIds] = useState<string[]>([])
    const [passedIds, setPassedIds] = useState<string[]>([])

    const blockUser = async (targetUid: string) => {
        if (!user) return
        try {
            await setDoc(doc(db, "users", user.uid, "blocked_users", targetUid), {
                blockedAt: serverTimestamp()
            })
            setMatches(prev => prev.filter(m => m.uid !== targetUid))
            setBlockedIds(prev => [...prev, targetUid])
            toast.success("User blocked")
        } catch (error) {
            console.error("Error blocking user:", error)
            toast.error("Failed to block user")
        }
    }

    const passUser = async (targetUid: string) => {
        if (!user) return
        try {
            await setDoc(doc(db, "users", user.uid, "passed_users", targetUid), {
                passedAt: serverTimestamp()
            })
            setMatches(prev => prev.filter(m => m.uid !== targetUid))
            setPassedIds(prev => [...prev, targetUid])
            toast.success("Passed")
        } catch (error) {
            console.error("Error passing user:", error)
        }
    }

    useEffect(() => {
        const fetchMatches = async () => {
            if (!user) return

            try {
                // 1. Fetch Blocked & Passed Users
                const [blockedSnap, passedSnap] = await Promise.all([
                    getDocs(collection(db, "users", user.uid, "blocked_users")),
                    getDocs(collection(db, "users", user.uid, "passed_users"))
                ])

                const blocked = blockedSnap.docs.map(d => d.id)
                const passed = passedSnap.docs.map(d => d.id)
                const excludedIds = [...blocked, ...passed]

                setBlockedIds(blocked)
                setPassedIds(passed)

                // 2. Fetch Current User Data
                const userDoc = await getDocs(query(collection(db, "users"), where("uid", "==", user.uid)))
                if (userDoc.empty) return
                const currentUserData = userDoc.docs[0].data() as UserProfile

                const myGender = currentUserData.gender
                let targetGender = ""
                if (myGender === "Male") targetGender = "Female"
                else if (myGender === "Female") targetGender = "Male"

                // 3. Fetch Candidate Users
                const usersRef = collection(db, "users")
                let q = query(usersRef, limit(50)) // Fetch more for better AI ranking

                if (targetGender) {
                    q = query(usersRef, where("gender", "==", targetGender), limit(50))
                }

                const querySnapshot = await getDocs(q)
                const fetchedUsers: UserProfile[] = []

                querySnapshot.forEach((doc) => {
                    const data = doc.data() as UserProfile
                    if (doc.id !== user.uid && !excludedIds.includes(doc.id)) {
                        fetchedUsers.push({ ...data, uid: doc.id })
                    }
                })

                // FALLBACK: If no matches found with strict gender filter, show any nearby users
                if (fetchedUsers.length === 0 && targetGender) {
                    const fallbackQ = query(usersRef, limit(50))
                    const fallbackSnap = await getDocs(fallbackQ)
                    fallbackSnap.forEach((doc) => {
                        const data = doc.data() as UserProfile
                        if (doc.id !== user.uid && !excludedIds.includes(doc.id)) {
                            fetchedUsers.push({ ...data, uid: doc.id })
                        }
                    })
                }

                // 4. AI MATCHING: Call the matching API to rank users
                if (fetchedUsers.length > 0) {
                    try {
                        const response = await fetch("/api/match/calculate", {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({
                                currentUser: currentUserData,
                                candidates: fetchedUsers
                            })
                        })

                        if (response.ok) {
                            const { matches: rankedMatches } = await response.json()
                            setMatches(rankedMatches)
                        } else {
                            // Fallback to unranked if API fails
                            console.warn("AI matching failed, showing unranked results")
                            setMatches(fetchedUsers)
                        }
                    } catch (error) {
                        console.error("AI matching error:", error)
                        setMatches(fetchedUsers) // Fallback
                    }
                } else {
                    setMatches([])
                }

            } catch (error) {
                console.error("Error fetching matches:", error)
            } finally {
                setLoading(false)
            }
        }
        fetchMatches()
    }, [user])

    return { matches, loading, blockUser, passUser }
}
