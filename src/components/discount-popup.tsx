"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Check, Copy, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DISCOUNT_STORAGE_KEY, WELCOME_CODE, WELCOME_PERCENT } from "@/lib/discount"

const SEEN_KEY = "sempy-popup-seen"

/** Dismissed/subscribed in this browser session? Survives reloads, not a new visit. */
function hasSeenPopup() {
  try {
    return sessionStorage.getItem(SEEN_KEY) !== null
  } catch {
    return false
  }
}
function markPopupSeen() {
  try {
    sessionStorage.setItem(SEEN_KEY, "1")
  } catch {
    /* storage unavailable: popup may show again on the next page load */
  }
}
/** The code itself is kept in localStorage so it survives closing the browser. */
function rememberCode() {
  try {
    localStorage.setItem(DISCOUNT_STORAGE_KEY, WELCOME_CODE)
  } catch {
    /* storage unavailable: discount is still applied in memory */
  }
}

export function DiscountPopup() {
  const pathname = usePathname()
  const hidden = pathname.startsWith("/checkout") || pathname.startsWith("/order") || pathname.startsWith("/cart")
  const [open, setOpen] = useState(false)
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (hidden || hasSeenPopup()) return
    const id = window.setTimeout(() => setOpen(true), 1200)
    return () => window.clearTimeout(id)
  }, [hidden])

  const close = () => {
    markPopupSeen()
    setOpen(false)
  }

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && close()
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  const submit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!email.trim() || loading) return
    setLoading(true)
    setError(null)
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = (await response.json()) as { ok?: boolean; error?: string }
      if (!response.ok || !data.ok) throw new Error(data.error || "Something went wrong. Please try again.")
      rememberCode()
      markPopupSeen()
      setDone(true)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(WELCOME_CODE)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 1800)
    } catch {
      /* clipboard blocked */
    }
  }

  if (!open || hidden) return null

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm animate-in fade-in"
      onClick={(e) => e.target === e.currentTarget && close()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="discount-title"
    >
      <div className="chrome-surface relative w-full max-w-md rounded-2xl p-8 text-center shadow-2xl">
        <button
          type="button"
          onClick={close}
          aria-label="Close"
          className="absolute right-3 top-3 rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
        >
          <X className="h-5 w-5" />
        </button>

        {done ? (
          <>
            <p className="font-serif text-[12px] uppercase tracking-[0.4em] text-white/60">You&apos;re on the list</p>
            <h2 id="discount-title" className="mt-4 font-display text-5xl leading-none text-foreground">
              {WELCOME_PERCENT}% off
            </h2>
            <p className="mt-4 font-serif text-lg italic text-white/70">
              Your code is below. It&apos;s applied automatically at checkout.
            </p>
            <button
              type="button"
              onClick={copy}
              className="mx-auto mt-6 flex items-center gap-3 rounded-lg border border-dashed border-white/40 px-6 py-3 font-mono text-xl tracking-[0.3em] text-white transition hover:bg-white/10"
            >
              {WELCOME_CODE}
              {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4 opacity-70" />}
            </button>
            <Button asChild className="mt-6 w-full" size="lg" onClick={close}>
              <Link href="/shop">Start shopping</Link>
            </Button>
          </>
        ) : (
          <>
            <p className="font-serif text-[12px] uppercase tracking-[0.4em] text-white/60">Welcome offer</p>
            <h2 id="discount-title" className="mt-4 font-display text-5xl leading-none text-foreground">
              Take {WELCOME_PERCENT}% off
            </h2>
            <p className="mt-4 font-serif text-lg italic text-white/70">
              Join the sempy list for early drops and free kits, and get a discount code for your first order.
            </p>
            <form onSubmit={submit} className="mt-6 space-y-3">
              <Input
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                aria-label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {error && <p className="text-sm text-red-400">{error}</p>}
              <Button type="submit" size="lg" className="w-full" disabled={loading}>
                {loading ? "Sending..." : `Get my ${WELCOME_PERCENT}% code`}
              </Button>
            </form>
            <button type="button" onClick={close} className="mt-4 text-xs uppercase tracking-[0.2em] text-white/50 hover:text-white">
              No thanks
            </button>
          </>
        )}
      </div>
    </div>
  )
}
