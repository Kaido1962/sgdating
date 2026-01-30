"use client"

import React, { useState, useEffect } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { AlertCircle, CheckCircle2 } from "lucide-react"

interface AgeVerificationProps {
    onDateChange: (date: Date | null, isValid: boolean) => void
    error?: string
}

export function AgeVerification({ onDateChange, error }: AgeVerificationProps) {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null)
    const [age, setAge] = useState<number | null>(null)
    const [isValid, setIsValid] = useState(false)

    const calculateAge = (birthDate: Date): number => {
        const today = new Date()
        let age = today.getFullYear() - birthDate.getFullYear()
        const monthDiff = today.getMonth() - birthDate.getMonth()

        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            age--
        }

        return age
    }

    useEffect(() => {
        if (selectedDate) {
            const calculatedAge = calculateAge(selectedDate)
            setAge(calculatedAge)
            const valid = calculatedAge >= 18
            setIsValid(valid)
            onDateChange(selectedDate, valid)
        } else {
            setAge(null)
            setIsValid(false)
            onDateChange(null, false)
        }
    }, [selectedDate])

    const maxDate = new Date()
    maxDate.setFullYear(maxDate.getFullYear() - 18)

    const minDate = new Date()
    minDate.setFullYear(minDate.getFullYear() - 100)

    return (
        <div className="space-y-4">
            <div>
                <label className="text-sm font-medium text-[#242228] block mb-2">
                    Date of Birth
                </label>
                <DatePicker
                    selected={selectedDate}
                    onChange={(date) => setSelectedDate(date)}
                    dateFormat="dd/MM/yyyy"
                    showYearDropdown
                    showMonthDropdown
                    dropdownMode="select"
                    maxDate={new Date()}
                    minDate={minDate}
                    placeholderText="Select your date of birth"
                    className="w-full rounded-xl border border-[#c5c4c4] bg-white px-4 py-3 text-[#242228] focus:ring-2 focus:ring-[#ae645c] focus:outline-none shadow-sm"
                    wrapperClassName="w-full"
                />
                {error && <p className="text-sm text-red-600 font-medium mt-2">{error}</p>}
            </div>

            {age !== null && (
                <div className={`rounded-xl p-4 border-2 ${isValid
                        ? "bg-green-50 border-green-200"
                        : "bg-red-50 border-red-200"
                    }`}>
                    <div className="flex items-start gap-3">
                        {isValid ? (
                            <CheckCircle2 className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                        ) : (
                            <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" />
                        )}
                        <div className="flex-1">
                            <p className={`font-semibold text-sm ${isValid ? "text-green-800" : "text-red-800"
                                }`}>
                                {isValid ? "Age Verified" : "Age Requirement Not Met"}
                            </p>
                            <p className={`text-sm mt-1 ${isValid ? "text-green-700" : "text-red-700"
                                }`}>
                                {isValid
                                    ? `You are ${age} years old. You meet the minimum age requirement.`
                                    : `You are ${age} years old. You must be at least 18 years old to use SG Dating App.`
                                }
                            </p>
                            {!isValid && (
                                <p className="text-xs text-red-600 mt-2">
                                    This requirement is in accordance with South African law and our Terms of Service.
                                </p>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {!selectedDate && (
                <div className="bg-gray-50 border border-gray-200 rounded-xl p-4">
                    <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <div>
                            <p className="text-sm font-medium text-gray-700">Age Verification Required</p>
                            <p className="text-xs text-gray-600 mt-1">
                                You must be at least 18 years old to create an account on SG Dating App.
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
