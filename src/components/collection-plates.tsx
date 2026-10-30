import Link from "next/link"
import { products, type Product } from "@/data/products"
import { getProductPricing } from "@/lib/pricing"
import { VectorTemplate } from "@/components/vector-template"
import { DiamondRule } from "@/components/ornaments"

const PLATE_SLUGS = [
  "cathedral-exe-gothic-stream-overlay",
  "crimson-chapel-gothic-webcam-frame",
  "dark-ritual-horror-screen-pack",
]

const ROMAN = ["I", "II", "III", "IV", "V", "VI"]

function shortName(product: Product) {
  return product.name.split("—")[0].trim()
}

function subtitle(product: Product) {
  return product.name.split("—")[1]?.trim() ?? product.category
}

function euro(value: number) {
  return `€${value.toFixed(2)}`
}

export function CollectionPlates() {
  const plates = PLATE_SLUGS.map((slug) => products.find((product) => product.slug === slug)).filter(
    (product): product is Product => Boolean(product)
  )
  const freeKit = products.find((product) => product.price === 0)
  const total = products.filter((product) => product.isActive).length

  return (
    <section aria-labelledby="collection-title" className="mx-auto max-w-[1240px] px-4 pb-8 pt-20 sm:px-10">
      <div className="flex items-end justify-between gap-6">
        <h2 id="collection-title" className="font-display text-5xl leading-none text-foreground md:text-6xl">
          The Collection
        </h2>
        <Link
          href="/shop"
          className="font-serif text-sm font-medium uppercase tracking-[0.22em] text-white/80 transition-colors hover:text-white"
        >
          View all {total} →
        </Link>
      </div>
      <DiamondRule className="mt-5" />

      <div className="mt-10 grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
        {plates.map((product, index) => {
          const pricing = getProductPricing(product)
          return (
            <Link key={product.id} href={`/products/${product.slug}`} className="group block">
              <div className="relative overflow-hidden border border-white/25">
                <VectorTemplate
                  product={product}
                  screen="starting-soon"
                  className="aspect-video transition-transform duration-500 group-hover:scale-[1.04]"
                />
                <span className="absolute left-2.5 top-2.5 bg-black/80 px-2.5 py-1 font-serif text-xs tracking-[0.2em] text-white">
                  {ROMAN[index]}
                </span>
              </div>
              <h3 className="mt-4 font-serif text-2xl font-medium text-foreground">{shortName(product)}</h3>
              <p className="mt-1 font-serif text-lg italic text-white/60">{subtitle(product)}</p>
              <p className="mt-2.5 font-serif text-[15px] tracking-[0.12em] text-white/90">
                {euro(pricing.price)}
                {pricing.compareAtPrice && pricing.compareAtPrice > pricing.price && (
                  <span className="ml-2 text-white/40 line-through">{euro(pricing.compareAtPrice)}</span>
                )}
              </p>
            </Link>
          )
        })}

        {freeKit && (
          <Link
            href={`/products/${freeKit.slug}`}
            className="flex min-h-[300px] flex-col justify-between border border-white/45 bg-white/[0.03] p-6 transition-colors hover:bg-white/[0.07]"
          >
            <span className="font-serif text-[11px] uppercase tracking-[0.3em] text-white/70">
              {ROMAN[plates.length]} · Free
            </span>
            <div>
              <h3 className="font-display text-4xl leading-none text-foreground">{shortName(freeKit)}</h3>
              <p className="mt-3 font-serif text-lg italic leading-snug text-white/70">
                A free kit: webcam frame, chat box, alerts and Starting Soon screens.
              </p>
            </div>
            <span className="self-start border-b border-white/70 pb-1 font-serif text-xs uppercase tracking-[0.22em] text-foreground">
              Get it free
            </span>
          </Link>
        )}
      </div>
    </section>
  )
}
