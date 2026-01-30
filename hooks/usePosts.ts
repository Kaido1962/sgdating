"use client"

import { useState, useEffect } from "react"
import { db } from "@/lib/firebase"
import { collection, query, orderBy, onSnapshot, addDoc, serverTimestamp, getDocs, where, doc, updateDoc, getDoc } from "firebase/firestore"
import { useAuth } from "@/context/AuthContext"

export interface Post {
    id: string
    uid: string
    authorName: string
    authorPhoto: string
    content: string
    imageUrl?: string
    feeling?: string
    likes: number
    likedBy?: string[]
    comments: number
    timestamp: any
}

export function usePosts() {
    const [posts, setPosts] = useState<Post[]>([])
    const [loading, setLoading] = useState(true)
    const { user } = useAuth()

    // Real-time listener for posts
    useEffect(() => {
        const q = query(collection(db, "posts"), orderBy("timestamp", "desc"))

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const loadedPosts: Post[] = []
            snapshot.forEach((doc) => {
                loadedPosts.push({ id: doc.id, ...doc.data() } as Post)
            })
            setPosts(loadedPosts)
            setLoading(false)
        })

        return () => unsubscribe()
    }, [])

    const createPost = async (content: string, imageFile?: string, feeling?: string) => {
        if (!user) return

        try {
            await addDoc(collection(db, "posts"), {
                uid: user.uid,
                authorName: user.displayName || "Anonymous",
                authorPhoto: user.photoURL || "",
                content: content,
                imageUrl: imageFile || "",
                feeling: feeling || "",
                likes: 0,
                likedBy: [],
                comments: 0,
                timestamp: serverTimestamp()
            })
            return true
        } catch (error) {
            console.error("Error creating post:", error)
            return false
        }
    }

    const toggleLike = async (postId: string, currentLikes: number, likedBy: string[] = []) => {
        if (!user) return
        const isLiked = likedBy.includes(user.uid)
        const postRef = doc(db, "posts", postId)

        try {
            if (isLiked) {
                await updateDoc(postRef, {
                    likes: currentLikes > 0 ? currentLikes - 1 : 0,
                    likedBy: likedBy.filter(id => id !== user.uid)
                })
            } else {
                await updateDoc(postRef, {
                    likes: currentLikes + 1,
                    likedBy: [...likedBy, user.uid]
                })

                // Add Notification
                const postSnap = await getDoc(postRef)
                const postData = postSnap.data()
                if (postData && postData.uid !== user.uid) {
                    await addDoc(collection(db, "users", postData.uid, "notifications"), {
                        type: "post_like",
                        postId: postId,
                        fromId: user.uid,
                        fromName: user.displayName,
                        read: false,
                        timestamp: serverTimestamp()
                    })
                }
            }
        } catch (error) {
            console.error("Error liking post:", error)
        }
    }

    const addComment = async (postId: string, text: string) => {
        if (!user || !text.trim()) return
        const postRef = doc(db, "posts", postId)
        const commentsRef = collection(db, "posts", postId, "comments")

        try {
            await addDoc(commentsRef, {
                uid: user.uid,
                username: user.displayName || "User",
                photoURL: user.photoURL,
                text: text,
                timestamp: serverTimestamp()
            })

            const postSnap = await getDoc(postRef)
            const postData = postSnap.data()
            await updateDoc(postRef, {
                comments: (postData?.comments || 0) + 1
            })

            // Add Notification
            if (postData && postData.uid !== user.uid) {
                await addDoc(collection(db, "users", postData.uid, "notifications"), {
                    type: "comment",
                    postId: postId,
                    fromId: user.uid,
                    fromName: user.displayName,
                    read: false,
                    timestamp: serverTimestamp()
                })
            }
            return true
        } catch (error) {
            console.error("Error commenting:", error)
            return false
        }
    }

    return { posts, loading, createPost, toggleLike, addComment }
}
