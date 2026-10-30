import type { Product } from "@/data/products"

/** Colours and label font used by the live camera preview. Generated from the template art config. */
export interface TemplateTheme {
  accent: string
  text: string
  font: "display" | "serif" | "sans"
}

const THEMES: Record<string, TemplateTheme> = {
  "1": { accent: "#cdbdff", text: "#f3eeff", font: "serif" },
  "2": { accent: "#b79cff", text: "#f1eaff", font: "display" },
  "3": { accent: "#e10b12", text: "#f4f1ee", font: "sans" },
  "4": { accent: "#ff7ac8", text: "#f5f5fb", font: "sans" },
  "5": { accent: "#22e8ff", text: "#d8fbff", font: "sans" },
  "6": { accent: "#f7a8cf", text: "#ffeef6", font: "serif" },
  "7": { accent: "#e6c78a", text: "#eefcf6", font: "serif" },
  "8": { accent: "#ff7a1a", text: "#fff1e0", font: "sans" },
  "9": { accent: "#e070ff", text: "#fbeaff", font: "sans" },
  "10": { accent: "#4ade80", text: "#e8ffee", font: "sans" },
  "11": { accent: "#c4b5fd", text: "#f5f3ff", font: "serif" },
  "12": { accent: "#ff6a45", text: "#fff0e4", font: "serif" },
  "13": { accent: "#b6ff3c", text: "#efffe0", font: "sans" },
  "14": { accent: "#e8508f", text: "#fff1f4", font: "serif" },
  "15": { accent: "#39ff88", text: "#e6ffee", font: "sans" },
  "16": { accent: "#8fd0ff", text: "#eaf6ff", font: "sans" },
  "17": { accent: "#d9d3f0", text: "#f5f2ff", font: "serif" },
  "18": { accent: "#c6f36a", text: "#eafff6", font: "sans" },
  "19": { accent: "#e6e9f5", text: "#f4f5fb", font: "sans" },
  "20": { accent: "#ffc2b0", text: "#fff8f2", font: "sans" },
}

const FALLBACK: TemplateTheme = { accent: "#e5e7eb", text: "#ffffff", font: "sans" }

export function getTemplateTheme(product: Product): TemplateTheme {
  return THEMES[product.id] ?? FALLBACK
}

