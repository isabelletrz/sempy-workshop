import type { Product } from "@/data/products"

export const COLLECTION_ACCENTS: Record<string, string> = {
  "gothic-horror": "#a855f7",
  "dark-y2k": "#c7d2fe",
  cybercore: "#22d3ee",
  minimalist: "#e5e7eb",
  coquette: "#f06aa6",
  halloween: "#ff6b35",
  christmas: "#c7a76c",
  valentine: "#f06aa6",
  summer: "#c6f36a",
  "noctra-signature": "#d8b4fe",
  cosy: "#f6b6a8",
}

export function getProductAccent(product: Product): string {
  for (const collection of product.collections) {
    if (COLLECTION_ACCENTS[collection]) return COLLECTION_ACCENTS[collection]
  }
  return "#a855f7"
}
