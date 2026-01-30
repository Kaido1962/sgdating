import { NextResponse } from "next/server"

const OPENAI_API_KEY = process.env.OPENAI_API_KEY
const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-3.5-turbo"
const FALLBACK_MODEL = "gpt-3.5-turbo"

async function callOpenAI(prompt: string, model: string = OPENAI_MODEL) {
  if (!OPENAI_API_KEY) {
    return { reply: null, error: "OPENAI_API_KEY missing" }
  }

  try {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: "You are a friendly dating coach for South African singles. Provide helpful, concise, and encouraging advice about dating, profiles, conversation starters, and local date ideas in South Africa.",
          },
          {
            role: "user",
            content: prompt,
          },
        ],
        max_tokens: 300,
        temperature: 0.7,
      }),
      next: { revalidate: 0 },
    })

    if (!res.ok) {
      const errorData = await res.json().catch(() => ({ error: { message: "Unknown error", code: null } }))
      console.error("OpenAI error", errorData)
      
      const errorCode = errorData.error?.code
      const errorMessage = errorData.error?.message || ""
      
      // Handle quota exceeded error specifically
      if (errorCode === "insufficient_quota" || errorMessage.includes("quota")) {
        return {
          reply: null,
          error: "QUOTA_EXCEEDED",
          details: "Your OpenAI account has no credits or billing is not set up. Even if you haven't used the API, you need to add a payment method and purchase credits. Visit https://platform.openai.com/account/billing to set up billing.",
        }
      }
      
      // If model doesn't exist or access denied, try fallback model
      if (
        (errorMessage.includes("does not exist") || errorMessage.includes("access")) &&
        model !== FALLBACK_MODEL
      ) {
        console.log(`Model ${model} not available, trying fallback ${FALLBACK_MODEL}`)
        return callOpenAI(prompt, FALLBACK_MODEL)
      }
      
      return { reply: null, error: errorMessage || "OpenAI API error" }
    }

    const data = await res.json()
    const reply = data?.choices?.[0]?.message?.content

    if (reply && typeof reply === "string") {
      return { reply: reply.trim(), error: null }
    }

    return { reply: null, error: "OpenAI response had no content" }
  } catch (error) {
    console.error("OpenAI fetch failed", error)
    return { reply: null, error: "OpenAI fetch failed" }
  }
}

export async function POST(request: Request) {
  const { message } = await request.json()

  if (!message || typeof message !== "string") {
    return NextResponse.json({ message: "Message is required" }, { status: 400 })
  }

  const result = await callOpenAI(message)

  if (result.reply) {
    return NextResponse.json({ message: result.reply })
  }

  // Handle specific error cases with user-friendly messages
  let userMessage = "Chat is unavailable right now. Please try again later."
  
  if (result.error === "OPENAI_API_KEY missing") {
    userMessage = "Add OPENAI_API_KEY in your .env.local and restart the dev server."
  } else if (result.error === "QUOTA_EXCEEDED") {
    userMessage = "OpenAI API requires billing setup. Even if you haven't used it yet, you need to add a payment method and purchase credits. Visit https://platform.openai.com/account/billing to set up billing and add credits."
  } else if (result.error) {
    userMessage = `Chat unavailable: ${result.error}`
  }

  return NextResponse.json(
    {
      message: userMessage,
    },
    { status: 500 },
  )
}

