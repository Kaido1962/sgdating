"use client"

import React from "react"
import { Check } from "lucide-react"

interface ProgressIndicatorProps {
    currentStep: number
    totalSteps: number
    steps: string[]
}

export function ProgressIndicator({ currentStep, totalSteps, steps }: ProgressIndicatorProps) {
    return (
        <div className="w-full mb-8">
            <div className="flex items-center justify-between">
                {steps.map((step, index) => {
                    const stepNumber = index + 1
                    const isCompleted = stepNumber < currentStep
                    const isCurrent = stepNumber === currentStep
                    const isUpcoming = stepNumber > currentStep

                    return (
                        <React.Fragment key={stepNumber}>
                            <div className="flex flex-col items-center flex-1">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold text-sm transition-all ${isCompleted
                                            ? "bg-[#a22929] text-white"
                                            : isCurrent
                                                ? "bg-[#a22929] text-white ring-4 ring-[#a22929]/20"
                                                : "bg-gray-200 text-gray-500"
                                        }`}
                                >
                                    {isCompleted ? <Check className="w-5 h-5" /> : stepNumber}
                                </div>
                                <span
                                    className={`text-xs mt-2 text-center font-medium hidden sm:block ${isCurrent ? "text-[#a22929]" : isCompleted ? "text-gray-700" : "text-gray-400"
                                        }`}
                                >
                                    {step}
                                </span>
                            </div>
                            {stepNumber < totalSteps && (
                                <div className="flex-1 h-1 mx-2 -mt-8">
                                    <div
                                        className={`h-full rounded transition-all ${isCompleted ? "bg-[#a22929]" : "bg-gray-200"
                                            }`}
                                    />
                                </div>
                            )}
                        </React.Fragment>
                    )
                })}
            </div>
        </div>
    )
}
