"use client"

import Link from "next/link"
import { Heart } from "lucide-react"
import { Product, platforms } from "@/data/products"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { formatPrice } from "@/lib/utils"
import { getProductPricing } from "@/lib/pricing"
import { VectorTemplate } from "@/components/vector-template"
import { useWishlist } from "@/components/wishlist-provider"
import { useToast } from "@/components/ui/use-toast"

interface ProductCardProps {
  product: Product
}

export function ProductCard({ product }: ProductCardProps) {
  const { toggleItem, isInWishlist } = useWishlist()
  const { toast } = useToast()
  const { price, compareAtPrice, discount } = getProductPricing(product)
  const inWishlist = isInWishlist(product.id)

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault()
    toggleItem(product)
    toast({
      title: inWishlist ? "Removed from wishlist" : "Added to wishlist",
      description: product.name,
    })
  }

  return (
    <Card className="group overflow-hidden hover:border-accent transition-colors">
      <Link href={`/products/${product.slug}`}>
        <div className="relative aspect-video bg-secondary overflow-hidden">
          <VectorTemplate
            product={product}
            screen="brb"
            className="h-full rounded-none border-0"
          />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-transparent to-transparent" />
          {price === 0 ? (
            <div className="absolute top-2 left-2 rounded bg-emerald-400 px-2 py-1 text-xs font-bold text-black">
              FREE
            </div>
          ) : discount ? (
            <div className="absolute top-2 left-2 bg-accent text-accent-foreground px-2 py-1 text-xs font-semibold rounded">
              -{discount}%
            </div>
          ) : product.isNew ? (
            <div className="absolute top-2 left-2 bg-primary text-primary-foreground px-2 py-1 text-xs font-semibold rounded">
              NEW
            </div>
          ) : null}
          <Button
            size="icon"
            variant="secondary"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleWishlistToggle}
          >
            <Heart className={`h-4 w-4 ${inWishlist ? 'fill-current text-accent' : ''}`} />
          </Button>
        </div>
      </Link>
      
      <CardContent className="p-4 space-y-2">
        <Link href={`/products/${product.slug}`}>
          <h3 className="font-semibold hover:text-accent transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>
        <p className="text-xs text-muted-foreground">{product.category}</p>
        <p className="text-[11px] uppercase tracking-wide text-muted-foreground/70">
          {platforms.slice(0, 3).join(" · ")} +3
        </p>
        <div className="flex items-center gap-2">
          <span className="font-semibold">{price === 0 ? "Free" : formatPrice(price)}</span>
          {compareAtPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {formatPrice(compareAtPrice)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
