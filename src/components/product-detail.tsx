"use client"

import { useState } from "react"
import { Product, platforms, products } from "@/data/products"
import { Button } from "@/components/ui/button"
import { formatPrice } from "@/lib/utils"
import { getProductPricing } from "@/lib/pricing"
import { useCart } from "@/components/cart-provider"
import { useWishlist } from "@/components/wishlist-provider"
import { useToast } from "@/components/ui/use-toast"
import { Heart, ShoppingBag, Check, Mail, MonitorPlay } from "lucide-react"
import { ProductCard } from "@/components/product-card"
import { CameraPreview } from "@/components/camera-preview"
import { TEMPLATE_SCREENS, type TemplateScreen } from "@/lib/template-screens"
import { VectorTemplate } from "@/components/vector-template"

interface ProductDetailProps {
  product: Product
}

export function ProductDetail({ product }: ProductDetailProps) {
  const { addItem } = useCart()
  const { toggleItem, isInWishlist } = useWishlist()
  const { toast } = useToast()
  const { price, compareAtPrice, discount } = getProductPricing(product)
  const inWishlist = isInWishlist(product.id)
  const [screen, setScreen] = useState<TemplateScreen>("overlay")

  const relatedProducts = products
    .filter((candidate) => candidate.id !== product.id && candidate.category === product.category && candidate.isActive)
    .slice(0, 4)

  const handleAddToCart = () => {
    addItem(product)
    toast({
      title: price === 0 ? "Free kit added" : "Added to cart",
      description: product.name,
    })
  }

  const handleWishlistToggle = () => {
    toggleItem(product)
    toast({
      title: inWishlist ? "Removed from wishlist" : "Added to wishlist",
      description: product.name,
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 mb-16">
        {/* Visual preview */}
        <div className="space-y-3">
          <div className="chrome-surface rounded-2xl p-2">
            <VectorTemplate
              product={product}
              screen={screen}
              loading="eager"
              className="rounded-xl"
            />
          </div>

          <div className="flex flex-wrap gap-2">
            {TEMPLATE_SCREENS.map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => setScreen(option.id)}
                className={
                  screen === option.id
                    ? "rounded-full border border-white/40 bg-white/15 px-3 py-1.5 text-xs font-medium text-white"
                    : "rounded-full border border-white/10 px-3 py-1.5 text-xs text-muted-foreground hover:border-white/30 hover:text-white"
                }
              >
                {option.label}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-foreground">
            These are live renders of the actual layout. Use the camera preview to test your username and framing.
          </p>
        </div>

        {/* Product info */}
        <div className="space-y-6">
          <div>
            <p className="text-sm text-muted-foreground mb-2">{product.category}</p>
            <h1 className="text-3xl md:text-4xl font-bold mb-4 chrome-text">{product.name}</h1>
            <p className="text-muted-foreground">{product.shortDescription}</p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold">{price === 0 ? "Free" : formatPrice(price)}</span>
            {compareAtPrice && (
              <>
                <span className="text-xl text-muted-foreground line-through">{formatPrice(compareAtPrice)}</span>
                {discount && (
                  <span className="bg-accent text-accent-foreground px-2 py-1 text-sm font-semibold rounded">
                    Save {discount}%
                  </span>
                )}
              </>
            )}
            {price === 0 && (
              <span className="rounded bg-emerald-400 px-2 py-1 text-xs font-bold text-black">FREE KIT</span>
            )}
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button size="lg" variant={price === 0 ? "chrome" : "default"} className="flex-1" onClick={handleAddToCart}>
              <ShoppingBag className="mr-2 h-5 w-5" />
              {price === 0 ? "Get it free" : "Add to Cart"}
            </Button>
            <Button size="lg" variant="outline" onClick={handleWishlistToggle}>
              <Heart className={`mr-2 h-5 w-5 ${inWishlist ? "fill-current" : ""}`} />
              {inWishlist ? "Remove" : "Wishlist"}
            </Button>
          </div>

          <CameraPreview product={product} />

          <div className="rounded-xl border border-white/10 bg-white/5 p-4">
            <p className="mb-2 flex items-center gap-2 text-sm font-medium">
              <MonitorPlay className="h-4 w-4 text-accent" />
              Works with your setup
            </p>
            <div className="flex flex-wrap gap-2">
              {platforms.map((platform) => (
                <span
                  key={platform}
                  className="inline-flex items-center gap-1 rounded-full border border-white/10 px-2.5 py-1 text-xs text-muted-foreground"
                >
                  <Check className="h-3 w-3 text-emerald-400" />
                  {platform}
                </span>
              ))}
            </div>
          </div>

          <p className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4 text-accent" />
            Instant delivery by email: overlay, webcam frame, chat box, alerts, Starting Soon and BRB screens.
          </p>

          <div className="border-t border-border pt-6 space-y-4">
            <h2 className="text-xl font-semibold">Description</h2>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          <div className="border-t border-border pt-6 space-y-4">
            <h2 className="text-xl font-semibold">What&apos;s Included</h2>
            <ul className="grid gap-2 sm:grid-cols-2">
              {product.includedAssets.map((asset) => (
                <li key={asset} className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Check className="h-4 w-4 shrink-0 text-accent" />
                  {asset}
                </li>
              ))}
            </ul>
          </div>

          <div className="border-t border-border pt-6 grid grid-cols-2 gap-4 text-sm">
            <div>
              <p className="font-medium mb-1">Formats</p>
              <p className="text-muted-foreground">{product.formats.join(", ")}</p>
            </div>
            <div>
              <p className="font-medium mb-1">Dimensions</p>
              <p className="text-muted-foreground">{product.dimensions}</p>
            </div>
            <div>
              <p className="font-medium mb-1">Animated</p>
              <p className="text-muted-foreground">{product.isAnimated ? "Yes" : "No"}</p>
            </div>
            <div>
              <p className="font-medium mb-1">Compatibility</p>
              <p className="text-muted-foreground">{platforms.join(", ")}</p>
            </div>
          </div>

          <div className="border-t border-border pt-6">
            <p className="text-sm text-muted-foreground">
              <strong>Licence:</strong> {product.licence}
            </p>
            <p className="text-sm text-muted-foreground mt-2">
              <strong>Delivery:</strong> Instant digital download by email after purchase
            </p>
          </div>
        </div>
      </div>

      {relatedProducts.length > 0 && (
        <section>
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedProducts.map((relatedProduct) => (
              <ProductCard key={relatedProduct.id} product={relatedProduct} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
