import type { Campaign } from "@/lib/config"

export interface Hsl {
  h: number
  s: number
  l: number
}

export function hexToHsl(hex: string): Hsl {
  const value = hex.replace("#", "")
  const r = parseInt(value.substring(0, 2), 16) / 255
  const g = parseInt(value.substring(2, 4), 16) / 255
  const b = parseInt(value.substring(4, 6), 16) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0
  let s = 0

  if (max !== min) {
    const delta = max - min
    s = l > 0.5 ? delta / (2 - max - min) : delta / (max + min)

    switch (max) {
      case r:
        h = ((g - b) / delta + (g < b ? 6 : 0)) / 6
        break
      case g:
        h = ((b - r) / delta + 2) / 6
        break
      default:
        h = ((r - g) / delta + 4) / 6
    }
  }

  return { h: Math.round(h * 360), s: Math.round(s * 100), l: Math.round(l * 100) }
}

export function hsl({ h, s, l }: Hsl): string {
  return `${h} ${s}% ${l}%`
}

/**
 * CSS custom properties (as HSL triplets, the format Tailwind expects) for a
 * campaign. Used both server-side (inline style to avoid a theme flash) and
 * client-side (when the campaign changes).
 */
export function campaignCssVars(campaign: Campaign): Record<string, string> {
  const { colors } = campaign

  const background = hexToHsl(colors.background)
  const surface = hexToHsl(colors.surface)
  const textPrimary = hexToHsl(colors.textPrimary)
  const textSecondary = hexToHsl(colors.textSecondary)
  const accent = hexToHsl(colors.accent)
  const border = hexToHsl(colors.border)
  const accentForeground = accent.l > 60 ? "0 0% 7%" : "0 0% 100%"

  return {
    "--background": hsl(background),
    "--foreground": hsl(textPrimary),
    "--card": hsl(surface),
    "--card-foreground": hsl(textPrimary),
    "--popover": hsl(surface),
    "--popover-foreground": hsl(textPrimary),
    "--secondary": hsl(surface),
    "--secondary-foreground": hsl(textPrimary),
    "--muted": hsl(surface),
    "--muted-foreground": hsl(textSecondary),
    "--accent": hsl(accent),
    "--accent-foreground": accentForeground,
    "--primary": hsl(accent),
    "--primary-foreground": accentForeground,
    "--ring": hsl(accent),
    "--border": hsl(border),
    "--input": hsl(border),
  }
}
