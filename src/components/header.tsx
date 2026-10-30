"use client"

import Link from "next/link"
import { Search, Heart, ShoppingBag, Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { useWishlist } from "@/components/wishlist-provider"
import { CornerFlourish, EdgeOrnament } from "@/components/ornaments"
import { siteConfig } from "@/lib/config"
import { useState } from "react"

export function Header() {
  const { totalItems } = useCart()
  const { items: wishlistItems } = useWishlist()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const navigation = [
    { name: "Shop", href: "/shop" },
    { name: "Overlays", href: "/shop?category=Overlays" },
    { name: "Kits", href: "/shop?category=Full%20Branding%20Kits" },
    { name: "Collections", href: "/collections" },
    { name: "Seasonal", href: "/shop?seasonal=true" },
  ]

  return (
    <header className="sticky top-0 z-50 px-3 pt-4 sm:px-6">
      <div className="relative mx-auto max-w-[1080px]">
        <div className="relative flex h-16 items-center justify-between rounded-2xl border border-white/20 bg-black/75 px-4 backdrop-blur-md sm:px-7">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2 md:hidden"
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
            <Link href="/" className="flex items-center" aria-label={`${siteConfig.name} home`}>
              <span className="font-display text-[2.15rem] leading-none text-foreground">
                {siteConfig.name}
              </span>
            </Link>
          </div>

          <nav className="hidden items-center gap-8 md:flex" aria-label="Primary">
            {navigation.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="font-serif text-[15px] font-medium uppercase tracking-[0.14em] text-white/80 transition-colors hover:text-white"
              >
                {item.name}
              </Link>
            ))}
          </nav>

          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/search">
                <Search className="h-5 w-5" />
                <span className="sr-only">Search</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/wishlist">
                <Heart className="h-5 w-5" />
                {wishlistItems.length > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-xs text-accent-foreground">
                    {wishlistItems.length}
                  </span>
                )}
                <span className="sr-only">Wishlist</span>
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild className="relative">
              <Link href="/cart">
                <ShoppingBag className="h-5 w-5" />
                {totalItems > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-xs text-accent-foreground">
                    {totalItems}
                  </span>
                )}
                <span className="sr-only">Cart</span>
              </Link>
            </Button>
          </div>
        </div>

        {/* Ornate frame: corner flourishes and edge ornaments */}
        <CornerFlourish className="pointer-events-none absolute -left-3 -top-3 hidden sm:block" />
        <CornerFlourish className="pointer-events-none absolute -right-3 -top-3 hidden -scale-x-100 sm:block" />
        <CornerFlourish className="pointer-events-none absolute -bottom-3 -left-3 hidden -scale-y-100 sm:block" />
        <CornerFlourish className="pointer-events-none absolute -bottom-3 -right-3 hidden -scale-100 sm:block" />
        <EdgeOrnament className="pointer-events-none absolute -top-[7px] left-1/2 hidden -translate-x-1/2 sm:block" />
        <EdgeOrnament className="pointer-events-none absolute -bottom-[7px] left-1/2 hidden -translate-x-1/2 sm:block" />

        {mobileMenuOpen && (
          <div className="mt-2 rounded-2xl border border-white/20 bg-black/90 px-5 py-3 backdrop-blur-md md:hidden">
            <nav className="space-y-1" aria-label="Mobile">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  href={item.href}
                  className="block py-2 font-serif text-base font-medium uppercase tracking-[0.14em] text-white/80 transition-colors hover:text-white"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
