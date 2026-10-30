export const siteConfig = {
  name: "sempy",
  description: "Premium seasonal design assets for Twitch streamers",
  url: "https://noctra.studio",
  currency: "EUR",
  defaultTheme: "noctra" as const,
}

export interface CampaignColors {
  background: string
  surface: string
  textPrimary: string
  textSecondary: string
  accent: string
  accentSecondary: string
  border: string
}

export interface CampaignBanner {
  enabled: boolean
  text?: string
  link?: string
}

export interface CampaignPromotion {
  type: "percentage"
  value: number
  collection: string
}

export interface Campaign {
  id: string
  name: string
  title: string
  description: string
  startDate: string | null
  endDate: string | null
  priority: number
  active: boolean
  colors: CampaignColors
  banner: CampaignBanner
  promotion?: CampaignPromotion
}

// Brand palette: black and white. Every campaign shares it so the site stays monochrome all year.
const MONO: CampaignColors = {
  background: "#070707",
  surface: "#0f0f0f",
  textPrimary: "#F2F2F2",
  textSecondary: "#A8A8A8",
  accent: "#F2F2F2",
  accentSecondary: "#BDBDBD",
  border: "#2B2B2B",
}

export type CampaignId = "noctra" | "halloween" | "christmas" | "valentine" | "summer"

export const campaigns: Record<CampaignId, Campaign> = {
  noctra: {
    id: "noctra",
    name: "NOCTRA",
    title: "PREMIUM DARK DESIGNS",
    description: "Elevate your stream with art-directed templates",
    startDate: null,
    endDate: null,
    priority: 0,
    active: true,
    colors: MONO,
    banner: {
      enabled: false,
    },
  },
  halloween: {
    id: "halloween",
    name: "HAUNTED ARCHIVE",
    title: "ENTER THE HAUNTED ARCHIVE",
    description: "Dark designs for darker streams.",
    startDate: "2026-10-01T00:00:00+02:00",
    endDate: "2026-11-01T00:00:00+01:00",
    priority: 10,
    active: false,
    colors: MONO,
    banner: {
      enabled: true,
      text: "ENTER THE HAUNTED ARCHIVE - 20% OFF SELECTED HALLOWEEN PRODUCTS",
      link: "/collections/halloween",
    },
    promotion: {
      type: "percentage" as const,
      value: 20,
      collection: "halloween",
    },
  },
  christmas: {
    id: "christmas",
    name: "MIDNIGHT WINTER",
    title: "THE MIDNIGHT WINTER COLLECTION",
    description: "Give your stream a darker kind of magic.",
    startDate: "2026-12-01T00:00:00+01:00",
    endDate: "2027-01-01T00:00:00+01:00",
    priority: 10,
    active: false,
    colors: MONO,
    banner: {
      enabled: true,
      text: "MIDNIGHT WINTER - LUXURY SEASONAL DESIGNS",
      link: "/collections/christmas",
    },
  },
  valentine: {
    id: "valentine",
    name: "AFTER DARK",
    title: "MADE FOR YOUR DARK SIDE",
    description: "Fall for a different aesthetic.",
    startDate: "2027-02-01T00:00:00+01:00",
    endDate: "2027-02-15T00:00:00+01:00",
    priority: 10,
    active: false,
    colors: MONO,
    banner: {
      enabled: true,
      text: "AFTER DARK - DARK ROMANCE COLLECTION",
      link: "/collections/valentine",
    },
  },
  summer: {
    id: "summer",
    name: "DIGITAL HEAT",
    title: "DIGITAL HEAT",
    description: "Cyber summer with an edge.",
    startDate: "2027-07-01T00:00:00+02:00",
    endDate: "2027-09-01T00:00:00+02:00",
    priority: 10,
    active: false,
    colors: MONO,
    banner: {
      enabled: true,
      text: "DIGITAL HEAT - CYBER SUMMER COLLECTION",
      link: "/collections/summer",
    },
  },
}

export function getActiveCampaign() {
  const now = new Date()
  // For development, allow manual override via env
  if (process.env.NEXT_PUBLIC_ACTIVE_THEME) {
    const override = process.env.NEXT_PUBLIC_ACTIVE_THEME
    if (campaigns[override as keyof typeof campaigns]) {
      return campaigns[override as keyof typeof campaigns]
    }
  }
  
  const activeCampaigns = Object.values(campaigns)
    .filter(c => c.id !== "noctra" && c.startDate && c.endDate)
    .filter(c => {
      const start = new Date(c.startDate!)
      const end = new Date(c.endDate!)
      return now >= start && now <= end
    })
    .sort((a, b) => b.priority - a.priority)
  
  if (activeCampaigns.length > 0) {
    return activeCampaigns[0]
  }
  
  return campaigns.noctra
}
