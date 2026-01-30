"use client"

import React from "react"
import PhoneInput from "react-phone-number-input"
import "react-phone-number-input/style.css"
import { E164Number } from "libphonenumber-js/core"

interface PhoneNumberInputProps {
    value: E164Number | undefined
    onChange: (value: E164Number | undefined) => void
    error?: string
    disabled?: boolean
}

export function PhoneNumberInput({ value, onChange, error, disabled }: PhoneNumberInputProps) {
    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-[#242228]">Phone Number</label>
            <PhoneInput
                international
                defaultCountry="ZA"
                value={value}
                onChange={onChange}
                disabled={disabled}
                className="w-full rounded-xl border border-[#c5c4c4] bg-white px-4 py-3 text-[#242228] focus:ring-2 focus:ring-[#ae645c] focus:outline-none shadow-sm"
                numberInputProps={{
                    className: "w-full bg-transparent border-none focus:outline-none focus:ring-0 text-[#242228]"
                }}
            />
            {error && <p className="text-sm text-red-600 font-medium">{error}</p>}
            <p className="text-xs text-gray-500">We'll send you a verification code via SMS</p>
        </div>
    )
}
