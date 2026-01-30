"use client"

import React from "react"
import Link from "next/link"
import { Shield, FileText, Lock, Mail } from "lucide-react"

interface ConsentFormProps {
    consents: {
        popia: boolean
        gdpr: boolean
        terms: boolean
        privacy: boolean
        marketing: boolean
    }
    onConsentChange: (key: string, value: boolean) => void
    errors?: Record<string, string>
}

export function ConsentForm({ consents, onConsentChange, errors }: ConsentFormProps) {
    const requiredConsents = [
        {
            key: "popia",
            label: "POPIA Compliance",
            description: "I consent to the processing of my personal information in accordance with the Protection of Personal Information Act (POPIA)",
            icon: Shield,
            required: true,
            link: "/privacy"
        },
        {
            key: "terms",
            label: "Terms of Service",
            description: "I have read and agree to the Terms of Service",
            icon: FileText,
            required: true,
            link: "/terms"
        },
        {
            key: "privacy",
            label: "Privacy Policy",
            description: "I have read and agree to the Privacy Policy",
            icon: Lock,
            required: true,
            link: "/privacy"
        }
    ]

    const optionalConsents = [
        {
            key: "gdpr",
            label: "GDPR Compliance (International Users)",
            description: "I consent to the processing of my personal data in accordance with GDPR",
            icon: Shield,
            required: false
        },
        {
            key: "marketing",
            label: "Marketing Communications",
            description: "I would like to receive updates, promotions, and dating tips via email",
            icon: Mail,
            required: false
        }
    ]

    return (
        <div className="space-y-6">
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-start gap-3">
                    <Shield className="w-5 h-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div>
                        <p className="text-sm font-semibold text-blue-900">Your Privacy Matters</p>
                        <p className="text-xs text-blue-700 mt-1">
                            We take your privacy seriously. Please review and accept the following to continue.
                        </p>
                    </div>
                </div>
            </div>

            {/* Required Consents */}
            <div className="space-y-4">
                <h3 className="text-sm font-semibold text-[#242228] flex items-center gap-2">
                    <span className="text-red-500">*</span>
                    Required Consents
                </h3>

                {requiredConsents.map((consent) => {
                    const Icon = consent.icon
                    return (
                        <div key={consent.key} className="space-y-2">
                            <label className="flex items-start gap-3 cursor-pointer group">
                                <input
                                    type="checkbox"
                                    checked={consents[consent.key as keyof typeof consents]}
                                    onChange={(e) => onConsentChange(consent.key, e.target.checked)}
                                    className="mt-1 w-4 h-4 text-[#a22929] border-gray-300 rounded focus:ring-[#a22929] focus:ring-2"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <Icon className="w-4 h-4 text-[#a22929]" />
                                        <span className="text-sm font-medium text-[#242228] group-hover:text-[#a22929] transition-colors">
                                            {consent.label}
                                            <span className="text-red-500 ml-1">*</span>
                                        </span>
                                    </div>
                                    <p className="text-xs text-gray-600 mt-1">
                                        {consent.description}{" "}
                                        {consent.link && (
                                            <Link
                                                href={consent.link}
                                                target="_blank"
                                                className="text-[#a22929] hover:underline font-medium"
                                            >
                                                Read more
                                            </Link>
                                        )}
                                    </p>
                                </div>
                            </label>
                            {errors?.[consent.key] && (
                                <p className="text-xs text-red-600 ml-7">{errors[consent.key]}</p>
                            )}
                        </div>
                    )
                })}
            </div>

            {/* Optional Consents */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
                <h3 className="text-sm font-semibold text-[#242228]">
                    Optional Preferences
                </h3>

                {optionalConsents.map((consent) => {
                    const Icon = consent.icon
                    return (
                        <label key={consent.key} className="flex items-start gap-3 cursor-pointer group">
                            <input
                                type="checkbox"
                                checked={consents[consent.key as keyof typeof consents]}
                                onChange={(e) => onConsentChange(consent.key, e.target.checked)}
                                className="mt-1 w-4 h-4 text-[#a22929] border-gray-300 rounded focus:ring-[#a22929] focus:ring-2"
                            />
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <Icon className="w-4 h-4 text-gray-500" />
                                    <span className="text-sm font-medium text-[#242228] group-hover:text-[#a22929] transition-colors">
                                        {consent.label}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-600 mt-1">{consent.description}</p>
                            </div>
                        </label>
                    )
                })}
            </div>

            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mt-4">
                <p className="text-xs text-gray-600">
                    <span className="font-semibold">Your Rights:</span> You can withdraw your consent at any time by contacting us or updating your preferences in your account settings. For more information about how we handle your data, please review our Privacy Policy.
                </p>
            </div>
        </div>
    )
}
