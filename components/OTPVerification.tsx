"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface OTPVerificationProps {
    phoneNumber: string
    onVerify: (code: string) => Promise<boolean>
    onResend: () => Promise<void>
    loading?: boolean
}

export function OTPVerification({ phoneNumber, onVerify, onResend, loading }: OTPVerificationProps) {
    const [otp, setOtp] = useState(["", "", "", "", "", ""])
    const [error, setError] = useState("")
    const [resendTimer, setResendTimer] = useState(60)
    const [canResend, setCanResend] = useState(false)
    const [verifying, setVerifying] = useState(false)

    useEffect(() => {
        if (resendTimer > 0) {
            const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000)
            return () => clearTimeout(timer)
        } else {
            setCanResend(true)
        }
    }, [resendTimer])

    const handleChange = (index: number, value: string) => {
        if (value.length > 1) return
        if (!/^\d*$/.test(value)) return

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)
        setError("")

        // Auto-focus next input
        if (value && index < 5) {
            const nextInput = document.getElementById(`otp-${index + 1}`)
            nextInput?.focus()
        }

        // Auto-verify when all digits entered
        if (index === 5 && value && newOtp.every(digit => digit !== "")) {
            handleVerify(newOtp.join(""))
        }
    }

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === "Backspace" && !otp[index] && index > 0) {
            const prevInput = document.getElementById(`otp-${index - 1}`)
            prevInput?.focus()
        }
    }

    const handleVerify = async (code?: string) => {
        const otpCode = code || otp.join("")
        if (otpCode.length !== 6) {
            setError("Please enter all 6 digits")
            return
        }

        setVerifying(true)
        setError("")

        try {
            const success = await onVerify(otpCode)
            if (!success) {
                setError("Invalid verification code. Please try again.")
                setOtp(["", "", "", "", "", ""])
                document.getElementById("otp-0")?.focus()
            }
        } catch (err: any) {
            setError(err.message || "Verification failed. Please try again.")
            setOtp(["", "", "", "", "", ""])
            document.getElementById("otp-0")?.focus()
        } finally {
            setVerifying(false)
        }
    }

    const handleResend = async () => {
        setCanResend(false)
        setResendTimer(60)
        setOtp(["", "", "", "", "", ""])
        setError("")
        await onResend()
    }

    return (
        <div className="space-y-6">
            <div className="text-center">
                <h3 className="text-lg font-semibold text-[#242228] mb-2">Verify Your Phone Number</h3>
                <p className="text-sm text-gray-600">
                    We've sent a 6-digit code to <span className="font-semibold">{phoneNumber}</span>
                </p>
            </div>

            <div className="flex justify-center gap-2">
                {otp.map((digit, index) => (
                    <input
                        key={index}
                        id={`otp-${index}`}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        disabled={loading || verifying}
                        className="w-12 h-14 text-center text-2xl font-bold border-2 border-gray-300 rounded-lg focus:border-[#a22929] focus:outline-none focus:ring-2 focus:ring-[#a22929]/20 disabled:bg-gray-100"
                    />
                ))}
            </div>

            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-center">
                    <p className="text-sm text-red-600 font-medium">{error}</p>
                </div>
            )}

            <div className="text-center space-y-3">
                <Button
                    onClick={() => handleVerify()}
                    disabled={otp.some(d => !d) || verifying || loading}
                    className="w-full bg-gradient-to-r from-[#ae645c] to-[#a22929] text-white py-3 text-base font-semibold"
                >
                    {verifying ? "Verifying..." : "Verify Code"}
                </Button>

                <div className="text-sm text-gray-600">
                    {canResend ? (
                        <button
                            onClick={handleResend}
                            className="text-[#a22929] font-semibold hover:underline"
                        >
                            Resend Code
                        </button>
                    ) : (
                        <span>Resend code in {resendTimer}s</span>
                    )}
                </div>
            </div>
        </div>
    )
}
