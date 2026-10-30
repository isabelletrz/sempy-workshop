import { W, H, n1, rect, circ, line, pth, g, sparkle, heartPath, starPath, roundedRectPath, rgba, mix } from "./lib.mjs"

export function starfield(r, n, { x0 = 0, y0 = 0, w = W, h = H, cols = ["#fff"], rmin = 0.6, rmax = 2.2, sp = 0.06, op = [0.35, 1] } = {}) {
  let o = ""
  for (let i = 0; i < n; i++) {
    const x = x0 + r() * w, y = y0 + r() * h
    const c = cols[Math.floor(r() * cols.length)]
    const a = op[0] + r() * (op[1] - op[0])
    if (r() < sp) o += sparkle(x, y, 5 + r() * 12, c, a)
    else o += circ(x, y, rmin + r() * (rmax - rmin), `fill="${c}" opacity="${n1(a)}"`)
  }
  return o
}

export function moon(id, cx, cy, r, { tint = "#e9e4ff", shade = "#8d86c9", craters = true, glow = "#9d8cff", rot = 0 } = {}) {
  const cr = [
    [-0.28, -0.22, 0.2], [0.3, -0.3, 0.13], [0.1, 0.25, 0.24], [-0.4, 0.28, 0.1], [0.42, 0.18, 0.11], [-0.05, -0.5, 0.08], [0.55, -0.02, 0.07],
  ]
  return `<defs>
<radialGradient id="${id}" cx=".36" cy=".32" r=".85"><stop offset="0" stop-color="#ffffff"/><stop offset=".45" stop-color="${tint}"/><stop offset="1" stop-color="${shade}"/></radialGradient>
<radialGradient id="${id}h" cx=".5" cy=".5" r=".5"><stop offset=".6" stop-color="${glow}" stop-opacity=".45"/><stop offset="1" stop-color="${glow}" stop-opacity="0"/></radialGradient></defs>
${circ(cx, cy, r * 1.7, `fill="url(#${id}h)"`)}
${circ(cx, cy, r, `fill="url(#${id})"`)}
${craters ? cr.map(([a, b, c]) => circ(cx + a * r, cy + b * r, c * r, `fill="${shade}" opacity=".28"`)).join("") : ""}
${circ(cx, cy, r, `fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="2"`)}`
}

export function cloud(x, y, s, { fill = "#fff", op = 1, shade = null } = {}) {
  const c = (dx, dy, r) => circ(x + dx * s, y + dy * s, r * s)
  const body = `${c(0, 0, 38)}${c(46, -22, 52)}${c(104, -8, 42)}${c(150, 4, 30)}${c(-34, 10, 26)}${rect(x - 54 * s, y + 4 * s, 218 * s, 38 * s, `rx="${19 * s}"`)}`
  return `<g fill="${fill}" opacity="${op}">${body}</g>${shade ? `<g fill="${shade}" opacity="${op * 0.5}" transform="translate(0 ${10 * s})"><rect x="${x - 40 * s}" y="${y + 22 * s}" width="${190 * s}" height="${18 * s}" rx="${9 * s}"/></g>` : ""}`
}

export function shootingStar(x, y, len, ang, col = "#fff", wd = 3, id = "ss") {
  const a = (ang * Math.PI) / 180
  const x2 = x - Math.cos(a) * len, y2 = y - Math.sin(a) * len
  const gid = `${id}${Math.round(x)}${Math.round(y)}`
  return `<defs><linearGradient id="${gid}" gradientUnits="userSpaceOnUse" x1="${n1(x)}" y1="${n1(y)}" x2="${n1(x2)}" y2="${n1(y2)}"><stop offset="0" stop-color="${col}"/><stop offset="1" stop-color="${col}" stop-opacity="0"/></linearGradient></defs>
${line(x, y, x2, y2, `stroke="url(#${gid})" stroke-width="${wd}" stroke-linecap="round"`)}${circ(x, y, wd * 1.1, `fill="#fff"`)}${sparkle(x, y, wd * 4, "#fff", 0.9)}`
}

export function firTree(x, y, h, fill = "#0b1a14", snow = "#e8f1ff") {
  const w = h * 0.55
  let o = ""
  const tiers = 4
  for (let i = 0; i < tiers; i++) {
    const ty = y - h + (i * h * 0.78) / tiers
    const tw = (w * (0.45 + (i + 1) / tiers * 0.55)) / 2
    const th = (h * 0.42)
    o += pth(`M${x} ${ty}L${x + tw} ${ty + th}L${x - tw} ${ty + th}Z`, `fill="${fill}"`)
    if (snow) o += pth(`M${x} ${ty}L${x + tw * 0.34} ${ty + th * 0.34}Q${x + tw * 0.1} ${ty + th * 0.3} ${x} ${ty + th * 0.4}Q${x - tw * 0.1} ${ty + th * 0.3} ${x - tw * 0.34} ${ty + th * 0.34}Z`, `fill="${snow}" opacity=".5"`)
  }
  o += rect(x - h * 0.035, y - h * 0.08, h * 0.07, h * 0.1, `fill="${fill}"`)
  return o
}

export function snowflake(x, y, r, stroke = "#dbeafe", sw = 2, op = 0.9) {
  let o = ""
  for (let i = 0; i < 6; i++) {
    const a = (i * Math.PI) / 3
    const ex = x + Math.cos(a) * r, ey = y + Math.sin(a) * r
    o += line(x, y, ex, ey)
    for (const t of [0.5, 0.75]) {
      const bx = x + Math.cos(a) * r * t, by = y + Math.sin(a) * r * t
      const bl = r * (t === 0.5 ? 0.3 : 0.2)
      o += line(bx, by, bx + Math.cos(a + 0.8) * bl, by + Math.sin(a + 0.8) * bl)
      o += line(bx, by, bx + Math.cos(a - 0.8) * bl, by + Math.sin(a - 0.8) * bl)
    }
  }
  return `<g stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" opacity="${op}" fill="none">${o}</g>`
}

export function tombstone(x, y, w, h, fill, { cross = false, stroke = null, rip = null, ripFill = "#fff", font = "serif" } = {}) {
  const r = w / 2
  let o = pth(`M${x} ${y}V${y - h + r}A${r} ${r} 0 0 1 ${x + w} ${y - h + r}V${y}Z`, `fill="${fill}"${stroke ? ` stroke="${stroke}" stroke-width="2"` : ""}`)
  if (cross) {
    const cx = x + w / 2, cy = y - h + r + 6
    o += rect(cx - 3, cy - 18, 6, 44, `fill="${stroke ?? "#000"}" opacity=".5"`) + rect(cx - 16, cy - 6, 32, 6, `fill="${stroke ?? "#000"}" opacity=".5"`)
  }
  return o
}

export function pentagram(cx, cy, r, stroke, sw = 3, ring = true, op = 1) {
  const pts = []
  for (let i = 0; i < 5; i++) {
    const a = -Math.PI / 2 + (i * 4 * Math.PI) / 5
    pts.push(`${n1(cx + Math.cos(a) * r)} ${n1(cy + Math.sin(a) * r)}`)
  }
  return `<g fill="none" stroke="${stroke}" stroke-width="${sw}" opacity="${op}" stroke-linejoin="round">${ring ? circ(cx, cy, r) + circ(cx, cy, r * 1.08, `stroke-width="${sw * 0.5}"`) : ""}<path d="M${pts.join("L")}Z"/></g>`
}

export function bat(x, y, s, fill = "#000", rot = 0) {
  // symmetric bat, wingspan ~ 100*s
  const d = `M0 -6 C6 -14 10 -12 12 -4 C24 -16 44 -20 62 -4 C54 -6 48 -2 46 6 C40 -2 32 0 28 8 C24 2 16 2 12 8 C10 14 4 18 0 24 C-4 18 -10 14 -12 8 C-16 2 -24 2 -28 8 C-32 0 -40 -2 -46 6 C-48 -2 -54 -6 -62 -4 C-44 -20 -24 -16 -12 -4 C-10 -12 -6 -14 0 -6Z`
  return `<g transform="translate(${n1(x)} ${n1(y)}) rotate(${rot}) scale(${s})" fill="${fill}"><path d="${d}"/></g>`
}

export function pumpkin(x, y, s, body = "#ff7a1a", dark = "#b34a00", face = "#1a0a05", glowc = "#ffcc55") {
  const lobe = (dx, rx) => `<ellipse cx="${x + dx * s}" cy="${y}" rx="${rx * s}" ry="${44 * s}" fill="${body}" stroke="${dark}" stroke-width="${2 * s}"/>`
  return `${circ(x, y, 90 * s, `fill="${glowc}" opacity=".12" filter="url(#blur30)"`)}
${lobe(-34, 30)}${lobe(34, 30)}${lobe(-16, 30)}${lobe(16, 30)}
<path d="M${x - 4 * s} ${y - 40 * s}q${4 * s} ${-16 * s} ${14 * s} ${-18 * s}" stroke="#3a5a1a" stroke-width="${7 * s}" fill="none" stroke-linecap="round"/>
<path d="M${x - 28 * s} ${y - 12 * s}l${12 * s} ${-14 * s}l${12 * s} ${14 * s}z M${x + 4 * s} ${y - 12 * s}l${12 * s} ${-14 * s}l${12 * s} ${14 * s}z M${x - 30 * s} ${y + 12 * s}q${30 * s} ${26 * s} ${60 * s} 0l${-8 * s} ${10 * s}l${-10 * s} ${-6 * s}l${-10 * s} ${8 * s}l${-10 * s} ${-8 * s}l${-10 * s} ${6 * s}z" fill="${face}"/>`
}

export function ghostSheet(x, y, s, fill = "#e8ecff", eye = "#1a1a2a", op = 1) {
  const d = `M${x - 40 * s} ${y + 50 * s}V${y - 10 * s}C${x - 40 * s} ${y - 62 * s} ${x + 40 * s} ${y - 62 * s} ${x + 40 * s} ${y - 10 * s}V${y + 50 * s}l${-13 * s} ${-12 * s}l${-13.5 * s} ${12 * s}l${-13.5 * s} ${-12 * s}l${-13.5 * s} ${12 * s}l${-13.5 * s} ${-12 * s}Z`
  return `<g opacity="${op}"><path d="${d}" fill="${fill}"/>${circ(x - 14 * s, y - 14 * s, 6 * s, `fill="${eye}"`)}${circ(x + 14 * s, y - 14 * s, 6 * s, `fill="${eye}"`)}<ellipse cx="${x}" cy="${y + 6 * s}" rx="${6 * s}" ry="${8 * s}" fill="${eye}"/></g>`
}

export function cobweb(x, y, s, flipX = 1, flipY = 1, stroke = "#ffffff", op = 0.35) {
  let o = ""
  const rays = 6
  for (let i = 0; i <= rays; i++) {
    const a = (i * Math.PI) / 2 / rays
    o += line(0, 0, Math.cos(a) * s, Math.sin(a) * s)
  }
  for (let k = 1; k <= 6; k++) {
    const rr = (s * k) / 6
    let d = ""
    for (let i = 0; i <= rays; i++) {
      const a = (i * Math.PI) / 2 / rays
      const px = Math.cos(a) * rr, py = Math.sin(a) * rr
      if (i === 0) d += `M${n1(px)} ${n1(py)}`
      else {
        const am = ((i - 0.5) * Math.PI) / 2 / rays
        d += `Q${n1(Math.cos(am) * rr * 0.86)} ${n1(Math.sin(am) * rr * 0.86)} ${n1(px)} ${n1(py)}`
      }
    }
    o += `<path d="${d}"/>`
  }
  return `<g transform="translate(${x} ${y}) scale(${flipX} ${flipY})" stroke="${stroke}" stroke-width="1.4" fill="none" opacity="${op}">${o}</g>`
}

export function candle(x, y, h, { wax = "#e9dfc8", flame = "#ffb347", glowc = "#ff9a3c", glowR = 120 } = {}) {
  const w = h * 0.32
  return `${circ(x, y - h - 12, glowR, `fill="${glowc}" opacity=".22" filter="url(#blur30)"`)}
${rect(x - w / 2, y - h, w, h, `rx="3" fill="${wax}"`)}
${pth(`M${x - w / 2} ${y - h}q${w * 0.2} ${h * 0.25} ${w * 0.1} ${h * 0.3}q${w * 0.15} 4 ${w * 0.2} ${-h * 0.3}`, `fill="#fff" opacity=".5"`)}
${rect(x - 1.5, y - h - 8, 3, 9, `fill="#222"`)}
<path d="M${x} ${y - h - 46}C${x + 12} ${y - h - 26} ${x + 12} ${y - h - 12} ${x} ${y - h - 8}C${x - 12} ${y - h - 12} ${x - 12} ${y - h - 26} ${x} ${y - h - 46}Z" fill="${flame}" filter="url(#glowS)"/>
<path d="M${x} ${y - h - 28}C${x + 5} ${y - h - 20} ${x + 5} ${y - h - 14} ${x} ${y - h - 11}C${x - 5} ${y - h - 14} ${x - 5} ${y - h - 20} ${x} ${y - h - 28}Z" fill="#fff6d0"/>`
}

export function bookshelf(r, x, y, w, h, { frame = "#1a0f14", cols = ["#4a1d2e", "#2c2a54", "#5a3a1a", "#1d3a38", "#52252a"], shelves = 4, trim = "#caa45d" } = {}) {
  let o = rect(x, y, w, h, `fill="${frame}"`)
  const sh = h / shelves
  for (let s = 0; s < shelves; s++) {
    const sy = y + s * sh
    let bx = x + 8
    while (bx < x + w - 10) {
      const bw = 12 + r() * 18
      const bh = sh * (0.62 + r() * 0.3)
      const c = cols[Math.floor(r() * cols.length)]
      if (bx + bw > x + w - 8) break
      o += rect(bx, sy + sh - 8 - bh, bw, bh, `fill="${c}"`)
      o += rect(bx + 2, sy + sh - 8 - bh + 8, bw - 4, 2, `fill="${trim}" opacity=".7"`)
      o += rect(bx + 2, sy + sh - 8 - 12, bw - 4, 2, `fill="${trim}" opacity=".5"`)
      bx += bw + (r() < 0.12 ? 10 : 1)
    }
    o += rect(x, sy + sh - 8, w, 8, `fill="${frame}"`) + rect(x, sy + sh - 8, w, 2, `fill="${trim}" opacity=".35"`)
  }
  o += rect(x, y, 6, h, `fill="${trim}" opacity=".3"`) + rect(x + w - 6, y, 6, h, `fill="${trim}" opacity=".3"`)
  return o
}

export function roseWindow(cx, cy, R, cols, { lead = "#0b0716", op = 1 } = {}) {
  let o = ""
  const n = 12
  for (let i = 0; i < n; i++) {
    const a0 = (i * 2 * Math.PI) / n, a1 = ((i + 1) * 2 * Math.PI) / n
    const r1 = R * 0.34, r2 = R * 0.66, r3 = R
    const p = (r, a) => `${n1(cx + Math.cos(a) * r)} ${n1(cy + Math.sin(a) * r)}`
    const c = cols[i % cols.length]
    o += pth(`M${p(r1, a0)}L${p(r2, a0)}A${r2} ${r2} 0 0 1 ${p(r2, a1)}L${p(r1, a1)}A${r1} ${r1} 0 0 0 ${p(r1, a0)}Z`, `fill="${cols[(i + 1) % cols.length]}" stroke="${lead}" stroke-width="5"`)
    o += pth(`M${p(r2, a0)}L${p(r3, a0)}A${r3} ${r3} 0 0 1 ${p(r3, a1)}L${p(r2, a1)}A${r2} ${r2} 0 0 0 ${p(r2, a0)}Z`, `fill="${c}" stroke="${lead}" stroke-width="5"`)
    const am = (a0 + a1) / 2
    o += circ(cx + Math.cos(am) * R * 0.83, cy + Math.sin(am) * R * 0.83, R * 0.05, `fill="#fff" opacity=".35"`)
  }
  o += circ(cx, cy, R * 0.34, `fill="${cols[0]}" stroke="${lead}" stroke-width="6"`)
  o += circ(cx, cy, R * 0.14, `fill="#fff" opacity=".5"`)
  o += circ(cx, cy, R, `fill="none" stroke="${lead}" stroke-width="12"`)
  return `<g opacity="${op}">${o}</g>`
}

export function archWindow(x, y, w, h, cols, { lead = "#0b0716", op = 1, glow = null } = {}) {
  const r = w / 2
  const outline = `M${x} ${y + h}V${y + h * 0.4}C${x} ${y + h * 0.22} ${x + r * 0.55} ${y + h * 0.1} ${x + r} ${y}C${x + r * 1.45} ${y + h * 0.1} ${x + w} ${y + h * 0.22} ${x + w} ${y + h * 0.4}V${y + h}Z`
  const id = `aw${Math.round(x)}${Math.round(y)}`
  let o = `<defs><clipPath id="${id}"><path d="${outline}"/></clipPath></defs>`
  let panes = ""
  const cols_n = 3
  const pw = w / cols_n
  const rows = 6
  const ph = h / rows
  for (let c = 0; c < cols_n; c++) for (let rr = 0; rr < rows; rr++) {
    panes += rect(x + c * pw, y + rr * ph, pw + 1, ph + 1, `fill="${cols[(c * 2 + rr * 3) % cols.length]}"`)
  }
  o += `<g clip-path="url(#${id})" opacity="${op}">${panes}${circ(x + r, y + h * 0.26, w * 0.14, `fill="${cols[0]}" stroke="${lead}" stroke-width="4"`)}`
  for (let c = 1; c < cols_n; c++) o += line(x + c * pw, y, x + c * pw, y + h, `stroke="${lead}" stroke-width="5"`)
  for (let rr = 1; rr < rows; rr++) o += line(x, y + rr * ph, x + w, y + rr * ph, `stroke="${lead}" stroke-width="3"`)
  o += `</g>` + pth(outline, `fill="none" stroke="${lead}" stroke-width="10" opacity="${op}"`)
  if (glow) o = pth(outline, `fill="${glow}" opacity=".35" filter="url(#blur30)"`) + o
  return o
}

export function skyline(r, y, w, fill, win = "#ffd66b", { x0 = 0, minH = 60, maxH = 320, winP = 0.12 } = {}) {
  let o = ""
  let x = x0
  while (x < x0 + w) {
    const bw = 40 + r() * 90
    const bh = minH + r() * (maxH - minH)
    o += rect(x, y - bh, bw, bh, `fill="${fill}"`)
    if (r() < 0.3) o += rect(x + bw / 2 - 2, y - bh - 40, 4, 40, `fill="${fill}"`)
    for (let wy = y - bh + 14; wy < y - 12; wy += 18) for (let wx = x + 8; wx < x + bw - 10; wx += 14) if (r() < winP) o += rect(wx, wy, 6, 9, `fill="${win}" opacity="${n1(0.4 + r() * 0.6)}"`)
    x += bw + (r() < 0.3 ? 8 : 0)
  }
  return o
}

export function perspGrid(y0, color, { lines = 22, rows = 12, op = 0.55, sw = 1.6 } = {}) {
  let o = ""
  const vx = W / 2
  for (let i = -lines; i <= lines; i++) o += line(vx + i * 40, y0, vx + i * 220, H)
  for (let k = 0; k < rows; k++) {
    const t = Math.pow(k / rows, 2.2)
    o += line(0, y0 + t * (H - y0), W, y0 + t * (H - y0))
  }
  return `<g stroke="${color}" stroke-width="${sw}" opacity="${op}">${o}</g>`
}

export function dahlia(cx, cy, R, c1, c2, { layers = 4, rot = 0, stroke = null } = {}) {
  let o = ""
  const id = `dh${Math.round(cx)}${Math.round(cy)}`
  o += `<defs><radialGradient id="${id}" cx=".5" cy=".5" r=".5"><stop offset="0" stop-color="${c2}"/><stop offset="1" stop-color="${c1}"/></radialGradient></defs>`
  for (let L = 0; L < layers; L++) {
    const rr = R * (1 - L * 0.2)
    const n = 12 + L * 2
    for (let i = 0; i < n; i++) {
      const a = rot + (i * 360) / n + L * 9
      o += `<ellipse cx="0" cy="${-rr * 0.52}" rx="${rr * 0.2}" ry="${rr * 0.5}" transform="translate(${cx} ${cy}) rotate(${n1(a)})" fill="url(#${id})" opacity="${n1(0.78 + L * 0.06)}" ${stroke ? `stroke="${stroke}" stroke-width="1.2"` : ""}/>`
    }
  }
  o += circ(cx, cy, R * 0.1, `fill="${c2}"`)
  return o
}

export function bow(cx, cy, s, fill = "#f5a3c7", dark = "#a8416e") {
  const loop = (d) => `<path d="M0 0C${d * 30} ${-34} ${d * 74} ${-38} ${d * 82} ${-6}C${d * 86} 22 ${d * 40} 30 0 0Z" fill="${fill}" stroke="${dark}" stroke-width="2.5"/>`
  return `<g transform="translate(${cx} ${cy}) scale(${s})">
<path d="M0 6C-12 30 -22 50 -34 66L-14 60L-6 74Z" fill="${fill}" stroke="${dark}" stroke-width="2.5"/>
<path d="M0 6C12 30 22 50 34 66L14 60L6 74Z" fill="${fill}" stroke="${dark}" stroke-width="2.5"/>
${loop(-1)}${loop(1)}
<path d="M-34 -14C-20 -22 -10 -6 -6 4M34 -14C20 -22 10 -6 6 4" stroke="${dark}" stroke-width="2" fill="none" opacity=".6"/>
<ellipse cx="0" cy="-2" rx="13" ry="15" fill="${fill}" stroke="${dark}" stroke-width="2.5"/></g>`
}

export function holoFlower(cx, cy, R, c1, c2, { petals = 8, rot = 0, sw = 2 } = {}) {
  let o = ""
  for (let L = 0; L < 3; L++) {
    const rr = R * (1 - L * 0.26)
    for (let i = 0; i < petals; i++) {
      const a = rot + (i * 360) / petals + L * (180 / petals)
      o += `<path d="M0 0C${rr * 0.34} ${-rr * 0.3} ${rr * 0.28} ${-rr * 0.8} 0 ${-rr}C${-rr * 0.28} ${-rr * 0.8} ${-rr * 0.34} ${-rr * 0.3} 0 0Z" transform="translate(${cx} ${cy}) rotate(${n1(a)})" fill="${c1}" fill-opacity="${n1(0.05 + L * 0.03)}" stroke="${L % 2 ? c2 : c1}" stroke-width="${sw}"/>`
    }
  }
  o += circ(cx, cy, R * 0.08, `fill="${c2}" filter="url(#glowS)"`)
  return `<g>${o}</g>`
}

export function cat(x, y, s, fill = "#07040a", eye = "#ffd36b") {
  // sitting cat silhouette, base at y, facing front, height ~140*s
  return `<g transform="translate(${x} ${y}) scale(${s})" fill="${fill}">
<path d="M-46 0C-60 -40 -52 -86 -34 -102L-38 -134L-14 -112C-6 -114 6 -114 14 -112L38 -134L34 -102C52 -86 60 -40 46 0Z"/>
<path d="M44 -8C86 -4 100 -50 76 -74C94 -50 70 -26 40 -26Z"/>
<ellipse cx="-14" cy="-90" rx="6" ry="9" fill="${eye}"/><ellipse cx="14" cy="-90" rx="6" ry="9" fill="${eye}"/>
<ellipse cx="-14" cy="-90" rx="2" ry="8" fill="#000"/><ellipse cx="14" cy="-90" rx="2" ry="8" fill="#000"/></g>`
}

export function splatter(r, x, y, R, fill = "#fff", n = 70) {
  let o = ""
  for (let i = 0; i < n; i++) {
    const a = r() * Math.PI * 2
    const d = Math.pow(r(), 0.6) * R
    const rr = Math.max(1, (1 - d / R) * (3 + r() * 14))
    o += circ(x + Math.cos(a) * d, y + Math.sin(a) * d, rr, `fill="${fill}"`)
    if (r() < 0.25) {
      const l = 10 + r() * 50
      o += pth(`M${n1(x + Math.cos(a) * d)} ${n1(y + Math.sin(a) * d)}L${n1(x + Math.cos(a) * (d + l))} ${n1(y + Math.sin(a) * (d + l))}`, `stroke="${fill}" stroke-width="${n1(1 + r() * 3)}" stroke-linecap="round"`)
    }
  }
  return o
}

export function brushStroke(r, x, y, w, h, fill = "#fff", rot = 0) {
  // rough horizontal brush swipe
  let top = "", bot = ""
  const steps = 22
  for (let i = 0; i <= steps; i++) {
    const px = x + (w * i) / steps
    top += `${i ? "L" : "M"}${n1(px)} ${n1(y + (r() - 0.5) * h * 0.35)}`
  }
  for (let i = steps; i >= 0; i--) {
    const px = x + (w * i) / steps
    bot += `L${n1(px)} ${n1(y + h + (r() - 0.5) * h * 0.35)}`
  }
  return `<g transform="rotate(${rot} ${x + w / 2} ${y + h / 2})"><path d="${top}${bot}Z" fill="${fill}" filter="url(#rough2)"/></g>`
}

export function drips(r, x, y, w, fill, { n = 9, max = 70 } = {}) {
  let o = ""
  for (let i = 0; i < n; i++) {
    const dx = x + (w * (i + 0.2 + r() * 0.6)) / n
    const len = 14 + r() * max
    const wd = 5 + r() * 8
    o += rect(dx - wd / 2, y - 2, wd, len, `rx="${wd / 2}" fill="${fill}"`)
    o += circ(dx, y + len, wd * 0.8, `fill="${fill}"`)
  }
  return o
}

export function chromeHeart(cx, cy, s, op = 1, rot = 0) {
  const d = heartPath(0, 0, s)
  return `<g transform="translate(${cx} ${cy}) rotate(${rot})" opacity="${op}"><path d="${d}" fill="url(#gChrome)" stroke="#fff" stroke-opacity=".7" stroke-width="2"/><path d="${heartPath(-s * 0.05, -s * 0.12, s * 0.72)}" fill="none" stroke="#fff" stroke-opacity=".55" stroke-width="3" stroke-linecap="round" stroke-dasharray="${s * 0.5} ${s * 3}"/></g>`
}

export function thornCross(cx, cy, s, fill = "url(#gChrome)", op = 1) {
  const a = s * 0.09, L = s
  const d = `M${-a} ${-L}H${a}V${-L * 0.38}H${L * 0.45}V${-L * 0.38 + a * 2}H${a}V${L * 0.6}L0 ${L}L${-a} ${L * 0.6}V${-L * 0.38 + a * 2}H${-L * 0.45}V${-L * 0.38}H${-a}Z`
  return `<g transform="translate(${cx} ${cy})" opacity="${op}"><path d="${d}" fill="${fill}" stroke="#fff" stroke-opacity=".6" stroke-width="2"/></g>`
}

export function flourish(x, y, s, stroke, sw = 2.2, flip = [1, 1], op = 1) {
  const d = `M0 0C40 0 70 -10 70 -40C70 -64 40 -66 38 -46C37 -34 52 -32 54 -42M0 0C0 40 -10 70 -40 70C-64 70 -66 40 -46 38C-34 37 -32 52 -42 54M12 12C34 12 50 24 60 44M12 12C12 34 24 50 44 60`
  return `<g transform="translate(${x} ${y}) scale(${s * flip[0]} ${s * flip[1]})" fill="none" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" opacity="${op}"><path d="${d}"/></g>`
}

export function scanlines(op = 0.12, gap = 4, color = "#000") {
  return `<defs><pattern id="scan" width="4" height="${gap}" patternUnits="userSpaceOnUse"><rect width="4" height="${gap / 2}" fill="${color}"/></pattern></defs>${rect(0, 0, W, H, `fill="url(#scan)" opacity="${op}"`)}`
}

export function grainOverlay(op = 0.08) {
  return rect(0, 0, W, H, `filter="url(#grain)" opacity="${op}"`)
}

export function glitchBars(r, n, cols, { x0 = 0, w = W, y0 = 0, h = H, maxH = 26, op = 0.5 } = {}) {
  let o = ""
  for (let i = 0; i < n; i++) {
    const y = y0 + r() * h, bh = 3 + r() * maxH
    const x = x0 + r() * w * 0.8, bw = 60 + r() * 420
    o += rect(x, y, Math.min(bw, x0 + w - x), bh, `fill="${cols[Math.floor(r() * cols.length)]}" opacity="${n1(op * (0.4 + r() * 0.6))}"`)
  }
  return o
}

export function rain(r, cols, font, { x0 = 0, w = W, y0 = 0, h = H, col = "#22d3ee", n = 36 } = {}) {
  let o = ""
  const chars = "01アイウエオカキクケコサシスセソ<>/\\{}[]"
  for (let c = 0; c < n; c++) {
    const x = x0 + (w * c) / n + r() * 10
    const len = 6 + Math.floor(r() * 18)
    const sy = y0 + r() * h * 0.5
    for (let i = 0; i < len; i++) {
      const ch = chars[Math.floor(r() * chars.length)]
      o += `<text x="${n1(x)}" y="${n1(sy + i * 22)}" font-family="${font}" font-size="18" fill="${col}" opacity="${n1(Math.max(0.04, 0.55 - i * 0.04))}">${ch}</text>`
    }
  }
  return o
}

export function icon(name, cx, cy, s, stroke = "#fff", sw = 3, fill = "none") {
  const a = `fill="${fill}" stroke="${stroke}" stroke-width="${sw}" stroke-linecap="round" stroke-linejoin="round"`
  const k = s / 2
  switch (name) {
    case "heart": return pth(heartPath(cx, cy, s * 1.15), a)
    case "star": return pth(starPath(cx, cy, k, k * 0.45), a)
    case "coin": return `${circ(cx, cy, k, a)}<text x="${cx}" y="${cy + k * 0.38}" font-family="Inter" font-weight="800" font-size="${k * 1.1}" fill="${stroke}" text-anchor="middle">$</text>`
    case "raid": return pth(`M${cx - k} ${cy - k * 0.7}L${cx + k * 0.1} ${cy}L${cx - k} ${cy + k * 0.7}M${cx} ${cy - k * 0.7}L${cx + k} ${cy}L${cx} ${cy + k * 0.7}`, a)
    case "user": return `${circ(cx, cy - k * 0.35, k * 0.38, a)}${pth(`M${cx - k * 0.85} ${cy + k * 0.9}C${cx - k * 0.85} ${cy + k * 0.2} ${cx + k * 0.85} ${cy + k * 0.2} ${cx + k * 0.85} ${cy + k * 0.9}`, a)}`
    case "clock": return `${circ(cx, cy, k, a)}${pth(`M${cx} ${cy - k * 0.55}V${cy}L${cx + k * 0.45} ${cy + k * 0.25}`, a)}`
    case "shield": return pth(`M${cx} ${cy - k}L${cx + k * 0.85} ${cy - k * 0.6}V${cy + k * 0.1}C${cx + k * 0.85} ${cy + k * 0.6} ${cx + k * 0.3} ${cy + k * 0.9} ${cx} ${cy + k}C${cx - k * 0.3} ${cy + k * 0.9} ${cx - k * 0.85} ${cy + k * 0.6} ${cx - k * 0.85} ${cy + k * 0.1}V${cy - k * 0.6}Z`, a)
    case "link": return `${rect(cx - k, cy - k * 0.38, k * 1.15, k * 0.76, `rx="${k * 0.38}" ${a} transform="rotate(-35 ${cx} ${cy})"`)}${rect(cx - k * 0.15, cy - k * 0.38, k * 1.15, k * 0.76, `rx="${k * 0.38}" ${a} transform="rotate(-35 ${cx} ${cy})"`)}`
    case "q": return `<text x="${cx}" y="${cy + k * 0.5}" font-family="Inter" font-weight="800" font-size="${s * 1.1}" fill="${stroke}" text-anchor="middle">?</text>`
    case "chat": return pth(`M${cx - k} ${cy - k * 0.75}H${cx + k}V${cy + k * 0.35}H${cx - k * 0.1}L${cx - k * 0.6} ${cy + k * 0.85}V${cy + k * 0.35}H${cx - k}Z`, a)
    case "cam": return `${rect(cx - k, cy - k * 0.55, k * 1.5, k * 1.1, `rx="${k * 0.2}" ${a}`)}${pth(`M${cx + k * 0.5} ${cy - k * 0.15}L${cx + k} ${cy - k * 0.45}V${cy + k * 0.45}L${cx + k * 0.5} ${cy + k * 0.15}`, a)}`
    case "game": return `${rect(cx - k, cy - k * 0.5, k * 2, k, `rx="${k * 0.45}" ${a}`)}${pth(`M${cx - k * 0.55} ${cy}H${cx - k * 0.15}M${cx - k * 0.35} ${cy - k * 0.2}V${cy + k * 0.2}`, a)}${circ(cx + k * 0.4, cy, 2, `fill="${stroke}"`)}`
    default: return circ(cx, cy, k, a)
  }
}
