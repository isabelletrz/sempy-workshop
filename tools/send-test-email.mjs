#!/usr/bin/env node
/**
 * Send one real email through Resend using the same settings as the app.
 *
 *   node tools/send-test-email.mjs recipient@example.com
 *
 * Reads RESEND_API_KEY / EMAIL_FROM / ORDER_NOTIFICATION_EMAIL from .env.local
 * (falling back to the process environment). Prints the Resend response so you
 * can see exactly why a send failed.
 */
import fs from "node:fs"
import path from "node:path"

const envPath = path.join(process.cwd(), ".env.local")

function loadEnvFile(file) {
  if (!fs.existsSync(file)) return
  for (const rawLine of fs.readFileSync(file, "utf8").split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith("#")) continue
    const eq = line.indexOf("=")
    if (eq === -1) continue
    const key = line.slice(0, eq).trim()
    let value = line.slice(eq + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    if (!(key in process.env)) process.env[key] = value
  }
}

loadEnvFile(envPath)

const to = process.argv[2]
if (!to) {
  console.error("Usage: node tools/send-test-email.mjs recipient@example.com")
  process.exit(1)
}

const apiKey = process.env.RESEND_API_KEY
const from = process.env.EMAIL_FROM || "sempy <onboarding@resend.dev>"
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3001"

if (!apiKey) {
  console.error("RESEND_API_KEY is empty in .env.local — add your key first.")
  process.exit(1)
}

const html = `<!doctype html>
<html><body style="margin:0;padding:32px;background:#08080b;color:#f5f3f7;font-family:Arial,Helvetica,sans-serif;">
  <p style="letter-spacing:6px;font-size:12px;color:#8d8a96;text-transform:uppercase;margin:0;">sempy</p>
  <h1 style="font-size:26px;margin:12px 0;">Resend is wired up.</h1>
  <p style="color:#d8d5df;font-size:15px;line-height:1.6;">
    This message was sent from <strong>${from}</strong> to <strong>${to}</strong>.
    Welcome emails, receipts and order notifications will now go out for real.
  </p>
  <p style="color:#8d8a96;font-size:13px;">Site: ${siteUrl}</p>
</body></html>`

console.log(`Sending from "${from}" to "${to}" …`)

const started = Date.now()
const response = await fetch("https://api.resend.com/emails", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${apiKey}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    from,
    to: [to],
    subject: "sempy · Resend test",
    html,
  }),
})

const body = await response.text()
console.log(`HTTP ${response.status} in ${Date.now() - started} ms`)
console.log(body)

if (!response.ok) {
  console.error("\nDiagnosis hints:")
  if (response.status === 401) console.error("- 401: the API key is invalid or revoked.")
  if (response.status === 403)
    console.error(
      "- 403: with onboarding@resend.dev you can only send to the address that owns the Resend account."
    )
  if (response.status === 422)
    console.error("- 422: check that EMAIL_FROM is a verified sender/domain in Resend.")
  process.exit(1)
}

console.log("\nAccepted by Resend. Check the inbox (and spam) in a few seconds.")
