# Template art generator

Draws every template screen (overlay, webcam, chat, panels, alerts, starting soon, BRB, offline)
for the 20 products from code. One theme per product lives in `themes.mjs` (palette, fonts,
frame style, background scene); `frames.mjs` draws the boxes/titles/alerts, `motifs.mjs` the
moons, candles, flowers, tombstones, etc.

```bash
npm i --no-save playwright @fontsource/cinzel @fontsource/cormorant-garamond ...   # fonts listed in lib.mjs
node render.mjs all all out          # PNGs in out/<slug>/
python3 towebp.py                    # converts into public/templates/<slug>/*.webp
node exporttheme.mjs > ../../src/lib/template-theme.ts
```

`overlay`, `alert` and `chat-box` also get a `-clear.webp` (transparent) used by the live
camera preview on the product page.
