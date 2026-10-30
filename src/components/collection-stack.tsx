import { VectorTemplate } from "@/components/vector-template"
import type { Product } from "@/data/products"
import type { TemplateScreen } from "@/lib/template-screens"

const COLS = 5
const ROWS = 4
const SCREEN_ORDER: TemplateScreen[] = ["brb", "overlay", "starting-soon", "webcam", "offline", "alerts", "chat", "panels"]

/**
 * Isometric wall of a collection's templates (pure CSS 3D). The tilted plane is larger than the
 * thumbnail, so it fills it edge to edge (zoomed in; the background never shows); the tiles cycle through every template's screens
 * (BRB, overlay, Starting Soon, webcam...). Hovering lifts the tiles off the plane.
 */
export function CollectionStack({ products, name }: { products: Product[]; name: string }) {
  const n = products.length

  if (n === 0) {
    return (
      <div className="flex h-full items-center justify-center">
        <p className="font-serif text-lg italic text-white/45">Coming soon</p>
      </div>
    )
  }

  const tiles = Array.from({ length: COLS * ROWS }, (_, i) => {
    const col = i % COLS
    const row = Math.floor(i / COLS)
    return { key: i, product: products[(col + row * 2) % n], screen: SCREEN_ORDER[i % SCREEN_ORDER.length], col, row }
  })

  return (
    <div
      className="absolute inset-0 overflow-hidden [--lift:0px] [perspective:1800px] group-hover:[--lift:16px]"
      role="img"
      aria-label={`${n} template${n === 1 ? "" : "s"} in ${name}`}
    >
      <div
        className="absolute left-1/2 top-1/2 [transform-style:preserve-3d]"
        style={{
          width: "310%",
          aspectRatio: `${COLS * 16} / ${ROWS * 9}`,
          transform: "translate(-50%, -48%) rotateX(56deg) rotateZ(-38deg)",
        }}
      >
        <div
          className="absolute inset-0 grid [transform-style:preserve-3d]"
          style={{
            gridTemplateColumns: `repeat(${COLS}, 1fr)`,
            gridTemplateRows: `repeat(${ROWS}, 1fr)`,
            gap: "1%",
          }}
        >
          {tiles.map(({ key, product, screen, col, row }) => (
            <div
              key={key}
              className="transition-transform duration-500 ease-out"
              style={{ transform: `translateZ(calc(var(--lift) * ${0.4 + ((col + row) % 3) * 0.35}))` }}
            >
              <VectorTemplate
                product={product}
                screen={screen}
                alt=""
                className="h-full w-full rounded-[2px] border border-white/30 shadow-[0_4px_12px_rgba(0,0,0,0.55)]"
              />
            </div>
          ))}
        </div>
      </div>
      {/* vignette: darkens the edges and corners of the thumbnail */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(ellipse 78% 74% at 50% 46%, transparent 38%, rgba(0,0,0,0.55) 78%, rgba(0,0,0,0.92) 100%)" }}
      />
      {/* light shade behind the collection name so it stays readable over the wall */}
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-black/85 via-black/40 to-transparent" />
    </div>
  )
}
