// Extensive list of banned words/phrases for Hate Speech, Harassment, Sexual Content, Violence
// This acts as a fallback or base list.
const STATIC_BANNED_WORDS = [
    // Violence / Threat
    "kill you", "murder", "die", "stab", "shoot you", "beat you", "break your",
    "hurt you", "punch", "kick you", "slap", "execute", "massacre", "bomb",
    "terrorist", "suicide", "end it all", "hang yourself", "cut yourself",
    "gun", "knife", "weapon", "bullet", "assassinate", "annihilate", "destroy you",

    // Hate Speech / Slurs
    "nigger", "nigga", "faggot", "dyke", "tranny", "retard", "spic", "kike", "chink",
    "wetback", "gook", "coon", "jungle bunny", "porch monkey", "sand nigger", "raghead",
    "fag", "homo", "lesbo", "sodomite", "trannie", "shemale", "shim",
    "mongoloid", "cripple", "vegetable", "tard",
    "white trash", "cracker", "redneck", "hillbilly",
    "whore", "slut", "bitch", "cunt", "skank", "slag",
    "rapist", "molester", "pedophile", "pedo", "groomer",

    // Sexual Content / Harassment
    "sex", "naked", "nude", "horny", "fuck", "suck", "dick", "pussy", "cock",
    "vagina", "boobs", "tits", "penis", "anal", "oral", "cum", "ejaculate", "orgasm",
    "masturbate", "jerk off", "finger yourself", "porn", "xxx", "bobs", "vagene",
    "send nudes", "show me", "open up", "strip", "undress",
    "hookup", "friends with benefits", "fwb", "ons", "one night stand",
    "sugar daddy", "sugar baby", "escort", "prostitute", "pay for sex",

    // Harassment / Bullying
    "stupid", "idiot", "dumb", "ugly", "fat", "loser", "waste of space", "useless",
    "nobody likes you", "go away", "creep", "weirdo", "stalker", "psycho", "crazy",
    "mental", "insane", "disgusting", "gross", "nasty", "filthy", "dirty",
    "shut up", "hate you", "despise you", "loathe", "abomination",

    // Scams / Spam
    "cash app", "venmo", "western union", "send money", "gift card", "crypto", "bitcoin",
    "investment", "forex", "binary options", "sugar momma", "allowance", "paypal",
    "bank account", "router", "verification code", "whatsapp number", "text me on",
]

export const checkContent = (text: string, dynamicBannedWords: string[] = []): { flagged: boolean; reason?: string } => {
    const lowerText = text.toLowerCase()
    const allBannedWords = [...STATIC_BANNED_WORDS, ...dynamicBannedWords]

    for (const word of allBannedWords) {
        if (word && lowerText.includes(word.toLowerCase())) {
            return { flagged: true, reason: "Keyword Violation: " + word }
        }
    }
    return { flagged: false }
}

export const analyzeContentWithAI = async (text: string): Promise<{ flagged: boolean; reason?: string; categories?: string[] }> => {
    try {
        const response = await fetch("/api/moderation/analyze", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ text })
        })

        if (!response.ok) {
            console.warn("AI Moderation Check failed, allowing content.")
            return { flagged: false } // Fail open to avoid blocking valid chats if AI is down
        }

        const data = await response.json()

        if (data.flagged) {
            return {
                flagged: true,
                reason: data.reason || `AI detected: ${data.categories?.join(", ")}`,
                categories: data.categories
            }
        }

        return { flagged: false }

    } catch (error) {
        console.error("Error analyzing content with AI:", error)
        return { flagged: false }
    }
}
