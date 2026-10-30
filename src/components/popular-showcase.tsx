import Link from "next/link"
import { ArrowRight } from "lucide-react"
import { products } from "@/data/products"
import type { TemplateScreen } from "@/lib/template-screens"
import { VectorTemplate } from "@/components/vector-template"
import { formatPrice } from "@/lib/utils"
import { getProductPricing } from "@/lib/pricing"

const SHOWCASE = [
  { slug: "luna-exe-gothic-horror-starter-kit", screen: "overlay" as TemplateScreen, username: "NOVA", label: "Most popular" },
  { slug: "glitch-protocol-cybercore-overlay", screen: "starting-soon" as TemplateScreen, username: "KAI", label: "Starting Soon" },
  { slug: "chrome-starter-free-stream-kit", screen: "alerts" as TemplateScreen, username: "MIRA", label: "Free this week" },
]

export function PopularShowcase() {
  const items = SHOWCASE.flatMap((entry) => {
    const product = products.find((candidate) => candidate.slug === entry.slug)
    return product ? [{ ...entry, product }] : []
  })

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-accent">What&apos;s popular</p>
            <h2 className="mt-2 text-3xl font-bold chrome-text">See the templates in action</h2>
            <p className="mt-2 max-w-xl text-muted-foreground">
              Real renders of the overlays, screens and alerts — not mockup titles. Hover a card and open it to test the username and camera preview.
            </p>
          </div>
          <Link href="/shop" className="inline-flex items-center gap-2 text-sm font-medium text-white/80 hover:text-white">
            View all templates
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="grid gap-5 lg:grid-cols-3">
          {items.map(({ product, screen, label }) => {
            const { price } = getProductPricing(product)
            return (
              <Link key={product.id} href={`/products/${product.slug}`} className="group block">
                <div className="chrome-surface chrome-edge overflow-hidden rounded-2xl p-2 transition group-hover:-translate-y-1">
                  <VectorTemplate product={product} screen={screen} className="rounded-xl" />
                  <div className="flex items-center justify-between gap-3 px-3 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold">{product.name.split("—")[0].trim()}</p>
                      <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">{label}</p>
                    </div>
                    <span className="shrink-0 text-sm font-semibold">
                      {price === 0 ? "Free" : formatPrice(price)}
                    </span>
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
