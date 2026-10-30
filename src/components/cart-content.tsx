"use client"

import Link from "next/link"
import { Minus, Plus, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useCart } from "@/components/cart-provider"
import { formatPrice } from "@/lib/utils"
import { getProductPricing } from "@/lib/pricing"
import { VectorTemplate } from "@/components/vector-template"

export function CartContent() {
  const { items, removeItem, updateQuantity, subtotal } = useCart()

  if (items.length === 0) {
    return (
      <div className="text-center py-12 space-y-4">
        <p className="text-muted-foreground">Your cart is empty</p>
        <Button asChild>
          <Link href="/shop">Continue Shopping</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-2 space-y-4">
        {items.map((item) => {
          const unitPrice = getProductPricing(item.product).price

          return (
            <div key={item.product.id} className="flex gap-4 p-4 border border-border rounded-lg">
              <div className="h-[81px] w-36 flex-shrink-0 overflow-hidden rounded border border-white/15 bg-secondary">
                <VectorTemplate product={item.product} screen="brb" alt={item.product.name} className="h-full w-full" />
              </div>
              <div className="flex-1 space-y-2">
                <div className="flex justify-between">
                  <Link href={`/products/${item.product.slug}`} className="font-semibold hover:text-accent">
                    {item.product.name}
                  </Link>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeItem(item.product.id)}
                    aria-label={`Remove ${item.product.name} from cart`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <p className="text-sm text-muted-foreground">{item.product.category}</p>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-1">
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </Button>
                    <span className="w-8 text-center text-sm">{item.quantity}</span>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </Button>
                  </div>
                  <p className="font-semibold">{formatPrice(unitPrice * item.quantity)}</p>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      <div className="space-y-4">
        <div className="border border-border rounded-lg p-6 space-y-4">
          <h2 className="text-xl font-semibold">Order Summary</h2>
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="border-t border-border pt-4 flex justify-between font-semibold text-lg">
            <span>Total</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <Button className="w-full" size="lg" asChild>
            <Link href="/checkout">Proceed to Checkout</Link>
          </Button>
          <Button variant="outline" className="w-full" asChild>
            <Link href="/shop">Continue Shopping</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
