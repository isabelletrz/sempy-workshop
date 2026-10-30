import fs from "node:fs"
import path from "node:path"
import { fileURLToPath } from "node:url"

export const W = 1920
export const H = 1080
const here = path.dirname(fileURLToPath(import.meta.url))

export function rng(seed) {
  let s = seed >>> 0
  return () => {
    s = (s + 0x6d2b79f5) >>> 0
    let t = s
    t = Math.imul(t ^ (t >>> 15), t | 1)
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61)
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}
export const n1 = (n) => Math.round(n * 10) / 10
export const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7)

/* ---------- fonts ---------- */
export const FONTS = {
  cinzel: { pkg: "cinzel", family: "Cinzel", w: [400, 600, 700, 900], cw: 0.8 },
  cinzelDeco: { pkg: "cinzel-decorative", family: "Cinzel Decorative", w: [400, 700, 900], cw: 0.86 },
  cormorant: { pkg: "cormorant-garamond", family: "Cormorant Garamond", w: [400, 500, 600, 700], i: [400, 500, 600], cw: 0.5 },
  fraktur: { pkg: "unifrakturcook", family: "UnifrakturCook", w: [700], cw: 0.58 },
  metal: { pkg: "metal-mania", family: "Metal Mania", w: [400], cw: 0.6 },
  creepster: { pkg: "creepster", family: "Creepster", w: [400], cw: 0.5 },
  eater: { pkg: "eater", family: "Eater", w: [400], cw: 0.62 },
  pirata: { pkg: "pirata-one", family: "Pirata One", w: [400], cw: 0.5 },
  orbitron: { pkg: "orbitron", family: "Orbitron", w: [500, 700, 900], cw: 0.86 },
  rajdhani: { pkg: "rajdhani", family: "Rajdhani", w: [400, 500, 600, 700], cw: 0.5 },
  mono: { pkg: "share-tech-mono", family: "Share Tech Mono", w: [400], cw: 0.6 },
  vt: { pkg: "vt323", family: "VT323", w: [400], cw: 0.62, sz: 1.45 },
  syncopate: { pkg: "syncopate", family: "Syncopate", w: [400, 700], cw: 0.98 },
  audiowide: { pkg: "audiowide", family: "Audiowide", w: [400], cw: 0.82 },
  playfair: { pkg: "playfair-display", family: "Playfair Display", w: [400, 600, 700, 900], i: [400, 600, 700], cw: 0.62 },
  vibes: { pkg: "great-vibes", family: "Great Vibes", w: [400], cw: 0.42 },
  italiana: { pkg: "italiana", family: "Italiana", w: [400], cw: 0.5 },
  inter: { pkg: "inter", family: "Inter", w: [400, 500, 600, 700, 800], cw: 0.62 },
  fredoka: { pkg: "fredoka", family: "Fredoka", w: [400, 500, 600, 700], cw: 0.58 },
  quicksand: { pkg: "quicksand", family: "Quicksand", w: [400, 500, 600, 700], cw: 0.58 },
  nunito: { pkg: "nunito", family: "Nunito", w: [400, 600, 700, 800, 900], cw: 0.58 },
  elite: { pkg: "special-elite", family: "Special Elite", w: [400], cw: 0.58 },
  bebas: { pkg: "bebas-neue", family: "Bebas Neue", w: [400], cw: 0.4 },
  dancing: { pkg: "dancing-script", family: "Dancing Script", w: [500, 700], cw: 0.46 },
  almendra: { pkg: "almendra", family: "Almendra", w: [400, 700], cw: 0.52 },
  pressstart: { pkg: "press-start-2p", family: "Press Start 2P", w: [400], cw: 1.0 },
  grenze: { pkg: "grenze-gotisch", family: "Grenze Gotisch", w: [400, 700, 900], cw: 0.5 },
}

export function fontCss(keys) {
  const out = []
  for (const k of new Set(keys)) {
    const f = FONTS[k]
    if (!f) throw new Error("unknown font " + k)
    for (const w of f.w) {
      const p = path.join(here, "node_modules/@fontsource", f.pkg, "files", `${f.pkg}-latin-${w}-normal.woff2`)
      out.push(`@font-face{font-family:'${f.family}';font-weight:${w};font-style:normal;src:url('file://${p}') format('woff2')}`)
    }
    for (const w of f.i ?? []) {
      const p = path.join(here, "node_modules/@fontsource", f.pkg, "files", `${f.pkg}-latin-${w}-italic.woff2`)
      out.push(`@font-face{font-family:'${f.family}';font-weight:${w};font-style:italic;src:url('file://${p}') format('woff2')}`)
    }
  }
  return out.join("\n")
}
export const fam = (k) => `'${FONTS[k].family}'`

/* ---------- color helpers ---------- */
export function hex2rgb(h) {
  const s = h.replace("#", "")
  const v = s.length === 3 ? s.split("").map((c) => c + c).join("") : s
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)]
}
export const rgba = (h, a) => {
  const [r, g, b] = hex2rgb(h)
  return `rgba(${r},${g},${b},${a})`
}
export function mix(a, b, t) {
  const A = hex2rgb(a), B = hex2rgb(b)
  const c = A.map((v, i) => Math.round(v + (B[i] - v) * t))
  return "#" + c.map((v) => v.toString(16).padStart(2, "0")).join("")
}

/* ---------- svg primitives ---------- */
export const rect = (x, y, w, h, attrs = "") => `<rect x="${n1(x)}" y="${n1(y)}" width="${n1(w)}" height="${n1(h)}" ${attrs}/>`
export const circ = (x, y, r, attrs = "") => `<circle cx="${n1(x)}" cy="${n1(y)}" r="${n1(r)}" ${attrs}/>`
export const line = (x1, y1, x2, y2, attrs = "") => `<line x1="${n1(x1)}" y1="${n1(y1)}" x2="${n1(x2)}" y2="${n1(y2)}" ${attrs}/>`
export const pth = (d, attrs = "") => `<path d="${d}" ${attrs}/>`
export const g = (inner, attrs = "") => `<g ${attrs}>${inner}</g>`

export function text(x, y, str, o = {}) {
  const {
    font = "inter", weight = 600, fill = "#fff", anchor = "start", ls = 0, op = 1,
    filter, italic = false, extra = "", stroke, sw = 0, transform, baseline,
  } = o
  const ff = FONTS[font]
  const size = (o.size ?? 32) * (ff.sz ?? 1)
  const esc = String(str).replace(/&/g, "&amp;").replace(/</g, "&lt;")
  return `<text x="${n1(x)}" y="${n1(y)}" font-family="${fam(font)}" font-size="${n1(size)}" font-weight="${weight}"${italic ? ' font-style="italic"' : ""} fill="${fill}" text-anchor="${anchor}" letter-spacing="${ls}"${op !== 1 ? ` opacity="${op}"` : ""}${filter ? ` filter="url(#${filter})"` : ""}${stroke ? ` stroke="${stroke}" stroke-width="${sw}" stroke-linejoin="round" paint-order="stroke"` : ""}${transform ? ` transform="${transform}"` : ""}${baseline ? ` dominant-baseline="${baseline}"` : ""} ${extra}>${esc}</text>`
}
/** font size so that text fits maxW */
export function fit(str, font, size, maxW, ls = 0) {
  const cw = FONTS[font].cw
  const est = str.length * (size * cw + ls)
  return est > maxW ? Math.floor(size * (maxW / est)) : size
}

/* ---------- shapes ---------- */
export function sparkle(x, y, r, fill = "#fff", op = 1, extra = "") {
  const k = r * 0.18
  const d = `M${x} ${y - r} C${x + k} ${y - k} ${x + k} ${y - k} ${x + r} ${y} C${x + k} ${y + k} ${x + k} ${y + k} ${x} ${y + r} C${x - k} ${y + k} ${x - k} ${y + k} ${x - r} ${y} C${x - k} ${y - k} ${x - k} ${y - k} ${x} ${y - r}Z`
  return `<path d="${d}" fill="${fill}" opacity="${op}" ${extra}/>`
}
export function heartPath(cx, cy, s) {
  const k = s / 2
  return `M${cx} ${cy + k * 0.95} C${cx - k * 1.7} ${cy - k * 0.2} ${cx - k * 0.9} ${cy - k * 1.35} ${cx} ${cy - k * 0.45} C${cx + k * 0.9} ${cy - k * 1.35} ${cx + k * 1.7} ${cy - k * 0.2} ${cx} ${cy + k * 0.95}Z`
}
export function starPath(cx, cy, ro, ri, n = 5, rot = -Math.PI / 2) {
  const pts = []
  for (let i = 0; i < n * 2; i++) {
    const r = i % 2 ? ri : ro
    const a = rot + (i * Math.PI) / n
    pts.push(`${n1(cx + Math.cos(a) * r)} ${n1(cy + Math.sin(a) * r)}`)
  }
  return "M" + pts.join("L") + "Z"
}
export function roundedRectPath(x, y, w, h, r) {
  return `M${x + r} ${y}H${x + w - r}Q${x + w} ${y} ${x + w} ${y + r}V${y + h - r}Q${x + w} ${y + h} ${x + w - r} ${y + h}H${x + r}Q${x} ${y + h} ${x} ${y + h - r}V${y + r}Q${x} ${y} ${x + r} ${y}Z`
}

/* ---------- shared defs ---------- */
export function sharedDefs(th) {
  const p = th.pal
  return `
<filter id="glow" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="9" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="glowS" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="4" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<filter id="blur6"><feGaussianBlur stdDeviation="6"/></filter>
<filter id="blur14"><feGaussianBlur stdDeviation="14"/></filter>
<filter id="blur30" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="30"/></filter>
<filter id="blur60" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="60"/></filter>
<filter id="drop" x="-20%" y="-20%" width="140%" height="150%"><feDropShadow dx="0" dy="6" stdDeviation="8" flood-color="#000" flood-opacity=".55"/></filter>
<filter id="rough" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".035" numOctaves="3" seed="4" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="14"/></filter>
<filter id="rough2" x="-5%" y="-5%" width="110%" height="110%"><feTurbulence type="fractalNoise" baseFrequency=".09" numOctaves="2" seed="9" result="n"/><feDisplacementMap in="SourceGraphic" in2="n" scale="7"/></filter>
<filter id="grain" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".8" numOctaves="2" seed="3"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 .5 0"/></filter>
<filter id="paper" x="0" y="0" width="100%" height="100%"><feTurbulence type="fractalNoise" baseFrequency=".012 .02" numOctaves="4" seed="11"/><feColorMatrix values="0 0 0 0 1  0 0 0 0 1  0 0 0 0 1  0 0 0 1.4 -.35"/></filter>
<linearGradient id="gTitle" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.title[0]}"/><stop offset="1" stop-color="${p.title[1]}"/></linearGradient>
<linearGradient id="gAccent" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${p.accent}"/><stop offset="1" stop-color="${p.accent2}"/></linearGradient>
<linearGradient id="gAccentV" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.accent}"/><stop offset="1" stop-color="${p.accent2}"/></linearGradient>
<linearGradient id="gPanel" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.panel[0]}"/><stop offset="1" stop-color="${p.panel[1]}"/></linearGradient>
<linearGradient id="gChrome" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffffff"/><stop offset=".35" stop-color="#cfd2dc"/><stop offset=".5" stop-color="#6c7080"/><stop offset=".62" stop-color="#e8eaf2"/><stop offset="1" stop-color="#9aa0b4"/></linearGradient>
<linearGradient id="gGold" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff3c4"/><stop offset=".45" stop-color="#d9b25f"/><stop offset=".55" stop-color="#8a6a2a"/><stop offset="1" stop-color="#f1d58a"/></linearGradient>
<linearGradient id="gHoloH" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${p.accent}"/><stop offset=".5" stop-color="${p.accent2}"/><stop offset="1" stop-color="${p.accent}"/></linearGradient>
<linearGradient id="gHole" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.hole[0]}"/><stop offset="1" stop-color="${p.hole[1]}"/></linearGradient>
<linearGradient id="gHoleSheen" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".09"/><stop offset=".45" stop-color="#fff" stop-opacity="0"/></linearGradient>
<pattern id="scan" width="4" height="4" patternUnits="userSpaceOnUse"><rect width="4" height="2" fill="#000"/></pattern>
<radialGradient id="gVignette" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".62"/></radialGradient>
`
}

export function html(th, body, { clear = false, extraDefs = "" } = {}) {
  const fonts = fontCss([th.fonts.title, th.fonts.label, th.fonts.body, th.fonts.mono ?? "mono", ...(th.fonts.extra ?? [])])
  return `<!doctype html><html><head><meta charset="utf-8"><style>
${fonts}
html,body{margin:0;padding:0;background:${clear ? "transparent" : "#000"};}
svg{display:block}
</style></head><body>
<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}"><defs>${sharedDefs(th)}${extraDefs}</defs>${body}</svg>
</body></html>`
}
