import { W, H, n1, rect, circ, line, pth, g, text, fit, sparkle, heartPath, starPath, roundedRectPath, rgba, mix, rng, hash, FONTS, fam } from "./lib.mjs"
import { flourish, splatter, icon, brushStroke, drips, bow, cobweb, scanlines, holoFlower, snowflake } from "./motifs.mjs"

export const sls = (th) => Math.min(th.titleLs ?? 0, 3)
export const tc = (th, str) => (th.titleCase === "title" ? str.toLowerCase().replace(/(^|[\s])([a-z])/g, (m, a, b) => a + b.toUpperCase()) : str)
let uid = 0
const nid = (p) => `${p}${++uid}`

/* ---------- shape paths ---------- */
export function shapePath(kind, x, y, w, h, th) {
  switch (kind) {
    case "gothic": {
      const c = Math.min(26, h / 4)
      return `M${x + c} ${y}H${x + w - c}A${c} ${c} 0 0 0 ${x + w} ${y + c}V${y + h - c}A${c} ${c} 0 0 0 ${x + w - c} ${y + h}H${x + c}A${c} ${c} 0 0 0 ${x} ${y + h - c}V${y + c}A${c} ${c} 0 0 0 ${x + c} ${y}Z`
    }
    case "hud": {
      const c = Math.min(24, h / 3)
      return `M${x + c} ${y}H${x + w}V${y + h - c}L${x + w - c} ${y + h}H${x}V${y + c}Z`
    }
    case "torn": {
      const r = rng(hash(`${x}${y}${w}${h}`))
      let d = `M${x} ${y}`
      const edge = (x1, y1, x2, y2) => {
        const len = Math.hypot(x2 - x1, y2 - y1)
        const steps = Math.max(2, Math.round(len / 34))
        let s = ""
        for (let i = 1; i <= steps; i++) {
          const t = i / steps
          const jx = i === steps ? 0 : (r() - 0.5) * 7
          const jy = i === steps ? 0 : (r() - 0.5) * 7
          s += `L${n1(x1 + (x2 - x1) * t + (x1 === x2 ? jx : 0))} ${n1(y1 + (y2 - y1) * t + (y1 === y2 ? jy : 0))}`
        }
        return s
      }
      d += edge(x, y, x + w, y) + edge(x + w, y, x + w, y + h) + edge(x + w, y + h, x, y + h) + edge(x, y + h, x, y) + "Z"
      return d
    }
    case "tomb": {
      const rr = Math.min(64, w / 2, h / 2)
      return `M${x} ${y + h}V${y + rr}A${rr} ${rr} 0 0 1 ${x + rr} ${y}H${x + w - rr}A${rr} ${rr} 0 0 1 ${x + w} ${y + rr}V${y + h}Z`
    }
    case "scallop": {
      const n = Math.max(3, Math.round(w / 64))
      const bw = w / n
      const top = y + 20
      let d = `M${x} ${top + 20}`
      for (let i = 0; i < n; i++) d += `A${bw / 2} 24 0 0 1 ${x + bw * (i + 1)} ${top + 20}`
      d += `V${y + h - 22}A22 22 0 0 1 ${x + w - 22} ${y + h}H${x + 22}A22 22 0 0 1 ${x} ${y + h - 22}Z`
      return d
    }
    case "chrome": return roundedRectPath(x, y, w, h, Math.min(26, h / 3))
    case "neon": return roundedRectPath(x, y, w, h, Math.min(12, h / 4))
    case "term": return roundedRectPath(x, y, w, h, 8)
    case "holo": return roundedRectPath(x, y, w, h, Math.min(36, h / 3))
    case "frost": return roundedRectPath(x, y, w, h, Math.min(18, h / 4))
    case "book": return roundedRectPath(x, y, w, h, 10)
    case "min": return roundedRectPath(x, y, w, h, 3)
    case "deco": {
      const c = Math.min(26, h / 3.5)
      return `M${x + c} ${y}H${x + w - c}L${x + w} ${y + c}V${y + h - c}L${x + w - c} ${y + h}H${x + c}L${x} ${y + h - c}V${y + c}Z`
    }
    case "snowcap": return roundedRectPath(x, y, w, h, 14)
    case "ornate": return roundedRectPath(x, y, w, h, 6)
    case "vhs": return `M${x} ${y}H${x + w}V${y + h}H${x}Z`
    default: return roundedRectPath(x, y, w, h, Math.min(28, h / 4)) // glass
  }
}

/* ---------- placeholder (game / cam slot) ---------- */
function placeholder(th, role, x, y, w, h, shapeId) {
  const p = th.pal
  const cx = x + w / 2, cy = y + h / 2
  let o = `<g clip-path="url(#${shapeId})">`
  o += rect(x, y, w, h, `fill="url(#gHole)"`)
  if (th.holeArt) o += th.holeArt(x, y, w, h, role)
  o += pth(`M${x} ${y + h * 0.62}L${x + w} ${y + h * 0.42}V${y + h}H${x}Z`, `fill="#000" opacity=".12"`)
  o += rect(x, y, w, h, `fill="url(#gHoleSheen)"`)
  if (role === "cam") {
    const s = Math.min(w, h)
    o += `<g opacity=".16" fill="${p.text}">${circ(cx, cy - s * 0.1, s * 0.15)}<path d="M${cx - s * 0.32} ${y + h}C${cx - s * 0.32} ${cy + s * 0.2} ${cx - s * 0.18} ${cy + s * 0.08} ${cx} ${cy + s * 0.08}C${cx + s * 0.18} ${cy + s * 0.08} ${cx + s * 0.32} ${cy + s * 0.2} ${cx + s * 0.32} ${y + h}Z"/></g>`
    o += text(cx, y + h - Math.min(34, h * 0.09), "FACECAM", { font: th.fonts.label, size: Math.min(26, h * 0.075), fill: p.text, op: 0.5, anchor: "middle", ls: 6, weight: 700 })
  } else {
    o += text(cx, cy + 8, "GAMEPLAY", { font: th.fonts.label, size: Math.min(34, h * 0.05), fill: p.text, op: 0.28, anchor: "middle", ls: 10, weight: 700 })
    o += `<g stroke="${p.text}" stroke-opacity=".22" stroke-width="2" fill="none"><path d="M${cx - 18} ${cy - 40}H${cx + 18}M${cx} ${cy - 58}V${cy - 22}"/>${circ(cx, cy - 40, 24)}</g>`
  }
  return o + "</g>"
}

/* ---------- main box ---------- */
export function box(th, kind, x, y, w, h, o = {}) {
  const { role = "panel", clear = false, label = "", tilt = 0, seedShift = 0 } = o
  const p = th.pal
  const sid = nid("sh")
  const d = shapePath(kind, x, y, w, h, th)
  const hole = role === "game" || role === "cam"
  const cx = x + w / 2
  let out = ""
  out += `<defs><clipPath id="${sid}"><path d="${d}"/></clipPath></defs>`

  // soft glow under
  if (!clear || hole === false) out += pth(d, `fill="${p.accent}" opacity="${hole ? 0.1 : 0.07}" filter="url(#blur30)"`)

  // fill
  if (hole) {
    if (!clear) out += placeholder(th, role, x, y, w, h, sid)
  } else {
    out += pth(d, `fill="url(#gPanel)"${kind === "torn" ? ' filter="url(#rough2)"' : ""}`)
    if (kind === "vhs" || kind === "hud") out += `<g clip-path="url(#${sid})" opacity=".5">${rect(x, y, w, h, `fill="url(#scan)" opacity=".5"`)}</g>`
  }

  // stroke(s)
  switch (kind) {
    case "gothic": {
      out += pth(d, `fill="none" stroke="${p.line}" stroke-width="2.4"`)
      out += pth(shapePath("gothic", x + 11, y + 11, w - 22, h - 22, th), `fill="none" stroke="${p.line}" stroke-opacity=".5" stroke-width="1.2"`)
      const c = Math.min(26, h / 4)
      for (const [qx, qy] of [[x, y], [x + w, y], [x, y + h], [x + w, y + h]]) {
        out += circ(qx, qy, 7, `fill="${p.bg[0]}" stroke="${p.line}" stroke-width="2"`) + circ(qx, qy, 2.4, `fill="${p.accent}"`)
      }
      if (hole && w > 300) {
        out += pth(`M${cx - 44} ${y - 1}C${cx - 44} ${y - 30} ${cx - 16} ${y - 40} ${cx} ${y - 62}C${cx + 16} ${y - 40} ${cx + 44} ${y - 30} ${cx + 44} ${y - 1}`, `fill="${p.bg[0]}" stroke="${p.line}" stroke-width="2.4"`)
        out += pth(`M${cx - 26} ${y - 1}C${cx - 26} ${y - 20} ${cx - 8} ${y - 28} ${cx} ${y - 42}C${cx + 8} ${y - 28} ${cx + 26} ${y - 20} ${cx + 26} ${y - 1}`, `fill="none" stroke="${p.accent}" stroke-width="1.4"`)
        out += circ(cx, y - 66, 3.5, `fill="${p.accent}" filter="url(#glowS)"`)
      }
      break
    }
    case "hud": {
      out += pth(d, `fill="none" stroke="${p.line}" stroke-width="2" stroke-opacity=".75"`)
      const L = 34, T = 5
      const br = (bx, by, sx, sy) => `M${bx} ${by + sy * L}V${by}H${bx + sx * L}`
      out += pth(br(x, y, 1, 1) + br(x + w, y, -1, 1) + br(x, y + h, 1, -1) + br(x + w, y + h, -1, -1), `fill="none" stroke="${p.accent}" stroke-width="${T}" stroke-linecap="square" filter="url(#glowS)"`)
      let ticks = ""
      for (let i = 0; i < 14; i++) ticks += line(x + 70 + i * 9, y - 10, x + 70 + i * 9, y - (i % 4 === 0 ? 2 : 6))
      out += `<g stroke="${p.accent}" stroke-width="1.4" opacity=".7">${ticks}</g>`
      if (label) out += rect(x + w - 190, y - 22, 190, 22, `fill="${p.accent}" opacity=".16"`) + text(x + w - 10, y - 6, label, { font: th.fonts.mono ?? "mono", size: 15, fill: p.accent, anchor: "end", ls: 3 })
      break
    }
    case "torn": {
      out += pth(d, `fill="none" stroke="${p.line}" stroke-width="3" filter="url(#rough2)"`)
      const r = rng(hash(`t${x}${y}`))
      const sl = (sx, sy, rot) => `<g transform="translate(${sx} ${sy}) rotate(${rot})">${rect(-46, -5, 92, 10, `fill="${p.accent}"`)}${rect(-30, 9, 60, 4, `fill="${p.accent}" opacity=".6"`)}</g>`
      if (h >= 200) out += sl(x + 10, y + 12, -38) + sl(x + w - 10, y + h - 12, -38)
      if (role === "game" || role === "cam") {
        out += `<g fill="${p.splat ?? "#fff"}" opacity=".95">${splatter(r, x + 6, y + 6, Math.min(90, w * 0.3), p.splat ?? "#fff", 36)}</g>`
        out += brushStroke(r, x + w * 0.45, y + h - 8, w * 0.5, 10, p.accent, -1)
      }
      break
    }
    case "neon": {
      out += pth(d, `fill="none" stroke="${p.accent}" stroke-width="3.2" filter="url(#glow)"`)
      out += pth(shapePath("neon", x + 9, y + 9, w - 18, h - 18, th), `fill="none" stroke="${p.accent2}" stroke-opacity=".6" stroke-width="1.4"`)
      out += circ(x + 20, y, 4, `fill="#fff" filter="url(#glowS)"`) + circ(x + w - 20, y + h, 4, `fill="#fff" filter="url(#glowS)"`)
      break
    }
    case "term": {
      const hh = 36
      out += `<g clip-path="url(#${sid})">${rect(x, y, w, hh, `fill="${p.accent}" opacity=".2"`)}${line(x, y + hh, x + w, y + hh, `stroke="${p.line}" stroke-opacity=".7" stroke-width="1.5"`)}</g>`
      out += pth(d, `fill="none" stroke="${p.line}" stroke-width="2"`)
      for (let i = 0; i < 3; i++) out += circ(x + 22 + i * 22, y + hh / 2, 6, `fill="${[p.accent2, p.accent, "#ffffff"][i]}" opacity=".85"`)
      out += text(x + 100, y + hh / 2 + 6, (label || role + ".exe").toLowerCase(), { font: "mono", size: 17, fill: p.text, op: 0.7, ls: 2 })
      out += text(x + w - 16, y + hh / 2 + 6, "— ▢ ✕", { font: "mono", size: 16, fill: p.text, op: 0.6, anchor: "end", ls: 4 })
      break
    }
    case "holo": {
      out += pth(d, `fill="none" stroke="url(#gHoloH)" stroke-width="3.4" filter="url(#glowS)"`)
      out += pth(shapePath("holo", x + 10, y + 10, w - 20, h - 20, th), `fill="none" stroke="url(#gHoloH)" stroke-opacity=".35" stroke-width="1.2"`)
      if (hole || w > 400) out += holoFlower(x + 4, y + 4, 26, p.accent, p.accent2, { petals: 6, sw: 1.6 })
      out += sparkle(x + w - 10, y + h - 6, 16, "#fff", 0.9, `filter="url(#glowS)"`)
      break
    }
    case "deco": {
      out += pth(d, `fill="none" stroke="${p.line}" stroke-width="2.6"`)
      out += pth(shapePath("deco", x + 11, y + 11, w - 22, h - 22, th), `fill="none" stroke="${p.line}" stroke-opacity=".5" stroke-width="1.2"`)
      for (const [dx, dy] of [[cx, y], [cx, y + h]]) out += pth(`M${dx - 12} ${dy}L${dx} ${dy - 12}L${dx + 12} ${dy}L${dx} ${dy + 12}Z`, `fill="${p.bg[0]}" stroke="${p.line}" stroke-width="2"`)
      out += line(x + 30, y + 5.5, cx - 40, y + 5.5, `stroke="${p.line}" stroke-opacity=".7" stroke-width="1.2"`) + line(cx + 40, y + 5.5, x + w - 30, y + 5.5, `stroke="${p.line}" stroke-opacity=".7" stroke-width="1.2"`)
      break
    }
    case "frost": {
      out += pth(d, `fill="none" stroke="${p.line}" stroke-width="2.4"`)
      out += pth(shapePath("frost", x + 9, y + 9, w - 18, h - 18, th), `fill="none" stroke="#bfe3ff" stroke-opacity=".32" stroke-width="1.2"`)
      out += snowflake(x + 6, y + 6, 20, "#d6ecff", 1.8, 0.95) + snowflake(x + w - 6, y + h - 6, 20, "#d6ecff", 1.8, 0.95)
      break
    }
    case "book": {
      out += `<g clip-path="url(#${sid})">${rect(x, y, 18, h, `fill="${p.accent}" opacity=".35"`)}${line(x + 18, y, x + 18, y + h, `stroke="${p.line}" stroke-opacity=".8" stroke-width="2"`)}</g>`
      out += pth(d, `fill="none" stroke="${p.line}" stroke-width="2.4"`)
      if (w > 400 && h >= 200) out += pth(`M${x + w - 74} ${y}V${y + 58}L${x + w - 58} ${y + 42}L${x + w - 42} ${y + 58}V${y}Z`, `fill="${p.accent2}" stroke="${p.bg[0]}" stroke-width="1.5"`)
      break
    }
    case "min": {
      out += pth(d, `fill="none" stroke="${p.line}" stroke-width="1.6"`)
      const L = 18
      const br = (bx, by, sx, sy) => `M${bx} ${by + sy * L}V${by}H${bx + sx * L}`
      out += pth(br(x - 6, y - 6, 1, 1) + br(x + w + 6, y - 6, -1, 1) + br(x - 6, y + h + 6, 1, -1) + br(x + w + 6, y + h + 6, -1, -1), `fill="none" stroke="${p.accent}" stroke-width="1.8"`)
      break
    }
    case "ornate": {
      out += pth(d, `fill="none" stroke="${p.line}" stroke-width="2.2"`)
      out += pth(shapePath("ornate", x + 10, y + 10, w - 20, h - 20, th), `fill="none" stroke="${p.line}" stroke-opacity=".5" stroke-width="1"`)
      const s = Math.min(1, h / 180) * 0.62
      out += flourish(x + 12, y + 12, s, p.accent, 2, [1, 1]) + flourish(x + w - 12, y + 12, s, p.accent, 2, [-1, 1]) + flourish(x + 12, y + h - 12, s, p.accent, 2, [1, -1]) + flourish(x + w - 12, y + h - 12, s, p.accent, 2, [-1, -1])
      out += pth(`M${cx - 14} ${y}L${cx} ${y - 12}L${cx + 14} ${y}L${cx} ${y + 12}Z`, `fill="${p.bg[0]}" stroke="${p.line}" stroke-width="2"`)
      if (th.bowFrames && hole) out += bow(cx, y + 6, 0.55, p.accent2, p.accent)
      break
    }
    case "chrome": {
      out += pth(d, `fill="none" stroke="url(#gChrome)" stroke-width="10"`)
      out += pth(d, `fill="none" stroke="#000" stroke-width="2" stroke-opacity=".6"`)
      out += pth(shapePath("chrome", x + 9, y + 9, w - 18, h - 18, th), `fill="none" stroke="#fff" stroke-opacity=".28" stroke-width="1.5"`)
      if (hole) {
        for (const [qx, qy] of [[x + 6, y + 6], [x + w - 6, y + h - 6]]) out += pth(starPath(qx, qy, 15, 6, 4), `fill="url(#gChrome)" stroke="#fff" stroke-opacity=".6" stroke-width="1"`)
      }
      break
    }
    case "vhs": {
      out += pth(d, `fill="none" stroke="${p.line}" stroke-width="2.4" stroke-opacity=".8"`)
      const L = 40
      const br = (bx, by, sx, sy) => `M${bx + sx * 14} ${by + sy * (14 + L)}V${by + sy * 14}H${bx + sx * (14 + L)}`
      out += pth(br(x, y, 1, 1) + br(x + w, y, -1, 1) + br(x, y + h, 1, -1) + br(x + w, y + h, -1, -1), `fill="none" stroke="#fff" stroke-width="3" opacity=".85"`)
      if (hole) {
        out += circ(x + 44, y + 44, 8, `fill="#ff3b3b"`) + text(x + 62, y + 52, "REC", { font: "vt", size: 28, fill: "#fff", ls: 2 })
        out += text(x + w - 40, y + 52, "00:31:07", { font: "vt", size: 28, fill: "#fff", anchor: "end", ls: 2 })
      }
      break
    }
    case "scallop": {
      out += pth(d, `fill="none" stroke="${p.line}" stroke-width="3" stroke-linejoin="round"`)
      out += pth(d, `fill="none" stroke="#fff" stroke-width="1.5" stroke-opacity=".35" transform="translate(0 3)"`)
      break
    }
    case "snowcap": {
      out += pth(d, `fill="none" stroke="${p.line}" stroke-width="2.4"`)
      const big = h >= 250
      if (big) {
        const n = Math.max(3, Math.round(w / 70))
        let cap = `M${x - 8} ${y + 8}`
        const bw = (w + 16) / n
        for (let i = 0; i < n; i++) cap += `q${bw * 0.25} ${-34 - (i % 2) * 8} ${bw * 0.5} ${-6}t${bw * 0.5} 6`
        cap += `V${y + 22}`
        for (let i = n - 1; i >= 0; i--) cap += `q${-bw * 0.25} 20 ${-bw * 0.5} 6t${-bw * 0.5} -6`
        cap += "Z"
        out += pth(cap, `fill="#f5f9ff" stroke="#bcd4f2" stroke-width="1.2"`)
      } else {
        out += pth(`M${x + 14} ${y - 1}H${x + w - 14}`, `stroke="#f5f9ff" stroke-width="6" stroke-linecap="round"`)
        for (let i = 0; i < Math.floor(w / 120); i++) out += circ(x + 40 + i * 120 + (i % 2) * 30, y - 5, 5, `fill="#f5f9ff"`)
      }
      if (hole) for (let i = 0; i < Math.floor(w / 90); i++) out += circ(x + 30 + i * 90, y + h + 8, 6, `fill="${[p.accent, p.accent2, "#ff5d5d", "#ffd66b"][i % 4]}" filter="url(#glowS)"`)
      break
    }
    case "tomb": {
      out += pth(d, `fill="none" stroke="${p.line}" stroke-width="2.6"`)
      out += pth(shapePath("tomb", x + 12, y + 12, w - 24, h - 12, th), `fill="none" stroke="${p.line}" stroke-opacity=".4" stroke-width="1.2"`)
      break
    }
    default: {
      out += pth(d, `fill="none" stroke="${p.line}" stroke-width="2"`)
      out += pth(`M${x + 30} ${y + 1.5}H${x + w - 30}`, `stroke="#fff" stroke-opacity=".5" stroke-width="1.5" fill="none" stroke-linecap="round"`)
      if (hole && th.glassSparkle !== false) {
        out += sparkle(x + w - 8, y + 6, 22, "#fff", 0.95, `filter="url(#glowS)"`) + sparkle(x + 8, y + h - 6, 13, "#fff", 0.7)
      }
    }
  }
  return out
}

/* ---------- titles ---------- */
export function title(th, str0, cx, cy, size, o = {}) {
  const str = tc(th, str0)
  const { maxW = 1500, anchor = "middle", kind = th.titleKind } = o
  const f = th.fonts.title
  const ls = o.ls ?? th.titleLs ?? 0
  const s = fit(str, f, size, maxW, ls)
  const base = { font: f, size: s, anchor, ls, weight: th.titleWeight ?? 700, italic: !!th.titleItalic }
  const p = th.pal
  let out = ""
  switch (kind) {
    case "glitch": {
      out += text(cx - 6, cy, str, { ...base, fill: "#22e8ff", op: 0.85 }) + text(cx + 6, cy, str, { ...base, fill: "#ff2fb0", op: 0.85 })
      out += text(cx, cy, str, { ...base, fill: "#fff" })
      const id1 = nid("gb"), id2 = nid("gb")
      out += `<defs><clipPath id="${id1}"><rect x="0" y="${cy - s * 0.55}" width="${W}" height="${s * 0.14}"/></clipPath><clipPath id="${id2}"><rect x="0" y="${cy - s * 0.12}" width="${W}" height="${s * 0.1}"/></clipPath></defs>`
      out += `<g clip-path="url(#${id1})" transform="translate(22 0)">${text(cx, cy, str, { ...base, fill: p.accent })}</g><g clip-path="url(#${id2})" transform="translate(-26 0)">${text(cx, cy, str, { ...base, fill: p.accent2 })}</g>`
      break
    }
    case "drip": {
      out += text(cx + 6, cy + 7, str, { ...base, fill: "#000", op: 0.9 })
      out += text(cx, cy, str, { ...base, fill: p.title[0], stroke: "#000", sw: 10 })
      out += text(cx, cy, str, { ...base, fill: "url(#gTitle)" })
      const r = rng(hash(str))
      const wEst = Math.min(maxW, str.length * (s * FONTS[f].cw + ls)) * 0.82
      const x0 = anchor === "middle" ? cx - wEst / 2 : cx
      out += drips(r, x0, cy - s * 0.05, wEst, p.title[1], { n: Math.max(3, Math.round(wEst / 150)), max: s * 0.2 })
      break
    }
    case "chrome": {
      out += text(cx, cy + 5, str, { ...base, fill: "#000", op: 0.7, filter: "blur6" })
      out += text(cx, cy, str, { ...base, fill: "url(#gChrome)", stroke: "#15151c", sw: 7 })
      break
    }
    case "gold": {
      out += text(cx, cy + 5, str, { ...base, fill: "#000", op: 0.7, filter: "blur6" })
      out += text(cx, cy, str, { ...base, fill: "url(#gGold)", stroke: "#2a1d08", sw: 6 })
      break
    }
    case "neon": {
      out += text(cx, cy, str, { ...base, fill: p.accent, op: 0.55, filter: "blur14" })
      out += text(cx, cy, str, { ...base, fill: "none", stroke: p.accent, sw: 3.2, filter: "glow" })
      out += text(cx, cy, str, { ...base, fill: "#fff", op: 0.12 })
      break
    }
    case "vhs": {
      out += text(cx - 5, cy, str, { ...base, fill: "#ff3b6b", op: 0.8 }) + text(cx + 5, cy, str, { ...base, fill: "#36d6ff", op: 0.8 })
      out += text(cx, cy, str, { ...base, fill: "#f3f3f3" })
      break
    }
    case "flat": {
      out += text(cx, cy, str, { ...base, fill: "url(#gTitle)" })
      break
    }
    case "plain": {
      out += text(cx + 3, cy + 4, str, { ...base, fill: "#000", op: 0.8 })
      out += text(cx, cy, str, { ...base, fill: "url(#gTitle)", stroke: "#000", sw: 6 })
      break
    }
    case "outline": {
      out += text(cx, cy, str, { ...base, fill: "none", stroke: p.text, sw: 1.6 })
      break
    }
    default: {
      // glow / script / frost
      out += text(cx, cy, str, { ...base, fill: p.accent, op: 0.55, filter: "blur14" })
      out += text(cx, cy, str, { ...base, fill: "url(#gTitle)", filter: o.softGlow === false ? undefined : "glowS" })
    }
  }
  return out
}

/* ---------- reusable elements ---------- */
const CHAT = [
  ["Luna_Fan", "this overlay is so clean", 0],
  ["NightOwl", "hype hype hype!", 1],
  ["pixel.ghost", "can we get a clip of that", 2],
  ["Mod_Rae", "welcome in everyone", 3],
  ["starlit", "the colors omg", 0],
  ["Vexx", "GG no re", 1],
  ["Moth", "first time here, love the vibe", 2],
  ["Kai_", "chat is cozy tonight", 3],
  ["Nyx", "that boss fight was wild", 0],
  ["Rowan", "lets gooo", 1],
]
export function chatLines(th, x, y, w, h, { from = 0, size = 26 } = {}) {
  const p = th.pal
  const cols = th.chatCols ?? [p.accent, p.accent2, mix(p.accent, "#fff", 0.45), mix(p.accent2, "#fff", 0.4)]
  const gap = size * 1.85
  const n = Math.max(1, Math.floor(h / gap))
  let o = ""
  for (let i = 0; i < n; i++) {
    const [nm, msg, c] = CHAT[(from + i) % CHAT.length]
    const yy = y + size + i * gap
    o += `<text x="${n1(x)}" y="${n1(yy)}" font-size="${n1(size * 0.92 * (FONTS[th.fonts.body].sz ?? 1))}"><tspan font-family="${fam(th.fonts.label)}" font-weight="700" fill="${cols[c % cols.length]}" letter-spacing="0.6">${nm}:</tspan><tspan dx="12" font-family="${fam(th.fonts.body)}" font-weight="500" fill="${p.text}" fill-opacity=".88">${msg}</tspan></text>`
  }
  return o
}

export function chatBox(th, x, y, w, h, o = {}) {
  const p = th.pal
  const kind = th.frame.chat ?? th.frame.main
  let out = box(th, kind, x, y, w, h, { role: "chat", clear: o.clear })
  const hh = 56
  out += rect(x + 2, y + 2, w - 4, hh, `fill="${p.accent}" opacity=".14" clip-path="inset(0)"`).replace(/ clip-path="inset\(0\)"/, "")
  out += icon("chat", x + 36, y + 2 + hh / 2, 24, p.accent, 2.6)
  out += text(x + 66, y + 2 + hh / 2 + 9, "STREAM CHAT", { font: th.fonts.label, size: 22, weight: 700, fill: p.text, ls: 5 })
  out += line(x + 20, y + hh + 4, x + w - 20, y + hh + 4, `stroke="${p.line}" stroke-opacity=".5"`)
  out += chatLines(th, x + 28, y + hh + 22, w - 56, h - hh - 100, { from: o.from ?? 0, size: o.size ?? 24 })
  // input
  out += rect(x + 22, y + h - 64, w - 44, 42, `rx="${th.frame.chat === "ornate" ? 4 : 21}" fill="#000" opacity=".28" stroke="${p.line}" stroke-opacity=".5"`)
  out += text(x + 44, y + h - 36, "Send a message", { font: th.fonts.body, size: 20, fill: p.text, op: 0.4, weight: 500 })
  out += circ(x + w - 50, y + h - 43, 11, `fill="${p.accent}" opacity=".9"`)
  return out
}

export function iconBlock(th, x, y, s, name) {
  const p = th.pal
  const kind = th.iconShape ?? "round"
  const cx = x + s / 2, cy = y + s / 2
  let o = ""
  if (kind === "square") o += rect(x, y, s, s, `fill="url(#gAccent)"`) + icon(name, cx, cy, s * 0.5, th.iconInk ?? "#0a0a0a", 4)
  else if (kind === "hex") {
    const hx = (r) => [0, 1, 2, 3, 4, 5].map((i) => `${n1(cx + Math.cos((i * Math.PI) / 3) * r)} ${n1(cy + Math.sin((i * Math.PI) / 3) * r)}`).join("L")
    o += pth(`M${hx(s * 0.56)}Z`, `fill="url(#gAccent)"`) + icon(name, cx, cy, s * 0.46, th.iconInk ?? "#0a0a0a", 4)
  } else {
    o += circ(cx, cy, s / 2, `fill="url(#gAccent)"`) + circ(cx, cy, s / 2 - 5, `fill="none" stroke="#fff" stroke-opacity=".5" stroke-width="2"`) + icon(name, cx, cy, s * 0.46, th.iconInk ?? "#101018", 4)
  }
  return o
}

export function alertBar(th, x, y, w, h, o = {}) {
  const p = th.pal
  const { label = "NEW FOLLOWER", name = "YOUR_NAME", ic = "heart", sub = "just followed!", clear = false } = o
  let out = box(th, th.frame.alert ?? th.frame.main, x, y, w, h, { role: "alert", clear })
  const pad = Math.min(22, h * 0.18)
  const s = h - pad * 2
  out += iconBlock(th, x + pad, y + pad, s, ic)
  const tx = x + pad * 2 + s
  out += text(tx, y + h * 0.36, label, { font: th.fonts.label, size: Math.max(16, h * 0.17), fill: p.accent, weight: 700, ls: 5 })
  const ns = fit(name, th.fonts.title, Math.min(60, h * 0.42), w - (tx - x) - 220, sls(th))
  out += text(tx, y + h * 0.74, name, { font: th.fonts.title, size: ns, fill: p.text, weight: th.titleWeight ?? 700, ls: sls(th) })
  out += text(x + w - 28, y + h * 0.74, sub, { font: th.fonts.body, size: Math.max(18, h * 0.19), fill: p.text, op: 0.6, anchor: "end", weight: 500, italic: th.subItalic })
  return out
}

export function nameplate(th, x, y, w, h, str = "YOUR_NAME", { clear = false, empty = false } = {}) {
  const p = th.pal
  let out = box(th, th.frame.plate ?? th.frame.main, x, y, w, h, { role: "plate", clear })
  if (!empty) {
    const s = fit(str, th.fonts.title, h * 0.46, w - 60, sls(th))
    out += text(x + w / 2, y + h * 0.66, tc(th, str), { font: th.fonts.title, size: s, fill: "url(#gTitle)", anchor: "middle", weight: th.titleWeight ?? 700, ls: sls(th) })
  }
  return out
}

export function panelBanner(th, x, y, w, h, o = {}) {
  const p = th.pal
  const { name: name0 = "ABOUT ME", ic = "user", lines = 2, clear = false } = o
  const name = tc(th, name0)
  let out = box(th, th.frame.panel ?? th.frame.main, x, y, w, h, { role: "panel", clear })
  const s = h * 0.42
  const cx = x + 60 + s / 2, cy = y + h * 0.4
  out += iconBlock(th, x + 44, y + h * 0.4 - s / 2, s, ic)
  const ts = fit(name, th.fonts.title, h * 0.2, w - (s + 120) - 24, sls(th))
  out += text(x + 44 + s + 28, y + h * 0.4 + ts * 0.34, name, { font: th.fonts.title, size: ts, fill: "url(#gTitle)", weight: th.titleWeight ?? 700, ls: sls(th) })
  out += line(x + 44, y + h * 0.66, x + w - 44, y + h * 0.66, `stroke="${p.line}" stroke-opacity=".6" stroke-width="1.6"`)
  for (let i = 0; i < lines; i++) out += rect(x + 44, y + h * 0.74 + i * 22, (w - 88) * (i === lines - 1 ? 0.55 : 0.9), 8, `rx="4" fill="${p.text}" opacity=".22"`)
  return out
}

export function socialRow(th, x, y, items = ["twitch.tv/yourname", "@yourname", "discord.gg/you"], { size = 24, anchor = "start", gap = 54 } = {}) {
  const p = th.pal
  let o = ""
  let cx = x
  const icons = ["cam", "chat", "game"]
  items.forEach((s, i) => {
    const wEst = s.length * size * 0.56 + 44
    const sx = anchor === "middle" ? x - (items.reduce((a, t) => a + t.length * size * 0.56 + 44 + gap, -gap)) / 2 + (cx - x) : cx
    o += icon(icons[i % 3], sx + 12, y - size * 0.3, size * 0.9, p.accent, 2.4)
    o += text(sx + 36, y, s, { font: th.fonts.label, size, fill: p.text, op: 0.78, weight: 500, ls: 1 })
    cx += wEst + gap
  })
  return o
}
