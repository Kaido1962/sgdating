"use client"

import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, Bell, User, LogOut, Settings, Menu, Check, X, UserPlus, Activity, Shield, ChevronDown } from "lucide-react"
import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { useFriendSystem } from "@/hooks/useFriendSystem"

export default function Navbar() {
  const { user } = useAuth()
  const router = useRouter()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  // Helper to determine if we should show logged-in state
  const isVerified = user && user.emailVerified

  const handleLogout = async () => {
    await signOut(auth)
    router.push("/")
  }

  // Use Friend System to get requests for notifications
  const { incomingRequests, acceptRequest, rejectRequest, loading: friendsLoading } = useFriendSystem()
  const requestCount = incomingRequests.length

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowProfileDropdown(false)
      }
    }

    if (showProfileDropdown) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [showProfileDropdown])



  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-sm h-16">
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <img
            src="/datinglogo.jpeg"
            alt="SG Dating"
            className="h-10 w-auto object-contain rounded-md cursor-pointer"
            onClick={() => router.push("/")}
          />
          <span className="text-xl font-bold text-[#242228] hidden sm:block">SG Dating App</span>
        </div>

        {/* Center Nav (Desktop) */}
        {user ? (
          <div className="hidden md:flex items-center gap-6">
            {!['datingappadmin@guardian-angelstudios.co.za', 'itumeleng.mahwa@gmail.com', 'datingappsuperadmin@guardian-angelstudios.co.za', 'guardianangelstudios731@gmail.com'].includes(user.email?.toLowerCase() || "") && (
              <>
                <Link href="/dashboard" className="text-gray-500 hover:text-[#a22929] transition-colors font-medium">
                  Discover
                </Link>
                <Link href="/matches" className="text-gray-500 hover:text-[#a22929] transition-colors font-medium">
                  Matches
                </Link>
              </>
            )}

            {['datingappadmin@guardian-angelstudios.co.za', 'itumeleng.mahwa@gmail.com'].includes(user.email?.toLowerCase() || "") && (
              <Link href="/admin" className="text-[#a22929] font-bold hover:text-[#8b2323] transition-colors">
                Admin Dashboard
              </Link>
            )}
            {['datingappsuperadmin@guardian-angelstudios.co.za', 'guardianangelstudios731@gmail.com'].includes(user.email?.toLowerCase() || "") && (
              <Link href="/super-admin" className="text-purple-600 font-bold hover:text-purple-800 transition-colors">
                Super Admin
              </Link>
            )}
          </div>
        ) : (
          <div className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-gray-900 font-medium hover:text-[#a22929]">Home</Link>
            <Link href="/about" className="text-gray-500 hover:text-[#a22929]">About</Link>
            <Link href="/safety" className="text-gray-500 hover:text-[#a22929]">Safety</Link>
          </div>
        )}

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-4">
          {user ? (
            <>
              {/* Mobile Menu Toggle */}
              <Button variant="ghost" size="icon" className="md:hidden text-gray-600" onClick={() => setIsMenuOpen(!isMenuOpen)}>
                <Menu className="h-6 w-6" />
              </Button>

              <div className="flex items-center gap-2 relative">
                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-gray-500 hover:bg-gray-100 rounded-full relative"
                  onClick={() => setShowNotifications(!showNotifications)}
                >
                  <Bell className="h-5 w-5" />
                  {requestCount > 0 && (
                    <span className="absolute top-2 right-2 h-2 w-2 bg-[#a22929] rounded-full border border-white animate-pulse"></span>
                  )}
                </Button>

                {/* Notification Dropdown */}
                {showNotifications && (
                  <div className="absolute top-12 right-0 w-80 bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden z-50">
                    <div className="p-3 border-b border-gray-100 font-bold text-gray-700 flex justify-between items-center">
                      <span>Notifications</span>
                      {requestCount > 0 && <span className="text-xs bg-red-100 text-red-600 px-2 py-0.5 rounded-full">{requestCount} New</span>}
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {requestCount === 0 ? (
                        <div className="p-6 text-center text-gray-500 text-sm">
                          <Bell className="w-8 h-8 mx-auto text-gray-300 mb-2" />
                          No new notifications
                        </div>
                      ) : (
                        incomingRequests.map((req) => (
                          <div key={req.id} className="p-3 border-b border-gray-50 hover:bg-gray-50 transition-colors flex gap-3 items-start">
                            <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                              {req.fromUser?.photoURL ? (
                                <img src={req.fromUser.photoURL} className="h-full w-full object-cover" />
                              ) : (
                                <div className="h-full w-full flex items-center justify-center bg-gray-300"><User className="w-5 h-5 text-gray-500" /></div>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm text-gray-800">
                                <span className="font-bold">{req.fromUser?.displayName || "Someone"}</span> sent you a friend request.
                              </p>
                              <div className="flex gap-2 mt-2">
                                <Button
                                  size="sm"
                                  className="h-7 bg-[#a22929] hover:bg-[#8b2323] text-white text-xs"
                                  onClick={() => acceptRequest(req.id)}
                                >
                                  Confirm
                                </Button>
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="h-7 text-xs bg-gray-200 hover:bg-gray-300 text-gray-700"
                                  onClick={() => rejectRequest(req.id)}
                                >
                                  Delete
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}

                <div className="hidden sm:flex items-center gap-3 pl-2 border-l border-gray-200 relative" ref={dropdownRef}>
                  <button
                    onClick={() => setShowProfileDropdown(!showProfileDropdown)}
                    className="flex items-center gap-3 hover:bg-gray-50 rounded-lg px-2 py-1 transition-colors"
                  >
                    <div className="text-right hidden lg:block">
                      <p className="text-xs font-bold text-[#242228]">{user?.displayName?.split(" ")[0] || "User"}</p>
                      <p className="text-[10px] text-green-500 uppercase font-semibold">Online</p>
                    </div>
                    <div className="h-9 w-9 rounded-full bg-gray-200 overflow-hidden border border-gray-200">
                      {user?.photoURL ? (
                        <img src={user.photoURL} alt="Profile" className="h-full w-full object-cover" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-[#a22929] text-white text-xs font-bold">
                          {user?.displayName?.[0] || "U"}
                        </div>
                      )}
                    </div>
                    <ChevronDown className={`w-4 h-4 text-gray-500 transition-transform ${showProfileDropdown ? "rotate-180" : ""}`} />
                  </button>

                  {/* Dropdown Menu */}
                  {showProfileDropdown && (
                    <div className="absolute top-12 right-0 w-56 bg-white border border-gray-200 shadow-xl rounded-xl overflow-hidden z-50">
                      <div className="p-3 border-b border-gray-100">
                        <p className="font-bold text-gray-800 truncate">{user?.displayName || "User"}</p>
                        <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                      </div>
                      <div className="py-2">
                        <button
                          onClick={() => {
                            setShowProfileDropdown(false)
                            router.push("/profile")
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                        >
                          <User className="w-4 h-4" />
                          View Profile
                        </button>
                        <button
                          onClick={() => {
                            setShowProfileDropdown(false)
                            router.push("/profile")
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                        >
                          <Settings className="w-4 h-4" />
                          Settings
                        </button>
                      </div>
                      <div className="border-t border-gray-100">
                        <button
                          onClick={() => {
                            setShowProfileDropdown(false)
                            handleLogout()
                          }}
                          className="w-full px-4 py-3 text-left text-sm text-[#a22929] hover:bg-red-50 flex items-center gap-3 transition-colors font-medium"
                        >
                          <LogOut className="w-4 h-4" />
                          Log Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-3">
              <Button variant="ghost" onClick={() => router.push("/sign-in")} className="hidden sm:flex hover:text-[#a22929]">
                Log in
              </Button>
              <Button onClick={() => router.push("/sign-up")} className="bg-gradient-to-r from-[#a22929] to-[#ae645c] text-white rounded-full px-6">
                Sign Up
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-b border-gray-200 p-4 absolute w-full shadow-lg">
          <div className="space-y-2">
            <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/dashboard")}>
              <Heart className="mr-2 h-4 w-4" /> Discover
            </Button>
            <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/matches")}>
              <UserPlus className="mr-2 h-4 w-4" /> Matches
            </Button>
            {user?.email === 'datingappadmin@guardian-angelstudios.co.za' && (
              <Button variant="ghost" className="w-full justify-start text-[#a22929] font-bold" onClick={() => router.push("/admin")}>
                <Activity className="mr-2 h-4 w-4" /> Admin Dashboard
              </Button>
            )}
            {['datingappsuperadmin@guardian-angelstudios.co.za', 'guardianangelstudios731@gmail.com'].includes(user?.email?.toLowerCase() || "") && (
              <Button variant="ghost" className="w-full justify-start text-purple-600 font-bold" onClick={() => router.push("/super-admin")}>
                <Shield className="mr-2 h-4 w-4" /> Super Admin
              </Button>
            )}
            <Button variant="ghost" className="w-full justify-start" onClick={() => router.push("/profile")}>
              <User className="mr-2 h-4 w-4" /> Profile
            </Button>
            <Button variant="ghost" className="w-full justify-start text-[#a22929]" onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" /> Log Out
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}
