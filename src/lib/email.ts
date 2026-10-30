export interface EmailOrderItem {
  name: string
  quantity: number
  price: number
}

export interface EmailOrder {
  orderId: string
  customerName: string
  customerEmail: string
  phone?: string
  address: string
  city: string
  postalCode: string
  country: string
  mode: "guest" | "create"
  items: EmailOrderItem[]
  total: number
  isFree: boolean
  paymentLast4?: string
  paymentBrand?: string
}

export interface EmailAssetLink {
  label: string
  url: string
}

interface SendEmailInput {
  to: string | string[]
  subject: string
  html: string
  replyTo?: string
}

const DEFAULT_FROM = "sempy <onboarding@resend.dev>"

export function getOwnerEmail(): string {
  return process.env.ORDER_NOTIFICATION_EMAIL || "isabelle.trzopek@mail-ecv.fr"
}

export function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;")
}

export async function sendEmail({ to, subject, html, replyTo }: SendEmailInput) {
  const apiKey = process.env.RESEND_API_KEY
  const from = process.env.EMAIL_FROM || DEFAULT_FROM

  if (!apiKey) {
    console.info(`[email:simulated] to=${Array.isArray(to) ? to.join(",") : to} subject="${subject}"`)
    return { ok: true, simulated: true as const }
  }

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(to) ? to : [to],
        subject,
        html,
        ...(replyTo ? { reply_to: replyTo } : {}),
      }),
    })

    if (!response.ok) {
      const detail = await response.text()
      console.error("[email:error]", response.status, detail)
      return { ok: false, simulated: false as const, error: detail }
    }

    return { ok: true, simulated: false as const }
  } catch (error) {
    console.error("[email:error]", error)
    return {
      ok: false,
      simulated: false as const,
      error: error instanceof Error ? error.message : "Unknown email error",
    }
  }
}

function layout(title: string, body: string): string {
  return `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#08080b;color:#f5f3f7;font-family:Inter,Arial,Helvetica,sans-serif;">
    <div style="max-width:620px;margin:0 auto;padding:32px 20px;">
      <div style="text-align:center;padding-bottom:24px;">
        <p style="margin:0;font-size:12px;letter-spacing:6px;color:#8d8a96;text-transform:uppercase;">sempy</p>
        <h1 style="margin:14px 0 0;font-size:30px;line-height:1.15;background:linear-gradient(180deg,#ffffff,#b9b9c9 55%,#f8f8ff);-webkit-background-clip:text;background-clip:text;color:transparent;">${title}</h1>
      </div>
      <div style="background:linear-gradient(135deg,rgba(255,255,255,.08),rgba(0,0,0,.35));border:1px solid rgba(255,255,255,.14);border-radius:18px;padding:26px;">
        ${body}
      </div>
      <p style="margin:24px 0 0;text-align:center;font-size:11px;color:#6f6c78;">
        sempy · Premium seasonal design assets for streamers<br/>
        Works with OBS Studio, Streamlabs, StreamElements, Twitch, YouTube and Facebook.
      </p>
    </div>
  </body>
</html>`
}

export function welcomeEmailHtml(siteUrl: string): string {
  return layout(
    "WELCOME TO THE DARK SIDE",
    `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#d8d5df;">
      You are now on the sempy list. You will be the first to hear about new drops, seasonal collections, private offers and free templates.
    </p>
    <ul style="margin:0 0 22px;padding:0 0 0 18px;color:#b9b5c4;font-size:14px;line-height:1.9;">
      <li>Early access to seasonal collections</li>
      <li>Subscriber-only discount codes</li>
      <li>Free starter templates and design tips</li>
    </ul>
    <p style="margin:0 0 22px;">
      <a href="${escapeHtml(siteUrl)}/shop" style="display:inline-block;border-radius:10px;padding:12px 22px;background:linear-gradient(180deg,#ffffff,#cfcfdd 45%,#8e8e9e);color:#09090b;text-decoration:none;font-weight:700;">Explore the shop</a>
    </p>
    <p style="margin:0;font-size:13px;color:#8d8a96;">
      Want to test the experience for free? Get the Chrome Starter kit:
      <a href="${escapeHtml(siteUrl)}/products/chrome-starter-free-stream-kit" style="color:#c4b5fd;">download it here</a>.
    </p>`
  )
}

export function ownerOrderEmailHtml(order: EmailOrder, assets: EmailAssetLink[]): string {
  const items = order.items
    .map(
      (item) =>
        `<tr>
          <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,.08);color:#e9e6ef;">${escapeHtml(item.name)}</td>
          <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,.08);text-align:center;color:#b9b5c4;">x${item.quantity}</td>
          <td style="padding:8px 0;border-bottom:1px solid rgba(255,255,255,.08);text-align:right;color:#e9e6ef;">€${item.price.toFixed(2)}</td>
        </tr>`
    )
    .join("")

  return layout(
    "NEW ORDER",
    `<p style="margin:0 0 16px;font-size:13px;color:#8d8a96;">Order <strong style="color:#f5f3f7;">${escapeHtml(order.orderId)}</strong> · ${new Date().toLocaleString("fr-FR")}</p>
    <table style="width:100%;border-collapse:collapse;font-size:14px;margin-bottom:18px;">${items}</table>
    <p style="margin:0 0 18px;font-size:16px;color:#f5f3f7;"><strong>Total: €${order.total.toFixed(2)}</strong> ${order.isFree ? "(free product)" : ""}</p>
    <div style="font-size:13px;line-height:1.8;color:#b9b5c4;">
      <p style="margin:0;"><strong style="color:#f5f3f7;">Customer:</strong> ${escapeHtml(order.customerName)} (${escapeHtml(order.customerEmail)})</p>
      <p style="margin:0;"><strong style="color:#f5f3f7;">Phone:</strong> ${escapeHtml(order.phone || "—")}</p>
      <p style="margin:0;"><strong style="color:#f5f3f7;">Address:</strong> ${escapeHtml(order.address)}, ${escapeHtml(order.postalCode)} ${escapeHtml(order.city)}, ${escapeHtml(order.country)}</p>
      <p style="margin:0;"><strong style="color:#f5f3f7;">Account:</strong> ${order.mode === "create" ? "account created (demo)" : "guest checkout"}</p>
      <p style="margin:0;"><strong style="color:#f5f3f7;">Payment:</strong> ${order.paymentLast4 ? `${escapeHtml(order.paymentBrand || "card")} ending ${escapeHtml(order.paymentLast4)} (demo)` : "no payment required"}</p>
    </div>
    <p style="margin:18px 0 0;font-size:12px;color:#6f6c78;">Asset links sent to the customer:</p>
    <ul style="margin:6px 0 0;padding-left:18px;font-size:12px;color:#8d8a96;">
      ${assets.map((asset) => `<li>${escapeHtml(asset.label)}</li>`).join("")}
    </ul>`
  )
}

export function customerOrderEmailHtml(
  order: EmailOrder,
  assets: EmailAssetLink[],
  siteUrl: string
): string {
  const items = order.items
    .map(
      (item) =>
        `<li style="margin-bottom:6px;color:#d8d5df;">${escapeHtml(item.name)} <span style="color:#8d8a96;">x${item.quantity}</span></li>`
    )
    .join("")

  const links = assets
    .map(
      (asset) =>
        `<li style="margin-bottom:6px;"><a href="${escapeHtml(asset.url)}" style="color:#c4b5fd;">${escapeHtml(asset.label)}</a></li>`
    )
    .join("")

  return layout(
    "YOUR ORDER IS READY",
    `<p style="margin:0 0 16px;font-size:15px;line-height:1.6;color:#d8d5df;">
      Thank you ${escapeHtml(order.customerName)}! Your order <strong style="color:#f5f3f7;">${escapeHtml(order.orderId)}</strong> is confirmed.
      ${order.isFree ? "No payment was required for this free kit." : `Total paid: €${order.total.toFixed(2)}.`}
    </p>
    <h2 style="margin:20px 0 8px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#8d8a96;">Included products</h2>
    <ul style="margin:0 0 18px;padding-left:18px;font-size:14px;">${items}</ul>
    <h2 style="margin:20px 0 8px;font-size:13px;letter-spacing:2px;text-transform:uppercase;color:#8d8a96;">Download your assets</h2>
    <ul style="margin:0 0 18px;padding-left:18px;font-size:14px;">${links}</ul>
    <p style="margin:0 0 18px;font-size:13px;line-height:1.7;color:#b9b5c4;">
      Every file works with OBS Studio, Streamlabs, StreamElements, Twitch, YouTube and Facebook.
      Import the PNG/SVG/WebM files into your scene, then edit the username text in your streaming software.
      Need help? Reply to this email.
    </p>
    <p style="margin:0;">
      <a href="${escapeHtml(siteUrl)}/shop" style="display:inline-block;border-radius:10px;padding:12px 22px;background:linear-gradient(180deg,#ffffff,#cfcfdd 45%,#8e8e9e);color:#09090b;text-decoration:none;font-weight:700;">Back to the shop</a>
    </p>`
  )
}
