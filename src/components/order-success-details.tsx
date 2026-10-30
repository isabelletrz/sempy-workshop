"use client"

import { useEffect, useState } from "react"
import { formatPrice } from "@/lib/utils"

interface StoredOrder {
  orderId?: string
  email?: string
  total?: number
  isFree?: boolean
  emailSimulated?: boolean
  items?: { name: string; quantity: number; price: number }[]
}

export function OrderSuccessDetails() {
  const [order, setOrder] = useState<StoredOrder | null>(null)

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("noctra-last-order")
      if (stored) setOrder(JSON.parse(stored) as StoredOrder)
    } catch {
      setOrder(null)
    }
  }, [])

  if (!order) return null

  return (
    <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-left text-sm">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
        <span className="text-muted-foreground">Order</span>
        <span className="font-mono font-semibold">{order.orderId}</span>
      </div>
      {order.items && order.items.length > 0 && (
        <ul className="space-y-2 border-b border-white/10 py-3">
          {order.items.map((item, index) => (
            <li key={`${item.name}-${index}`} className="flex justify-between gap-3">
              <span className="text-muted-foreground">
                {item.name} <span className="text-xs">x{item.quantity}</span>
              </span>
              <span>{item.price === 0 ? "Free" : formatPrice(item.price)}</span>
            </li>
          ))}
        </ul>
      )}
      <div className="flex items-center justify-between pt-3">
        <span className="text-muted-foreground">Total</span>
        <span className="font-semibold">{order.isFree ? "Free" : formatPrice(order.total ?? 0)}</span>
      </div>
      {order.email && (
        <p className="mt-3 text-xs text-muted-foreground">
          Download links sent to <span className="text-foreground">{order.email}</span>. Check your spam folder if needed.
        </p>
      )}
      {order.emailSimulated && (
        <p className="mt-2 text-xs text-amber-300/80">
          Demo mode: configure <code>RESEND_API_KEY</code> to send real emails.
        </p>
      )}
    </div>
  )
}
