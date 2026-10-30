"use client"

import { useEffect, useState } from "react"
import { BookOpen, ChevronLeft, ChevronRight, X } from "lucide-react"
import { Button } from "@/components/ui/button"

/* ---------- little schematic illustrations (generic stream-software layout, not a screenshot of any one app) ---------- */

const ink = "#f2f2f2"
const dim = "rgba(255,255,255,0.18)"
const faint = "rgba(255,255,255,0.08)"

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg viewBox="0 0 400 220" className="h-auto w-full rounded-lg border border-white/15 bg-black/60" role="img">
      {children}
    </svg>
  )
}

function Ring({ x, y, w, h, r = 6 }: { x: number | string; y: number | string; w: number; h: number; r?: number }) {
  return (
    <rect x={x} y={y} width={w} height={h} rx={r} fill="none" stroke={ink} strokeWidth="2" strokeDasharray="5 4">
      <animate attributeName="stroke-opacity" values="1;0.35;1" dur="1.8s" repeatCount="indefinite" />
    </rect>
  )
}

function Label({ x, y, children, size = 10, anchor = "start", op = 0.85 }: { x: number | string; y: number | string; children: React.ReactNode; size?: number | string; anchor?: "start" | "middle" | "end"; op?: number }) {
  return (
    <text x={x} y={y} fontSize={size} fill={ink} fillOpacity={op} textAnchor={anchor} fontFamily="Inter, system-ui, sans-serif">
      {children}
    </text>
  )
}

/** Window chrome with a Scenes panel (left), preview (centre) and Sources panel (right). */
function AppWindow({ children, scenes = ["Main"], sources = [] as string[], activeSource = -1 }: { children?: React.ReactNode; scenes?: string[]; sources?: string[]; activeSource?: number }) {
  return (
    <>
      <rect x="10" y="10" width="380" height="200" rx="8" fill="#0c0c0c" stroke={dim} />
      <rect x="10" y="10" width="380" height="20" rx="8" fill={faint} />
      {[0, 1, 2].map((i) => (
        <circle key={i} cx={24 + i * 12} cy="20" r="3" fill={dim} />
      ))}
      {/* preview */}
      <rect x="120" y="40" width="170" height="96" rx="3" fill="#050505" stroke={dim} />
      {/* scenes */}
      <rect x="18" y="40" width="94" height="80" rx="3" fill={faint} />
      <Label x="24" y="53" size="8" op={0.55}>SCENES</Label>
      {scenes.map((s, i) => (
        <g key={s}>
          <rect x="22" y={59 + i * 14} width="86" height="12" rx="2" fill={i === 0 ? dim : "transparent"} />
          <Label x="27" y={68 + i * 14} size="8">{s}</Label>
        </g>
      ))}
      <Label x="100" y="53" size="12" anchor="end">+</Label>
      {/* sources */}
      <rect x="298" y="40" width="84" height="96" rx="3" fill={faint} />
      <Label x="304" y="53" size="8" op={0.55}>SOURCES</Label>
      {sources.map((s, i) => (
        <g key={s}>
          <rect x="302" y={59 + i * 14} width="76" height="12" rx="2" fill={i === activeSource ? dim : "transparent"} />
          <Label x="307" y={68 + i * 14} size="8">{s}</Label>
        </g>
      ))}
      <Label x="374" y="53" size="12" anchor="end">+</Label>
      {/* controls */}
      <rect x="18" y="146" width="364" height="56" rx="3" fill={faint} />
      <rect x="300" y="156" width="76" height="16" rx="3" fill={ink} fillOpacity="0.85" />
      <Label x="338" y="168" size="8" anchor="middle" op={1}>
        <tspan fill="#000">Start Streaming</tspan>
      </Label>
      {children}
    </>
  )
}

function FileRow({ y, name }: { y: number; name: string }) {
  return (
    <g>
      <rect x="150" y={y} width="200" height="14" rx="3" fill={faint} />
      <rect x="156" y={y + 3} width="8" height="8" rx="1" fill="none" stroke={ink} strokeOpacity="0.7" />
      <Label x="170" y={y + 10.5} size="8">{name}</Label>
      <Label x="342" y={y + 10.5} size="8" anchor="end" op={0.6}>↓</Label>
    </g>
  )
}

function ArtDownload() {
  const names = ["overlay.webp", "webcam-frame.webp", "chat-box.webp", "alert.webp", "panels.webp", "starting-soon.webp", "brb.webp", "offline.webp"]
  return (
    <Frame>
      <rect x="40" y="18" width="320" height="184" rx="8" fill="#0c0c0c" stroke={dim} />
      <rect x="56" y="34" width="70" height="60" rx="4" fill="none" stroke={ink} strokeOpacity="0.6" />
      <path d="M56 38 L91 66 L126 38" fill="none" stroke={ink} strokeOpacity="0.6" />
      <Label x="91" y="110" size="9" anchor="middle">Your order</Label>
      <Label x="91" y="124" size="8" anchor="middle" op={0.55}>download links</Label>
      {names.map((n, i) => (
        <FileRow key={n} y={28 + i * 21} name={n} />
      ))}
      <Ring x="146" y="24" w={208} h={172} />
    </Frame>
  )
}

function ArtScene() {
  return (
    <Frame>
      <AppWindow scenes={["Main"]} />
      <Ring x="18" y="42" w={94} h={16} />
      <Label x="64" y="100" size="9" anchor="middle" op={0.7}>click +</Label>
      <Label x="205" y="92" size="9" anchor="middle" op={0.5}>empty preview</Label>
    </Frame>
  )
}

function ArtOverlay() {
  return (
    <Frame>
      <AppWindow scenes={["Main"]} sources={["Overlay"]} activeSource={0}>
        <rect x="124" y="44" width="162" height="88" rx="2" fill="none" stroke={ink} strokeOpacity="0.9" strokeWidth="2" />
        <rect x="236" y="48" width="46" height="30" rx="2" fill="none" stroke={ink} strokeOpacity="0.6" />
        <rect x="236" y="82" width="46" height="46" rx="2" fill="none" stroke={ink} strokeOpacity="0.4" />
        <Label x="205" y="124" size="8" anchor="middle" op={0.5}>overlay.webp</Label>
        <Ring x="298" y="42" w={84} h={14} />
      </AppWindow>
      <rect x="296" y="14" width="0" height="0" />
    </Frame>
  )
}

function ArtWebcam() {
  return (
    <Frame>
      <AppWindow scenes={["Main"]} sources={["Webcam frame", "Camera", "Overlay"]} activeSource={0}>
        <rect x="124" y="44" width="162" height="88" rx="2" fill="none" stroke={ink} strokeOpacity="0.35" />
        <circle cx="178" cy="88" r="17" fill="none" stroke={ink} strokeOpacity="0.5" strokeDasharray="3 3" />
        <rect x="150" y="62" width="56" height="46" rx="4" fill="none" stroke={ink} strokeWidth="2" />
        <Label x="178" y="123" size="8" anchor="middle" op={0.6}>frame sits on top</Label>
        <Ring x="302" y="58" w={76} h={14} />
        <Label x="296" y="152" size="8" anchor="end" op={0}>.</Label>
      </AppWindow>
    </Frame>
  )
}

function ArtChat() {
  return (
    <Frame>
      <AppWindow scenes={["Main"]} sources={["Chat box", "Chat", "Alerts", "Webcam frame", "Overlay"]} activeSource={0}>
        <rect x="124" y="44" width="162" height="88" rx="2" fill="none" stroke={ink} strokeOpacity="0.35" />
        <rect x="232" y="48" width="50" height="80" rx="3" fill="none" stroke={ink} strokeWidth="2" />
        {[0, 1, 2, 3].map((i) => (
          <rect key={i} x="237" y={54 + i * 17} width={i % 2 ? 28 : 36} height="4" rx="2" fill={ink} fillOpacity="0.45" />
        ))}
        <rect x="150" y="44" width="70" height="16" rx="3" fill="none" stroke={ink} strokeOpacity="0.8" />
        <Label x="185" y="55" size="7" anchor="middle" op={0.7}>NEW FOLLOWER</Label>
        <Ring x="302" y="58" w={76} h={28} />
      </AppWindow>
    </Frame>
  )
}

function ArtScreens() {
  return (
    <Frame>
      <AppWindow scenes={["Main", "Starting Soon", "BRB", "Offline"]} sources={["Starting soon"]} activeSource={0}>
        <rect x="124" y="44" width="162" height="88" rx="2" fill="none" stroke={ink} strokeOpacity="0.9" />
        <Label x="205" y="86" size="12" anchor="middle">STARTING SOON</Label>
        <Label x="205" y="102" size="8" anchor="middle" op={0.55}>05:00</Label>
        <Ring x="22" y="72" w={86} h={44} />
        <Ring x="298" y="154" w={84} h={20} />
      </AppWindow>
    </Frame>
  )
}

type Step = { title: string; body: React.ReactNode; art: React.ReactNode }

const STEPS: Step[] = [
  {
    title: "Download your files",
    art: <ArtDownload />,
    body: (
      <>
        Open the confirmation email and download all <strong>8 files</strong>: overlay, webcam frame, chat box, alert banner, panels and the
        Starting Soon, BRB and Offline screens. Save them together in one folder so they&apos;re easy to find.
      </>
    ),
  },
  {
    title: "Create a scene",
    art: <ArtScene />,
    body: (
      <>
        In OBS Studio, Streamlabs or StreamElements, press <strong>+</strong> under <strong>Scenes</strong> and name it &quot;Main&quot;. Each
        scene is one full screen of your stream.
      </>
    ),
  },
  {
    title: "Add your overlay",
    art: <ArtOverlay />,
    body: (
      <>
        Press <strong>+</strong> under <strong>Sources</strong>, choose <strong>Image</strong>, and pick <strong>overlay.webp</strong>. Stretch
        it to fill the canvas (right-click → Transform → Fit to screen). The overlay already has spaces for your game, camera and chat.
      </>
    ),
  },
  {
    title: "Add your webcam and its frame",
    art: <ArtWebcam />,
    body: (
      <>
        Add your camera (<strong>Video Capture Device</strong>), then add <strong>webcam-frame.webp</strong> as an Image source{" "}
        <strong>above</strong> it in the list so the frame sits on top. Resize your camera to fit the opening.
      </>
    ),
  },
  {
    title: "Add chat and alerts",
    art: <ArtChat />,
    body: (
      <>
        Add <strong>chat-box.webp</strong> as the backdrop for your chat and place your chat widget (a <strong>Browser</strong> source from
        Streamlabs or StreamElements) on top. Use <strong>alert.webp</strong> as the banner image in your alert settings.
      </>
    ),
  },
  {
    title: "Set up your standby screens, then go live",
    art: <ArtScreens />,
    body: (
      <>
        Make three more scenes called <strong>Starting Soon</strong>, <strong>BRB</strong> and <strong>Offline</strong>, each with its image
        as a source. Switch to Starting Soon before you start, then press <strong>Start Streaming</strong>. Use <strong>panels.webp</strong> as
        artwork for your Twitch channel panels.
      </>
    ),
  },
]

const SHOWN_KEY = "sempy-setup-guide-shown"

function orderIdFromSession(): string {
  try {
    const raw = sessionStorage.getItem("noctra-last-order")
    return raw ? (JSON.parse(raw) as { orderId?: string }).orderId ?? "" : ""
  } catch {
    return ""
  }
}

/** Opens automatically once per order on the success page; the button reopens it any time. */
export function SetupGuide({ autoOpen = true }: { autoOpen?: boolean }) {
  const [open, setOpen] = useState(false)
  const [step, setStep] = useState(0)

  useEffect(() => {
    if (!autoOpen) return
    const id = orderIdFromSession() || "order"
    try {
      if (sessionStorage.getItem(SHOWN_KEY) === id) return
      sessionStorage.setItem(SHOWN_KEY, id)
    } catch {
      /* storage unavailable: still show it */
    }
    const t = window.setTimeout(() => setOpen(true), 600)
    return () => window.clearTimeout(t)
  }, [autoOpen])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false)
      if (e.key === "ArrowRight") setStep((s) => Math.min(s + 1, STEPS.length - 1))
      if (e.key === "ArrowLeft") setStep((s) => Math.max(s - 1, 0))
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open])

  const openGuide = () => {
    setStep(0)
    setOpen(true)
  }
  const last = step === STEPS.length - 1
  const current = STEPS[step]

  return (
    <>
      <Button variant="outline" onClick={openGuide} className="w-full">
        <BookOpen className="mr-2 h-4 w-4" />
        Setup guide
      </Button>

      {open && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/75 p-4 backdrop-blur-sm"
          role="dialog"
          aria-modal="true"
          aria-labelledby="setup-title"
          onClick={(e) => e.target === e.currentTarget && setOpen(false)}
        >
          <div className="chrome-surface relative max-h-[94vh] w-full max-w-xl overflow-y-auto rounded-2xl p-6 text-left shadow-2xl sm:p-8">
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close guide"
              className="absolute right-3 top-3 rounded-full p-2 text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              <X className="h-5 w-5" />
            </button>

            <p className="font-serif text-[12px] uppercase tracking-[0.35em] text-white/55">
              Set up your templates · Step {step + 1} of {STEPS.length}
            </p>
            <h2 id="setup-title" className="mt-2 pr-8 font-display text-3xl leading-tight text-foreground sm:text-4xl">
              {current.title}
            </h2>

            <div className="mt-5">{current.art}</div>
            <p className="mt-5 font-serif text-lg leading-relaxed text-white/80">{current.body}</p>

            <div className="mt-6 flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setStep((s) => Math.max(s - 1, 0))}
                disabled={step === 0}
                className="flex items-center gap-1 text-sm uppercase tracking-[0.15em] text-white/70 transition hover:text-white disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" /> Back
              </button>
              <div className="flex gap-2" aria-hidden>
                {STEPS.map((_, i) => (
                  <span key={i} className={`h-1.5 rounded-full transition-all ${i === step ? "w-6 bg-white" : "w-1.5 bg-white/30"}`} />
                ))}
              </div>
              {last ? (
                <Button onClick={() => setOpen(false)}>Done</Button>
              ) : (
                <Button onClick={() => setStep((s) => s + 1)}>
                  Next <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
