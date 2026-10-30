"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useWishlist } from "@/components/wishlist-provider"
import { ProductCard } from "@/components/product-card"

export function WishlistContent() {
  const { items } = useWishlist()

  if (items.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-muted-foreground">Your wishlist is empty</p>
        <Button asChild>
          <Link href="/shop">Browse Products</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
