"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, ShieldCheck, Sparkles, Star, Wand2, LogOut, Loader2, ImagePlus, MoreHorizontal, Send, Bookmark, Plus, Search, X } from "lucide-react"
import ProtectedRoute from "@/components/ProtectedRoute"
import Navbar from "@/components/navbar"
import { useAuth } from "@/context/AuthContext"
import { auth } from "@/lib/firebase"
import { signOut } from "firebase/auth"
import { useRouter } from "next/navigation"
import { useMatches } from "@/hooks/useMatches"
import { useFriendSystem } from "@/hooks/useFriendSystem"
import { useProfileViews } from "@/hooks/useProfileViews"
import { useStories } from "@/hooks/useStories"
import { collection, query, where, getDocs, onSnapshot, orderBy } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { SubscriptionModal } from "@/components/SubscriptionModal"
import { toast } from "sonner"
import { usePosts } from "@/hooks/usePosts"
import { PostCard } from "@/components/PostCard"
import { useRef } from "react"
import { isOnline } from "@/lib/presence"
import { StoryEditor, StoryMetadata } from "@/components/StoryEditor"
import { EmojiPicker } from "@/components/EmojiPicker"
import { FeelingSelector } from "@/components/FeelingSelector"
import { StoryViewer } from "@/components/StoryViewer"
import { PaymentPromptModal } from "@/components/PaymentPromptModal"

interface ChatPreview {
  id: string
  partnerId: string
  partnerName: string
  partnerLastSeen: any
  lastMessage: string
  timestamp: any
  unread: number
}

export default function DashboardPage() {
  const { user, hasPaidSubscription } = useAuth()
  const router = useRouter()
  const { matches: rawMatches, loading: matchesLoading } = useMatches() // Keep matches for "Who to follow" or similar if needed
  const matches = rawMatches.filter(m => m.photoURL)

  const { incomingRequests } = useFriendSystem()
  const { viewsCount } = useProfileViews()
  const { allStories, addStory, storyCount } = useStories()
  const [profileLikesCount, setProfileLikesCount] = useState(0)

  useEffect(() => {
    if (!user) return
    const q = query(collection(db, "users", user.uid, "profile_likes"))
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setProfileLikesCount(snapshot.size)
    })
    return () => unsubscribe()
  }, [user])

  const { posts: allPosts, loading: postsLoading, createPost, toggleLike, addComment } = usePosts() // New Hook
  const [newPostContent, setNewPostContent] = useState("")
  const [isPosting, setIsPosting] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const storyInputRef = useRef<HTMLInputElement>(null)

  // Filtered Posts
  const filteredPosts = allPosts.filter(post =>
    post.authorName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Filtered Matches for sidebar/stories
  const filteredMatches = matches.filter(match =>
    match.displayName.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const [chats, setChats] = useState<ChatPreview[]>([])
  const [chatsLoading, setChatsLoading] = useState(true)
  const [isBoostActive, setBoostActive] = useState(false)
  const [showSubscription, setShowSubscription] = useState(false)
  const [showPaymentPrompt, setShowPaymentPrompt] = useState(false)
  const [showStoryEditor, setShowStoryEditor] = useState(false)
  const [pendingStoryImage, setPendingStoryImage] = useState<string | null>(null)
  const [selectedFeeling, setSelectedFeeling] = useState<{ text: string; emoji: string } | null>(null)
  const [showFeelingSelector, setShowFeelingSelector] = useState(false)
  const [showStoryViewer, setShowStoryViewer] = useState(false)
  const [storyViewerIndex, setStoryViewerIndex] = useState(0)

  // Boost Logic
  const handleBoost = () => {
    if (isBoostActive) return
    setBoostActive(true)
    toast.success("Profile Boosted! 🚀", { description: "You are now top visibility." })
    setTimeout(() => {
      toast.message("New Match!", { description: "Thando liked your profile! 🎉" })
    }, 4000)
  }

  // Force Subscription for unpaid users (Excluding Admins)
  useEffect(() => {
    if (!user) return

    const emailLower = user.email?.toLowerCase() || ""
    const ADMIN_EMAILS = ['datingappadmin@guardian-angelstudios.co.za', 'itumeleng.mahwa@gmail.com']
    const SUPER_ADMIN_EMAILS = ['datingappsuperadmin@guardian-angelstudios.co.za', 'guardianangelstudios731@gmail.com']
    const isAdmin = ADMIN_EMAILS.includes(emailLower) || SUPER_ADMIN_EMAILS.includes(emailLower)

    if (!isAdmin && !hasPaidSubscription) {
      // Small delay to ensure smooth loading
      const timer = setTimeout(() => {
        setShowSubscription(true)
      }, 1000)
      return () => clearTimeout(timer)
    }
  }, [user, hasPaidSubscription])

  // Chat Listener
  useEffect(() => {
    if (!user) return
    const q = query(collection(db, "chats"), where("participants", "array-contains", user.uid), orderBy("lastMessageTime", "desc"))
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const loadedChats: ChatPreview[] = []
      for (const docSnapshot of snapshot.docs) {
        const data = docSnapshot.data()

        // Skip chats with no messages to avoid showing "ghost" chats
        if (!data.lastMessage) continue

        const partnerId = data.participants.find((uid: string) => uid !== user.uid)
        let partnerName = "User"
        let finalPartnerId = "unknown"
        let partnerLastSeen = null
        if (partnerId) {
          finalPartnerId = partnerId
          const userDoc = await getDocs(query(collection(db, "users"), where("uid", "==", partnerId)))
          if (!userDoc.empty) {
            const partnerData = userDoc.docs[0].data()
            partnerName = partnerData.displayName
            partnerLastSeen = partnerData.lastSeen
          }
        }
        loadedChats.push({
          id: docSnapshot.id,
          partnerId: finalPartnerId,
          partnerName: partnerName,
          partnerLastSeen: partnerLastSeen,
          lastMessage: data.lastMessage || "Start the conversation!",
          timestamp: data.lastMessageTime,
          unread: data[`unread_${user.uid}`] || 0
        })
      }
      setChats(loadedChats)
      setChatsLoading(false)
    })
    return () => unsubscribe()
  }, [user])

  const handleLogout = async () => {
    await signOut(auth)
    router.push("/")
  }

  const handlePostSubmit = async () => {
    if (!newPostContent.trim()) return

    setIsPosting(true)
    let imageBase64 = undefined

    if (fileInputRef.current?.files?.[0]) {
      const file = fileInputRef.current.files[0]
      const reader = new FileReader()
      imageBase64 = await new Promise<string>((resolve) => {
        reader.onload = (e) => resolve(e.target?.result as string)
        reader.readAsDataURL(file)
      })
    }

    const feelingText = selectedFeeling ? `${selectedFeeling.text} ${selectedFeeling.emoji}` : undefined
    const contentToPost = newPostContent.trim() || feelingText || "" // Use feeling as content if no text

    const success = await createPost(contentToPost, imageBase64, feelingText)
    if (success) {
      setNewPostContent("")
      setSelectedFeeling(null)
      if (fileInputRef.current) fileInputRef.current.value = ""
      toast.success("Posted!")
    } else {
      toast.error("Failed to post.")
    }
    setIsPosting(false)
  }

  const handleAddStory = async (e: React.ChangeEvent<HTMLInputElement>) => {
    // Check if user has paid subscription
    if (!hasPaidSubscription) {
      setShowPaymentPrompt(true)
      return
    }

    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (ev) => {
      const imageBase64 = ev.target?.result as string
      setPendingStoryImage(imageBase64)
      setShowStoryEditor(true)
    }
    reader.readAsDataURL(file)

    // Reset input
    if (storyInputRef.current) storyInputRef.current.value = ""
  }

  const handleSaveStory = async (customizedImage: string, metadata: StoryMetadata) => {
    const loadingToast = toast.loading("Uploading story...")
    const success = await addStory(customizedImage)
    toast.dismiss(loadingToast)

    if (success) {
      toast.success("Story added!")
    } else {
      toast.error("Failed to add story.")
    }

    setShowStoryEditor(false)
    setPendingStoryImage(null)
  }

  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-[#f0f2f5] pt-20 pb-10"> {/* Facebook-like gray background */}
        <Navbar />

        <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 lg:grid-cols-12 gap-6">

          {/* LEFT COLUMN: Sidebar (Profile & Nav) - spans 3 cols */}
          <div className="hidden lg:block lg:col-span-3 space-y-4">
            {/* Mini Profile Card */}
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-200">
              <div className="h-20 bg-gradient-to-r from-[#a22929] to-[#ae645c]"></div>
              <div className="px-4 pb-4 relative">
                <div className="absolute -top-10 left-4 h-20 w-20 rounded-full border-4 border-white overflow-hidden bg-gray-200">
                  {user?.photoURL ? <img src={user.photoURL} alt="Me" className="h-full w-full object-cover" /> : <div className="h-full w-full bg-gray-300" />}
                </div>
                <div className="pt-12">
                  <h2 className="text-xl font-bold text-[#242228]">{user?.displayName?.split(" ")[0] || "User"}</h2>
                  <p className="text-sm text-gray-500">Johannesburg, SA</p>
                </div>
                <div className="mt-4 pt-4 border-t flex justify-between text-center">
                  <div className="cursor-pointer hover:bg-gray-50 rounded-lg p-1 transition-colors" onClick={() => router.push('/matches')}>
                    <p className="text-xs text-gray-500">Matches</p>
                    <p className="font-bold text-[#a22929]">{filteredMatches.length}</p>
                  </div>
                  <div className="cursor-pointer hover:bg-gray-50 rounded-lg p-1 transition-colors" onClick={() => router.push('/likes')}>
                    <p className="text-xs text-gray-500">Likes</p>
                    <p className="font-bold text-[#a22929]">{incomingRequests.length + profileLikesCount}</p>
                  </div>
                  <div className="cursor-pointer hover:bg-gray-50 rounded-lg p-1 transition-colors">
                    <p className="text-xs text-gray-500">Views</p>
                    <p className="font-bold text-[#a22929]">{viewsCount}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Navigation Menu */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
              <Button variant="ghost" onClick={() => router.push('/encounters')} className="w-full justify-start text-gray-700 hover:bg-gray-100 hover:text-[#a22929]">
                <Sparkles className="w-5 h-5 mr-3" /> Encounters
              </Button>
              <Button variant="ghost" onClick={() => router.push('/likes')} className="w-full justify-start text-gray-700 hover:bg-gray-100 hover:text-[#a22929]">
                <Heart className="w-5 h-5 mr-3" /> Likes
              </Button>
              <Button variant="ghost" onClick={() => router.push('/messages')} className="w-full justify-start text-gray-700 hover:bg-gray-100 hover:text-[#a22929]">
                <MessageCircle className="w-5 h-5 mr-3" /> Messages
              </Button>
              <Button variant="ghost" onClick={() => router.push('/activities')} className="w-full justify-start text-gray-700 hover:bg-gray-100 hover:text-[#a22929]">
                <Wand2 className="w-5 h-5 mr-3" /> Activities
              </Button>
              <Button variant="ghost" onClick={() => router.push('/profile')} className="w-full justify-start text-gray-700 hover:bg-gray-100 hover:text-[#a22929]">
                <ShieldCheck className="w-5 h-5 mr-3" /> Profile Settings
              </Button>
              <Button variant="ghost" onClick={handleLogout} className="w-full justify-start text-gray-700 hover:bg-gray-100 hover:text-[#a22929]">
                <LogOut className="w-5 h-5 mr-3" /> Log Out
              </Button>
            </div>
          </div>

          {/* CENTER COLUMN: The Feed (Matches) - spans 6 cols */}
          <div className="lg:col-span-6 space-y-6">

            {/* Search Bar */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2 flex items-center gap-3 px-4">
              <Search className="w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search posts or people..."
                className="flex-1 bg-transparent border-none focus:ring-0 text-sm py-2 text-[#242228]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery("")} className="text-gray-400 hover:text-gray-600">
                  <Plus className="w-4 h-4 rotate-45" />
                </button>
              )}
            </div>

            {/* Stories / Quick Actions */}
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              <input
                type="file"
                ref={storyInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleAddStory}
              />
              <div
                className="flex-shrink-0 w-28 h-40 bg-white rounded-xl shadow-sm border border-gray-200 relative overflow-hidden group cursor-pointer"
                onClick={() => {
                  if (!hasPaidSubscription) setShowPaymentPrompt(true)
                  else storyInputRef.current?.click()
                }}
              >
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-all"></div>
                <div className="absolute bottom-2 left-2 text-white text-sm font-bold leading-tight">Add to Story</div>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white rounded-full p-1">
                  <Plus className="w-6 h-6 text-[#a22929]" />
                </div>
              </div>

              {/* Other Users' Stories */}
              {allStories.map((story, index) => (
                <div
                  key={story.id}
                  className="flex-shrink-0 w-28 h-40 bg-white rounded-xl shadow-sm border border-gray-200 relative overflow-hidden cursor-pointer group"
                  onClick={() => {
                    setStoryViewerIndex(index)
                    setShowStoryViewer(true)
                  }}
                >
                  <img src={story.photoURL} className="h-full w-full object-cover group-hover:scale-105 transition-transform" />
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
                  <div className="absolute bottom-2 left-2 right-2">
                    <div className="flex items-center gap-1 mb-1">
                      <div className="w-6 h-6 rounded-full border-2 border-white overflow-hidden bg-gray-300">
                        {story.userPhotoURL && <img src={story.userPhotoURL} className="w-full h-full object-cover" />}
                      </div>
                    </div>
                    <p className="text-white text-xs font-semibold truncate">{story.displayName}</p>
                  </div>
                </div>
              ))}
              {allStories.length < 5 && filteredMatches.slice(0, 5 - allStories.length).map((match) => (
                <div key={match.uid} className="flex-shrink-0 w-28 h-40 bg-gray-200 rounded-xl shadow-sm border border-gray-200 relative overflow-hidden cursor-pointer hover:scale-105 transition-transform opacity-70" onClick={() => router.push(`/users/${match.uid}`)}>
                  {match.photoURL ? (
                    <img src={match.photoURL} alt="Story" className="h-full w-full object-cover" />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center bg-gray-300 text-gray-500 font-bold text-xl">{match.displayName?.[0]}</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/60"></div>
                  <div className="absolute bottom-2 left-2 text-white text-xs font-bold shadow-black drop-shadow-md truncate w-20">{match.displayName}</div>
                </div>
              ))}
            </div>

            {/* Create Post / Status Input */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex gap-4 items-center mb-3">
                <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden">
                  {user?.photoURL && <img src={user.photoURL} className="h-full w-full object-cover" />}
                </div>
                <input
                  type="text"
                  value={newPostContent}
                  onChange={(e) => setNewPostContent(e.target.value)}
                  placeholder={`What's on your mind, ${user?.displayName?.split(" ")[0]}?`}
                  className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-gray-700 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-[#a22929]/20 transition-all"
                  onKeyDown={(e) => e.key === 'Enter' && handlePostSubmit()}
                />
              </div>
              {selectedFeeling && (
                <div className="mb-2 flex items-center gap-2 text-sm text-gray-600">
                  <span>Feeling:</span>
                  <span className="bg-[#a22929]/10 text-[#a22929] px-3 py-1 rounded-full font-medium">
                    {selectedFeeling.text} {selectedFeeling.emoji}
                  </span>
                  <button
                    onClick={() => setSelectedFeeling(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <div className="flex gap-2">
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-[#a22929]"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <ImagePlus className="w-4 h-4 mr-2" /> Photo
                  </Button>
                  <EmojiPicker
                    onEmojiSelect={(emoji) => setNewPostContent(prev => prev + emoji)}
                    buttonClassName="text-gray-600 hover:text-[#a22929] flex items-center gap-2 px-3 py-1.5 hover:bg-gray-100 rounded-lg transition-colors text-sm font-medium"
                  />
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-gray-600 hover:text-[#a22929]"
                    onClick={() => setShowFeelingSelector(true)}
                  >
                    <Sparkles className="w-4 h-4 mr-2" /> Feeling
                  </Button>
                </div>
                <Button
                  size="sm"
                  onClick={handlePostSubmit}
                  disabled={isPosting || !newPostContent}
                  className="bg-[#a22929] hover:bg-[#8b2323] text-white rounded-full px-6"
                >
                  {isPosting ? "Posting..." : "Post"}
                </Button>
              </div>
            </div>

            {/* FEED: Real User Posts */}
            <div className="space-y-6">
              {postsLoading ? <div className="text-center py-10"><Loader2 className="animate-spin mx-auto text-[#a22929]" /></div> :
                filteredPosts.length === 0 ? (
                  <div className="bg-white p-8 rounded-xl text-center text-gray-500">
                    {searchQuery ? (
                      <>
                        <p className="font-semibold text-lg mb-2">No results found for "{searchQuery}"</p>
                        <p className="text-sm">Try searching for something else or clear your search</p>
                      </>
                    ) : (
                      <p>No posts yet. Be the first to share!</p>
                    )}
                  </div>
                ) :
                  filteredPosts.map((post) => (
                    <PostCard
                      key={post.id}
                      post={post}
                      currentUserId={user?.uid}
                      hasPaidSubscription={hasPaidSubscription}
                      onLike={toggleLike}
                      onComment={async (id, text) => {
                        const res = await addComment(id, text)
                        return res === true
                      }}
                      onShowPayment={() => setShowPaymentPrompt(true)}
                    />
                  ))
              }
            </div>
          </div>

          {/* RIGHT COLUMN: Sidebar (Chats & Boost) - spans 3 cols */}
          <div className="hidden lg:block lg:col-span-3 space-y-6">
            {/* Boost Card */}
            <div className="bg-gradient-to-br from-[#a22929] to-[#ae645c] rounded-xl p-5 text-white shadow-md">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-lg">Boost Your Profile</h3>
                  <p className="text-xs text-white/80 opacity-90 max-w-[150px]">Get up to 10x more visibility right now.</p>
                </div>
                <Sparkles className={`w-8 h-8 text-yellow-300 ${isBoostActive ? "animate-spin" : ""}`} />
              </div>
              <Button
                onClick={handleBoost}
                className="mt-4 w-full bg-white text-[#a22929] hover:bg-gray-100 font-semibold"
              >
                {isBoostActive ? "Active!" : "Boost Now"}
              </Button>
            </div>

            {/* VIP Banner */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-yellow-100 rounded-full"><Star className="w-5 h-5 text-yellow-600" /></div>
                <div className="font-bold text-[#242228]">Go Premium</div>
              </div>
              <p className="text-xs text-gray-500 mb-3">See who likes you and get unlimited swipes.</p>
              <Button variant="outline" size="sm" className="w-full border-[#a22929] text-[#a22929]" onClick={() => setShowSubscription(true)}>Upgrade</Button>
            </div>

            {/* Messages List */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-gray-700">Messages</h3>
                {incomingRequests.length > 0 && (
                  <span
                    className="text-xs text-[#a22929] font-medium cursor-pointer hover:underline"
                    onClick={() => router.push('/activities')}
                  >
                    Requests({incomingRequests.length})
                  </span>
                )}
              </div>
              <div className="space-y-1">
                {chatsLoading ? <div className="text-center py-4"><Loader2 className="w-5 h-5 animate-spin mx-auto text-gray-400" /></div> :
                  chats.length === 0 ? <p className="text-xs text-gray-400 text-center py-2">No messages yet.</p> :
                    chats.slice(0, 5).map(c => (
                      <div key={c.id} className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-lg cursor-pointer group" onClick={() => router.push(`/chat/${c.partnerId}`)}>
                        <div className="relative">
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center text-[#242228] font-bold text-xs uppercase shadow-inner">
                            {c.partnerName[0]}
                          </div>
                          <div className={`absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white ${isOnline(c.partnerLastSeen) ? "bg-green-500" : "bg-gray-400"}`}></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-[#242228] group-hover:text-[#a22929]">{c.partnerName}</p>
                          <p className={`text-xs truncate ${c.unread > 0 ? "font-bold text-black" : "text-gray-500"}`}>
                            {c.unread > 0 ? "New message" : c.lastMessage}
                          </p>
                        </div>
                        {c.unread > 0 && <div className="h-2 w-2 bg-[#a22929] rounded-full"></div>}
                      </div>
                    ))
                }
              </div>
            </div>

            <div className="text-xs text-gray-400 pt-4 border-t text-center">
              Safety • Rules • Privacy • Terms
              <br />© 2026 SG Dating
            </div>
          </div>

        </div>

        {/* Story Editor Modal */}
        {showStoryEditor && pendingStoryImage && (
          <StoryEditor
            imageUrl={pendingStoryImage}
            onSave={handleSaveStory}
            onCancel={() => {
              setShowStoryEditor(false)
              setPendingStoryImage(null)
            }}
          />
        )}

        {/* Feeling Selector Modal */}
        {showFeelingSelector && (
          <FeelingSelector
            onSelect={(feeling) => {
              setSelectedFeeling(feeling)
              setShowFeelingSelector(false)
            }}
            onClose={() => setShowFeelingSelector(false)}
          />
        )}

        {/* Story Viewer Modal */}
        {showStoryViewer && allStories.length > 0 && (
          <StoryViewer
            stories={allStories}
            initialIndex={storyViewerIndex}
            onClose={() => setShowStoryViewer(false)}
          />
        )}

        {/* Payment Prompt Modal */}
        <PaymentPromptModal
          open={showPaymentPrompt}
          onOpenChange={setShowPaymentPrompt}
          onUpgrade={() => setShowSubscription(true)}
        />

        <SubscriptionModal open={showSubscription} onOpenChange={setShowSubscription} />
      </div>
    </ProtectedRoute>
  )
}
