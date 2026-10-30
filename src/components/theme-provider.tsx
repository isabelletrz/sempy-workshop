"use client"

import { createContext, useContext, useEffect, useLayoutEffect, useState } from "react"
import { campaignCssVars } from "@/lib/colors"
import { campaigns, getActiveCampaign, type Campaign } from "@/lib/config"

type Theme = keyof typeof campaigns

const useIsomorphicLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect

interface ThemeContextType {
  theme: Theme
  campaign: Campaign
  setTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

function applyCampaign(campaign: Campaign) {
  const root = document.documentElement
  const vars = campaignCssVars(campaign)

  Object.entries(vars).forEach(([property, value]) => {
    root.style.setProperty(property, value)
  })
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>(() => getActiveCampaign().id as Theme)

  useIsomorphicLayoutEffect(() => {
    applyCampaign(campaigns[theme])
  }, [theme])

  const campaign = campaigns[theme]

  return (
    <ThemeContext.Provider value={{ theme, campaign, setTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
