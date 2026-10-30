import { NextResponse } from "next/server"
import { z } from "zod"
import { products } from "@/data/products"
import { getProductPricing } from "@/lib/pricing"
import { applyDiscount } from "@/lib/discount"
import {
  customerOrderEmailHtml,
  getOwnerEmail,
  ownerOrderEmailHtml,
  sendEmail,
  type EmailAssetLink,
  type EmailOrder,
} from "@/lib/email"

export const runtime = "nodejs"

const ASSET_KINDS: { key: string; label: string }[] = [
  { key: "overlay", label: "Main Overlay" },
  { key: "webcam-frame", label: "Webcam Frame" },
  { key: "chat-box", label: "Chat Box" },
  { key: "alert", label: "Alert Banner" },
  { key: "panels", label: "Info Panels" },
  { key: "starting-soon", label: "Starting Soon Screen" },
  { key: "brb", label: "Be Right Back Screen" },
  { key: "offline", label: "Offline Screen" },
]

const schema = z.object({
  customer: z.object({
    firstName: z.string().trim().min(1).max(80),
    lastName: z.string().trim().min(1).max(80),
    email: z.string().email().max(200),
    phone: z.string().trim().max(40).optional(),
    address: z.string().trim().min(1).max(200),
    city: z.string().trim().min(1).max(120),
    postalCode: z.string().trim().min(1).max(20),
    country: z.string().trim().min(1).max(80),
  }),
  account: z.object({
    mode: z.enum(["guest", "create"]),
    password: z.string().max(200).optional(),
  }),
  payment: z
    .object({
      last4: z.string().regex(/^\d{4}$/).optional(),
      brand: z.string().max(30).optional(),
    })
    .optional(),
  items: z
    .array(
      z.object({
        id: z.string().min(1),
        quantity: z.number().int().min(1).max(10),
      })
    )
    .min(1)
    .max(20),
  discountCode: z.string().trim().max(40).optional(),
})

export async function POST(request: Request) {
  const body = await request.json().catch(() => null)
  const parsed = schema.safeParse(body)

  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Please check the form: some required details are missing." },
      { status: 400 }
    )
  }

  const { customer, account, payment, items, discountCode } = parsed.data

  const lineItems = items.flatMap((item) => {
    const product = products.find((candidate) => candidate.id === item.id && candidate.isActive)
    if (!product) return []
    return [
      {
        product,
        quantity: item.quantity,
        unitPrice: getProductPricing(product).price,
      },
    ]
  })

  if (lineItems.length !== items.length) {
    return NextResponse.json(
      { ok: false, error: "One of the products is no longer available." },
      { status: 400 }
    )
  }

  const total = applyDiscount(
    Math.round(lineItems.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0) * 100) / 100,
    discountCode
  )

  if (total > 0 && !payment?.last4) {
    return NextResponse.json(
      { ok: false, error: "Payment details are required for a paid order." },
      { status: 400 }
    )
  }

  const orderId = `NCT-${Date.now().toString(36).toUpperCase()}`
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin

  const deliveryLinks: EmailAssetLink[] = lineItems.flatMap(({ product }) =>
    ASSET_KINDS.map((kind) => ({
      label: `${product.name.split("—")[0].trim()} — ${kind.label}`,
      url: `${siteUrl}/api/assets/${product.slug}/${kind.key}`,
    }))
  )

  const order: EmailOrder = {
    orderId,
    customerName: `${customer.firstName} ${customer.lastName}`.trim(),
    customerEmail: customer.email,
    phone: customer.phone,
    address: customer.address,
    city: customer.city,
    postalCode: customer.postalCode,
    country: customer.country,
    mode: account.mode,
    items: lineItems.map(({ product, quantity, unitPrice }) => ({
      name: product.name,
      quantity,
      price: Math.round(unitPrice * quantity * 100) / 100,
    })),
    total,
    isFree: total === 0,
    paymentLast4: total > 0 ? payment?.last4 : undefined,
    paymentBrand: total > 0 ? payment?.brand : undefined,
  }

  const [customerEmail, ownerEmail] = await Promise.all([
    sendEmail({
      to: customer.email,
      subject: `Your sempy order ${orderId}`,
      html: customerOrderEmailHtml(order, deliveryLinks, siteUrl),
      replyTo: getOwnerEmail(),
    }),
    sendEmail({
      to: getOwnerEmail(),
      subject: `New order ${orderId} — €${total.toFixed(2)}`,
      html: ownerOrderEmailHtml(order, deliveryLinks),
      replyTo: customer.email,
    }),
  ])

  return NextResponse.json({
    ok: true,
    orderId,
    total,
    isFree: total === 0,
    emailSimulated: customerEmail.simulated && ownerEmail.simulated,
    deliveryLinks: deliveryLinks.slice(0, 12),
  })
}
