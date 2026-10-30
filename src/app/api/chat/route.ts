import { NextResponse } from "next/server"
import { z } from "zod"

export const runtime = "nodejs"

const schema = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(2000),
      })
    )
    .min(1)
    .max(12),
})

const SYSTEM_PROMPT = `You are sempy Assist, the AI customer service assistant for sempy, a shop selling premium seasonal design assets for streamers.

Useful facts:
- Products: overlays, stream screens (Starting Soon, Be Right Back, Offline), full branding kits, panels, alerts, emotes and animated assets.
- A free product exists: "Chrome Starter — Free Stream Kit" (webcam frame, chat box, alerts, Starting Soon and BRB screens), at /products/chrome-starter-free-stream-kit.
- All templates work with OBS Studio, Streamlabs, StreamElements, Twitch, YouTube and Facebook.
- Buyers can preview a template with their own camera and change the username on the product page.
- Delivery is instant by email after checkout. The email contains the product list and download links for each asset.
- Checkout supports guest checkout or creating an account. Payment is currently in development/demo mode, so no real charge is made.
- The Halloween "Haunted Archive" campaign is active until 1 November 2026 with 20% off selected Halloween products.
- Support: customers can reply to their order confirmation email. Never ask for full card numbers, CVC codes or passwords.
- Refunds: digital products; ask the customer to reply to their order email so the team can review the request.

Rules:
- Be concise, friendly and practical (2-4 short sentences).
- Only answer about sempy, its products, compatibility, delivery, previews, accounts, orders and the free kit.
- If you do not know something, say so and point the customer to their order email or the shop.
- Do not invent prices, discounts or policies.`

function fallbackReply(text: string): string {
  const query = text.toLowerCase()

  if (/(free|gratuit)/.test(query)) {
    return "Yes — the Chrome Starter kit is free: it includes a chrome webcam frame, chat box, alert banner, Starting Soon and Be Right Back screens. Open /products/chrome-starter-free-stream-kit, choose Get it free, and the download links arrive by email."
  }
  if (/(obs|streamlabs|streamelements|twitch|youtube|facebook|compat)/.test(query)) {
    return "Every sempy template works with OBS Studio, Streamlabs, StreamElements, Twitch, YouTube and Facebook. The files are standard PNG/SVG/WebM assets you can drop into your scene."
  }
  if (/(download|file|delivery|email|receive|livraison)/.test(query)) {
    return "Delivery is instant by email. After checkout you receive the full product list plus download links for the overlay, webcam frame, chat box, alerts, Starting Soon and Be Right Back screens. Check your spam folder if it is not there within a few minutes."
  }
  if (/(camera|preview|username|aperçu|webcam)/.test(query)) {
    return "On any product page, click “Preview with your camera”. Allow camera access, then edit the username field to see exactly how the webcam frame, chat and alerts will look on your stream. Nothing is recorded."
  }
  if (/(account|guest|compte|checkout|order|commande)/.test(query)) {
    return "You can check out as a guest or create an account. Both options ask for contact and billing details; payment is currently in demo mode. You will receive an order confirmation with all download links by email."
  }
  if (/(refund|return|rembours)/.test(query)) {
    return "For a refund or a problem with an order, reply directly to your order confirmation email with your order number. The team will review it. Do not send card details by email."
  }
  if (/(price|prix|discount|promo|halloween)/.test(query)) {
    return "The Haunted Archive Halloween campaign is live until 1 November 2026 with 20% off selected Halloween products. Prices update automatically on the product pages. The Chrome Starter kit is free."
  }

  return "I can help with templates, compatibility (OBS, Streamlabs, StreamElements, Twitch, YouTube, Facebook), instant email delivery, camera previews, guest/account checkout, the free Chrome Starter kit and order questions. What would you like to know?"
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Invalid message." }, { status: 400 })
  }

  const messages = parsed.data.messages
  const lastUserMessage = [...messages].reverse().find((message) => message.role === "user")?.content ?? ""

  // Provider: OpenRouter (OPENROUTER_API_KEY) or OpenAI (OPENAI_API_KEY). No key = FAQ fallback.
  const openRouterKey = process.env.OPENROUTER_API_KEY
  const openAiKey = process.env.OPENAI_API_KEY
  const apiKey = openRouterKey || openAiKey
  if (!apiKey) {
    return NextResponse.json({ ok: true, reply: fallbackReply(lastUserMessage), simulated: true })
  }

  const endpoint = openRouterKey
    ? "https://openrouter.ai/api/v1/chat/completions"
    : "https://api.openai.com/v1/chat/completions"
  const model = openRouterKey
    ? process.env.OPENROUTER_MODEL || "openai/gpt-4o-mini"
    : process.env.OPENAI_MODEL || "gpt-4o-mini"

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model,
        temperature: 0.4,
        max_tokens: 350,
        messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
      }),
    })

    if (!response.ok) {
      const detail = await response.text()
      console.error("[chat:error]", response.status, detail)
      return NextResponse.json({ ok: true, reply: fallbackReply(lastUserMessage), simulated: true })
    }

    const data = (await response.json()) as {
      choices?: { message?: { content?: string } }[]
    }
    const reply = data.choices?.[0]?.message?.content?.trim()

    return NextResponse.json({
      ok: true,
      reply: reply || fallbackReply(lastUserMessage),
      simulated: false,
    })
  } catch (error) {
    console.error("[chat:error]", error)
    return NextResponse.json({ ok: true, reply: fallbackReply(lastUserMessage), simulated: true })
  }
}
