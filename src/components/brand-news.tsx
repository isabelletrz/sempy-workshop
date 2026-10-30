import Link from "next/link"
import { ArrowUpRight, Gift, Radio, ShieldCheck } from "lucide-react"

const news = [
  {
    icon: Radio,
    tag: "New drop",
    title: "The Haunted Archive is live",
    description: "Gothic overlays, cathedral frames and ritual screens for the darker season. 20% off selected products until 1 November.",
    href: "/collections/halloween",
    cta: "Enter the archive",
  },
  {
    icon: ShieldCheck,
    tag: "Compatibility",
    title: "Built for every platform",
    description: "Every template now ships with OBS Studio, Streamlabs, StreamElements, Twitch, YouTube and Facebook support.",
    href: "/shop",
    cta: "Browse compatible kits",
  },
  {
    icon: Gift,
    tag: "Free",
    title: "Chrome Starter is free",
    description: "A complete chrome webcam frame, chat box, alert banner, Starting Soon and Be Right Back kit. No payment required.",
    href: "/products/chrome-starter-free-stream-kit",
    cta: "Download the free kit",
  },
]

export function BrandNews() {
  return (
    <section className="border-b border-white/10 py-14">
      <div className="container mx-auto px-4">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.32em] text-accent">From the studio</p>
            <h2 className="mt-2 text-3xl font-bold chrome-text">News, drops &amp; free assets</h2>
          </div>
          <p className="max-w-md text-sm text-muted-foreground">
            What is happening at sempy right now — new collections, platform support and gifts for the community.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {news.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.title}
                href={item.href}
                className="group chrome-surface chrome-edge relative overflow-hidden rounded-xl p-5 transition hover:-translate-y-0.5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-white/15 bg-white/5 text-accent">
                    <Icon className="h-5 w-5" />
                  </span>
                  <span className="text-[10px] uppercase tracking-[0.28em] text-white/40">{item.tag}</span>
                </div>
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                <span className="mt-4 inline-flex items-center gap-1 text-xs font-medium text-white/80">
                  {item.cta}
                  <ArrowUpRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </section>
  )
}
