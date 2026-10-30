import fs from "node:fs"
import path from "node:path"
import { products } from "@/data/products"

export const runtime = "nodejs"

/** The template files a customer receives with an order (see tools/template-art). */
const KINDS = new Set([
  "overlay",
  "webcam-frame",
  "chat-box",
  "alert",
  "panels",
  "starting-soon",
  "brb",
  "offline",
])

export async function GET(
  _request: Request,
  { params }: { params: { slug: string; asset: string } }
) {
  const product = products.find((candidate) => candidate.slug === params.slug)

  if (!product || !KINDS.has(params.asset)) {
    return new Response("Asset not found", { status: 404 })
  }

  const filePath = path.join(process.cwd(), "public", "templates", product.slug, `${params.asset}.webp`)
  if (!fs.existsSync(filePath)) {
    return new Response("Asset not found", { status: 404 })
  }

  return new Response(fs.readFileSync(filePath), {
    headers: {
      "Content-Type": "image/webp",
      "Content-Disposition": `attachment; filename="${product.slug}-${params.asset}.webp"`,
      "Cache-Control": "public, max-age=3600",
    },
  })
}
