"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Users, FileText, Image, MessageSquare, Activity, LogOut } from "lucide-react"
import AdminRoute from "@/components/AdminRoute"
import Navbar from "@/components/navbar"
import { db, auth } from "@/lib/firebase"
import { collection, getDocs, query, orderBy, limit, getCountFromServer, where } from "firebase/firestore"
import { useRouter } from "next/navigation"
import { signOut } from "firebase/auth"

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
  createdAt: any
}

// Removed Navbar import since it's handled by layout/sidebar concept mostly, or we removed it per request.
// Keeping imports clean.

export default function AdminPage() {
  const router = useRouter()
  const [stats, setStats] = useState<Stats>({
    totalUsers: 0,
    activeUsers: 0,
    totalPosts: 0,
    totalStories: 0,
    totalChats: 0,
  })
  const [users, setUsers] = useState<UserData[]>([])
  const [posts, setPosts] = useState<PostData[]>([])
  const [stories, setStories] = useState<StoryData[]>([])
  const [loading, setLoading] = useState(true)

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

      // Optimized active users query
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
      const q = query(collection(db, "stories"), orderBy("createdAt", "desc"), limit(10))
      const snapshot = await getDocs(q)
      const storiesData: StoryData[] = []
      snapshot.forEach((doc) => {
        const data = doc.data()
        storiesData.push({
          id: doc.id,
          photoURL: data.photoURL,
          displayName: data.displayName || "Unknown",
          createdAt: data.createdAt
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

  // handleLogout moved to sidebar

  return (
    <AdminRoute>
      {/* Layout wrapper handles the sidebar and main flex container */}
      <div className="p-8">
        <div className="max-w-7xl mx-auto space-y-8">

          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Admin Command Center</h1>
              <p className="text-gray-500 mt-1">Real-time overview of SG Dating ecosystem</p>
            </div>
            {/* Actions are now in sidebar */}
          </div>

          {/* Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
            {[
              { label: 'Total Users', value: stats.totalUsers, icon: Users, color: 'text-[#a22929]', bg: 'bg-red-50' },
              { label: 'Active Now', value: stats.activeUsers, icon: Activity, color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'Posts', value: stats.totalPosts, icon: FileText, color: 'text-[#a22929]', bg: 'bg-red-50' },
              { label: 'Stories', value: stats.totalStories, icon: Image, color: 'text-[#a22929]', bg: 'bg-red-50' },
              { label: 'Chats', value: stats.totalChats, icon: MessageSquare, color: 'text-[#a22929]', bg: 'bg-red-50' },
            ].map((stat, i) => (
              <div key={i} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 transition-all hover:shadow-md hover:border-red-100">
                <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-xl flex items-center justify-center mb-4`}>
                  <stat.icon className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-gray-500 font-medium text-xs uppercase tracking-wide">{stat.label}</p>
              </div>
            ))}
          </div>



          <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col mb-8">
            <div className="p-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-gray-900">User Management</h2>
                <p className="text-gray-500 text-sm">Quick access to user controls</p>
              </div>
              <Button variant="ghost" size="sm" className="text-[#a22929] font-semibold hover:bg-red-50" onClick={fetchUsers}>Refresh</Button>
            </div>
            <div className="overflow-x-auto flex-1">
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
                    <tr key={u.uid} className="hover:bg-gray-50/50 transition-colors group">
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
                          className="text-[#a22929] hover:bg-red-50"
                          onClick={() => router.push(`/users/${u.uid}`)}
                        >
                          Manage
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* System Status and other widgets... */}
        </div>
      </div>
    </AdminRoute >
  )
}
