import { THEMES } from "./themes.mjs"
const fontKind = (k) => (k === "fraktur" ? "display" : ["italiana", "cormorant", "playfair", "vibes", "cinzel", "cinzelDeco"].includes(k) ? "serif" : "sans")
const rows = Object.values(THEMES).sort((a, b) => +a.id - +b.id).map((t) => `  "${t.id}": { accent: "${t.pal.accent}", text: "${t.pal.text}", font: "${fontKind(t.fonts.title)}" },`)
console.log(`import type { Product } from "@/data/products"

/** Colours and label font used by the live camera preview. Generated from the template art config. */
export interface TemplateTheme {
  accent: string
  text: string
  font: "display" | "serif" | "sans"
}

const THEMES: Record<string, TemplateTheme> = {
${rows.join("\n")}
}

const FALLBACK: TemplateTheme = { accent: "#e5e7eb", text: "#ffffff", font: "sans" }

export function getTemplateTheme(product: Product): TemplateTheme {
  return THEMES[product.id] ?? FALLBACK
}
`)
