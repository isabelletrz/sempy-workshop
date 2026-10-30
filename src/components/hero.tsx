"use client"

import Link from "next/link"
import { ArrowRight, Gift } from "lucide-react"
import { Button } from "@/components/ui/button"
import { products } from "@/data/products"
import { Dagger } from "@/components/ornaments"
import { useTheme } from "@/components/theme-provider"

const buttonSize =
  "h-12 w-full px-6 font-serif text-[15px] uppercase tracking-[0.18em] sm:w-[290px]"

export function Hero() {
  const { campaign } = useTheme()
  const freeKit = products.find((product) => product.price === 0)

  return (
    <section className="relative overflow-hidden">
      <div className="mx-auto max-w-[1000px] px-4 pb-4 pt-20 text-center md:pt-28">
        <p className="font-serif text-[13px] font-medium uppercase tracking-[0.4em] text-white/70">
          Twitch overlays · screens · kits
        </p>
        <h1 className="mx-auto mt-6 max-w-4xl text-balance font-display text-5xl leading-[1.02] text-foreground drop-shadow-[0_6px_40px_rgba(0,0,0,0.8)] sm:text-6xl lg:text-[88px]">
          {campaign.description}
        </h1>
        <p className="mx-auto mt-6 max-w-xl font-serif text-xl italic leading-relaxed text-white/70 md:text-[22px]">
          Overlays, webcam frames and stream screens made for creators who care about the details.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" asChild className={buttonSize}>
            <Link href="/shop">
              Browse the collection
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
          {freeKit && (
            <Button
              size="lg"
              variant="outline"
              asChild
              className={`${buttonSize} border-white/60 bg-transparent hover:bg-white hover:text-black`}
            >
              <Link href={`/products/${freeKit.slug}`}>
                <Gift className="mr-2 h-4 w-4" />
                Try the free kit
              </Link>
            </Button>
          )}
        </div>
      </div>

      <div className="mt-6 flex justify-center pb-4">
        <Dagger />
      </div>
    </section>
  )
}
