"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import {
    collection,
    getDocs,
    query,
    orderBy,
    limit,
    startAfter,
    where,
    doc,
    updateDoc
} from "firebase/firestore"
import { db } from "@/lib/firebase"
import AdminRoute from "@/components/AdminRoute"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { Search, MoreHorizontal, Shield, Ban, CheckCircle, Trash2 } from "lucide-react"
import { toast } from "sonner"

interface UserData {
    uid: string
    displayName: string
    email: string
    photoURL?: string
    role?: string
    status?: 'active' | 'banned' | 'suspended'
    createdAt: any
    lastSeen: any
}

export default function AdminUsersPage() {
    const router = useRouter()
    const [users, setUsers] = useState<UserData[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")

    useEffect(() => {
        fetchUsers()
    }, [])

    const fetchUsers = async () => {
        setLoading(true)
        try {
            // In a real app with Algolia/Meilisearch, we'd do full text search.
            // Here we just fetch latest 50 for demo purposes or simple filtering.
            const q = query(collection(db, "users"), orderBy("createdAt", "desc"), limit(50))
            const snapshot = await getDocs(q)
            const usersData: UserData[] = []
            snapshot.forEach((doc) => {
                usersData.push({ uid: doc.id, ...doc.data() } as UserData)
            })
            setUsers(usersData)
        } catch (error) {
            console.error("Error fetching users:", error)
            toast.error("Failed to load users")
        } finally {
            setLoading(false)
        }
    }

    const handleStatusChange = async (uid: string, newStatus: string) => {
        try {
            await updateDoc(doc(db, "users", uid), { status: newStatus })
            setUsers(users.map(u => u.uid === uid ? { ...u, status: newStatus as any } : u))
            toast.success(`User updated to ${newStatus}`)
        } catch (error) {
            toast.error("Failed to update status")
        }
    }

    const filteredUsers = users.filter(user =>
        user.displayName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <AdminRoute>
            <div className="p-8 space-y-8">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
                        <p className="text-gray-500 mt-1">View, search, and manage all registered users.</p>
                    </div>
                    <div className="flex gap-2">
                        {/* Create User Button could go here */}
                    </div>
                </div>

                {/* Search & Filters */}
                <div className="bg-white p-4 rounded-xl border border-gray-200 shadow-sm flex items-center gap-4">
                    <div className="relative flex-1 max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <Input
                            placeholder="Search users by name or email..."
                            className="pl-10 border-gray-200 focus:border-[#a22929] focus:ring-[#a22929]"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" onClick={fetchUsers}>Refresh</Button>
                </div>

                {/* Users Table */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <Table>
                        <TableHeader className="bg-gray-50/50">
                            <TableRow>
                                <TableHead className="w-[300px]">User</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Joined</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {loading ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">Loading users...</TableCell>
                                </TableRow>
                            ) : filteredUsers.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={5} className="text-center py-8 text-gray-500">No users found.</TableCell>
                                </TableRow>
                            ) : (
                                filteredUsers.map((user) => (
                                    <TableRow key={user.uid}>
                                        <TableCell>
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden">
                                                    {user.photoURL ? (
                                                        <img src={user.photoURL} alt="" className="w-full h-full object-cover" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center bg-red-50 text-[#a22929] font-bold">
                                                            {user.displayName?.[0]?.toUpperCase() || "U"}
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <p className="font-medium text-gray-900">{user.displayName || "Unknown User"}</p>
                                                    <p className="text-xs text-gray-500">{user.email}</p>
                                                </div>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium border ${user.status === 'banned'
                                                    ? 'bg-red-50 text-red-700 border-red-100'
                                                    : user.status === 'suspended'
                                                        ? 'bg-orange-50 text-orange-700 border-orange-100'
                                                        : 'bg-green-50 text-green-700 border-green-100'
                                                }`}>
                                                {user.status || 'Active'}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-1.5 text-sm text-gray-600">
                                                {user.role === 'admin' && <Shield className="w-3.5 h-3.5 text-[#a22929]" />}
                                                {user.role === 'admin' ? 'Admin' : 'User'}
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-sm text-gray-500">
                                            {user.createdAt?.seconds
                                                ? new Date(user.createdAt.seconds * 1000).toLocaleDateString()
                                                : 'N/A'
                                            }
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" className="h-8 w-8 p-0">
                                                        <span className="sr-only">Open menu</span>
                                                        <MoreHorizontal className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                                    <DropdownMenuItem onClick={() => router.push(`/users/${user.uid}`)}>
                                                        View Profile
                                                    </DropdownMenuItem>
                                                    <DropdownMenuSeparator />
                                                    <DropdownMenuItem onClick={() => handleStatusChange(user.uid, 'active')}>
                                                        <CheckCircle className="w-4 h-4 mr-2" /> Activate
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(user.uid, 'suspended')}>
                                                        Suspend (7 Days)
                                                    </DropdownMenuItem>
                                                    <DropdownMenuItem onClick={() => handleStatusChange(user.uid, 'banned')} className="text-red-600">
                                                        <Ban className="w-4 h-4 mr-2" /> Ban User
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </AdminRoute>
    )
}
