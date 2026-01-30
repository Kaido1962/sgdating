"use client"

import Navbar from "@/components/navbar"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useAuth } from "@/context/AuthContext"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { signInWithEmailAndPassword, sendPasswordResetEmail, signOut, GoogleAuthProvider, signInWithPopup } from "firebase/auth"
import { auth, db } from "@/lib/firebase"
import { doc, getDoc } from "firebase/firestore"
import { toast } from "sonner"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [isResetMode, setIsResetMode] = useState(false)
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const user = userCredential.user

      if (!user.emailVerified) {
        await signOut(auth)
        setError("Please verify your email address before signing in.")
        toast.error("Email not verified", {
          description: "Check your inbox for the verification link.",
        })
        return
      }

      toast.success("Welcome back!", {
        description: "You have successfully signed in.",
      })

      const emailLower = email.toLowerCase()
      const ADMIN_EMAILS = ['datingappadmin@guardian-angelstudios.co.za', 'itumeleng.mahwa@gmail.com']
      const SUPER_ADMIN_EMAILS = ['datingappsuperadmin@guardian-angelstudios.co.za', 'guardianangelstudios731@gmail.com']

      if (SUPER_ADMIN_EMAILS.includes(emailLower)) {
        router.push("/super-admin")
      } else if (ADMIN_EMAILS.includes(emailLower)) {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }
    } catch (err: any) {
      console.error(err)
      if (err.code === "auth/invalid-credential") {
        setError("Invalid email or password. Please try again.")
      } else {
        setError("An error occurred during sign in. Please try again.")
      }
      toast.error("Sign in failed", {
        description: err.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      await sendPasswordResetEmail(auth, email)
      toast.success("Reset email sent", {
        description: "Check your inbox for password reset instructions.",
      })
      setIsResetMode(false)
    } catch (err: any) {
      console.error(err)
      setError("Failed to send reset email. Please verify your email address.")
      toast.error("Error", {
        description: err.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSignIn = async () => {
    setLoading(true)
    setError("")

    try {
      const provider = new GoogleAuthProvider()
      const result = await signInWithPopup(auth, provider)
      const user = result.user

      // Get user document to check role
      const userDocRef = doc(db, "users", user.uid)
      const userDocSnap = await getDoc(userDocRef)

      const userData = userDocSnap.data()
      const userRole = userData?.role || "user"
      const emailLower = user.email?.toLowerCase() || ""

      // Redirect based on role
      if (userRole === "super_admin" || emailLower === "datingappsuperadmin@guardian-angelstudios.co.za" || emailLower === "guardianangelstudios731@gmail.com") {
        router.push("/super-admin")
      } else if (userRole === "admin" || emailLower === "datingappadmin@guardian-angelstudios.co.za" || emailLower === "itumeleng.mahwa@gmail.com") {
        router.push("/admin")
      } else {
        router.push("/dashboard")
      }

      toast.success("Welcome back!", {
        description: "Successfully signed in with Google",
      })
    } catch (err: any) {
      console.error(err)
      if (err.code === "auth/popup-closed-by-user") {
        setError("Sign-in cancelled")
      } else if (err.code === "auth/account-exists-with-different-credential") {
        setError("An account already exists with this email using a different sign-in method")
      } else {
        setError("Failed to sign in with Google. Please try again.")
      }
      toast.error("Sign in failed", {
        description: err.message,
      })
    } finally {
      setLoading(false)
    }
  }

  const features = [
    "Premium Matching",
    "Verified Profiles",
    "Secure Chat",
    "Privacy First"
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#c5c4c4] via-white to-[#c5c4c4]/70 flex flex-col">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-16 lg:py-24 mt-16 flex-grow">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#a22929] via-[#ae645c] to-[#242228] text-white p-10 shadow-2xl">
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_top_left,#fff,transparent_50%)]" />

            <div className="relative space-y-6">

              <div className="flex items-center gap-3">
                <img
                  src="/datinglogo.jpeg"
                  alt="SG Dating App logo"
                  className="w-16 h-16 rounded-full object-cover border border-white/30 shadow-lg"
                />
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-white/70">Welcome back</p>
                  <h1 className="text-3xl font-bold">SG Dating App</h1>
                </div>
              </div>
              <p className="text-lg text-white/85 leading-relaxed">
                Pick up where you left off. Sign in to continue discovering meaningful connections tailored to you.
              </p>
              <div className="flex flex-wrap gap-3">
                {features.map((item) => (
                  <span
                    key={item}
                    className="px-4 py-2 rounded-full bg-white/10 border border-white/15 backdrop-blur text-sm"
                  >
                    {item}
                  </span>
                ))}
              </div>
              <div className="flex items-center gap-3 pt-4">
                <div className="h-1 w-16 rounded-full bg-white/60" />
                <p className="text-sm text-white/70">Loved by thousands across SA</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl border border-[#c5c4c4]/50 p-10 space-y-8">
            <div className="space-y-2">
              <p className="text-sm font-semibold text-[#a22929]">{isResetMode ? "Forgot Password" : "Welcome back"}</p>
              <h2 className="text-3xl font-bold text-[#242228]">{isResetMode ? "Reset your password" : "Sign in to continue"}</h2>
              <p className="text-[#242228]/70">{isResetMode ? "Enter your email to receive a reset link." : "Use your email and password to access your account."}</p>
            </div>

            {isResetMode ? (
              <form className="space-y-5" onSubmit={handleResetPassword}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#242228]">Email</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-[#c5c4c4] bg-white px-4 py-3 text-[#242228] focus:ring-2 focus:ring-[#ae645c] focus:outline-none shadow-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#ae645c] to-[#a22929] text-white py-3.5 text-base font-semibold shadow-lg shadow-[#a22929]/30"
                >
                  {loading ? "Sending..." : "Send Reset Link"}
                </Button>
                <div className="text-center mt-4">
                  <button type="button" onClick={() => setIsResetMode(false)} className="text-sm text-gray-500 hover:text-[#a22929]">
                    Back to Login
                  </button>
                </div>
              </form>
            ) : (
              <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#242228]">Email</label>
                  <Input
                    type="email"
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-[#c5c4c4] bg-white px-4 py-3 text-[#242228] focus:ring-2 focus:ring-[#ae645c] focus:outline-none shadow-sm"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm font-medium text-[#242228]">
                    <label>Password</label>
                    <button type="button" onClick={() => setIsResetMode(true)} className="text-[#a22929] hover:underline">
                      Forgot password?
                    </button>
                  </div>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-[#c5c4c4] bg-white px-4 py-3 text-[#242228] focus:ring-2 focus:ring-[#ae645c] focus:outline-none shadow-sm"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

                <Button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-[#ae645c] to-[#a22929] text-white py-3.5 text-base font-semibold shadow-lg shadow-[#a22929]/30"
                >
                  {loading ? "Signing In..." : "Sign In"}
                </Button>
              </form>
            )}

            {!isResetMode && (
              <>
                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-white text-gray-500">Or continue with</span>
                  </div>
                </div>

                <Button
                  type="button"
                  variant="outline"
                  disabled={loading}
                  onClick={handleGoogleSignIn}
                  className="w-full border-2 border-gray-300 hover:border-[#a22929] hover:bg-gray-50 py-3.5 text-base font-semibold flex items-center justify-center gap-3"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                  </svg>
                  Sign in with Google
                </Button>
              </>
            )}

            {!isResetMode && (
              <div className="text-sm text-center text-[#242228]/80">
                New here?{" "}
                <Link href="/sign-up" className="text-[#a22929] font-semibold hover:underline">
                  Create your account
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
