"use client"

import { useEffect, useState, useRef } from "react"
import { useParams, useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { db } from "@/lib/firebase"
import { collection, query, where, getDocs, addDoc, onSnapshot, orderBy, serverTimestamp, setDoc, doc, getDoc, updateDoc, increment } from "firebase/firestore"
import { Button } from "@/components/ui/button"
import ProtectedRoute from "@/components/ProtectedRoute"
import { ArrowLeft, Send, Phone, Video, MoreVertical, ShieldAlert, ChevronLeft } from "lucide-react"
import Image from "next/image"
import { EmojiPicker } from "@/components/EmojiPicker"
import { checkContent } from "@/utils/moderation"
import { toast } from "sonner"
import { createNotification } from "@/lib/notifications"

interface Message {
    id: string
    text: string
    senderId: string
    createdAt: any
}

interface UserProfile {
    displayName: string
    photoURL?: string
}

export default function ChatPage() {
    const { user } = useAuth()
    const params = useParams()
    const router = useRouter()
    const targetUserId = params.id as string

    const [messages, setMessages] = useState<Message[]>([])
    const [newMessage, setNewMessage] = useState("")
    const [chatId, setChatId] = useState<string | null>(null)
    const [targetUser, setTargetUser] = useState<UserProfile | null>(null)
    const dummyScroll = useRef<HTMLDivElement>(null)

    // 1. Fetch Target User Details
    useEffect(() => {
        const fetchTargetUser = async () => {
            if (!targetUserId) return
            const docSnap = await getDoc(doc(db, "users", targetUserId))
            if (docSnap.exists()) {
                setTargetUser(docSnap.data() as UserProfile)
            }
        }
        fetchTargetUser()
    }, [targetUserId])

    // 2. Find or Create Chat Room
    useEffect(() => {
        const setupChat = async () => {
            if (!user || !targetUserId) return

            const chatsRef = collection(db, "chats")
            const q = query(chatsRef, where("participants", "array-contains", user.uid))

            const querySnapshot = await getDocs(q)
            let foundChatId = null

            querySnapshot.forEach((doc) => {
                const data = doc.data()
                if (data.participants.includes(targetUserId)) {
                    foundChatId = doc.id
                }
            })

            if (foundChatId) {
                setChatId(foundChatId)
            } else {
                // Create new chat
                const newChatRef = await addDoc(chatsRef, {
                    participants: [user.uid, targetUserId],
                    createdAt: serverTimestamp(),
                    lastMessage: "",
                    lastMessageTime: serverTimestamp()
                })
                setChatId(newChatRef.id)
            }
        }

        setupChat()
    }, [user, targetUserId])

    // 3. Listen for Messages & Reset Unread Count
    useEffect(() => {
        if (!chatId || !user) return

        const messagesRef = collection(db, "chats", chatId, "messages")
        const q = query(messagesRef, orderBy("createdAt", "asc"))

        const unsubscribe = onSnapshot(q, (snapshot) => {
            const msgs: Message[] = []
            snapshot.forEach((doc) => {
                msgs.push({ id: doc.id, ...doc.data() } as Message)
            })
            setMessages(msgs)
            setTimeout(() => dummyScroll.current?.scrollIntoView({ behavior: "smooth" }), 100)
        })

        // Reset my unread count to 0 when I open the chat
        const chatDocRef = doc(db, "chats", chatId)
        updateDoc(chatDocRef, {
            [`unread_${user.uid}`]: 0
        }).catch(err => console.error("Error resetting unread count", err))

        return () => unsubscribe()
    }, [chatId, user])

    // State for dynamic configuration
    const [bannedKeywords, setBannedKeywords] = useState<string[]>([])
    const [aiModerationEnabled, setAiModerationEnabled] = useState(true)

    // Fetch moderation settings on load
    useEffect(() => {
        const fetchSettings = async () => {
            const docRef = doc(db, "system_settings", "ai_config")
            const docSnap = await getDoc(docRef)
            if (docSnap.exists()) {
                const data = docSnap.data()
                setBannedKeywords(data.bannedKeywords || [])
                setAiModerationEnabled(data.moderationEnabled ?? true)
            }
        }
        fetchSettings()
    }, [])

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!newMessage.trim() || !user || !chatId || !targetUserId) return

        try {
            // 1. Content Moderation Check (Local + Dynamic List)
            let check = checkContent(newMessage, bannedKeywords)

            // 2. AI Moderation Check (if Local Passed & Enabled)
            if (!check.flagged && aiModerationEnabled) {
                // Optimistic UI could go here, but for safety we await
                const aiCheck = await import("@/utils/moderation").then(mod => mod.analyzeContentWithAI(newMessage))
                if (aiCheck.flagged) {
                    check = aiCheck
                }
            }

            if (check.flagged) {
                // FLAGGING LOGIC
                // A. Flag the User
                const userRef = doc(db, "users", user.uid)
                await updateDoc(userRef, {
                    isFlagged: true,
                    flags: increment(1)
                })

                // B. Create Admin Alert
                await addDoc(collection(db, "admin_alerts"), {
                    type: "content_violation",
                    userId: user.uid,
                    userEmail: user.email,
                    content: newMessage, // Store the bad message for evidence
                    reason: check.reason,
                    timestamp: serverTimestamp(),
                    severity: "high",
                    status: "new"
                })

                // C. Update System Stats (Threats Blocked)
                const statsRef = doc(db, "system_settings", "ai_stats")
                await setDoc(statsRef, { threatsBlocked: increment(1) }, { merge: true })

                toast.error(`Message blocked: ${check.reason}`)
                setNewMessage("")
                return
            }

            // 3. Proceed to Send Message (if safe)
            await addDoc(collection(db, "chats", chatId, "messages"), {
                text: newMessage,
                senderId: user.uid,
                receiverId: targetUserId,
                createdAt: serverTimestamp(),
                read: false
            })

            // Update last message in chat document
            const chatRef = doc(db, "chats", chatId)
            await setDoc(chatRef, {
                participants: [user.uid, targetUserId],
                lastMessage: newMessage,
                lastMessageTime: serverTimestamp(),
                [`unreadCount.${targetUserId}`]: increment(1)
            }, { merge: true })

            // Create notification for recipient
            await createNotification(
                targetUserId,
                "new_message",
                "New Message",
                `${user.displayName || "Someone"} sent you a message: ${newMessage.substring(0, 50)}${newMessage.length > 50 ? "..." : ""}`,
                {
                    senderId: user.uid,
                    chatId: chatId
                }
            )

            setNewMessage("")
        } catch (error) {
            console.error("Error sending message:", error)
            toast.error("Failed to send message")
        }
    }

    return (
        <ProtectedRoute>
            <div className="flex h-screen flex-col bg-gray-50">
                {/* Header */}
                <div className="flex items-center gap-3 bg-white px-4 py-3 shadow-sm border-b">
                    <Button variant="ghost" size="icon" onClick={() => router.back()}>
                        <ChevronLeft className="h-6 w-6 text-gray-600" />
                    </Button>

                    <div className="relative h-10 w-10 overflow-hidden rounded-full bg-gray-200">
                        {targetUser?.photoURL ? (
                            <Image src={targetUser.photoURL} alt="User" fill className="object-cover" />
                        ) : (
                            <div className="h-full w-full bg-gray-300" />
                        )}
                    </div>

                    <div>
                        <h1 className="font-semibold text-[#242228]">{targetUser?.displayName || "Loading..."}</h1>
                        <p className="text-xs text-green-600">Online</p>
                    </div>
                </div>

                {/* Messages Area */}
                <div className="flex-1 overflow-y-auto p-4 space-y-4">
                    <div className="text-center text-xs text-gray-400 my-4">
                        Safety Tip: Do not share financial info.
                    </div>

                    {messages.map((msg) => {
                        const isMe = msg.senderId === user?.uid
                        return (
                            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
                                <div
                                    className={`max-w-[75%] rounded-2xl px-4 py-2 text-sm shadow-sm ${isMe
                                        ? "bg-[#a22929] text-white rounded-tr-none"
                                        : "bg-white text-gray-800 border border-gray-100 rounded-tl-none"
                                        }`}
                                >
                                    {msg.text}
                                </div>
                            </div>
                        )
                    })}
                    <div ref={dummyScroll} />
                </div>

                {/* Input Area */}
                <form onSubmit={handleSendMessage} className="bg-white p-4 border-t pb-8">
                    <div className="flex gap-2 items-center">
                        <input
                            value={newMessage}
                            onChange={(e) => setNewMessage(e.target.value)}
                            placeholder="Type a message..."
                            className="flex-1 rounded-full border border-gray-300 px-4 py-2 text-sm focus:border-[#a22929] focus:outline-none"
                        />
                        <EmojiPicker
                            onEmojiSelect={(emoji) => setNewMessage(prev => prev + emoji)}
                            buttonClassName="p-2 hover:bg-gray-100 rounded-full transition-colors"
                        />
                        <Button
                            type="submit"
                            size="icon"
                            className="rounded-full bg-[#a22929] hover:bg-[#8f2424]"
                            disabled={!newMessage.trim()}
                        >
                            <Send className="h-4 w-4 text-white" />
                        </Button>
                    </div>
                </form>
            </div>
        </ProtectedRoute>
    )
}
