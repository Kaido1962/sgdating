"use client"

import { useEffect, useState } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { applyActionCode } from "firebase/auth"
import { auth } from "@/lib/firebase"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { CheckCircle2, XCircle, Loader2 } from "lucide-react"

export default function VerifyEmailPage() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [status, setStatus] = useState<"loading" | "success" | "error">("loading")
    const [errorMessage, setErrorMessage] = useState("")
    const [countdown, setCountdown] = useState(5)

    useEffect(() => {
        const verifyEmail = async () => {
            const oobCode = searchParams.get("oobCode")
            const mode = searchParams.get("mode")

            // Check if this is an email verification link
            if (mode !== "verifyEmail" || !oobCode) {
                setStatus("error")
                setErrorMessage("Invalid verification link. Please check your email and try again.")
                return
            }

            try {
                // Apply the verification code
                await applyActionCode(auth, oobCode)
                setStatus("success")

                // Start countdown for redirect
                let timeLeft = 5
                const timer = setInterval(() => {
                    timeLeft -= 1
                    setCountdown(timeLeft)

                    if (timeLeft <= 0) {
                        clearInterval(timer)
                        router.push("/sign-in")
                    }
                }, 1000)

                return () => clearInterval(timer)
            } catch (error: any) {
                console.error("Email verification error:", error)
                setStatus("error")

                // Provide user-friendly error messages
                if (error.code === "auth/expired-action-code") {
                    setErrorMessage("This verification link has expired. Please sign up again to receive a new link.")
                } else if (error.code === "auth/invalid-action-code") {
                    setErrorMessage("This verification link is invalid or has already been used.")
                } else if (error.code === "auth/user-disabled") {
                    setErrorMessage("This account has been disabled. Please contact support.")
                } else {
                    setErrorMessage("Failed to verify email. Please try again or contact support.")
                }
            }
        }

        verifyEmail()
    }, [searchParams, router])

    return (
        <div className="min-h-screen bg-gradient-to-br from-white via-[#c5c4c4]/40 to-white flex items-center justify-center px-4">
            <div className="max-w-md w-full bg-white rounded-3xl shadow-2xl border border-[#c5c4c4]/60 p-10 space-y-6">
                {status === "loading" && (
                    <>
                        <div className="flex justify-center">
                            <Loader2 className="w-16 h-16 text-[#ae645c] animate-spin" />
                        </div>
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold text-[#242228]">Verifying Your Email</h2>
                            <p className="text-[#242228]/70">Please wait while we verify your email address...</p>
                        </div>
                    </>
                )}

                {status === "success" && (
                    <>
                        <div className="flex justify-center">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                                <CheckCircle2 className="w-10 h-10 text-green-600" />
                            </div>
                        </div>
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold text-[#242228]">Email Verified!</h2>
                            <p className="text-[#242228]/70">
                                Your email has been successfully verified. You can now sign in to your account.
                            </p>
                            <p className="text-sm text-[#ae645c] font-medium pt-2">
                                Redirecting to login in {countdown} seconds...
                            </p>
                        </div>
                        <Button
                            onClick={() => router.push("/sign-in")}
                            className="w-full bg-gradient-to-r from-[#ae645c] to-[#a22929] text-white py-3.5 text-base font-semibold shadow-lg shadow-[#a22929]/30"
                        >
                            Go to Login Now
                        </Button>
                    </>
                )}

                {status === "error" && (
                    <>
                        <div className="flex justify-center">
                            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                                <XCircle className="w-10 h-10 text-red-600" />
                            </div>
                        </div>
                        <div className="text-center space-y-2">
                            <h2 className="text-2xl font-bold text-[#242228]">Verification Failed</h2>
                            <p className="text-[#242228]/70">{errorMessage}</p>
                        </div>
                        <div className="space-y-3">
                            <Link href="/sign-up" className="block">
                                <Button className="w-full bg-gradient-to-r from-[#ae645c] to-[#a22929] text-white py-3.5 text-base font-semibold shadow-lg shadow-[#a22929]/30">
                                    Sign Up Again
                                </Button>
                            </Link>
                            <Link href="/sign-in" className="block">
                                <Button variant="outline" className="w-full border-[#c5c4c4] text-[#242228] py-3.5 text-base font-semibold">
                                    Back to Login
                                </Button>
                            </Link>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
}
