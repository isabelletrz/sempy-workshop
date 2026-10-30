import Link from "next/link"
import { siteConfig } from "@/lib/config"

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <Link href="/" className="flex items-center space-x-2">
              <span className="text-3xl leading-none text-foreground" style={{ fontFamily: "var(--font-display)" }}>
                {siteConfig.name}
              </span>
            </Link>
            <p className="text-sm text-muted-foreground">
              Premium seasonal design assets for Twitch streamers.
            </p>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Shop</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop" className="text-muted-foreground hover:text-foreground transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Overlays" className="text-muted-foreground hover:text-foreground transition-colors">
                  Overlays
                </Link>
              </li>
              <li>
                <Link href="/shop?category=Full%20Branding%20Kits" className="text-muted-foreground hover:text-foreground transition-colors">
                  Branding Kits
                </Link>
              </li>
              <li>
                <Link href="/collections" className="text-muted-foreground hover:text-foreground transition-colors">
                  Collections
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Explore</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/shop?seasonal=true" className="text-muted-foreground hover:text-foreground transition-colors">
                  Seasonal Collections
                </Link>
              </li>
              <li>
                <Link href="/search" className="text-muted-foreground hover:text-foreground transition-colors">
                  Search
                </Link>
              </li>
              <li>
                <Link href="/wishlist" className="text-muted-foreground hover:text-foreground transition-colors">
                  Wishlist
                </Link>
              </li>
              <li>
                <Link href="/cart" className="text-muted-foreground hover:text-foreground transition-colors">
                  Cart
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-8 pt-8 text-center text-sm text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p className="mt-2 text-xs">Not affiliated with or endorsed by Twitch Interactive, Inc.</p>
        </div>
      </div>
    </footer>
  )
}
