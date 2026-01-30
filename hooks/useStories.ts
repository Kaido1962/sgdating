"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, query, where, onSnapshot, addDoc, serverTimestamp, orderBy } from "firebase/firestore"
import { useAuth } from "@/context/AuthContext"

export interface Story {
    id: string
    userId: string
    displayName: string
    userPhotoURL?: string
    photoURL: string
    timestamp: any
}

export function useStories() {
    const { user } = useAuth()
    const [myStories, setMyStories] = useState<Story[]>([])
    const [allStories, setAllStories] = useState<Story[]>([])
    const [loading, setLoading] = useState(true)

    // Listen to all stories for the story bar
    useEffect(() => {
        const q = query(collection(db, "stories"), orderBy("timestamp", "desc"))
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const stories: Story[] = []
            snapshot.forEach((doc) => {
                stories.push({ id: doc.id, ...doc.data() } as Story)
            })
            setAllStories(stories)
            setLoading(false)
        })
        return () => unsubscribe()
    }, [])

    // Track my stories
    useEffect(() => {
        if (!user) return
        const q = query(
            collection(db, "stories"),
            where("userId", "==", user.uid),
            orderBy("timestamp", "desc")
        )
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const stories: Story[] = []
            snapshot.forEach((doc) => {
                stories.push({ id: doc.id, ...doc.data() } as Story)
            })
            setMyStories(stories)
        })
        return () => unsubscribe()
    }, [user])

    const addStory = async (photoURL: string) => {
        if (!user) return false

        try {
            await addDoc(collection(db, "stories"), {
                userId: user.uid,
                displayName: user.displayName,
                userPhotoURL: user.photoURL,
                photoURL: photoURL,
                timestamp: serverTimestamp()
            })
            return true
        } catch (error) {
            console.error("Error adding story:", error)
            return false
        }
    }

    return {
        myStories,
        allStories,
        storyCount: myStories.length,
        addStory,
        loading
    }
}
