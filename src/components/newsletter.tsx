"use client"

import { useState } from "react"
import { Check, Mail, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"

const BENEFITS = [
  "Early access to seasonal drops",
  "Subscriber-only offers and discount codes",
  "Free templates, wallpapers and design tips",
]

export function Newsletter() {
  const [email, setEmail] = useState("")
  const [loading, setLoading] = useState(false)
  const [done, setDone] = useState(false)
  const [simulated, setSimulated] = useState(false)
  const { toast } = useToast()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!email.trim() || loading) return

    setLoading(true)
    try {
      const response = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      })
      const data = (await response.json()) as { ok?: boolean; error?: string; simulated?: boolean }

      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Subscription failed.")
      }

      setDone(true)
      setSimulated(Boolean(data.simulated))
      setEmail("")
      toast({
        title: "Welcome to sempy",
        description: "A welcome email is on its way with your subscriber benefits.",
      })
    } catch (error) {
      toast({
        title: "Could not subscribe",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <section className="relative overflow-hidden border-y border-white/10 py-16">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-1/2 h-[360px] w-[720px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute inset-0 chrome-grid opacity-20" />
      </div>

      <div className="container mx-auto px-4">
        <div className="chrome-surface grid gap-8 rounded-2xl p-6 md:p-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-5">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1.5 text-xs uppercase tracking-[0.24em] text-white/70">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              The sempy list
            </div>
            <div>
              <h2 className="text-3xl font-bold chrome-text md:text-4xl">Stay in the dark</h2>
              <p className="mt-3 max-w-lg text-muted-foreground">
                Get new product drops, private offers and seasonal collections before anyone else.
                Subscribe and receive a welcome email immediately.
              </p>
            </div>
            <ul className="space-y-2 text-sm">
              {BENEFITS.map((benefit) => (
                <li key={benefit} className="flex items-center gap-2 text-muted-foreground">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full border border-white/15 bg-white/5">
                    <Check className="h-3 w-3 text-emerald-400" />
                  </span>
                  {benefit}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col justify-center">
            {done ? (
              <div className="rounded-xl border border-emerald-400/25 bg-emerald-400/5 p-6 text-center">
                <Mail className="mx-auto h-8 w-8 text-emerald-400" />
                <p className="mt-3 text-lg font-semibold">You are on the list</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Check your inbox for the welcome email and your subscriber benefits.
                </p>
                {simulated && (
                  <p className="mt-3 text-xs text-amber-300/80">
                    Demo mode: configure <code>RESEND_API_KEY</code> to deliver real emails.
                  </p>
                )}
                <Button variant="outline" size="sm" className="mt-4" onClick={() => setDone(false)}>
                  Subscribe another email
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <label htmlFor="newsletter-email" className="text-sm font-medium">
                  Email address
                </label>
                <Input
                  id="newsletter-email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  className="h-12 bg-black/30"
                />
                <Button type="submit" size="lg" variant="chrome" className="w-full" disabled={loading}>
                  {loading ? "Subscribing..." : "Subscribe & get the welcome email"}
                </Button>
                <p className="text-center text-xs text-muted-foreground">
                  No spam. Unsubscribe anytime. We only send design drops and offers.
                </p>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
