"use client"

import { useEffect, useState } from "react"
import SuperAdminRoute from "@/components/SuperAdminRoute"
import { Button } from "@/components/ui/button"
import { Globe, Users, FileText, Image, Activity, Loader2, Save, Eye, EyeOff } from "lucide-react"
import { doc, getDoc, setDoc, getCountFromServer, collection, query, orderBy, limit, getDocs, where } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

interface Stats {
    totalUsers: number
    activeUsers: number
    totalPosts: number
    totalStories: number
    totalChats: number
}

interface UserData {
    uid: string
    displayName: string
    email: string
    photoURL?: string
    lastSeen: any
    createdAt: any
}

interface PostData {
    id: string
    content: string
    authorName: string
    createdAt: any
    likes: number
}

interface StoryData {
    id: string
    photoURL: string
    displayName: string
    timestamp: any
}

export default function SuperAdminPublicSitePage() {
    const router = useRouter()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    // Stats
    const [stats, setStats] = useState<Stats>({
        totalUsers: 0,
        activeUsers: 0,
        totalPosts: 0,
        totalStories: 0,
        totalChats: 0,
    })

    // Recent Data
    const [users, setUsers] = useState<UserData[]>([])
    const [posts, setPosts] = useState<PostData[]>([])
    const [stories, setStories] = useState<StoryData[]>([])

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true)
            await Promise.all([
                fetchStats(),
                fetchUsers(),
                fetchRecentPosts(),
                fetchRecentStories()
            ])
            setLoading(false)
        }
        fetchData()
    }, [])

    const fetchStats = async () => {
        try {
            const usersCount = await getCountFromServer(collection(db, "users"))
            const totalUsers = usersCount.data().count

            // Active users in last 5 minutes
            const fiveMinutesAgo = new Date(Date.now() - 5 * 60 * 1000)
            const activeUsersQuery = query(
                collection(db, "users"),
                where("lastSeen", ">", fiveMinutesAgo)
            )
            const activeUsersCount = await getCountFromServer(activeUsersQuery)
            const activeUsers = activeUsersCount.data().count

            const postsCount = await getCountFromServer(collection(db, "posts"))
            const totalPosts = postsCount.data().count

            const storiesCount = await getCountFromServer(collection(db, "stories"))
            const totalStories = storiesCount.data().count

            const chatsCount = await getCountFromServer(collection(db, "chats"))
            const totalChats = chatsCount.data().count

            setStats({ totalUsers, activeUsers, totalPosts, totalStories, totalChats })
        } catch (error) {
            console.error("Error fetching stats:", error)
        }
    }

    const fetchUsers = async () => {
        try {
            const q = query(collection(db, "users"), orderBy("createdAt", "desc"), limit(10))
            const snapshot = await getDocs(q)
            const usersData: UserData[] = []
            snapshot.forEach((doc) => {
                usersData.push({ uid: doc.id, ...doc.data() } as UserData)
            })
            setUsers(usersData)
        } catch (error) {
            console.error("Error fetching users:", error)
        }
    }

    const fetchRecentPosts = async () => {
        try {
            const q = query(collection(db, "posts"), orderBy("createdAt", "desc"), limit(10))
            const snapshot = await getDocs(q)
            const postsData: PostData[] = []
            snapshot.forEach((doc) => {
                const data = doc.data()
                postsData.push({
                    id: doc.id,
                    content: data.content,
                    authorName: data.authorName || "Anonymous",
                    createdAt: data.createdAt,
                    likes: data.likes?.length || 0
                })
            })
            setPosts(postsData)
        } catch (error) {
            console.error("Error fetching posts:", error)
        }
    }

    const fetchRecentStories = async () => {
        try {
            const q = query(collection(db, "stories"), orderBy("timestamp", "desc"), limit(10))
            const snapshot = await getDocs(q)
            const storiesData: StoryData[] = []
            snapshot.forEach((doc) => {
                const data = doc.data()
                storiesData.push({
                    id: doc.id,
                    photoURL: data.photoURL,
                    displayName: data.displayName || "Unknown",
                    timestamp: data.timestamp
                })
            })
            setStories(storiesData)
        } catch (error) {
            console.error("Error fetching stories:", error)
        }
    }

    const isOnline = (lastSeen: any) => {
        if (!lastSeen?.seconds) return false
        const fiveMinutesAgo = Date.now() - 5 * 60 * 1000
        return lastSeen.seconds * 1000 > fiveMinutesAgo
    }

    if (loading) {
        return (
            <SuperAdminRoute>
                <div className="flex items-center justify-center min-h-screen">
                    <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
                </div>
            </SuperAdminRoute>
        )
    }

    return (
        <SuperAdminRoute>
            <div className="p-8 space-y-8">
                {/* Header */}
                <div>
                    <div className="flex items-center gap-3 mb-2">
                        <Globe className="w-8 h-8 text-purple-600" />
                        <h1 className="text-3xl font-bold text-gray-900">Public Site Dashboard</h1>
                    </div>
                    <p className="text-gray-500">Overview of the SG Dating public platform - same view as Admin Dashboard</p>
                </div>

                {/* Stats Overview */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                    {[
                        { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-purple-600', bg: 'bg-purple-50' },
                        { label: 'Active Now', value: stats.activeUsers, icon: Activity, color: 'text-green-600', bg: 'bg-green-50' },
                        { label: 'Posts', value: stats.totalPosts, icon: FileText, color: 'text-blue-600', bg: 'bg-blue-50' },
                        { label: 'Stories', value: stats.totalStories, icon: Image, color: 'text-pink-600', bg: 'bg-pink-50' },
                        { label: 'Chats', value: stats.totalChats, icon: Activity, color: 'text-orange-600', bg: 'bg-orange-50' },
                    ].map((stat, i) => (
                        <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 transition-all hover:shadow-md">
                            <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                                <stat.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                            <p className="text-gray-500 font-medium text-xs uppercase tracking-wide">{stat.label}</p>
                        </div>
                    ))}
                </div>

                {/* User Management Table */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                        <div>
                            <h2 className="text-xl font-bold text-gray-900">Recent Users</h2>
                            <p className="text-gray-500 text-sm">Latest registered users on the platform</p>
                        </div>
                        <Button variant="ghost" size="sm" className="text-purple-600 font-semibold hover:bg-purple-50" onClick={fetchUsers}>
                            Refresh
                        </Button>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-left">
                            <thead className="bg-gray-50/50">
                                <tr>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">User</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Joined</th>
                                    <th className="px-6 py-4 text-xs font-bold text-gray-400 uppercase tracking-wider">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {users.map((u) => (
                                    <tr key={u.uid} className="hover:bg-gray-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                                                    {u.photoURL ? <img src={u.photoURL} alt="" className="w-full h-full object-cover" /> : null}
                                                </div>
                                                <div>
                                                    <p className="font-bold text-gray-900">{u.displayName || 'Anonymous'}</p>
                                                    <p className="text-xs text-gray-400">{u.email}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            {isOnline(u.lastSeen) ? (
                                                <span className="flex items-center gap-1.5 text-xs font-bold text-green-600 bg-green-50 px-2.5 py-1 rounded-full w-fit">
                                                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" /> Active
                                                </span>
                                            ) : (
                                                <span className="text-xs font-bold text-gray-400 bg-gray-50 px-2.5 py-1 rounded-full w-fit">Offline</span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500 font-medium">
                                            {u.createdAt?.seconds ? new Date(u.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                className="text-purple-600 hover:bg-purple-50"
                                                onClick={() => router.push(`/users/${u.uid}`)}
                                            >
                                                View
                                            </Button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Recent Posts & Stories Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Recent Posts */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Recent Posts</h2>
                            <p className="text-gray-500 text-sm">Latest user posts</p>
                        </div>
                        <div className="p-6 space-y-4 max-h-96 overflow-y-auto">
                            {posts.map((post) => (
                                <div key={post.id} className="p-4 bg-gray-50 rounded-lg">
                                    <p className="text-sm font-semibold text-gray-900">{post.authorName}</p>
                                    <p className="text-sm text-gray-600 mt-1 line-clamp-2">{post.content}</p>
                                    <div className="flex items-center gap-4 mt-2 text-xs text-gray-400">
                                        <span>{post.likes} likes</span>
                                        <span>{post.createdAt?.seconds ? new Date(post.createdAt.seconds * 1000).toLocaleDateString() : 'N/A'}</span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Recent Stories */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
                        <div className="p-6 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-gray-900">Recent Stories</h2>
                            <p className="text-gray-500 text-sm">Latest user stories</p>
                        </div>
                        <div className="p-6 grid grid-cols-3 gap-4 max-h-96 overflow-y-auto">
                            {stories.map((story) => (
                                <div key={story.id} className="relative aspect-[9/16] rounded-lg overflow-hidden bg-gray-100">
                                    <img src={story.photoURL} alt="" className="w-full h-full object-cover" />
                                    <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/60 to-transparent">
                                        <p className="text-xs font-semibold text-white truncate">{story.displayName}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </SuperAdminRoute>
    )
}
