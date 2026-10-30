"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { ChevronLeft, ChevronRight, Star } from "lucide-react"
import { DiamondRule } from "@/components/ornaments"

/** Sample reviews for the demo store. Replace with real customer reviews once the shop is live. */
const REVIEWS = [
  { name: "Mara K.", handle: "@maraplays", product: "Cathedral.exe", text: "The overlay looks like it was made for my channel. Dropped it into OBS and was live in ten minutes." },
  { name: "Jonas T.", handle: "@jonas_tv", product: "Dark Ritual", text: "The Starting Soon and BRB screens are gorgeous. Chat asked where I got them the very first stream." },
  { name: "Elodie R.", handle: "@elodie.live", product: "Crimson Chapel", text: "Finally a webcam frame that doesn't look like every other template. The detail is unreal." },
  { name: "Sam W.", handle: "@samwrites", product: "Chrome Starter (free)", text: "Tried the free kit first and bought two more packs the next day. Easy decision." },
  { name: "Priya N.", handle: "@priyaplaysgames", product: "Nocturne", text: "Everything matched: chat box, alerts, panels. My whole stream finally feels like one thing." },
  { name: "Luca B.", handle: "@lucab", product: "Ghost Signal", text: "Instant email with the files, and the previews on the site were exactly what I got." },
  { name: "Hana M.", handle: "@hanamoon", product: "Lunar Static", text: "Moody, clean and readable on a busy game feed. The alert banners are my favourite." },
  { name: "Theo D.", handle: "@theodraws", product: "Velvet Hour", text: "Worth every cent. Setup was simple even though I'm new to streaming." },
]

export function Reviews() {
  const scroller = useRef<HTMLDivElement>(null)
  const [canPrev, setCanPrev] = useState(false)
  const [canNext, setCanNext] = useState(true)

  const update = useCallback(() => {
    const el = scroller.current
    if (!el) return
    setCanPrev(el.scrollLeft > 4)
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4)
  }, [])

  useEffect(() => {
    update()
    const el = scroller.current
    if (!el) return
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [update])

  const scrollBy = (dir: 1 | -1) => {
    const el = scroller.current
    if (!el) return
    const card = el.querySelector("article")
    const step = (card?.clientWidth ?? 340) + 20
    el.scrollBy({ left: dir * step * (window.innerWidth >= 1024 ? 2 : 1), behavior: "smooth" })
  }

  const arrow =
    "flex h-11 w-11 items-center justify-center rounded-full border border-white/30 bg-black/40 text-white transition hover:bg-white hover:text-black disabled:cursor-not-allowed disabled:opacity-30 disabled:hover:bg-black/40 disabled:hover:text-white"

  return (
    <section aria-labelledby="reviews-title" className="mx-auto max-w-[1240px] px-4 pb-16 pt-16 sm:px-10">
      <div className="flex items-end justify-between gap-6">
        <div>
          <h2 id="reviews-title" className="font-display text-5xl leading-none text-foreground md:text-6xl">
            Reviews
          </h2>
          <p className="mt-3 font-serif text-lg italic text-white/60">What streamers are saying.</p>
        </div>
        <div className="flex gap-3">
          <button type="button" className={arrow} onClick={() => scrollBy(-1)} disabled={!canPrev} aria-label="Previous reviews">
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button type="button" className={arrow} onClick={() => scrollBy(1)} disabled={!canNext} aria-label="Next reviews">
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="mt-6">
        <DiamondRule />
      </div>

      <div
        ref={scroller}
        onScroll={update}
        className="mt-8 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {REVIEWS.map((review) => (
          <article
            key={review.handle}
            className="chrome-surface flex w-[85%] shrink-0 snap-start flex-col rounded-xl p-6 sm:w-[360px]"
          >
            <div className="flex gap-1 text-white" aria-label="5 out of 5 stars">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-current" />
              ))}
            </div>
            <p className="mt-4 flex-1 font-serif text-lg leading-relaxed text-white/85">“{review.text}”</p>
            <div className="mt-5 border-t border-white/10 pt-4">
              <p className="text-sm font-semibold text-white">{review.name}</p>
              <p className="text-xs text-white/50">
                {review.handle} · {review.product}
              </p>
            </div>
          </article>
        ))}
      </div>
      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/35">Sample reviews shown for the demo store</p>
    </section>
  )
}
