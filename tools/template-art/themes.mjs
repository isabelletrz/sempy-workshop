import { W, H, n1, rect, circ, line, pth, text, rng, sparkle, mix, rgba, hash, heartPath, starPath } from "./lib.mjs"
import * as M from "./motifs.mjs"

export const THEMES = {}
const add = (key, t) => { THEMES[key] = { key, ...t } }

const spire = (x, by, w, h, fill, glow = "#7a6cff") => {
  const cx = x + w / 2
  return `${rect(x, by - h, w, h, `fill="${fill}"`)}
${pth(`M${x - 8} ${by - h}L${cx} ${by - h - w * 1.7}L${x + w + 8} ${by - h}Z`, `fill="${fill}"`)}
${rect(x - 10, by - h - 6, w + 20, 10, `fill="${fill}"`)}
${pth(`M${cx - w * 0.16} ${by - h * 0.42}V${by - h * 0.62}Q${cx} ${by - h * 0.78} ${cx + w * 0.16} ${by - h * 0.62}V${by - h * 0.42}Z`, `fill="${glow}" opacity=".55"`)}
${pth(`M${x - 6} ${by - h * 0.2}L${x - 22} ${by - h * 0.2 - w * 0.5}L${x + 4} ${by - h * 0.2}Z`, `fill="${fill}"`)}
${pth(`M${x + w + 6} ${by - h * 0.2}L${x + w + 22} ${by - h * 0.2 - w * 0.5}L${x + w - 4} ${by - h * 0.2}Z`, `fill="${fill}"`)}`
}

/* ============ 1. LUNA.EXE — cosmic horror starter kit (ref: star light) ============ */
add("luna", {
  slug: "luna-exe-gothic-horror-starter-kit", id: "1",
  mark: "Luna.exe", tag: "COSMIC HORROR STARTER KIT",
  fonts: { title: "cormorant", label: "cinzel", body: "quicksand", mono: "mono" },
  titleKind: "glow", titleItalic: true, titleLs: 3, titleWeight: 600, subItalic: false,
  frame: { main: "glass" }, iconShape: "round",
  pal: {
    bg: ["#090820", "#3a2a8f"], accent: "#cdbdff", accent2: "#7fe0ff", text: "#f3eeff",
    panel: ["rgba(70,56,170,.42)", "rgba(24,18,86,.62)"], line: "rgba(214,200,255,.62)",
    title: ["#ffffff", "#cdbdff"], hole: ["#1a1458", "#0b0838"],
  },
  backdrop({ v }) {
    
    const R = rng(1000 + v * 7)
    let o = `<defs><linearGradient id="lbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#080720"/><stop offset=".5" stop-color="#18104e"/><stop offset="1" stop-color="#43309a"/></linearGradient></defs>`
    o += rect(0, 0, W, H, `fill="url(#lbg)"`)
    o += `<g filter="url(#blur60)">${[[1450, 260, 620, 250, "#6a4cff", 0.4], [260, 720, 560, 260, "#c05cff", 0.26], [1000, 980, 900, 200, "#36b6ff", 0.22], [200, 120, 460, 200, "#7a5cff", 0.3], [900, 420, 420, 160, "#ff7ad9", 0.12]].map(([x, y, rx, ry, c, a]) => `<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${c}" opacity="${a}"/>`).join("")}</g>`
    o += M.starfield(R, 300, { cols: ["#ffffff", "#e5dcff", "#bfe9ff"], sp: 0.07 })
    o += M.moon("lm", 1560, 250, 150, { tint: "#ece8ff", shade: "#8e84d4", glow: "#9d8cff" })
    o += `<g fill="none" stroke="#cdbdff" stroke-opacity=".38" stroke-width="1.5"><ellipse cx="1560" cy="250" rx="300" ry="86" transform="rotate(-18 1560 250)"/><ellipse cx="1560" cy="250" rx="410" ry="124" transform="rotate(-18 1560 250)" stroke-dasharray="3 9"/></g>`
    o += circ(1300, 196, 8, `fill="#7fe0ff" filter="url(#glowS)"`) + circ(1810, 338, 6, `fill="#ff9ee0" filter="url(#glowS)"`)
    // constellations
    const cons = [[[120, 160], [210, 220], [300, 190], [380, 270], [330, 340]], [[760, 90], [850, 150], [940, 120], [1010, 190]]]
    for (const pts of cons) {
      o += `<polyline points="${pts.map((p) => p.join(",")).join(" ")}" fill="none" stroke="#cdbdff" stroke-opacity=".4" stroke-width="1.4"/>`
      for (const [x, y] of pts) o += sparkle(x, y, 8, "#fff", 0.95, `filter="url(#glowS)"`)
    }
    const ss = [[[820 + v * 40, 300], 360, 28], [[1250, 560 - v * 20], 300, 24], [[460 + v * 30, 520], 240, 30]]
    for (const [[x, y], len, ang] of ss) o += M.shootingStar(x, y, len, ang, "#d8ccff", 3)
    // gothic spires on the horizon
    const sf = "#0a0724"
    o += spire(60, 1080, 70, 320, sf) + spire(170, 1080, 46, 220, sf) + spire(1700, 1080, 70, 360, sf) + spire(1620, 1080, 44, 230, sf) + spire(1810, 1080, 54, 250, sf)
    o += rect(0, 1000, W, 80, `fill="${sf}"`)
    // clouds
    o += M.cloud(280, 960, 1.5, { fill: "#6a58d6", op: 0.5 }) + M.cloud(1100, 1010, 1.9, { fill: "#8070e8", op: 0.38 }) + M.cloud(640, 1040, 1.1, { fill: "#9d8cff", op: 0.3 })
    o += rect(0, 880, W, 200, `fill="#9d8cff" opacity=".06" filter="url(#blur30)"`)
    return o
  },
})

/* ============ 3. DARK RITUAL — horror screen pack (ref: halloween overlay) ============ */
add("ritual", {
  slug: "dark-ritual-horror-screen-pack", id: "3",
  mark: "DARK RITUAL", tag: "HORROR SCREEN PACK",
  fonts: { title: "metal", label: "cinzel", body: "cinzel", mono: "mono" },
  titleKind: "drip", markKind: "plain", titleLs: 2, titleWeight: 400,
  frame: { main: "torn", alert: "torn", plate: "torn" }, iconShape: "square", iconInk: "#0a0a0a",
  pal: {
    bg: ["#070203", "#3a0508"], accent: "#e10b12", accent2: "#8c0007", text: "#f4f1ee",
    panel: ["rgba(10,9,11,.94)", "rgba(24,6,9,.94)"], line: "#e10b12",
    title: ["#ff2a2a", "#9b0000"], hole: ["#5a0508", "#1d0204"], splat: "#ffffff",
  },
  backdrop({ v }) {
    const R = rng(2000 + v * 5)
    let o = `<defs><linearGradient id="rbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060203"/><stop offset=".6" stop-color="#17030a"/><stop offset="1" stop-color="#450509"/></linearGradient></defs>`
    o += rect(0, 0, W, H, `fill="url(#rbg)"`)
    o += `<g filter="url(#blur60)">${circ(1300, 520, 420, `fill="#c4000a" opacity=".28"`)}${circ(300, 1000, 380, `fill="#ff1a1a" opacity=".2"`)}</g>`
    // tilted ghost panels
    o += `<g transform="rotate(-8 960 540)" opacity=".9">${[[120, 150, 700, 380], [900, 90, 800, 440], [260, 640, 620, 340], [1100, 640, 640, 360]].map(([x, y, w, h]) => rect(x, y, w, h, `fill="#fff" fill-opacity=".025" stroke="#e10b12" stroke-opacity=".22" stroke-width="2"`)).join("")}</g>`
    o += M.pentagram(1280, 540, 400, "#e10b12", 3, true, 0.2)
    let ticks = ""
    for (let i = 0; i < 72; i++) {
      const a = (i * Math.PI * 2) / 72
      ticks += line(1280 + Math.cos(a) * 432, 540 + Math.sin(a) * 432, 1280 + Math.cos(a) * (i % 6 === 0 ? 462 : 448), 540 + Math.sin(a) * (i % 6 === 0 ? 462 : 448))
    }
    o += `<g stroke="#e10b12" stroke-opacity=".22" stroke-width="2">${ticks}</g>`
    // scratches
    for (let i = 0; i < 26; i++) {
      const x = R() * W, y = R() * H, l = 60 + R() * 260
      o += line(x, y, x + l * 0.55, y + l, `stroke="#fff" stroke-opacity="${n1(0.05 + R() * 0.12)}" stroke-width="${n1(0.8 + R() * 1.5)}"`)
    }
    // smoke
    o += `<g filter="url(#blur60)" opacity=".5">${[0, 1, 2, 3, 4].map((i) => circ(200 + i * 420 + R() * 120, 980 + R() * 80, 160 + R() * 80, `fill="#7a0a10" opacity=".4"`)).join("")}</g>`
    if (v >= 6) o += M.candle(110, 1060, 150) + M.candle(210, 1068, 96, { glowR: 90 }) + M.candle(1800, 1062, 130) + M.candle(1710, 1068, 84, { glowR: 80 })
    // white brush splatter, top-left like the reference
    o += `<g>${M.brushStroke(R, -60, -18, 380, 44, "#fff", -16)}${M.splatter(R, 40, 20, 130, "#fff", 60)}</g>`
    o += M.splatter(R, 1880, 1020, 150, "#c4000a", 60)
    o += rect(0, 0, W, H, `filter="url(#paper)" opacity=".1"`)
    o += M.grainOverlay(0.07)
    return o
  },
})

/* ============ 2. CATHEDRAL.EXE — gothic stream overlay ============ */
add("cathedral", {
  slug: "cathedral-exe-gothic-stream-overlay", id: "2",
  mark: "Cathedral.exe", tag: "GOTHIC STREAM OVERLAY",
  fonts: { title: "fraktur", label: "cinzel", body: "cormorant", mono: "mono" },
  titleKind: "gold", titleCase: "title", titleLs: 1, titleWeight: 700,
  frame: { main: "gothic" }, iconShape: "hex",
  pal: {
    bg: ["#05030f", "#1a0f45"], accent: "#b79cff", accent2: "#e6c26a", text: "#f1eaff",
    panel: ["rgba(34,20,86,.84)", "rgba(10,6,38,.92)"], line: "rgba(226,190,106,.88)",
    title: ["#fff", "#b79cff"], hole: ["#1d1156", "#080420"],
  },
  backdrop({ v }) {
    const R = rng(3000 + v)
    const glass = ["#5b3fd6", "#2f7be0", "#a43ad6", "#d6a23a", "#1e9aa8", "#c93c6a"]
    let o = `<defs><linearGradient id="cbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#04020c"/><stop offset=".6" stop-color="#140a38"/><stop offset="1" stop-color="#241552"/></linearGradient>
<linearGradient id="cray" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d9c8ff" stop-opacity=".28"/><stop offset="1" stop-color="#d9c8ff" stop-opacity="0"/></linearGradient></defs>`
    o += rect(0, 0, W, H, `fill="url(#cbg)"`)
    o += `<g filter="url(#blur60)">${circ(960, 330, 360, `fill="#6d4be8" opacity=".5"`)}${circ(200, 600, 260, `fill="#2f7be0" opacity=".25"`)}${circ(1720, 600, 260, `fill="#a43ad6" opacity=".25"`)}</g>`
    // light rays
    for (const [dx, a] of [[-560, 0.9], [-280, 1], [0, 1], [280, 1], [560, 0.9]]) o += pth(`M${960 + dx * 0.12} 330L${960 + dx - 90} 1080H${960 + dx + 90}Z`, `fill="url(#cray)" opacity="${a * 0.55}"`)
    o += M.roseWindow(960, 330, 330, glass, { op: 0.62 })
    // vaulted ribs
    for (let i = 0; i < 5; i++) {
      const x = 260 + i * 350
      o += `<path d="M${x - 175} 0C${x - 175} 120 ${x - 40} 190 ${x} 250C${x + 40} 190 ${x + 175} 120 ${x + 175} 0" fill="none" stroke="#b79cff" stroke-opacity=".16" stroke-width="3"/>`
    }
    o += M.archWindow(30, 190, 210, 640, glass, { op: 0.55, glow: "#6d4be8" }) + M.archWindow(1680, 190, 210, 640, glass, { op: 0.55, glow: "#a43ad6" })
    o += M.archWindow(290, 360, 110, 360, glass.slice().reverse(), { op: 0.35 }) + M.archWindow(1520, 360, 110, 360, glass.slice().reverse(), { op: 0.35 })
    // pillars + floor
    for (const x of [0, 250, 1640, 1900]) o += rect(x, 0, 24, H, `fill="#000" opacity=".28"`)
    o += rect(0, 900, W, 180, `fill="#0a0620" opacity=".6"`) + rect(0, 880, W, 10, `fill="#e6c26a" opacity=".18"`)
    o += `<g filter="url(#blur30)" opacity=".4">${[0, 1, 2, 3].map((i) => `<ellipse cx="${300 + i * 440}" cy="1000" rx="320" ry="70" fill="#9d86ff"/>`).join("")}</g>`
    o += M.starfield(R, 90, { cols: ["#e6c26a", "#fff"], sp: 0.2, rmax: 1.8 })
    o += M.grainOverlay(0.05)
    return o
  },
})

/* ============ 12. CRIMSON CHAPEL — gothic webcam frame ============ */
add("chapel", {
  slug: "crimson-chapel-gothic-webcam-frame", id: "12",
  mark: "Crimson Chapel", tag: "GOTHIC WEBCAM FRAME",
  fonts: { title: "cinzelDeco", label: "cinzel", body: "cormorant", mono: "mono" },
  titleKind: "glow", titleLs: 3, titleWeight: 700,
  frame: { main: "ornate", cam: "gothic" }, iconShape: "round",
  pal: {
    bg: ["#0d0304", "#2b0508"], accent: "#ff6a45", accent2: "#f4b15a", text: "#fff0e4",
    panel: ["rgba(52,10,14,.85)", "rgba(16,3,5,.92)"], line: "rgba(244,177,90,.85)",
    title: ["#fff3dc", "#f4b15a"], hole: ["#3a0b0c", "#120304"],
  },
  backdrop({ v }) {
    const R = rng(4000 + v)
    const glass = ["#b3171f", "#e0551d", "#f4b15a", "#8a0f1a", "#d6351f", "#ffcf7a"]
    let o = `<defs><linearGradient id="kbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#080203"/><stop offset=".65" stop-color="#1e0507"/><stop offset="1" stop-color="#3c0a0c"/></linearGradient></defs>`
    o += rect(0, 0, W, H, `fill="url(#kbg)"`)
    o += `<g filter="url(#blur60)">${circ(960, 420, 360, `fill="#ff5a2a" opacity=".32"`)}${circ(120, 900, 300, `fill="#ffb347" opacity=".22"`)}${circ(1800, 900, 300, `fill="#ffb347" opacity=".22"`)}</g>`
    o += M.archWindow(800, 90, 320, 760, glass, { op: 0.75, glow: "#ff6a45", lead: "#120304" })
    o += M.archWindow(380, 210, 150, 480, glass.slice().reverse(), { op: 0.5, glow: "#ff6a45", lead: "#120304" }) + M.archWindow(1390, 210, 150, 480, glass, { op: 0.5, lead: "#120304" })
    // chandelier
    o += line(960, 0, 960, 70, `stroke="#f4b15a" stroke-opacity=".6" stroke-width="3"`)
    o += `<ellipse cx="960" cy="84" rx="150" ry="18" fill="none" stroke="#f4b15a" stroke-opacity=".7" stroke-width="3"/>`
    for (let i = -3; i <= 3; i++) o += M.candle(960 + i * 48, 84 + Math.abs(i) * 1.5, 28, { glowR: 50 })
    // pews
    for (let i = 0; i < 6; i++) {
      const y = 800 + i * 50
      o += pth(`M0 ${y + 60}L${W} ${y + 60}L${W} ${y}L0 ${y + 10}Z`, `fill="#0a0203" opacity="${n1(0.5 + i * 0.1)}" stroke="#f4b15a" stroke-opacity=".08"`)
    }
    for (const x of [90, 220, 1700, 1830]) o += M.candle(x, 880, 120 + (x % 3) * 30)
    o += M.starfield(R, 60, { cols: ["#ffcf7a"], sp: 0.15, rmax: 1.6, op: [0.2, 0.6] })
    o += M.grainOverlay(0.06)
    return o
  },
})

/* ============ 4. CHROME HEARTS — dark Y2K branding kit ============ */
add("hearts", {
  slug: "chrome-hearts-dark-y2k-branding-kit", id: "4",
  mark: "CHROME HEARTS", tag: "DARK Y2K BRANDING KIT",
  fonts: { title: "syncopate", label: "orbitron", body: "inter", mono: "mono" },
  titleKind: "chrome", titleLs: 4, titleWeight: 700,
  frame: { main: "chrome" }, iconShape: "round",
  pal: {
    bg: ["#06060a", "#14101c"], accent: "#ff7ac8", accent2: "#cfd6ee", text: "#f5f5fb",
    panel: ["rgba(26,22,36,.9)", "rgba(8,8,12,.94)"], line: "#cfd6ee",
    title: ["#fff", "#cfd6ee"], hole: ["#1d1826", "#0a0910"],
  },
  backdrop({ v }) {
    const R = rng(5000 + v * 3)
    let o = `<defs><linearGradient id="hbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#050509"/><stop offset="1" stop-color="#17101f"/></linearGradient>
<pattern id="chk" width="80" height="80" patternUnits="userSpaceOnUse"><rect width="40" height="40" fill="#fff" opacity=".022"/><rect x="40" y="40" width="40" height="40" fill="#fff" opacity=".022"/></pattern></defs>`
    o += rect(0, 0, W, H, `fill="url(#hbg)"`) + rect(0, 0, W, H, `fill="url(#chk)"`)
    o += `<g filter="url(#blur60)">${circ(300, 200, 360, `fill="#ff4fb0" opacity=".22"`)}${circ(1700, 900, 380, `fill="#8a7bff" opacity=".2"`)}</g>`
    const spots = [[120, 190, 120, -14], [1790, 130, 90, 12], [1800, 560, 150, 18], [90, 640, 100, -20], [260, 990, 130, 10], [1560, 1000, 110, -8], [980, 60, 70, 8], [960, 1030, 60, -6], [1380, 40, 54, 16], [520, 1040, 56, -12]]
    for (const [x, y, s, rot] of spots) o += M.chromeHeart(x, y, s, 0.95, rot)
    o += M.thornCross(1700, 330, 90) + M.thornCross(200, 420, 70) + M.thornCross(1100, 1040, 50, undefined, 0.9)
    for (const [x, y, s] of [[420, 90, 26], [1560, 300, 20], [150, 860, 24], [1720, 800, 28], [700, 1030, 18]]) o += `<path d="${starPath(x, y, s, s * 0.4, 4)}" fill="url(#gChrome)" stroke="#fff" stroke-opacity=".6"/>`
    o += M.starfield(R, 80, { cols: ["#ffd1ec", "#fff"], sp: 0.3, rmax: 1.6 })
    o += M.grainOverlay(0.06)
    return o
  },
})

/* ============ 19. CHROME STARTER — free stream kit ============ */
add("starter", {
  slug: "chrome-starter-free-stream-kit", id: "19",
  mark: "CHROME STARTER", tag: "FREE STREAM KIT",
  fonts: { title: "orbitron", label: "orbitron", body: "inter", mono: "mono" },
  titleKind: "chrome", titleLs: 3, titleWeight: 900,
  frame: { main: "chrome" }, iconShape: "round",
  pal: {
    bg: ["#050507", "#101018"], accent: "#e6e9f5", accent2: "#8f99c4", text: "#f4f5fb",
    panel: ["rgba(22,22,30,.9)", "rgba(8,8,12,.94)"], line: "#d5d9ea",
    title: ["#fff", "#d5d9ea"], hole: ["#1a1a24", "#09090e"],
  },
  backdrop({ v }) {
    const R = rng(6000 + v * 3)
    let o = `<defs><linearGradient id="sbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#050507"/><stop offset="1" stop-color="#14141e"/></linearGradient>
<linearGradient id="rib" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".0"/><stop offset=".35" stop-color="#dfe3f2" stop-opacity=".55"/><stop offset=".5" stop-color="#5b6076" stop-opacity=".6"/><stop offset=".65" stop-color="#f4f6ff" stop-opacity=".6"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>`
    o += rect(0, 0, W, H, `fill="url(#sbg)"`)
    o += `<g filter="url(#blur60)">${circ(1500, 220, 320, `fill="#8f99c4" opacity=".22"`)}${circ(300, 980, 320, `fill="#8f99c4" opacity=".16"`)}</g>`
    o += `<path d="M-100 800C300 500 700 1100 1200 700C1500 460 1700 280 2020 340L2020 470C1700 430 1500 620 1250 840C800 1220 300 700 -100 960Z" fill="url(#rib)"/>`
    o += `<path d="M-100 140C300 -60 800 380 1250 160C1500 40 1750 -10 2020 60L2020 150C1760 100 1520 160 1280 260C800 470 300 80 -100 240Z" fill="url(#rib)" opacity=".7"/>`
    let grid = ""
    for (let x = 0; x <= W; x += 120) grid += line(x, 0, x, H)
    for (let y = 0; y <= H; y += 120) grid += line(0, y, W, y)
    o += `<g stroke="#fff" stroke-opacity=".035">${grid}</g>`
    o += M.starfield(R, 50, { cols: ["#fff"], sp: 0.4, rmax: 1.5 })
    o += M.grainOverlay(0.05)
    return o
  },
})

/* ============ 17. NOCTURNE — premium full branding kit ============ */
add("nocturne", {
  slug: "nocturne-premium-full-branding-kit", id: "17",
  mark: "Nocturne", tag: "PREMIUM FULL BRANDING KIT",
  fonts: { title: "italiana", label: "cinzel", body: "cormorant", mono: "mono" },
  titleKind: "glow", titleLs: 12, titleWeight: 400,
  frame: { main: "ornate" }, iconShape: "round", subItalic: true,
  pal: {
    bg: ["#050508", "#120c22"], accent: "#d9d3f0", accent2: "#a78bfa", text: "#f5f2ff",
    panel: ["rgba(24,18,44,.82)", "rgba(6,5,12,.92)"], line: "rgba(217,211,240,.7)",
    title: ["#ffffff", "#d9d3f0"], hole: ["#171230", "#07060f"],
  },
  backdrop({ v }) {
    const R = rng(7000 + v)
    let o = `<defs><linearGradient id="nbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#040407"/><stop offset=".6" stop-color="#0e0a1c"/><stop offset="1" stop-color="#1b1236"/></linearGradient>
<linearGradient id="nbeam" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#d9d3f0" stop-opacity="0"/><stop offset=".5" stop-color="#d9d3f0" stop-opacity=".12"/><stop offset="1" stop-color="#d9d3f0" stop-opacity="0"/></linearGradient></defs>`
    o += rect(0, 0, W, H, `fill="url(#nbg)"`)
    o += `<g filter="url(#blur60)">${circ(1480, 420, 380, `fill="#7c5cff" opacity=".26"`)}${circ(200, 900, 300, `fill="#a78bfa" opacity=".14"`)}</g>`
    for (let i = 0; i < 7; i++) o += circ(1480, 420, 150 + i * 120, `fill="none" stroke="#d9d3f0" stroke-opacity="${n1(0.2 - i * 0.022)}" stroke-width="1.4"`)
    // crescent
    o += `<defs><mask id="crm"><rect width="${W}" height="${H}" fill="#fff"/>${circ(1530, 380, 120, `fill="#000"`)}</mask></defs><g mask="url(#crm)">${circ(1480, 420, 130, `fill="#f2eeff"`)}</g>`
    o += `<polygon points="400,0 560,0 1100,1080 760,1080" fill="url(#nbeam)"/>`
    o += `<g fill="none" stroke="#d9d3f0" stroke-opacity=".28" stroke-width="1.4">${rect(22, 22, W - 44, H - 44)}${rect(34, 34, W - 68, H - 68, `stroke-opacity=".12"`)}</g>`
    o += M.flourish(22, 22, 0.9, "#d9d3f0", 1.8, [1, 1], 0.7) + M.flourish(W - 22, 22, 0.9, "#d9d3f0", 1.8, [-1, 1], 0.7) + M.flourish(22, H - 22, 0.9, "#d9d3f0", 1.8, [1, -1], 0.7) + M.flourish(W - 22, H - 22, 0.9, "#d9d3f0", 1.8, [-1, -1], 0.7)
    o += M.starfield(R, 160, { cols: ["#fff", "#d9d3f0"], sp: 0.1, rmax: 1.6, op: [0.2, 0.8] })
    o += M.grainOverlay(0.05)
    return o
  },
})

/* ============ 5. GLITCH PROTOCOL — cybercore overlay ============ */
add("glitch", {
  slug: "glitch-protocol-cybercore-overlay", id: "5",
  mark: "GLITCH//PROTOCOL", tag: "CYBERCORE OVERLAY",
  fonts: { title: "orbitron", label: "rajdhani", body: "rajdhani", mono: "mono" },
  titleKind: "glitch", titleLs: 4, titleWeight: 900,
  frame: { main: "term", cam: "hud", plate: "hud", bar: "hud" }, iconShape: "square", iconInk: "#02171c",
  pal: {
    bg: ["#03080a", "#06161a"], accent: "#22e8ff", accent2: "#a3ff3c", text: "#d8fbff",
    panel: ["rgba(4,26,32,.9)", "rgba(2,10,14,.95)"], line: "rgba(34,232,255,.8)",
    title: ["#ffffff", "#22e8ff"], hole: ["#06303a", "#021015"],
  },
  backdrop({ v }) {
    const R = rng(8000 + v * 3)
    let o = `<defs><linearGradient id="gbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#02080a"/><stop offset="1" stop-color="#062028"/></linearGradient></defs>`
    o += rect(0, 0, W, H, `fill="url(#gbg)"`)
    o += `<g filter="url(#blur60)">${circ(1500, 300, 330, `fill="#00b8d4" opacity=".22"`)}${circ(200, 900, 300, `fill="#7dff2a" opacity=".12"`)}</g>`
    o += M.rain(R, null, "Share Tech Mono", { n: 48, col: "#22e8ff", h: H })
    o += M.perspGrid(700, "#22e8ff", { op: 0.18 })
    o += `<g>${M.glitchBars(R, 26, ["#22e8ff", "#a3ff3c", "#ff2fb0"], { op: 0.5, maxH: 18 })}</g>`
    o += `<g fill="none" stroke="#22e8ff" stroke-opacity=".18" stroke-width="1.5">${circ(1500, 540, 360)}${circ(1500, 540, 250, `stroke-dasharray="4 10"`)}${line(1140, 540, 1860, 540)}${line(1500, 180, 1500, 900)}</g>`
    for (let i = 0; i < 12; i++) o += text(10, 40 + i * 90, "0x" + Math.floor(R() * 0xffffff).toString(16).toUpperCase().padStart(6, "0") + " :: " + (R() < 0.5 ? "OK" : "SYNC"), { font: "mono", size: 14, fill: "#22e8ff", op: 0.3, ls: 2 })
    o += M.scanlines(0.16)
    return o
  },
})

/* ============ 9. AFTER HOURS — purple cyber overlay ============ */
add("afterhours", {
  slug: "after-hours-purple-cyber-overlay", id: "9",
  mark: "AFTER HOURS", tag: "PURPLE CYBER OVERLAY",
  fonts: { title: "audiowide", label: "rajdhani", body: "rajdhani", mono: "mono" },
  titleKind: "neon", titleLs: 4, titleWeight: 400,
  frame: { main: "neon" }, iconShape: "round", iconInk: "#1a0630",
  pal: {
    bg: ["#0b0220", "#3a0a5a"], accent: "#e070ff", accent2: "#2de3ff", text: "#fbeaff",
    panel: ["rgba(34,8,70,.84)", "rgba(10,3,28,.92)"], line: "#e070ff",
    title: ["#ffffff", "#e8a0ff"], hole: ["#2b0a52", "#0d0322"],
  },
  backdrop({ v }) {
    const R = rng(9000 + v * 3)
    let o = `<defs><linearGradient id="abg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#07011a"/><stop offset=".45" stop-color="#2a0a52"/><stop offset=".62" stop-color="#8a1d9a"/><stop offset=".64" stop-color="#14041f"/><stop offset="1" stop-color="#14041f"/></linearGradient>
<linearGradient id="asun" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe86b"/><stop offset=".55" stop-color="#ff5fb0"/><stop offset="1" stop-color="#9a2cff"/></linearGradient>
<mask id="asm"><rect width="${W}" height="${H}" fill="#fff"/>${[0, 1, 2, 3, 4, 5].map((i) => rect(0, 540 + i * 18 + i * i * 1.5, W, 3 + i * 1.4, `fill="#000"`)).join("")}</mask></defs>`
    o += rect(0, 0, W, H, `fill="url(#abg)"`)
    o += M.starfield(R, 120, { y0: 0, h: 560, cols: ["#fff", "#ffd1ff", "#a6f3ff"], sp: 0.05, rmax: 1.8 })
    o += `<g filter="url(#blur60)">${circ(960, 600, 300, `fill="#ff4fb0" opacity=".5"`)}</g>`
    o += `<g mask="url(#asm)">${circ(960, 560, 210, `fill="url(#asun)"`)}</g>`
    o += M.skyline(R, 690, W, "#0c0218", "#ff9cf5", { minH: 60, maxH: 340, winP: 0.1 })
    o += rect(0, 690, W, H - 690, `fill="#14041f"`)
    o += M.perspGrid(690, "#e070ff", { op: 0.55, sw: 1.8, lines: 26 })
    o += rect(0, 686, W, 6, `fill="#e070ff" opacity=".8" filter="url(#glowS)"`)
    return o
  },
})

/* ============ 13. NEON SPECTRE — animated cyber pack ============ */
add("spectre", {
  slug: "neon-spectre-animated-cyber-pack", id: "13",
  mark: "NEON SPECTRE", tag: "ANIMATED CYBER PACK",
  fonts: { title: "rajdhani", label: "rajdhani", body: "rajdhani", mono: "mono" },
  titleKind: "neon", titleLs: 8, titleWeight: 700,
  frame: { main: "hud" }, iconShape: "hex", iconInk: "#0a1202",
  pal: {
    bg: ["#050807", "#0a1208"], accent: "#b6ff3c", accent2: "#b45cff", text: "#efffe0",
    panel: ["rgba(10,22,8,.88)", "rgba(4,8,4,.95)"], line: "rgba(182,255,60,.8)",
    title: ["#ffffff", "#d6ff8a"], hole: ["#102a0a", "#050a03"],
  },
  backdrop({ v }) {
    const R = rng(10000 + v * 3)
    const ghost = (x, y, s, col, op) => `<g transform="translate(${x} ${y}) scale(${s})" fill="none" stroke="${col}" stroke-width="${3 / s}" opacity="${op}" filter="url(#glowS)"><path d="M-70 110V-20C-70 -90 70 -90 70 -20V110L47 88L23 110L0 88L-23 110L-47 88Z"/><ellipse cx="-24" cy="-14" rx="12" ry="18"/><ellipse cx="24" cy="-14" rx="12" ry="18"/><path d="M-14 38Q0 52 14 38"/></g>`
    let o = `<defs><linearGradient id="nsbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#040605"/><stop offset="1" stop-color="#0b160a"/></linearGradient></defs>`
    o += rect(0, 0, W, H, `fill="url(#nsbg)"`)
    o += `<g filter="url(#blur60)">${circ(1480, 460, 340, `fill="#7cff2a" opacity=".16"`)}${circ(260, 760, 320, `fill="#b45cff" opacity=".2"`)}</g>`
    let hex = ""
    for (let row = 0; row < 14; row++) for (let col = 0; col < 24; col++) {
      const cx = col * 90 + (row % 2) * 45, cy = row * 78
      hex += `<path d="M${cx} ${cy - 40}L${cx + 39} ${cy - 20}V${cy + 20}L${cx} ${cy + 40}L${cx - 39} ${cy + 20}V${cy - 20}Z"/>`
    }
    o += `<g fill="none" stroke="#b6ff3c" stroke-opacity=".07" stroke-width="1.4">${hex}</g>`
    o += ghost(1480, 470, 4.2, "#b6ff3c", 0.5) + ghost(220, 800, 2.2, "#b45cff", 0.5) + ghost(1760, 920, 1.2, "#b6ff3c", 0.6) + ghost(520, 120, 1.0, "#b45cff", 0.55)
    for (let i = 0; i < 9; i++) o += rect(0, R() * H, W, 2 + R() * 6, `fill="#b6ff3c" opacity="${n1(0.03 + R() * 0.05)}"`)
    o += M.starfield(R, 120, { cols: ["#b6ff3c", "#b45cff", "#fff"], sp: 0.02, rmax: 2.2, op: [0.2, 0.7] })
    o += M.scanlines(0.1)
    return o
  },
})

/* ============ 18. STATIC BLOOM — futuristic stream pack ============ */
add("bloom", {
  slug: "static-bloom-futuristic-stream-pack", id: "18",
  mark: "Static Bloom", tag: "FUTURISTIC STREAM PACK",
  fonts: { title: "quicksand", label: "quicksand", body: "quicksand", mono: "mono" },
  titleKind: "glow", titleLs: 8, titleWeight: 700,
  frame: { main: "holo" }, iconShape: "round", iconInk: "#071208",
  pal: {
    bg: ["#05080a", "#0a1a1c"], accent: "#c6f36a", accent2: "#22d3ee", text: "#eafff6",
    panel: ["rgba(8,34,38,.7)", "rgba(4,14,18,.85)"], line: "rgba(198,243,106,.7)",
    title: ["#ffffff", "#c6f36a"], hole: ["#0a2a30", "#041013"],
  },
  backdrop({ v }) {
    const R = rng(11000 + v * 3)
    let o = `<defs><linearGradient id="bbg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#04090b"/><stop offset="1" stop-color="#0a2024"/></linearGradient>
<linearGradient id="bstat" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<mask id="bsm"><rect width="${W}" height="${H}" fill="#000"/>${[170, 480, 760, 930].map((y, i) => rect(0, y + (v % 3) * 20, W, 70 + i * 16, `fill="url(#bstat)"`)).join("")}</mask></defs>`
    o += rect(0, 0, W, H, `fill="url(#bbg)"`)
    o += `<g filter="url(#blur60)">${circ(1500, 280, 340, `fill="#22d3ee" opacity=".2"`)}${circ(300, 840, 340, `fill="#c6f36a" opacity=".14"`)}</g>`
    o += M.holoFlower(1580, 300, 300, "#c6f36a", "#22d3ee", { petals: 9, sw: 2.2, rot: 10 })
    o += M.holoFlower(260, 860, 240, "#22d3ee", "#c6f36a", { petals: 7, sw: 2, rot: 30 })
    o += M.holoFlower(900, 80, 120, "#c6f36a", "#22d3ee", { petals: 6, sw: 1.6 }) + M.holoFlower(1700, 960, 130, "#22d3ee", "#c6f36a", { petals: 8, sw: 1.6 })
    o += `<g mask="url(#bsm)" opacity=".16">${rect(0, 0, W, H, `filter="url(#grain)" fill="#fff"`)}</g>`
    let dots = ""
    for (let x = 30; x < W; x += 60) for (let y = 30; y < H; y += 60) dots += circ(x, y, 1.2)
    o += `<g fill="#c6f36a" opacity=".12">${dots}</g>`
    o += M.starfield(R, 90, { cols: ["#c6f36a", "#22d3ee", "#fff"], sp: 0.12, rmax: 2, op: [0.3, 0.9] })
    return o
  },
})

/* ============ 15. GHOST SIGNAL — halloween VHS overlay ============ */
add("ghost", {
  slug: "ghost-signal-halloween-overlay", id: "15",
  mark: "GHOST SIGNAL", tag: "HALLOWEEN OVERLAY",
  fonts: { title: "vt", label: "vt", body: "vt", mono: "vt", extra: ["mono"] },
  titleKind: "vhs", titleLs: 3, titleWeight: 400,
  frame: { main: "vhs" }, iconShape: "square", iconInk: "#031208",
  pal: {
    bg: ["#030805", "#0a1810"], accent: "#39ff88", accent2: "#b36bff", text: "#e6ffee",
    panel: ["rgba(4,22,12,.9)", "rgba(2,8,5,.95)"], line: "#39ff88",
    title: ["#ffffff", "#c8ffdc"], hole: ["#06301a", "#02100a"],
  },
  backdrop({ v }) {
    const R = rng(12000 + v * 3)
    let o = `<defs><linearGradient id="gsbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#020604"/><stop offset="1" stop-color="#0c2016"/></linearGradient></defs>`
    o += rect(0, 0, W, H, `fill="url(#gsbg)"`)
    o += `<g filter="url(#blur60)">${circ(1400, 500, 340, `fill="#39ff88" opacity=".18"`)}${circ(300, 300, 280, `fill="#b36bff" opacity=".16"`)}</g>`
    o += M.ghostSheet(1420, 520, 6.2, "#d9ffe8", "#031208", 0.12)
    o += M.ghostSheet(260, 820, 2.4, "#d9ffe8", "#031208", 0.16) + M.bat(700, 180, 0.9, "#000", -8) + M.bat(1100, 90, 0.6, "#000", 6) + M.bat(1700, 160, 0.7, "#000", -4)
    // tracking distortion bands
    for (let i = 0; i < 7; i++) {
      const y = R() * H, hh = 8 + R() * 30
      o += rect(0, y, W, hh, `fill="#39ff88" opacity="${n1(0.03 + R() * 0.07)}"`) + rect(R() * 600, y + 2, 300 + R() * 900, 2 + R() * 3, `fill="#fff" opacity="${n1(0.1 + R() * 0.18)}"`)
    }
    o += `<g opacity=".7">${M.glitchBars(R, 16, ["#ff3b6b", "#36d6ff", "#39ff88"], { op: 0.35, maxH: 8 })}</g>`
    o += text(W - 60, 70, "PLAY ▶", { font: "vt", size: 44, fill: "#fff", anchor: "end", op: 0.85, ls: 3 })
    o += text(W - 60, H - 36, "SP  0:31:07  OCT 31 1999", { font: "vt", size: 34, fill: "#fff", anchor: "end", op: 0.6, ls: 3 })
    o += rect(0, 0, W, H, `filter="url(#grain)" opacity=".18"`)
    o += M.scanlines(0.22)
    return o
  },
})

/* ============ 6. VELVET VOID — dark coquette stream pack ============ */
add("velvet", {
  slug: "velvet-void-dark-coquette-stream-pack", id: "6",
  mark: "Velvet Void", tag: "DARK COQUETTE STREAM PACK",
  fonts: { title: "vibes", label: "playfair", body: "playfair", mono: "mono" },
  titleKind: "glow", titleCase: "title", titleLs: 1, titleWeight: 400,
  frame: { main: "ornate" }, iconShape: "round", bowFrames: true, subItalic: true,
  pal: {
    bg: ["#12040c", "#3a0a1e"], accent: "#f7a8cf", accent2: "#e0245e", text: "#ffeef6",
    panel: ["rgba(76,12,38,.84)", "rgba(24,4,14,.93)"], line: "rgba(247,168,207,.82)",
    title: ["#ffffff", "#f7a8cf"], hole: ["#3e0d24", "#14040c"],
  },
  backdrop({ v }) {
    const R = rng(13000 + v * 3)
    let o = `<defs><linearGradient id="vbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0e030a"/><stop offset=".6" stop-color="#2a0817"/><stop offset="1" stop-color="#4a0c26"/></linearGradient>
<linearGradient id="vfold" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset=".5" stop-color="#ff6aa8" stop-opacity=".07"/><stop offset="1" stop-color="#000" stop-opacity=".35"/></linearGradient></defs>`
    o += rect(0, 0, W, H, `fill="url(#vbg)"`)
    for (let i = 0; i < 8; i++) o += rect(i * 240, 0, 240, H, `fill="url(#vfold)"`)
    o += `<g filter="url(#blur60)">${circ(1560, 260, 280, `fill="#ff5a9a" opacity=".22"`)}${circ(260, 900, 300, `fill="#e0245e" opacity=".22"`)}</g>`
    o += M.moon("vm", 1600, 250, 120, { tint: "#ffe6f1", shade: "#e48ab0", glow: "#ff8fbf", craters: false })
    o += M.cat(300, 1080, 1.9) + M.cat(1750, 1080, 1.2)
    // lace
    let lace = ""
    for (let x = 0; x < W + 40; x += 40) lace += `<path d="M${x} 0Q${x + 20} 52 ${x + 40} 0" fill="none"/>` + circ(x + 20, 42, 3, `fill="#f7a8cf" stroke="none"`)
    o += `<g stroke="#f7a8cf" stroke-opacity=".5" stroke-width="1.6">${lace}</g>`
    // pearl garlands
    const garland = (x1, x2, y, sag) => {
      let p = ""
      for (let i = 0; i <= 26; i++) {
        const t = i / 26
        p += circ(x1 + (x2 - x1) * t, y + Math.sin(t * Math.PI) * sag, 6.5, `fill="#ffeef6" opacity=".72"`)
      }
      return p
    }
    o += garland(120, 960, 50, 60) + garland(960, 1800, 50, 60)
    // hearts
    for (let i = 0; i < 22; i++) o += pth(heartPath(R() * W, R() * H, 16 + R() * 34), `fill="${["#f7a8cf", "#e0245e"][i % 2]}" opacity="${n1(0.1 + R() * 0.25)}" transform="rotate(${n1(R() * 40 - 20)} 0 0)"`).replace(/ transform="[^"]*"/, "")
    o += M.bow(90, 130, 1.0) + M.bow(1830, 130, 1.0, "#f7a8cf", "#a8416e")
    o += M.starfield(R, 70, { cols: ["#fff", "#ffc2dc"], sp: 0.3, rmax: 1.6, op: [0.3, 0.8] })
    o += M.grainOverlay(0.06)
    return o
  },
})

/* ============ 14. BLACK DAHLIA — dark romantic branding ============ */
add("dahlia", {
  slug: "black-dahlia-dark-romantic-branding", id: "14",
  mark: "Black Dahlia", tag: "DARK ROMANTIC BRANDING",
  fonts: { title: "playfair", label: "cinzel", body: "cormorant", mono: "mono" },
  titleKind: "glow", titleItalic: true, titleLs: 1, titleWeight: 700,
  frame: { main: "deco" }, iconShape: "round", subItalic: true,
  pal: {
    bg: ["#070508", "#1a0d14"], accent: "#e8508f", accent2: "#e7b4a0", text: "#fff1f4",
    panel: ["rgba(36,10,22,.86)", "rgba(8,4,8,.94)"], line: "rgba(231,180,160,.85)",
    title: ["#ffffff", "#f6c4d2"], hole: ["#2a1019", "#0b0508"],
  },
  backdrop({ v }) {
    const R = rng(14000 + v * 3)
    let o = `<defs><linearGradient id="dbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#060407"/><stop offset="1" stop-color="#1d0d16"/></linearGradient>
<linearGradient id="dbeam" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#ffe3ec" stop-opacity=".22"/><stop offset="1" stop-color="#ffe3ec" stop-opacity="0"/></linearGradient></defs>`
    o += rect(0, 0, W, H, `fill="url(#dbg)"`)
    o += `<polygon points="860,0 1060,0 1500,1080 420,1080" fill="url(#dbeam)"/>`
    let fan = ""
    for (let i = -14; i <= 14; i++) fan += line(960, 1180, 960 + i * 150, -100)
    o += `<g stroke="#e7b4a0" stroke-opacity=".07" stroke-width="1.4">${fan}</g>`
    o += `<g filter="url(#blur60)">${circ(160, 160, 300, `fill="#e8508f" opacity=".22"`)}${circ(1800, 940, 320, `fill="#e8508f" opacity=".2"`)}</g>`
    // vines
    const vine = (d) => pth(d, `fill="none" stroke="#e7b4a0" stroke-opacity=".35" stroke-width="2.4"`)
    o += vine("M-20 380C120 340 160 260 230 200M-20 700C140 640 200 520 330 470") + vine("M1940 700C1800 660 1760 560 1680 480M1940 300C1820 280 1760 200 1700 120")
    o += M.dahlia(110, 150, 190, "#a8174f", "#ffb7d1", { layers: 5 }) + M.dahlia(1830, 960, 210, "#a8174f", "#ffb7d1", { layers: 5, rot: 15 })
    o += M.dahlia(1830, 120, 120, "#7d0f3a", "#f08cb2", { layers: 4, rot: 7 }) + M.dahlia(100, 980, 120, "#7d0f3a", "#f08cb2", { layers: 4, rot: 22 })
    o += M.dahlia(560, 1060, 70, "#7d0f3a", "#f08cb2", { layers: 3 }) + M.dahlia(1380, 40, 64, "#7d0f3a", "#f08cb2", { layers: 3 })
    o += M.starfield(R, 60, { cols: ["#ffe3ec"], sp: 0.2, rmax: 1.5, op: [0.2, 0.6] })
    o += M.grainOverlay(0.09)
    return o
  },
})

/* ============ 7. MIDNIGHT FROST — dark winter stream kit ============ */
add("frost", {
  slug: "midnight-frost-winter-stream-kit", id: "7",
  mark: "MIDNIGHT FROST", tag: "DARK WINTER STREAM KIT",
  fonts: { title: "cinzel", label: "cinzel", body: "cormorant", mono: "mono" },
  titleKind: "gold", titleLs: 5, titleWeight: 700,
  frame: { main: "frost" }, iconShape: "hex", iconInk: "#082018",
  pal: {
    bg: ["#04100c", "#0c2a22"], accent: "#e6c78a", accent2: "#7fe3c8", text: "#eefcf6",
    panel: ["rgba(8,38,30,.84)", "rgba(3,14,11,.93)"], line: "rgba(230,199,138,.85)",
    title: ["#fff6dd", "#e6c78a"], hole: ["#0c3a2e", "#04130f"],
  },
  backdrop({ v }) {
    const R = rng(15000 + v * 3)
    let o = `<defs><linearGradient id="fbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#03100c"/><stop offset=".7" stop-color="#0b2a22"/><stop offset="1" stop-color="#143c34"/></linearGradient>
<linearGradient id="aur" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#7fe3c8" stop-opacity="0"/><stop offset=".5" stop-color="#7fe3c8" stop-opacity=".5"/><stop offset="1" stop-color="#4bc3b0" stop-opacity="0"/></linearGradient></defs>`
    o += rect(0, 0, W, H, `fill="url(#fbg)"`)
    o += M.starfield(R, 160, { h: 600, cols: ["#fff", "#cdfff2"], sp: 0.05, rmax: 1.7 })
    o += `<g filter="url(#blur30)" opacity=".7"><path d="M-50 260C300 120 600 340 960 200C1300 70 1600 240 1980 120V330C1600 440 1300 240 960 380C600 520 300 330 -50 460Z" fill="url(#aur)"/></g>`
    o += `<g filter="url(#blur30)" opacity=".45"><path d="M-50 120C300 20 700 200 1000 100C1300 10 1700 160 1980 40V200C1700 300 1300 120 1000 220C700 320 300 160 -50 260Z" fill="#b48cff" opacity=".5"/></g>`
    o += M.moon("fm", 1500, 230, 90, { tint: "#f4fffb", shade: "#9fd8c8", glow: "#7fe3c8", craters: false })
    // forest layers
    const layer = (y, h, fill, step, seed) => {
      const r2 = rng(seed)
      let t = ""
      for (let x = -40; x < W + 60; x += step + r2() * 40) t += M.firTree(x, y, h * (0.7 + r2() * 0.6), fill, "#e8f6ff")
      return t
    }
    o += layer(900, 300, "#0a2a22", 90, 1) + layer(980, 360, "#06201a", 110, 2) + layer(1080, 420, "#031510", 140, 3)
    o += rect(0, 1030, W, 50, `fill="#031510"`)
    // snow
    for (let i = 0; i < 140; i++) o += circ(R() * W, R() * H, 1 + R() * 2.6, `fill="#fff" opacity="${n1(0.25 + R() * 0.6)}"`)
    for (let i = 0; i < 7; i++) o += M.snowflake(R() * W, R() * H * 0.9, 14 + R() * 26, "#d6ecff", 1.6, 0.35)
    o += M.grainOverlay(0.05)
    return o
  },
})

/* ============ 16. WINTER.EXE — christmas stream screens ============ */
add("winter", {
  slug: "winter-exe-christmas-stream-screens", id: "16",
  mark: "WINTER.EXE", tag: "CHRISTMAS STREAM SCREENS",
  fonts: { title: "pressstart", label: "rajdhani", body: "rajdhani", mono: "mono" },
  titleKind: "glow", titleLs: 2, titleWeight: 400,
  frame: { main: "snowcap" }, iconShape: "square", iconInk: "#06122a",
  pal: {
    bg: ["#050a18", "#0c1e3c"], accent: "#8fd0ff", accent2: "#ff5d73", text: "#eaf6ff",
    panel: ["rgba(12,32,70,.86)", "rgba(4,10,26,.94)"], line: "rgba(143,208,255,.85)",
    title: ["#ffffff", "#a6dcff"], hole: ["#0d2a58", "#050e22"],
  },
  backdrop({ v }) {
    const R = rng(16000 + v * 3)
    let o = `<defs><linearGradient id="wbg" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#040816"/><stop offset=".7" stop-color="#0c1f40"/><stop offset="1" stop-color="#17325e"/></linearGradient></defs>`
    o += rect(0, 0, W, H, `fill="url(#wbg)"`)
    o += M.starfield(R, 150, { h: 700, cols: ["#fff", "#bfe3ff"], sp: 0.08, rmax: 1.8 })
    o += `<g filter="url(#blur60)">${circ(260, 300, 280, `fill="#2f8bff" opacity=".28"`)}${circ(1700, 260, 280, `fill="#ff5d73" opacity=".16"`)}</g>`
    // wireframe trees with lights
    const tree = (cx, by, h) => {
      let t = ""
      const tiers = 5
      const lights = ["#ff5d73", "#ffd66b", "#8fd0ff", "#7dffb0"]
      for (let i = 0; i < tiers; i++) {
        const ty = by - h + (i * h * 0.8) / tiers
        const tw = (h * 0.16) * (1 + i * 0.75)
        const th2 = (h * 0.34)
        t += pth(`M${cx} ${ty}L${cx + tw} ${ty + th2}L${cx - tw} ${ty + th2}Z`, `fill="#0a3a2a" fill-opacity=".55" stroke="#7dffb0" stroke-opacity=".7" stroke-width="2"`)
        for (let k = 0; k < 4 + i; k++) {
          const tt = (k + 0.5) / (4 + i)
          t += circ(cx - tw + tw * 2 * tt, ty + th2 - 4 - (k % 2) * 6, 5, `fill="${lights[(k + i) % 4]}" filter="url(#glowS)"`)
        }
      }
      t += rect(cx - h * 0.03, by - h * 0.06, h * 0.06, h * 0.08, `fill="#6b3a1a"`)
      t += `<path d="${starPath(cx, by - h - 14, 22, 9)}" fill="#ffd66b" filter="url(#glow)"/>`
      return t
    }
    o += tree(130, 1030, 640) + tree(1790, 1030, 760) + tree(310, 1060, 380) + tree(1610, 1060, 420)
    // gifts
    const gift = (x, y, s, c) => rect(x, y - s, s, s, `fill="${c}"`) + rect(x + s * 0.43, y - s, s * 0.14, s, `fill="#fff" opacity=".85"`) + rect(x, y - s * 0.58, s, s * 0.14, `fill="#fff" opacity=".85"`)
    o += gift(520, 1070, 64, "#ff5d73") + gift(590, 1070, 44, "#3b82f6") + gift(1330, 1070, 70, "#22c55e") + gift(1410, 1070, 48, "#ffd66b")
    // snow hills + flakes
    o += `<path d="M0 1000C300 950 500 1010 800 990C1100 960 1400 1020 1920 960V1080H0Z" fill="#e9f4ff" opacity=".9"/>`
    for (let i = 0; i < 120; i++) o += rect(R() * W, R() * H, 4, 4, `fill="#fff" opacity="${n1(0.3 + R() * 0.6)}"`)
    return o
  },
})

/* ============ 8. HAUNTED ARCHIVE — halloween screen pack ============ */
add("archive", {
  slug: "haunted-archive-halloween-screen-pack", id: "8",
  mark: "Haunted Archive", tag: "HALLOWEEN SCREEN PACK",
  fonts: { title: "pirata", label: "cinzel", body: "almendra", mono: "mono" },
  titleKind: "plain", titleLs: 3, titleWeight: 400,
  frame: { main: "book" }, iconShape: "square", iconInk: "#1a0a02",
  pal: {
    bg: ["#0d0710", "#2a1020"], accent: "#ff7a1a", accent2: "#a855f7", text: "#fff1e0",
    panel: ["rgba(46,18,30,.88)", "rgba(14,6,12,.94)"], line: "rgba(255,138,48,.88)",
    title: ["#ffd9a8", "#ff7a1a"], hole: ["#331236", "#0f0614"],
  },
  backdrop({ v }) {
    const R = rng(17000 + v * 3)
    let o = `<defs><linearGradient id="hab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#0a0510"/><stop offset=".7" stop-color="#220d1e"/><stop offset="1" stop-color="#3c1620"/></linearGradient></defs>`
    o += rect(0, 0, W, H, `fill="url(#hab)"`)
    o += `<g filter="url(#blur60)">${circ(960, 520, 380, `fill="#ff7a1a" opacity=".2"`)}${circ(1560, 200, 260, `fill="#a855f7" opacity=".22"`)}</g>`
    o += M.bookshelf(R, 0, 0, 230, 1080, { shelves: 7, cols: ["#4a1d2e", "#2c2a54", "#5a3a1a", "#1d3a38", "#52252a", "#3a1a4a"] })
    o += M.bookshelf(R, 1690, 0, 230, 1080, { shelves: 7, cols: ["#4a1d2e", "#2c2a54", "#5a3a1a", "#1d3a38", "#52252a", "#3a1a4a"] })
    o += rect(0, 0, 230, 1080, `fill="#000" opacity=".35"`) + rect(1690, 0, 230, 1080, `fill="#000" opacity=".35"`)
    o += M.cobweb(230, 0, 260, 1, 1, "#fff", 0.35) + M.cobweb(1690, 0, 260, -1, 1, "#fff", 0.35)
    o += M.moon("hm", 960, 130, 70, { tint: "#ffe9c4", shade: "#e0a050", glow: "#ff9a3c", craters: false })
    for (const [x, y, h] of [[330, 940, 80], [470, 970, 56], [1450, 950, 74], [1600, 975, 50]]) o += M.candle(x, y, h, { glowR: 90 })
    o += M.pumpkin(320, 1010, 1.0) + M.pumpkin(1560, 1020, 0.8) + M.pumpkin(430, 1050, 0.55)
    o += M.bat(700, 170, 0.8, "#000", -8) + M.bat(1200, 120, 0.6, "#000", 8) + M.bat(1380, 260, 0.5, "#000", -12)
    // floating books
    for (let i = 0; i < 4; i++) o += `<g transform="translate(${360 + i * 330} ${200 + (i % 2) * 90}) rotate(${i * 17 - 20})"><rect x="-26" y="-18" width="52" height="36" rx="3" fill="#5a2a3a" stroke="#ff7a1a" stroke-opacity=".6"/><rect x="-26" y="-18" width="9" height="36" fill="#ff7a1a" opacity=".5"/></g>`
    o += M.starfield(R, 40, { cols: ["#ffd9a8"], sp: 0.2, rmax: 1.4, op: [0.2, 0.6] })
    o += M.grainOverlay(0.06)
    return o
  },
})

/* ============ 10. DIGITAL GRAVEYARD — horror alert pack ============ */
add("graveyard", {
  slug: "digital-graveyard-horror-alert-pack", id: "10",
  mark: "DIGITAL GRAVEYARD", tag: "HORROR ALERT PACK",
  fonts: { title: "creepster", label: "mono", body: "rajdhani", mono: "mono" },
  titleKind: "glitch", titleLs: 3, titleWeight: 400,
  frame: { main: "hud", cam: "tomb", alert: "tomb", panel: "tomb", btn: "hud" }, iconShape: "hex", iconInk: "#03140a",
  pal: {
    bg: ["#030805", "#0b1a12"], accent: "#4ade80", accent2: "#a855f7", text: "#e8ffee",
    panel: ["rgba(6,26,14,.88)", "rgba(2,9,5,.95)"], line: "rgba(74,222,128,.82)",
    title: ["#ffffff", "#a7f3c0"], hole: ["#0a2e1a", "#030f08"],
  },
  backdrop({ v }) {
    const R = rng(18000 + v * 3)
    let o = `<defs><linearGradient id="gvb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#020604"/><stop offset=".65" stop-color="#0a1d14"/><stop offset="1" stop-color="#143a26"/></linearGradient></defs>`
    o += rect(0, 0, W, H, `fill="url(#gvb)"`)
    o += `<g filter="url(#blur60)">${circ(1400, 220, 280, `fill="#a855f7" opacity=".28"`)}${circ(400, 940, 360, `fill="#4ade80" opacity=".2"`)}</g>`
    o += M.moon("gm", 1400, 210, 100, { tint: "#e7ffee", shade: "#8fd9aa", glow: "#4ade80", craters: true })
    // dead tree
    o += `<g stroke="#020a06" stroke-width="16" fill="none" stroke-linecap="round"><path d="M1640 1080C1650 900 1620 800 1660 640C1680 560 1640 480 1700 400"/><path d="M1655 760C1560 720 1520 650 1470 600M1665 620C1750 590 1790 520 1830 470M1680 480C1640 430 1600 410 1560 330"/></g>`
    // tombstone rows
    const rows = [[860, "#06140d", 1.0], [930, "#04100a", 1.25], [1010, "#020a06", 1.5]]
    for (const [by, fill, sc] of rows) {
      for (let x = -20; x < W; x += (150 + R() * 90) * sc) {
        const w = (60 + R() * 40) * sc, h = (90 + R() * 80) * sc
        o += M.tombstone(x, by + 70, w, h, fill, { cross: R() < 0.3, stroke: "#4ade80" })
        if (R() < 0.35) o += rect(x - 6, by + 70 - h * 0.5, w + 12, 3 + R() * 6, `fill="${R() < 0.5 ? "#4ade80" : "#a855f7"}" opacity=".45"`)
      }
    }
    o += `<g stroke="#020a06" stroke-width="5">${Array.from({ length: 30 }, (_, i) => line(i * 66, 880, i * 66, 960)).join("")}${line(0, 900, W, 900)}${line(0, 940, W, 940)}</g>`
    o += `<g filter="url(#blur30)" opacity=".5">${[0, 1, 2, 3, 4].map((i) => `<ellipse cx="${200 + i * 420}" cy="1000" rx="360" ry="60" fill="#8fe8b0"/>`).join("")}</g>`
    o += `<g>${M.glitchBars(R, 16, ["#4ade80", "#a855f7"], { op: 0.35, maxH: 10 })}</g>`
    o += M.scanlines(0.14)
    return o
  },
})

/* ============ 11. LUNAR STATIC — minimalist purple panels ============ */
add("lunar", {
  slug: "lunar-static-minimalist-purple-panels", id: "11",
  mark: "LUNAR STATIC", tag: "MINIMALIST PURPLE PANELS",
  fonts: { title: "italiana", label: "inter", body: "inter", mono: "mono" },
  titleKind: "flat", titleLs: 14, titleWeight: 400,
  frame: { main: "min" }, iconShape: "round", iconInk: "#150f26",
  pal: {
    bg: ["#08080c", "#14101e"], accent: "#c4b5fd", accent2: "#f5f3ff", text: "#f5f3ff",
    panel: ["rgba(26,20,44,.62)", "rgba(10,8,18,.82)"], line: "rgba(196,181,253,.6)",
    title: ["#ffffff", "#d8ccff"], hole: ["#151128", "#08070f"],
  },
  backdrop({ v }) {
    const R = rng(19000 + v * 3)
    let o = `<defs><linearGradient id="lsb" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#07070b"/><stop offset="1" stop-color="#171128"/></linearGradient></defs>`
    o += rect(0, 0, W, H, `fill="url(#lsb)"`)
    o += `<g filter="url(#blur60)">${circ(1500, 500, 380, `fill="#8b6cff" opacity=".16"`)}</g>`
    for (let i = 0; i < 5; i++) o += circ(1500, 500, 160 + i * 130, `fill="none" stroke="#c4b5fd" stroke-opacity="${n1(0.16 - i * 0.025)}" stroke-width="1.2"`)
    o += `<defs><mask id="lsm"><rect width="${W}" height="${H}" fill="#fff"/>${circ(1535, 478, 84, `fill="#000"`)}</mask></defs><g mask="url(#lsm)">${circ(1500, 500, 92, `fill="#f5f3ff" opacity=".92"`)}</g>`
    // moon phases line
    for (let i = 0; i < 8; i++) {
      const cx = 250 + i * 150, cy = 1040
      o += circ(cx, cy, 16, `fill="none" stroke="#c4b5fd" stroke-opacity=".5" stroke-width="1.4"`)
      o += `<path d="M${cx} ${cy - 16}A16 16 0 0 1 ${cx} ${cy + 16}A${16 - (i - 4) * 4} 16 0 0 ${i < 4 ? 0 : 1} ${cx} ${cy - 16}Z" fill="#c4b5fd" opacity=".55"/>`
    }
    // static dashes
    for (let i = 0; i < 160; i++) o += rect(R() * W, R() * H, 20 + R() * 160, 1.4, `fill="#fff" opacity="${n1(0.02 + R() * 0.06)}"`)
    let vl = ""
    for (let x = 120; x < W; x += 240) vl += line(x, 0, x, H)
    o += `<g stroke="#c4b5fd" stroke-opacity=".05">${vl}</g>`
    o += M.starfield(R, 90, { cols: ["#fff", "#c4b5fd"], sp: 0.03, rmax: 1.4, op: [0.2, 0.6] })
    o += M.grainOverlay(0.07)
    return o
  },
})

/* ============ 20. CLOUD NINE — cosy stream kit ============ */
add("cloud", {
  slug: "cloud-nine-cosy-stream-kit", id: "20",
  mark: "Cloud Nine", tag: "COSY STREAM KIT",
  fonts: { title: "fredoka", label: "quicksand", body: "nunito", mono: "mono" },
  titleKind: "plain", titleLs: 4, titleWeight: 600, titleCase: "title",
  frame: { main: "scallop", cam: "glass", chat: "glass", plate: "glass", bar: "glass", btn: "glass", alert: "glass" }, iconShape: "round", iconInk: "#3a2166", glassSparkle: true, socialPlate: true,
  pal: {
    bg: ["#241a4e", "#f6b49a"], accent: "#ffc2b0", accent2: "#a8d0ff", text: "#fff8f2",
    panel: ["rgba(104,78,170,.62)", "rgba(64,44,126,.78)"], line: "rgba(255,236,226,.85)",
    title: ["#ffffff", "#ffd9cc"], hole: ["#4a3a92", "#2b2160"],
  },
  backdrop({ v }) {
    const R = rng(20000 + v * 3)
    let o = `<defs><linearGradient id="cnb" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1e1646"/><stop offset=".45" stop-color="#5a3d94"/><stop offset=".78" stop-color="#d78aa0"/><stop offset="1" stop-color="#f6b49a"/></linearGradient></defs>`
    o += rect(0, 0, W, H, `fill="url(#cnb)"`)
    o += M.starfield(R, 120, { h: 600, cols: ["#fff", "#ffe4f0"], sp: 0.1, rmax: 1.8 })
    o += `<defs><mask id="cnm"><rect width="${W}" height="${H}" fill="#fff"/>${circ(1590, 190, 80, `fill="#000"`)}</mask></defs><g mask="url(#cnm)">${circ(1540, 210, 92, `fill="#fff4e0"`)}</g>`
    o += `<g filter="url(#blur30)" opacity=".6">${circ(1540, 210, 150, `fill="#ffe4c4" opacity=".35"`)}</g>`
    o += M.cloud(160, 300, 1.3, { fill: "#ffe9f0", op: 0.85, shade: "#e6b8d4" }) + M.cloud(1360, 440, 1.0, { fill: "#fff0ea", op: 0.8, shade: "#ecc2c8" })
    o += M.cloud(820, 130, 0.8, { fill: "#f3e4ff", op: 0.6 })
    o += M.cloud(-60, 940, 2.6, { fill: "#ffd0c6", op: 0.95, shade: "#f0a2a8" }) + M.cloud(500, 1010, 2.2, { fill: "#ffe1d8", op: 0.95, shade: "#f4b2b2" }) + M.cloud(1000, 960, 2.8, { fill: "#ffd0c6", op: 0.95, shade: "#f0a2a8" }) + M.cloud(1560, 1000, 2.4, { fill: "#ffe1d8", op: 0.95, shade: "#f4b2b2" })
    return o
  },
})
