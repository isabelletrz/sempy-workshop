"use client"

import { useEffect, useRef, useState } from "react"
import { Camera, RotateCcw, X } from "lucide-react"
import type { Product } from "@/data/products"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { templateImageUrl, type TemplateScreen } from "@/lib/template-screens"
import { getTemplateTheme } from "@/lib/template-theme"

const CAMERA_SCREENS: { id: TemplateScreen; label: string }[] = [
  { id: "overlay", label: "Overlay" },
  { id: "alerts", label: "Alerts" },
  { id: "chat", label: "Chat" },
]

export function CameraPreview({ product }: { product: Product }) {
  const [open, setOpen] = useState(false)
  const [username, setUsername] = useState("YOUR_NAME")
  const [screen, setScreen] = useState<TemplateScreen>("overlay")
  const [error, setError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)
  const [attempt, setAttempt] = useState(0)
  const videoRef = useRef<HTMLVideoElement>(null)
  const theme = getTemplateTheme(product)
  const labelStyle: React.CSSProperties = {
    color: theme.text,
    fontFamily: `var(--font-${theme.font === "display" ? "display" : theme.font === "serif" ? "serif" : "sans"})`,
    textShadow: `0 0 12px ${theme.accent}88`,
  }
  const streamRef = useRef<MediaStream | null>(null)

  useEffect(() => {
    if (!open) return

    let cancelled = false
    setError(null)
    setReady(false)

    if (!navigator.mediaDevices?.getUserMedia) {
      setError("Your browser does not support camera access.")
      return
    }

    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: "user" }, audio: false })
      .then((stream) => {
        if (cancelled) {
          stream.getTracks().forEach((track) => track.stop())
          return
        }
        streamRef.current = stream
        setReady(true)
      })
      .catch(() => {
        if (!cancelled) {
          setError("Camera access was denied. Allow camera permission in your browser and try again.")
        }
      })

    return () => {
      cancelled = true
      streamRef.current?.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }
  }, [open, attempt])

  useEffect(() => {
    if (videoRef.current && streamRef.current) {
      videoRef.current.srcObject = streamRef.current
      videoRef.current.play().catch(() => undefined)
    }
  }, [ready, screen])

  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [open])

  return (
    <>
      <Button variant="chrome" size="lg" onClick={() => setOpen(true)}>
        <Camera className="mr-2 h-5 w-5" />
        Preview with your camera
      </Button>

      {open && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/85 p-4 backdrop-blur-sm">
          <div className="chrome-surface relative w-full max-w-5xl rounded-2xl p-4 sm:p-6">
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-3 top-3 rounded-full border border-white/15 p-2 text-white/70 transition hover:bg-white/10 hover:text-white"
              aria-label="Close camera preview"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="mb-4 pr-10">
              <p className="text-xs uppercase tracking-[0.3em] text-white/45">Live camera test</p>
              <h2 className="text-2xl font-bold chrome-text">{product.name.split("—")[0].trim()}</h2>
              <p className="text-sm text-muted-foreground">
                Test the overlay with your own camera and username. Nothing is recorded or sent anywhere.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-[1fr_260px]">
              <div
                className="relative aspect-video overflow-hidden rounded-xl border border-white/15 bg-black"
                style={{ containerType: "inline-size" }}
              >
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="absolute inset-0 h-full w-full -scale-x-100 object-cover"
                />
                {!ready && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-black/70 p-6 text-center">
                    <Camera className="h-8 w-8 text-white/40" />
                    <p className="text-sm text-white/60">
                      {error ?? "Requesting camera access..."}
                    </p>
                    {error && (
                      <Button variant="outline" size="sm" onClick={() => setAttempt((value) => value + 1)}>
                        <RotateCcw className="mr-2 h-4 w-4" />
                        Try again
                      </Button>
                    )}
                  </div>
                )}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={templateImageUrl(product.slug, screen, true)}
                  alt=""
                  className="pointer-events-none absolute inset-0 h-full w-full object-fill"
                />
                {screen === "overlay" && (
                  <span
                    className="pointer-events-none absolute flex items-center justify-center truncate px-[1cqw] font-bold uppercase tracking-[0.12em]"
                    style={{ ...labelStyle, left: "2.5%", top: "83.15%", width: "26.04%", height: "10.37%", fontSize: "2.3cqw" }}
                  >
                    {username || "YOUR_NAME"}
                  </span>
                )}
                {screen === "alerts" && (
                  <span
                    className="pointer-events-none absolute flex items-center truncate font-bold uppercase tracking-[0.06em]"
                    style={{ ...labelStyle, left: "36.98%", top: "10.2%", width: "22.4%", height: "9%", fontSize: "3cqw" }}
                  >
                    {username || "YOUR_NAME"}
                  </span>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <label htmlFor="preview-username" className="mb-2 block text-sm font-medium">
                    Username
                  </label>
                  <Input
                    id="preview-username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value.slice(0, 24))}
                    placeholder="YOUR_NAME"
                  />
                  <p className="mt-1 text-xs text-muted-foreground">
                    Appears on the webcam frame, alerts and chat.
                  </p>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium">Screen</p>
                  <div className="flex flex-wrap gap-2">
                    {CAMERA_SCREENS.map((option) => (
                      <button
                        key={option.id}
                        type="button"
                        onClick={() => setScreen(option.id)}
                        className={
                          screen === option.id
                            ? "rounded-full border border-white/40 bg-white/15 px-3 py-1.5 text-xs font-medium text-white"
                            : "rounded-full border border-white/10 px-3 py-1.5 text-xs text-white/60 hover:border-white/30"
                        }
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/5 p-3 text-xs text-muted-foreground">
                  Camera access is local only. We never store or transmit your video feed.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
