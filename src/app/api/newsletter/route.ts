import { NextResponse } from "next/server"
import { z } from "zod"
import { escapeHtml, getOwnerEmail, sendEmail, welcomeEmailHtml } from "@/lib/email"

export const runtime = "nodejs"

const schema = z.object({
  email: z.string().email().max(200),
})

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Please enter a valid email address." }, { status: 400 })
  }

  const email = parsed.data.email.toLowerCase()
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin

  const welcome = await sendEmail({
    to: email,
    subject: "Welcome to sempy",
    html: welcomeEmailHtml(siteUrl),
  })

  if (!welcome.ok) {
    return NextResponse.json(
      { ok: false, error: "The welcome email could not be sent. Please try again." },
      { status: 502 }
    )
  }

  await sendEmail({
    to: getOwnerEmail(),
    subject: `New newsletter subscriber: ${email}`,
    html: `<p style="font-family:Arial,sans-serif;color:#111;">New subscriber: <strong>${escapeHtml(email)}</strong></p>`,
  })

  return NextResponse.json({ ok: true, simulated: welcome.simulated })
}
