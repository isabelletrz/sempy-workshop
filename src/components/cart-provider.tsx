"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { products, Product } from "@/data/products"
import { getProductPricing } from "@/lib/pricing"

export interface CartItem {
  product: Product
  quantity: number
}

interface CartContextType {
  items: CartItem[]
  addItem: (product: Product, quantity?: number) => void
  removeItem: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  totalItems: number
  subtotal: number
  isLoaded: boolean
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([])
  const [mounted, setMounted] = useState(false)
  const [isLoaded, setIsLoaded] = useState(false)

  useEffect(() => {
    setMounted(true)
    const stored = localStorage.getItem("noctra-cart")
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as CartItem[]
        const refreshed = parsed
          .map((item) => {
            const current = products.find((p) => p.id === item?.product?.id)
            return current
              ? { product: current, quantity: Math.max(1, Number(item?.quantity) || 1) }
              : null
          })
          .filter((item): item is CartItem => item !== null)
        setItems(refreshed)
      } catch (e) {
        console.error("Failed to parse cart", e)
      }
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("noctra-cart", JSON.stringify(items))
    }
  }, [items, mounted])

  const addItem = (product: Product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }
      return [...prev, { product, quantity }]
    })
  }

  const removeItem = (productId: string) => {
    setItems((prev) => prev.filter((item) => item.product.id !== productId))
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId)
      return
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    )
  }

  const clearCart = () => setItems([])

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0)
  const subtotal = items.reduce(
    (sum, item) => sum + getProductPricing(item.product).price * item.quantity,
    0
  )

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isLoaded,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider")
  }
  return context
}
