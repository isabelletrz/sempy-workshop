export type TemplateScreen =
  | "overlay"
  | "webcam"
  | "chat"
  | "panels"
  | "alerts"
  | "starting-soon"
  | "brb"
  | "offline"

export const TEMPLATE_SCREENS: { id: TemplateScreen; label: string }[] = [
  { id: "overlay", label: "Overlay" },
  { id: "webcam", label: "Webcam" },
  { id: "chat", label: "Chat" },
  { id: "panels", label: "Panels" },
  { id: "alerts", label: "Alerts" },
  { id: "starting-soon", label: "Starting Soon" },
  { id: "brb", label: "Be Right Back" },
  { id: "offline", label: "Offline" },
]

/** File name (without extension) of each screen inside /public/templates/<slug>/. */
export const SCREEN_FILE: Record<TemplateScreen, string> = {
  overlay: "overlay",
  webcam: "webcam-frame",
  chat: "chat-box",
  panels: "panels",
  alerts: "alert",
  "starting-soon": "starting-soon",
  brb: "brb",
  offline: "offline",
}

/**
 * Template artwork URL. `clear` returns the transparent version (overlay, alerts, chat)
 * that is laid on top of the viewer's camera in the live preview.
 */
export function templateImageUrl(slug: string, screen: TemplateScreen, clear = false) {
  return `/templates/${slug}/${SCREEN_FILE[screen]}${clear ? "-clear" : ""}.webp`
}
