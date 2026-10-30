import type { Metadata } from "next"
import { Inter, UnifrakturCook, Italiana, Cormorant_Garamond } from "next/font/google"
import "./globals.css"
import { cn } from "@/lib/utils"
import { ThemeProvider } from "@/components/theme-provider"
import { CartProvider } from "@/components/cart-provider"
import { WishlistProvider } from "@/components/wishlist-provider"
import { Toaster } from "@/components/ui/toaster"
import { SupportChat } from "@/components/support-chat"
import { LiquidChromeBackdrop } from "@/components/liquid-chrome-backdrop"
import { DiscountPopup } from "@/components/discount-popup"
import { Wallpaper } from "@/components/wallpaper"

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" })
const unifraktur = UnifrakturCook({ weight: "700", subsets: ["latin"], variable: "--font-display" })
const italiana = Italiana({ weight: "400", subsets: ["latin"], variable: "--font-headline" })
const cormorant = Cormorant_Garamond({ weight: ["400", "500", "600"], style: ["normal", "italic"], subsets: ["latin"], variable: "--font-serif" })

export const metadata: Metadata = {
  title: "sempy | Premium Twitch Templates & Graphics",
  description: "Premium seasonal design assets for Twitch streamers. Overlays, webcam frames, stream screens, branding kits, and more.",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn(inter.variable, unifraktur.variable, italiana.variable, cormorant.variable, "relative font-sans antialiased")}>
        <Wallpaper />
        <LiquidChromeBackdrop />
        <ThemeProvider>
          <CartProvider>
            <WishlistProvider>
              {children}
              <Toaster />
              <SupportChat />
              <DiscountPopup />
            </WishlistProvider>
          </CartProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
