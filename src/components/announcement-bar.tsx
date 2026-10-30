"use client"

import { useTheme } from "@/components/theme-provider"
import Link from "next/link"

export function AnnouncementBar() {
  const { campaign } = useTheme()

  if (!campaign.banner?.enabled) return null

  return (
    <div className="bg-accent px-4 py-2 text-center font-serif text-[12px] font-semibold uppercase tracking-[0.3em] text-accent-foreground">
      {campaign.banner.link ? (
        <Link href={campaign.banner.link} className="hover:underline">
          {campaign.banner.text}
        </Link>
      ) : (
        <span>{campaign.banner.text}</span>
      )}
    </div>
  )
}
