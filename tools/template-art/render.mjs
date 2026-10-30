import fs from "node:fs"
import path from "node:path"
import { chromium } from "playwright"
import { THEMES } from "./themes.mjs"
import { SCREENS, FILE, CLEAR, build } from "./screens.mjs"

const [,, which = "all", scr = "all", outDir = "out"] = process.argv
const keys = which === "all" ? Object.keys(THEMES) : which.split(",")
const screens = scr === "all" ? SCREENS : scr.split(",")
fs.mkdirSync(outDir, { recursive: true })
fs.mkdirSync("html", { recursive: true })
const browser = await chromium.launch()
const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } })
for (const k of keys) {
  const th = THEMES[k]
  if (!th) throw new Error("no theme " + k)
  fs.mkdirSync(path.join(outDir, th.slug), { recursive: true })
  for (const s of screens) {
    for (const mode of CLEAR.includes(s) ? ["solid", "clear"] : ["solid"]) {
      if (mode === "clear" && process.env.NOCLEAR) continue
      const htmlStr = build(th, s, mode)
      const hp = path.resolve(`html/${k}_${s}_${mode}.html`)
      fs.writeFileSync(hp, htmlStr)
      await page.goto("file://" + hp)
      await page.evaluate(() => document.fonts.ready)
      await page.waitForTimeout(120)
      const name = FILE[s] + (mode === "clear" ? "-clear" : "")
      await page.screenshot({ path: path.join(outDir, th.slug, name + ".png"), omitBackground: mode === "clear" })
    }
    console.log(k, s)
  }
}
await browser.close()
