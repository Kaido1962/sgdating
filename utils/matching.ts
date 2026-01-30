// AI-Powered Matching Utility
// Calculates compatibility scores based on geographic distance and interest overlap

interface UserProfile {
    uid: string
    displayName: string
    age: number | null
    gender: string
    location: string
    bio: string
    interests?: string[]
    latitude?: number
    longitude?: number
    photoURL?: string
}

interface MatchingWeights {
    geo: number // 0-100
    interest: number // 0-100
}

interface ScoredMatch extends UserProfile {
    score: number
    geoScore: number
    interestScore: number
}

/**
 * Calculate geographic distance score (0-100)
 * Higher score = closer distance
 */
function calculateGeoScore(user1: UserProfile, user2: UserProfile): number {
    // If no coordinates, use location string similarity as fallback
    if (!user1.latitude || !user1.longitude || !user2.latitude || !user2.longitude) {
        const loc1 = user1.location?.toLowerCase() || ""
        const loc2 = user2.location?.toLowerCase() || ""

        if (loc1 === loc2) return 100
        if (loc1.includes(loc2) || loc2.includes(loc1)) return 70
        return 30 // Default moderate score if no location data
    }

    // Haversine formula for distance
    const R = 6371 // Earth's radius in km
    const dLat = toRad(user2.latitude - user1.latitude)
    const dLon = toRad(user2.longitude - user1.longitude)

    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(toRad(user1.latitude)) * Math.cos(toRad(user2.latitude)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const distance = R * c // Distance in km

    // Convert distance to score (closer = higher score)
    // 0-10km = 100, 10-50km = 80, 50-100km = 60, 100-200km = 40, 200+km = 20
    if (distance < 10) return 100
    if (distance < 50) return 80
    if (distance < 100) return 60
    if (distance < 200) return 40
    return 20
}

function toRad(degrees: number): number {
    return degrees * (Math.PI / 180)
}

/**
 * Calculate interest overlap score (0-100)
 * Based on common interests/tags
 */
function calculateInterestScore(user1: UserProfile, user2: UserProfile): number {
    const interests1 = user1.interests || []
    const interests2 = user2.interests || []

    if (interests1.length === 0 || interests2.length === 0) {
        // Fallback: Use bio text similarity
        return calculateBioSimilarity(user1.bio || "", user2.bio || "")
    }

    const common = interests1.filter(i => interests2.includes(i))
    const total = new Set([...interests1, ...interests2]).size

    if (total === 0) return 50 // Neutral if no interests

    const overlapRatio = common.length / total
    return Math.round(overlapRatio * 100)
}

/**
 * Simple bio text similarity (keyword matching)
 */
function calculateBioSimilarity(bio1: string, bio2: string): number {
    if (!bio1 || !bio2) return 50

    const words1 = bio1.toLowerCase().split(/\s+/).filter(w => w.length > 3)
    const words2 = bio2.toLowerCase().split(/\s+/).filter(w => w.length > 3)

    const common = words1.filter(w => words2.includes(w))
    const total = new Set([...words1, ...words2]).size

    if (total === 0) return 50

    const similarity = common.length / total
    return Math.round(similarity * 100)
}

/**
 * Calculate overall compatibility score
 */
export function calculateMatchScore(
    currentUser: UserProfile,
    candidate: UserProfile,
    weights: MatchingWeights
): ScoredMatch {
    const geoScore = calculateGeoScore(currentUser, candidate)
    const interestScore = calculateInterestScore(currentUser, candidate)

    // Normalize weights to percentages
    const geoWeight = weights.geo / 100
    const interestWeight = weights.interest / 100
    const totalWeight = geoWeight + interestWeight

    // Calculate weighted score
    const score = totalWeight > 0
        ? ((geoScore * geoWeight) + (interestScore * interestWeight)) / totalWeight
        : 50 // Default neutral score

    return {
        ...candidate,
        score: Math.round(score),
        geoScore,
        interestScore
    }
}

/**
 * Rank and sort matches by compatibility
 */
export function rankMatches(
    currentUser: UserProfile,
    candidates: UserProfile[],
    weights: MatchingWeights
): ScoredMatch[] {
    const scored = candidates.map(candidate =>
        calculateMatchScore(currentUser, candidate, weights)
    )

    // Sort by score descending
    return scored.sort((a, b) => b.score - a.score)
}
