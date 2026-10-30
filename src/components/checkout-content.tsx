"use client"

import { useEffect, useRef, useState } from "react"
import { useRouter } from "next/navigation"
import { CreditCard, Lock, ShieldCheck, UserRound } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useCart } from "@/components/cart-provider"
import { formatPrice } from "@/lib/utils"
import { getProductPricing } from "@/lib/pricing"
import { useToast } from "@/components/ui/use-toast"
import { DISCOUNT_STORAGE_KEY, WELCOME_PERCENT, applyDiscount, isValidDiscountCode } from "@/lib/discount"

type AccountMode = "guest" | "create"

interface CheckoutForm {
  mode: AccountMode
  firstName: string
  lastName: string
  email: string
  password: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
  cardName: string
  cardNumber: string
  expiry: string
  cvc: string
}

const INITIAL_FORM: CheckoutForm = {
  mode: "guest",
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  phone: "",
  address: "",
  city: "",
  postalCode: "",
  country: "France",
  cardName: "",
  cardNumber: "",
  expiry: "",
  cvc: "",
}

function onlyDigits(value: string, max: number): string {
  return value.replace(/\D/g, "").slice(0, max)
}

export function CheckoutContent() {
  const { items, subtotal, clearCart, isLoaded } = useCart()
  const router = useRouter()
  const { toast } = useToast()
  const [form, setForm] = useState<CheckoutForm>(INITIAL_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const submittedRef = useRef(false)
  const isEmpty = items.length === 0
  const isFree = subtotal === 0
  const [discountCode, setDiscountCode] = useState<string | null>(null)
  useEffect(() => {
    try {
      const saved = localStorage.getItem(DISCOUNT_STORAGE_KEY)
      if (isValidDiscountCode(saved)) setDiscountCode(saved)
    } catch {
      /* storage unavailable */
    }
  }, [])
  const total = applyDiscount(subtotal, discountCode)
  const discountAmount = Math.round((subtotal - total) * 100) / 100

  useEffect(() => {
    if (isLoaded && isEmpty && !submittedRef.current) {
      router.replace("/cart")
    }
  }, [isLoaded, isEmpty, router])

  if (!isLoaded || isEmpty) {
    return null
  }

  const update = <K extends keyof CheckoutForm>(key: K, value: CheckoutForm[K]) => {
    setForm((current) => ({ ...current, [key]: value }))
  }

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    setError(null)

    if (form.mode === "create" && form.password.length < 8) {
      setError("Choose a password with at least 8 characters.")
      return
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      setError("Enter a valid email address.")
      return
    }

    const cardDigits = onlyDigits(form.cardNumber, 16)
    if (!isFree) {
      if (cardDigits.length < 15) {
        setError("Enter a valid card number (demo mode).")
        return
      }
      const [month, year] = form.expiry.split("/").map((part) => Number(part))
      if (!month || month < 1 || month > 12 || !year || year < 26) {
        setError("Enter a valid expiry date (MM/YY).")
        return
      }
      if (onlyDigits(form.cvc, 4).length < 3) {
        setError("Enter a valid CVC.")
        return
      }
      if (!form.cardName.trim()) {
        setError("Enter the name on the card.")
        return
      }
    }

    setLoading(true)

    try {
      const brand = cardDigits.startsWith("4")
        ? "Visa"
        : /^5[1-5]/.test(cardDigits)
          ? "Mastercard"
          : cardDigits.startsWith("34") || cardDigits.startsWith("37")
            ? "Amex"
            : "Card"

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
            phone: form.phone,
            address: form.address,
            city: form.city,
            postalCode: form.postalCode,
            country: form.country,
          },
          account: { mode: form.mode },
          payment: isFree ? undefined : { last4: cardDigits.slice(-4), brand },
          items: items.map((item) => ({ id: item.product.id, quantity: item.quantity })),
          discountCode: discountCode ?? undefined,
        }),
      })

      const data = (await response.json()) as {
        ok?: boolean
        error?: string
        orderId?: string
        total?: number
        isFree?: boolean
        emailSimulated?: boolean
      }

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "The order could not be placed.")
      }

      submittedRef.current = true
      sessionStorage.setItem("noctra-order-placed", "1")
      sessionStorage.setItem(
        "noctra-last-order",
        JSON.stringify({
          orderId: data.orderId,
          email: form.email,
          total: data.total ?? total,
          isFree: data.isFree ?? isFree,
          emailSimulated: Boolean(data.emailSimulated),
          items: items.map((item) => ({
            name: item.product.name,
            quantity: item.quantity,
            price: getProductPricing(item.product).price * item.quantity,
          })),
        })
      )

      toast({
        title: "Order confirmed",
        description: "Your download links are being sent by email.",
      })

      clearCart()
      router.push("/order/success")
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "The order could not be placed.")
      setLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <form onSubmit={handleSubmit} className="lg:col-span-2 space-y-6">
        <section className="chrome-surface rounded-xl p-5">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold">
            <UserRound className="h-5 w-5 text-accent" />
            How would you like to order?
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                { id: "guest", title: "Continue as guest", description: "No account needed. Download links by email." },
                { id: "create", title: "Create an account", description: "Demo account for this preview." },
              ] as const
            ).map((option) => (
              <button
                key={option.id}
                type="button"
                onClick={() => update("mode", option.id)}
                className={
                  form.mode === option.id
                    ? "rounded-lg border border-white/40 bg-white/10 p-4 text-left"
                    : "rounded-lg border border-white/10 p-4 text-left hover:border-white/25"
                }
              >
                <p className="text-sm font-semibold">{option.title}</p>
                <p className="mt-1 text-xs text-muted-foreground">{option.description}</p>
              </button>
            ))}
          </div>
        </section>

        <section className="chrome-surface rounded-xl p-5">
          <h2 className="mb-4 text-lg font-semibold">Contact &amp; billing details</h2>
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name" id="firstName" value={form.firstName} onChange={(value) => update("firstName", value)} autoComplete="given-name" required />
            <Field label="Last name" id="lastName" value={form.lastName} onChange={(value) => update("lastName", value)} autoComplete="family-name" required />
            <Field label="Email" id="email" type="email" value={form.email} onChange={(value) => update("email", value)} autoComplete="email" required />
            <Field label="Phone (optional)" id="phone" type="tel" value={form.phone} onChange={(value) => update("phone", value)} autoComplete="tel" />
            <div className="sm:col-span-2">
              <Field label="Address" id="address" value={form.address} onChange={(value) => update("address", value)} autoComplete="street-address" required />
            </div>
            <Field label="City" id="city" value={form.city} onChange={(value) => update("city", value)} autoComplete="address-level2" required />
            <Field label="Postal code" id="postalCode" value={form.postalCode} onChange={(value) => update("postalCode", value)} autoComplete="postal-code" required />
            <Field label="Country" id="country" value={form.country} onChange={(value) => update("country", value)} autoComplete="country-name" required />
            {form.mode === "create" && (
              <Field
                label="Password"
                id="password"
                type="password"
                value={form.password}
                onChange={(value) => update("password", value)}
                autoComplete="new-password"
                hint="At least 8 characters. This demo does not store passwords."
                required
              />
            )}
          </div>
        </section>

        <section className="chrome-surface rounded-xl p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <CreditCard className="h-5 w-5 text-accent" />
              Payment
            </h2>
            <span className="rounded-full border border-amber-300/30 bg-amber-300/10 px-2.5 py-1 text-[10px] uppercase tracking-[0.2em] text-amber-200">
              Demo mode
            </span>
          </div>

          {isFree ? (
            <div className="rounded-lg border border-emerald-400/25 bg-emerald-400/5 p-4 text-sm text-emerald-200">
              No payment required — this is a free product. You will still receive the full download email.
            </div>
          ) : (
            <>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <Field label="Name on card" id="cardName" value={form.cardName} onChange={(value) => update("cardName", value)} autoComplete="cc-name" required />
                </div>
                <div className="sm:col-span-2">
                  <Field
                    label="Card number"
                    id="cardNumber"
                    value={form.cardNumber}
                    onChange={(value) =>
                      update(
                        "cardNumber",
                        onlyDigits(value, 16).replace(/(.{4})/g, "$1 ").trim()
                      )
                    }
                    autoComplete="cc-number"
                    inputMode="numeric"
                    placeholder="4242 4242 4242 4242"
                    required
                  />
                </div>
                <Field
                  label="Expiry (MM/YY)"
                  id="expiry"
                  value={form.expiry}
                  onChange={(value) => {
                    const digits = onlyDigits(value, 4)
                    update("expiry", digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits)
                  }}
                  autoComplete="cc-exp"
                  inputMode="numeric"
                  placeholder="12/28"
                  required
                />
                <Field
                  label="CVC"
                  id="cvc"
                  value={form.cvc}
                  onChange={(value) => update("cvc", onlyDigits(value, 4))}
                  autoComplete="cc-csc"
                  inputMode="numeric"
                  placeholder="123"
                  required
                />
              </div>
              <p className="mt-4 flex items-start gap-2 text-xs text-muted-foreground">
                <Lock className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                Demo checkout: card details stay in your browser. Only the last 4 digits are used for the
                receipt. Never enter a real card number.
              </p>
            </>
          )}
        </section>

        {error && (
          <p className="rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-destructive-foreground">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" variant={isFree ? "chrome" : "default"} className="w-full" disabled={loading}>
          {loading
            ? "Placing order..."
            : isFree
              ? "Get it free — send my download links"
              : `Place order — ${formatPrice(total)}`}
        </Button>

        <p className="flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-emerald-400" />
          Secure checkout · instant email delivery · 6 platforms supported
        </p>
      </form>

      <div className="lg:col-span-1">
        <div className="chrome-surface sticky top-24 space-y-4 rounded-xl p-5">
          <h2 className="text-lg font-semibold">Order summary</h2>
          <div className="space-y-3">
            {items.map((item) => {
              const unitPrice = getProductPricing(item.product).price
              return (
                <div key={item.product.id} className="flex items-start justify-between gap-3 text-sm">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-xs text-muted-foreground">Qty {item.quantity} · {unitPrice === 0 ? "Free" : formatPrice(unitPrice)}</p>
                  </div>
                  <span className="shrink-0 font-medium">
                    {unitPrice === 0 ? "Free" : formatPrice(unitPrice * item.quantity)}
                  </span>
                </div>
              )
            })}
          </div>
          <div className="flex justify-between border-t border-white/10 pt-4 text-sm text-muted-foreground">
            <span>Delivery</span>
            <span>Email · instant</span>
          </div>
          {discountAmount > 0 && (
            <div className="flex justify-between border-t border-white/10 pt-4 text-sm text-muted-foreground">
              <span>Welcome code ({WELCOME_PERCENT}% off)</span>
              <span>−{formatPrice(discountAmount)}</span>
            </div>
          )}
          <div className="flex justify-between border-t border-white/10 pt-4 text-lg font-semibold">
            <span>Total</span>
            <span>{isFree ? "Free" : formatPrice(total)}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            You will receive the overlay, webcam frame, chat box, alerts, Starting Soon and BRB screens by email.
          </p>
        </div>
      </div>
    </div>
  )
}

function Field({
  label,
  id,
  value,
  onChange,
  type = "text",
  required,
  autoComplete,
  inputMode,
  placeholder,
  hint,
}: {
  label: string
  id: string
  value: string
  onChange: (value: string) => void
  type?: string
  required?: boolean
  autoComplete?: string
  inputMode?: "text" | "numeric" | "tel" | "email"
  placeholder?: string
  hint?: string
}) {
  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium">
        {label}
      </label>
      <Input
        id={id}
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        autoComplete={autoComplete}
        inputMode={inputMode}
        placeholder={placeholder}
      />
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}
