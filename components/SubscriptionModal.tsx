"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Check, Star, Crown, Loader2, Zap, Copy, X } from "lucide-react"
import { toast } from "sonner"
import { useAuth } from "@/context/AuthContext"

interface SubscriptionModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
}

export function SubscriptionModal({ open, onOpenChange }: SubscriptionModalProps) {
    const [loading, setLoading] = useState<"starter" | "plus" | "premium" | "vip" | null>(null)
    const [paymentReference, setPaymentReference] = useState<string | null>(null)
    const [selectedPlan, setSelectedPlan] = useState<string | null>(null)
    const { user } = useAuth()

    const generatePaymentReference = () => {
        const timestamp = Date.now()
        const userSlice = user?.uid?.slice(0, 6).toUpperCase() || "GUEST"
        return `SG-${timestamp}-${userSlice}`
    }

    const handleSubscribe = (plan: "starter" | "plus" | "premium" | "vip", planName: string) => {
        const reference = generatePaymentReference()
        setPaymentReference(reference)
        setSelectedPlan(planName)
        setLoading(plan)

        // Auto-dismiss loading after showing reference
        setTimeout(() => {
            setLoading(null)
        }, 1000)
    }

    const handleCopyReference = () => {
        if (paymentReference) {
            navigator.clipboard.writeText(paymentReference)
            toast.success("Payment reference copied!", { description: "Paste it when making your payment" })
        }
    }

    const handleClosePaymentView = () => {
        setPaymentReference(null)
        setSelectedPlan(null)
        onOpenChange(false)
    }

    const plans = [
        {
            id: "premium_access",
            name: "Premium Access",
            price: "R100",
            features: [
                "Unlimited daily likes",
                "See who liked you",
                "Read receipts",
                "Profile Boosts included",
                "AI match recommendations",
                "Priority support",
                "Verified Badge"
            ],
            color: "text-[#a22929]",
            borderColor: "border-[#a22929]",
            btnVariant: "default" as const,
            popular: true,
        }
    ]

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl bg-gray-50 p-0 overflow-y-auto max-h-[90vh] sm:rounded-3xl border-none">
                {paymentReference ? (
                    <div className="flex flex-col h-full bg-white">
                        <div className="bg-[#a22929] p-6 text-white flex items-center justify-between">
                            <div>
                                <h2 className="text-2xl font-bold flex items-center gap-2">
                                    <Crown className="w-6 h-6 text-yellow-400" />
                                    Manual Payment Required
                                </h2>
                                <p className="text-white/80">Complete your Premium Access subscription</p>
                            </div>
                            <Button variant="ghost" className="text-white hover:bg-white/20" onClick={handleClosePaymentView}>
                                <X className="w-6 h-6" />
                            </Button>
                        </div>

                        <div className="p-8 max-w-2xl mx-auto w-full space-y-8">
                            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-6 text-center space-y-4">
                                <h3 className="font-bold text-gray-800 text-lg">Use this as your payment reference</h3>
                                <div className="flex items-center justify-center gap-3">
                                    <span className="font-mono text-3xl font-bold text-[#a22929] tracking-wider bg-white px-4 py-2 rounded-lg border border-dashed border-[#a22929]">
                                        {paymentReference}
                                    </span>
                                    <Button size="icon" variant="outline" onClick={handleCopyReference}>
                                        <Copy className="w-4 h-4" />
                                    </Button>
                                </div>
                                <p className="text-sm text-gray-600">
                                    IMPORTANT: You MUST use this reference for your payment to be allocated correctly.
                                </p>
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-bold text-gray-800 text-lg border-b pb-2">Banking Details</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
                                    <div className="space-y-1">
                                        <p className="text-gray-500">Bank Name</p>
                                        <p className="font-semibold text-lg text-[#242228]">Capitec Bank</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-gray-500">Account Holder</p>
                                        <p className="font-semibold text-lg text-[#242228]">Guardian Angel Studios</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-gray-500">Account Number</p>
                                        <p className="font-semibold text-lg text-[#242228]">123 456 7890</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-gray-500">Branch Code</p>
                                        <p className="font-semibold text-lg text-[#242228]">470010</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-gray-500">Amount to Pay</p>
                                        <p className="font-semibold text-lg text-[#a22929]">R100.00</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-xl text-sm text-blue-800 space-y-2">
                                <p className="font-bold flex items-center gap-2">
                                    <Zap className="w-4 h-4" /> What happens next?
                                </p>
                                <ul className="list-disc list-inside space-y-1 ml-1 opacity-90">
                                    <li>Make the payment using your banking app.</li>
                                    <li>Use the reference number above.</li>
                                    <li>Your subscription will be activated automatically once funds clear (usually 24-48h).</li>
                                    <li>Send proof of payment to payments@sgdating.com for faster activation.</li>
                                </ul>
                            </div>

                            <div className="pt-4 flex gap-3">
                                <Button className="w-full bg-[#a22929] hover:bg-[#8b2323] text-white py-6" onClick={handleClosePaymentView}>
                                    I Have Made Payment
                                </Button>
                                <Button variant="outline" className="w-full py-6" onClick={handleClosePaymentView}>
                                    I'll Pay Later
                                </Button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <>
                        <div className="bg-[#a22929] p-6 text-center text-white">
                            <Crown className="mx-auto h-12 w-12 text-yellow-400 mb-4" />
                            <DialogTitle className="text-3xl font-bold">Upgrade to Premium</DialogTitle>
                            <DialogDescription className="text-white/80 mt-2 text-lg">
                                Unlock the full potential of SG Dating App.
                            </DialogDescription>
                        </div>

                        <div className="p-8 flex justify-center">
                            {plans.map((plan) => (
                                <div
                                    key={plan.id}
                                    className="rounded-3xl border-2 border-[#a22929] bg-white p-8 shadow-xl relative flex flex-col max-w-md w-full ring-4 ring-[#a22929]/10"
                                >
                                    <div className="absolute top-0 right-0 left-0 -mt-4 flex justify-center">
                                        <span className="bg-[#a22929] text-white px-4 py-1 rounded-full text-sm font-bold shadow-md uppercase tracking-wide">
                                            All-Inclusive Access
                                        </span>
                                    </div>

                                    <div className="text-center mb-6 mt-4">
                                        <h3 className="text-2xl font-bold text-gray-800 mb-2">{plan.name}</h3>
                                        <div className="flex items-center justify-center gap-1">
                                            <span className="text-5xl font-bold text-[#a22929]">{plan.price}</span>
                                            <span className="text-gray-500 font-medium self-end mb-2">/month</span>
                                        </div>
                                    </div>

                                    <ul className="space-y-4 mb-8 flex-1">
                                        {plan.features.map((feature, idx) => (
                                            <li key={idx} className="flex items-center gap-3 text-gray-700">
                                                <div className="bg-[#a22929]/10 p-1 rounded-full text-[#a22929]">
                                                    <Check className="h-4 w-4 stroke-[3]" />
                                                </div>
                                                <span className="font-medium">{feature}</span>
                                            </li>
                                        ))}
                                    </ul>

                                    <Button
                                        onClick={() => handleSubscribe(plan.id as any, plan.name)}
                                        disabled={!!loading}
                                        className="w-full bg-gradient-to-r from-[#a22929] to-[#8b2323] hover:opacity-90 text-white py-6 text-lg shadow-lg shadow-[#a22929]/20"
                                    >
                                        {loading === plan.id ? (
                                            <Loader2 className="h-5 w-5 animate-spin" />
                                        ) : (
                                            "Get Premium Access"
                                        )}
                                    </Button>
                                    <p className="text-xs text-center text-gray-400 mt-4">
                                        Secure manual payment via EFT. Cancel anytime.
                                    </p>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
