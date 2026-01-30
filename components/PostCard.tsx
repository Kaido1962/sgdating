"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Heart, MessageCircle, MoreHorizontal, Send, Bookmark } from "lucide-react"
import { Post } from "@/hooks/usePosts"
import { useRouter } from "next/navigation"
import { doc, collection, onSnapshot, orderBy, query, serverTimestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

interface PostCardProps {
    post: Post
    currentUserId?: string
    hasPaidSubscription?: boolean
    onLike: (postId: string, currentLikes: number, likedBy: string[]) => void
    onComment: (postId: string, text: string) => Promise<boolean>
    onShowPayment: () => void
}

export function PostCard({ post, currentUserId, hasPaidSubscription, onLike, onComment, onShowPayment }: PostCardProps) {
    const router = useRouter()
    const [isLiked, setIsLiked] = useState(false)
    const [showComments, setShowComments] = useState(false)
    const [commentText, setCommentText] = useState("")
    const [comments, setComments] = useState<PostComment[]>([])
    const [sendingComment, setSendingComment] = useState(false)

    useEffect(() => {
        if (currentUserId && post.likedBy) {
            setIsLiked(post.likedBy.includes(currentUserId))
        }
    }, [currentUserId, post.likedBy])

    // Fetch comments when section is open
    useEffect(() => {
        if (showComments) {
            const q = query(collection(db, "posts", post.id, "comments"), orderBy("timestamp", "asc"))
            const unsubscribe = onSnapshot(q, (snapshot) => {
                const loaded: PostComment[] = []
                snapshot.forEach(doc => {
                    loaded.push({ id: doc.id, ...doc.data() } as PostComment)
                })
                setComments(loaded)
            })
            return () => unsubscribe()
        }
    }, [showComments, post.id])

    const handleLike = () => {
        onLike(post.id, post.likes, post.likedBy || [])
    }

    const handleSendComment = async () => {
        if (!hasPaidSubscription) {
            onShowPayment()
            return
        }

        if (!commentText.trim()) return
        setSendingComment(true)
        const success = await onComment(post.id, commentText)
        if (success) {
            setCommentText("")
        }
        setSendingComment(false)
    }

    const handleCommentClick = () => {
        setShowComments(!showComments)
    }

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            {/* Header */}
            <div className="flex items-center justify-between p-4">
                <div className="flex items-start gap-3">
                    <div className="h-10 w-10 rounded-full bg-gray-200 overflow-hidden flex-shrink-0 cursor-pointer" onClick={() => router.push(`/users/${post.uid}`)}>
                        {post.authorPhoto && <img src={post.authorPhoto} className="h-full w-full object-cover" />}
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-[#242228] cursor-pointer hover:underline" onClick={() => router.push(`/users/${post.uid}`)}>
                                {post.authorName}
                            </h3>
                            {post.feeling && (
                                <p className="text-sm text-gray-600">
                                    is <span className="font-medium">{post.feeling}</span>
                                </p>
                            )}
                        </div>
                        <p className="text-xs text-gray-500">
                            {post.timestamp?.toDate ? post.timestamp.toDate().toLocaleString() : "Just now"}
                        </p>
                    </div>
                </div>
                <Button variant="ghost" size="icon"><MoreHorizontal className="w-5 h-5 text-gray-400" /></Button>
            </div>

            {/* Content */}
            <div className="px-4 pb-3">
                <p className="text-[#242228] leading-relaxed">{post.content}</p>
            </div>

            {/* Image */}
            {post.imageUrl && (
                <div className="relative w-full bg-gray-100 cursor-pointer">
                    <img src={post.imageUrl} alt="Post content" className="w-full h-auto object-cover max-h-[500px]" />
                </div>
            )}

            {/* Actions */}
            <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-4">
                        <Button
                            variant="ghost"
                            size="icon"
                            className={`hover:bg-red-50 ${isLiked ? "text-[#a22929]" : "text-gray-600"} hover:text-[#a22929] transition-colors`}
                            onClick={handleLike}
                        >
                            <Heart className={`w-6 h-6 ${isLiked ? "fill-current" : ""}`} />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="hover:bg-blue-50 text-gray-600 hover:text-blue-600"
                            onClick={handleCommentClick}
                        >
                            <MessageCircle className="w-6 h-6" />
                        </Button>
                        <Button variant="ghost" size="icon" className="hover:bg-gray-100 text-gray-600">
                            <Send className="w-6 h-6" />
                        </Button>
                    </div>
                    <Button variant="ghost" size="icon" className="text-gray-600"><Bookmark className="w-6 h-6" /></Button>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500 mb-2">
                    <span>{post.likes} Likes</span>
                    <span>•</span>
                    <span
                        className="hover:underline cursor-pointer"
                        onClick={handleCommentClick}
                    >
                        {post.comments} Comments
                    </span>
                </div>

                {/* Comment Section */}
                {showComments && (
                    <div className="pt-3 border-t border-gray-100 animate-in slide-in-from-top-2 fade-in duration-200">
                        {/* List */}
                        <div className="space-y-3 mb-4 max-h-60 overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-200">
                            {comments.map(comment => (
                                <div key={comment.id} className="flex gap-2 items-start">
                                    <div className="h-8 w-8 rounded-full bg-gray-200 overflow-hidden flex-shrink-0">
                                        {comment.photoURL && <img src={comment.photoURL} className="h-full w-full object-cover" />}
                                    </div>
                                    <div className="bg-gray-100 rounded-2xl rounded-tl-none px-3 py-2 text-sm">
                                        <p className="font-bold text-[#242228] text-xs">{comment.username}</p>
                                        <p className="text-gray-700">{comment.text}</p>
                                    </div>
                                </div>
                            ))}
                            {comments.length === 0 && <p className="text-xs text-gray-400 text-center py-2">No comments yet.</p>}
                        </div>

                        {/* Input or Payment Prompt */}
                        {hasPaidSubscription ? (
                            <div className="flex gap-2">
                                <input
                                    className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-[#a22929]"
                                    placeholder="Write a comment..."
                                    value={commentText}
                                    onChange={(e) => setCommentText(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSendComment()}
                                />
                                <Button
                                    size="icon"
                                    className="rounded-full bg-[#a22929] hover:bg-[#8b2323] text-white shrink-0"
                                    onClick={handleSendComment}
                                    disabled={sendingComment || !commentText.trim()}
                                >
                                    <Send className="w-4 h-4 ml-0.5" />
                                </Button>
                            </div>
                        ) : (
                            <div className="bg-gray-50 rounded-lg p-3 text-center border border-gray-100">
                                <p className="text-sm text-gray-600 mb-2">Join the conversation!</p>
                                <Button
                                    onClick={onShowPayment}
                                    size="sm"
                                    className="bg-gradient-to-r from-[#a22929] to-[#ae645c] text-white w-full"
                                >
                                    Upgrade to Comment
                                </Button>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    )
}
