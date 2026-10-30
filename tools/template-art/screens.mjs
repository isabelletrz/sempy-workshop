import { W, H, n1, rect, circ, line, pth, g, text, fit, sparkle, html, rgba, mix } from "./lib.mjs"
import { box, title, tc, sls, chatBox, alertBar, nameplate, panelBanner, socialRow, iconBlock, chatLines } from "./frames.mjs"
import { icon } from "./motifs.mjs"

export const SCREENS = ["overlay", "webcam", "chat", "panels", "alerts", "starting-soon", "brb", "offline"]
export const FILE = {
  overlay: "overlay", webcam: "webcam-frame", chat: "chat-box", panels: "panels", alerts: "alert",
  "starting-soon": "starting-soon", brb: "brb", offline: "offline",
}
export const CLEAR = ["overlay", "alerts", "chat"]

const bg = (th, v, dim = 0) => {
  let o = th.backdrop({ v, W, H })
  if (dim) o += rect(0, 0, W, H, `fill="#000" opacity="${dim}"`)
  o += rect(0, 0, W, H, `fill="url(#gVignette)"`)
  return o
}

function wordmark(th, x, y, size = 46, anchor = "start", maxW = 560) {
  const p = th.pal
  return title(th, th.mark, x, y, size, { anchor, maxW, kind: th.markKind ?? th.titleKind }) +
    text(x + (anchor === "middle" ? 0 : 3), y + 26, th.tag, { font: th.fonts.label, size: 17, fill: p.accent, anchor, ls: 7, weight: 600, op: 0.9 })
}

function layoutOverlay(th, clear) {
  const p = th.pal
  const F = th.frame
  let o = ""
  o += box(th, F.main, 48, 128, 1296, 729, { role: "game", clear, label: "GAME_FEED" })
  o += box(th, F.cam ?? F.main, 1384, 128, 488, 275, { role: "cam", clear, label: "CAM_01" })
  o += chatBox(th, 1384, 440, 488, 417, { clear, size: 22 })
  o += wordmark(th, 52, 84, 50)
  o += nameplate(th, 48, 898, 500, 112, "YOUR_NAME", { clear, empty: clear })
  // latest follower strip
  o += box(th, F.bar ?? F.main, 584, 898, 760, 112, { role: "bar", clear })
  o += iconBlock(th, 606, 918, 72, "heart")
  o += text(704, 944, "LATEST FOLLOWER", { font: th.fonts.label, size: 20, weight: 700, fill: p.accent, ls: 5 })
  o += text(704, 988, "NightOwl_88", { font: th.fonts.title, size: fit("NightOwl_88", th.fonts.title, 44, 380, sls(th)), fill: p.text, weight: th.titleWeight ?? 700, ls: sls(th) })
  o += line(1070, 922, 1070, 986, `stroke="${p.line}" stroke-opacity=".5" stroke-width="2"`)
  o += text(1096, 944, "LATEST SUB", { font: th.fonts.label, size: 20, weight: 700, fill: p.accent2, ls: 5 })
  o += text(1096, 988, "starlit", { font: th.fonts.title, size: fit("starlit", th.fonts.title, 44, 230, sls(th)), fill: p.text, weight: th.titleWeight ?? 700, ls: sls(th) })
  // socials
  o += box(th, F.bar ?? F.main, 1384, 898, 488, 112, { role: "bar", clear })
  o += text(1628, 943, "FOLLOW ME", { font: th.fonts.label, size: 20, weight: 700, fill: p.accent, ls: 6, anchor: "middle" })
  o += text(1628, 984, "twitch.tv/yourname", { font: th.fonts.body, size: 28, weight: 600, fill: p.text, anchor: "middle", op: 0.9 })
  return o
}

export function build(th, screen, mode = "solid") {
  const clear = mode === "clear"
  const p = th.pal
  const F = th.frame
  let body = ""
  const v = SCREENS.indexOf(screen) + 1

  if (screen === "overlay") {
    if (!clear) body += bg(th, v, 0.1)
    body += layoutOverlay(th, clear)
    if (!clear) body += th.finish?.() ?? ""
  } else if (screen === "alerts") {
    if (!clear) {
      body += bg(th, v, 0.28)
      body += text(W / 2, 108, "STREAM ALERTS", { font: th.fonts.label, size: 24, fill: p.text, anchor: "middle", ls: 14, weight: 700, op: 0.75 })
      body += `<g opacity=".7">${line(W / 2 - 330, 124, W / 2 + 330, 124, `stroke="${p.line}" stroke-width="1.5"`)}</g>`
      const items = [
        ["NEW FOLLOWER", "heart", "just followed!"],
        ["NEW SUBSCRIBER", "star", "subscribed · tier 1"],
        ["DONATION", "coin", "€10.00"],
        ["INCOMING RAID", "raid", "42 viewers"],
      ]
      items.forEach(([label, ic, sub], i) => {
        body += alertBar(th, 340, 170 + i * 205, 1240, 168, { label, ic, sub, name: ["NightOwl_88", "starlit", "Moth", "Vexx_TV"][i] })
      })
    } else {
      body += alertBar(th, 560, 70, 800, 150, { label: "NEW FOLLOWER", ic: "heart", sub: "just followed!", name: "", clear: true })
    }
  } else if (screen === "chat") {
    if (!clear) {
      body += bg(th, v, 0.3)
      body += chatBox(th, 110, 54, 640, 972, { size: 28 })
      body += chatBox(th, 840, 100, 1000, 340, { size: 26, from: 3 })
      body += text(840, 500, "SUB BADGES & EMOTES", { font: th.fonts.label, size: 22, fill: p.text, op: 0.75, ls: 10, weight: 700 })
      body += line(840, 520, 1840, 520, `stroke="${p.line}" stroke-opacity=".6" stroke-width="1.5"`)
      const ics = ["heart", "star", "coin", "game", "cam", "chat"]
      ics.forEach((n, i) => {
        body += iconBlock(th, 840 + i * 158, 560, 112, n)
        body += text(896 + i * 158, 706, ["FOLLOW", "SUB", "TIP", "GG", "CAM", "HYPE"][i], { font: th.fonts.label, size: 18, fill: p.text, op: 0.6, anchor: "middle", ls: 5, weight: 600 })
      })
      body += box(th, F.bar ?? F.main, 840, 770, 1000, 150, { role: "bar" })
      body += text(1340, 826, "CHAT COMMANDS", { font: th.fonts.label, size: 20, fill: p.accent, anchor: "middle", ls: 8, weight: 700 })
      body += text(1340, 880, "!discord   !socials   !schedule   !lurk", { font: th.fonts.mono ?? "mono", size: 30, fill: p.text, anchor: "middle", op: 0.9 })
    } else {
      body += chatBox(th, 1330, 90, 540, 900, { clear: true, size: 25 })
    }
  } else if (screen === "webcam") {
    body += bg(th, v, 0.25)
    body += box(th, F.cam ?? F.main, 180, 110, 1040, 585, { role: "cam", label: "CAM_01" })
    body += nameplate(th, 180, 752, 560, 112, "YOUR_NAME")
    body += wordmark(th, 800, 800, 44, "start", 440)
    body += socialRow(th, 190, 940, ["twitch.tv/yourname", "@yourname", "discord.gg/you"], { size: 26 })
    body += box(th, F.cam ?? F.main, 1300, 110, 420, 420, { role: "cam", label: "CAM_02" })
    body += box(th, F.cam ?? F.main, 1300, 585, 540, 304, { role: "cam", label: "CAM_03" })
    body += text(1300, 950, "SQUARE · WIDE · MAIN", { font: th.fonts.label, size: 19, fill: p.text, op: 0.5, ls: 8, weight: 600 })
  } else if (screen === "panels") {
    body += bg(th, v, 0.3)
    body += text(W / 2, 112, "TWITCH PANELS", { font: th.fonts.label, size: 24, fill: p.text, anchor: "middle", ls: 14, weight: 700, op: 0.75 })
    const names = [["ABOUT ME", "user"], ["SCHEDULE", "clock"], ["RULES", "shield"], ["SOCIALS", "link"], ["DONATE", "heart"], ["F.A.Q", "q"]]
    names.forEach(([nm, ic], i) => {
      const c = i % 3, r = Math.floor(i / 3)
      body += panelBanner(th, 70 + c * 610, 160 + r * 330, 560, 280, { name: nm, ic })
    })
    ;["ABOUT", "ALL LINKS", "DISCORD"].forEach((nm, i) => {
      const x = 70 + i * 610
      body += box(th, F.btn ?? F.bar ?? F.main, x + 100, 850, 360, 84, { role: "btn" })
      body += text(x + 280, 903, tc(th, nm), { font: th.fonts.title, size: fit(nm, th.fonts.title, 34, 280, sls(th)), fill: p.text, anchor: "middle", weight: th.titleWeight ?? 700, ls: sls(th) })
      body += sparkle(x + 470, 858, 17, p.accent, 0.95, `filter="url(#glowS)"`)
    })
  } else {
    // starting-soon / brb / offline
    const cfg = {
      "starting-soon": { t: "STARTING SOON", eyebrow: "THE STREAM BEGINS IN", sub: "grab a drink and get comfy" },
      brb: { t: "BE RIGHT BACK", eyebrow: "TAKING A SHORT BREAK", sub: "back in a few minutes" },
      offline: { t: "OFFLINE", eyebrow: "THE STREAM IS CURRENTLY", sub: "thanks for hanging out" },
    }[screen]
    body += bg(th, v, screen === "offline" ? 0.22 : 0.05)
    body += wordmark(th, 60, 96, 52)
    const tcx = W / 2
    if (th.screenBox !== false) {
      body += box(th, F.screen ?? F.main, 210, 190, 1500, 700, { role: "screen", clear: false, label: "STANDBY" })
    }
    body += text(tcx, 385, cfg.eyebrow, { font: th.fonts.label, size: 28, fill: p.accent, anchor: "middle", ls: 14, weight: 600 })
    const tsize = screen === "offline" ? 230 : 168
    body += title(th, cfg.t, tcx, 585, tsize, { maxW: 1280 })
    body += text(tcx, 665, cfg.sub, { font: th.fonts.body, size: 34, fill: p.text, anchor: "middle", op: 0.78, weight: 500, italic: th.subItalic, ls: 1 })
    if (screen === "starting-soon") {
      body += box(th, F.bar ?? F.main, tcx - 150, 722, 300, 96, { role: "btn" })
      body += text(tcx, 790, "05:00", { font: th.fonts.title, size: 60, fill: "url(#gTitle)", anchor: "middle", weight: th.titleWeight ?? 700, ls: 4 })
    } else if (screen === "brb") {
      const bw = 560
      body += rect(tcx - bw / 2, 764, bw, 16, `rx="8" fill="#000" opacity=".4" stroke="${p.line}" stroke-opacity=".6"`)
      body += rect(tcx - bw / 2 + 3, 767, bw * 0.62, 10, `rx="5" fill="url(#gAccent)"`)
      body += text(tcx, 826, "RETURNING SOON", { font: th.fonts.label, size: 20, fill: p.text, op: 0.6, anchor: "middle", ls: 10 })
    } else {
      ;[["MON", "8 PM"], ["WED", "8 PM"], ["FRI", "9 PM"]].forEach(([d, t], i) => {
        const x = tcx - 450 + i * 310
        body += box(th, F.btn ?? F.bar ?? F.main, x, 722, 280, 100, { role: "btn" })
        body += text(x + 34, 782, tc(th, d), { font: th.fonts.title, size: 40, fill: p.accent, weight: th.titleWeight ?? 700, ls: sls(th) })
        body += text(x + 246, 782, t, { font: th.fonts.label, size: 30, fill: p.text, anchor: "end", weight: 600, ls: 2 })
      })
    }
    if (th.socialPlate) body += rect(tcx - 520, 908, 1040, 60, `rx="30" fill="${p.panel[1]}" opacity=".85"`)
    body += socialRow(th, tcx, 946, ["twitch.tv/yourname", "@yourname", "discord.gg/you"], { anchor: "middle", size: 26 })
  }

  const extra = th.extraDefs?.() ?? ""
  return html(th, body, { clear, extraDefs: extra })
}
