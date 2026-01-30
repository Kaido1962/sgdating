import { NextResponse } from "next/server"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_MODEL = "gpt-3.5-turbo"

export async function POST(request: Request) {
    if (!OPENAI_API_KEY) {
        return NextResponse.json({ error: "Configuration Error: API Key missing" }, { status: 500 })
    }

    try {
        const { text } = await request.json()

        if (!text) {
            return NextResponse.json({ error: "Text is required" }, { status: 400 })
        }

        const response = await fetch("https://api.openai.com/v1/chat/completions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${OPENAI_API_KEY}`
            },
            body: JSON.stringify({
                model: OPENAI_MODEL,
                messages: [
                    {
                        role: "system",
                        content: `You are a content moderation AI. Analyze the following text for safety. 
                        Categories to detect: "harassment", "hate_speech", "sexual_content", "violence", "scam".
                        Return a JSON object in this format: { "flagged": boolean, "categories": string[], "reason": string | null, "confidence": number }. 
                        If flagged is false, categories should be empty. Confidence should be 0.0 to 1.0.`
                    },
                    {
                        role: "user",
                        content: text
                    }
                ],
                temperature: 0,
                response_format: { type: "json_object" }
            })
        })

        if (!response.ok) {
            const err = await response.json()
            console.error("OpenAI Moderation Error:", err)
            throw new Error("Failed to analyze content")
        }

        const data = await response.json()
        const analysis = JSON.parse(data.choices[0].message.content)

        return NextResponse.json(analysis)

    } catch (error: any) {
        console.error("AI Moderation Error:", error)
        return NextResponse.json({ error: "Analysis failed", details: error.message }, { status: 500 })
    }
}
