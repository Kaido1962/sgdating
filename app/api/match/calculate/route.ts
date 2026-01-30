import { NextResponse } from "next/server"
import { doc, getDoc } from "firebase/firestore"
import { db } from "@/lib/firebase"
import { calculateMatchScore } from "@/utils/matching"

export async function POST(request: Request) {
    try {
        const { currentUser, candidates } = await request.json()

        if (!currentUser || !candidates || !Array.isArray(candidates)) {
            return NextResponse.json({ error: "Invalid request data" }, { status: 400 })
        }

        // Fetch AI config from Firestore
        const configRef = doc(db, "system_settings", "ai_config")
        const configSnap = await getDoc(configRef)

        const weights = configSnap.exists()
            ? configSnap.data().matchingWeights || { geo: 80, interest: 50 }
            : { geo: 80, interest: 50 }

        // Calculate scores for all candidates
        const scoredMatches = candidates.map(candidate =>
            calculateMatchScore(currentUser, candidate, weights)
        )

        // Sort by score descending
        const rankedMatches = scoredMatches.sort((a, b) => b.score - a.score)

        return NextResponse.json({ matches: rankedMatches })

    } catch (error: any) {
        console.error("Match calculation error:", error)
        return NextResponse.json({ error: "Failed to calculate matches", details: error.message }, { status: 500 })
    }
}
