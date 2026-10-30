"use client"

import { useEffect, useRef, useState } from "react"
import { usePathname } from "next/navigation"

/**
 * Animated liquid chrome strip at the very top of every page, fading into the page background.
 * A WebGL fragment shader warps a noise field into flowing liquid metal and shades it like
 * polished chrome, with twinkling star dots on top. Not interactive.
 * Falls back to the static image (public/backgrounds/liquid-chrome.jpg) when WebGL is
 * unavailable or the visitor prefers reduced motion.
 */

const VERT = `attribute vec2 p; void main(){ gl_Position = vec4(p, 0.0, 1.0); }`

const FRAG = `
precision highp float;
uniform vec2 uRes;
uniform float uTime;

float hash(vec2 p){ p = fract(p * vec2(123.34, 456.21)); p += dot(p, p + 45.32); return fract(p.x * p.y); }
vec2 hash2(vec2 p){ return vec2(hash(p), hash(p + 17.31)); }

float noise(vec2 p){
  vec2 i = floor(p), f = fract(p);
  f = f * f * (3.0 - 2.0 * f);
  return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
             mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
}

float fbm(vec2 p){
  float a = 0.5, s = 0.0;
  for (int i = 0; i < 3; i++){
    s += a * noise(p);
    p = mat2(1.5, 1.1, -1.1, 1.5) * p;
    a *= 0.5;
  }
  return s;
}

// liquid height field: domain-warped noise whose warp speed and direction keep drifting
float height(vec2 p, float t){
  vec2 q = vec2(fbm(p + vec2(0.0, t * 0.11)),
                fbm(p + vec2(5.2, 1.3) - vec2(t * 0.09, 0.0)));
  vec2 r = vec2(fbm(p + 1.5 * q + vec2(1.7, 9.2) + t * 0.07 * vec2(sin(t * 0.13), cos(t * 0.11))),
                fbm(p + 1.5 * q + vec2(8.3, 2.8) - t * 0.06 * vec2(cos(t * 0.17), sin(t * 0.09))));
  float h = fbm(p + 1.7 * r + vec2(sin(t * 0.21) * 0.5, t * 0.05));
  // slow erratic swells
  h += 0.05 * sin(p.x * 1.3 + t * 0.55 + 4.0 * q.x) * sin(p.y * 1.1 - t * 0.42 + 3.0 * r.y);
  return h;
}

vec3 env(vec3 n){
  // studio-style chrome reflection: dark floor, bright horizon band, soft white sky
  float y = clamp(n.y * 2.6 * 0.5 + 0.5, 0.0, 1.0);
  float horizon = exp(-pow((y - 0.50) * 9.0, 2.0));
  float sky = smoothstep(0.55, 1.0, y);
  float floorG = 0.04 + 0.10 * smoothstep(0.0, 0.5, y);
  float strip = exp(-pow((clamp(n.x * 2.6 * 0.5 + 0.5, 0.0, 1.0) - 0.3) * 6.0, 2.0)) * 0.6;
  float c = floorG + horizon * 1.1 + sky * 0.35 + strip * smoothstep(0.35, 0.6, y);
  return vec3(c) * vec3(0.93, 0.95, 1.0);
}

void main(){
  vec2 uv = gl_FragCoord.xy / uRes;
  float asp = uRes.x / uRes.y;
  vec2 p = vec2((uv.x - 0.5) * asp, uv.y - 0.5) * 0.95;
  float t = uTime;

  float e = 0.02;
  float h  = height(p, t);
  float hx = height(p + vec2(e, 0.0), t);
  float hy = height(p + vec2(0.0, e), t);
  vec2 g = vec2(hx - h, hy - h) / e;

  vec3 n = normalize(vec3(-g * 0.42, 1.0));
  vec3 refl = reflect(vec3(0.0, 0.0, -1.0), n);
  vec3 col = env(refl);

  // fresnel-ish bright edges where the surface tilts hard
  float tilt = 1.0 - n.z;
  col += vec3(0.9, 0.95, 1.0) * smoothstep(0.15, 0.6, tilt) * 0.2;
  col = pow(clamp(col, 0.0, 1.5), vec3(1.15));

  // specular glints that ride the flow
  vec3 L = normalize(vec3(-0.4, 0.55, 0.7));
  float spec = pow(max(dot(reflect(-L, n), vec3(0.0, 0.0, 1.0)), 0.0), 60.0);
  col += vec3(spec) * 0.9;

  // twinkling star dots
  float dens = 26.0;
  vec2 sp = vec2(uv.x * asp, uv.y) * dens + vec2(t * 0.12, -t * 0.05);
  vec2 cell = floor(sp);
  vec2 fp = fract(sp);
  vec2 rnd = hash2(cell);
  float present = step(0.78, hash(cell + 9.1));
  float tw = 0.5 + 0.5 * sin(t * (0.6 + rnd.x * 2.2) + rnd.y * 6.283);
  float d = length(fp - (0.2 + 0.6 * rnd));
  float star = present * smoothstep(0.13, 0.02, d) * (0.25 + 0.75 * tw);
  col += vec3(star) * 1.2;

  gl_FragColor = vec4(clamp(col, 0.0, 1.0), 1.0);
}
`

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const s = gl.createShader(type)
  if (!s) return null
  gl.shaderSource(s, src)
  gl.compileShader(s)
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    gl.deleteShader(s)
    return null
  }
  return s
}

export function LiquidChromeBackdrop() {
  const pathname = usePathname()
  const isHome = pathname === "/"
  const wrapRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [live, setLive] = useState(false)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return
    // Note: deliberately not gated on prefers-reduced-motion (Windows "animation effects" off,
    // remote desktops and screen sharing report it), the motion is slow and low-contrast.
    const gl = canvas.getContext("webgl", { antialias: false, alpha: false })
    if (!gl) {
      console.warn("[liquid-chrome] WebGL unavailable, showing static image")
      return
    }
    const vs = compile(gl, gl.VERTEX_SHADER, VERT)
    const fs = compile(gl, gl.FRAGMENT_SHADER, FRAG)
    if (!vs || !fs) {
      console.warn("[liquid-chrome] shader failed to compile")
      return
    }
    const prog = gl.createProgram()
    if (!prog) return
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, "p")
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const uRes = gl.getUniformLocation(prog, "uRes")
    const uTime = gl.getUniformLocation(prog, "uTime")

    const SCALE = 0.6 // render below native resolution; the surface is soft so it upscales cleanly
    const resize = () => {
      const w = Math.max(2, Math.round(wrap.clientWidth * SCALE))
      const h = Math.max(2, Math.round(wrap.clientHeight * SCALE))
      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w
        canvas.height = h
        gl.viewport(0, 0, w, h)
      }
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(wrap)

    let raf = 0
    let running = true
    let visible = true
    let shown = false
    // Time advances by a clamped per-frame delta, so pausing (tab hidden, scrolled away) and
    // resuming never makes the flow jump ahead or run fast to "catch up".
    let clock = 20
    let last = 0

    const stop = () => {
      if (raf) cancelAnimationFrame(raf)
      raf = 0
      last = 0
    }
    const frame = (now: number) => {
      raf = 0
      if (!running || !visible) {
        last = 0
        return
      }
      if (last) clock += Math.min((now - last) / 1000, 0.05)
      last = now
      gl.uniform2f(uRes, canvas.width, canvas.height)
      gl.uniform1f(uTime, clock)
      gl.drawArrays(gl.TRIANGLES, 0, 3)
      if (!shown) { shown = true; setLive(true) }
      raf = requestAnimationFrame(frame)
    }
    const kick = () => {
      stop() // never more than one loop alive
      if (running && visible) raf = requestAnimationFrame(frame)
    }

    const io = new IntersectionObserver(([en]) => { visible = en.isIntersecting; kick() })
    io.observe(wrap)
    const onVis = () => { running = !document.hidden; kick() }
    document.addEventListener("visibilitychange", onVis)
    kick()

    return () => {
      running = false
      stop()
      ro.disconnect()
      io.disconnect()
      document.removeEventListener("visibilitychange", onVis)
      // Don't lose the context here: React dev mode (Strict Mode) mounts, unmounts and remounts
      // effects, and a lost context on the same canvas would never draw again.
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
    }
  }, [])

  return (
    <div
      ref={wrapRef}
      aria-hidden
      className={`liquid-chrome-top pointer-events-none absolute inset-x-0 top-0 -z-10 ${
        isHome ? "h-[720px] opacity-50" : "h-[380px] opacity-25"
      }`}
      style={live ? { backgroundImage: "none" } : undefined}
    >
      <canvas ref={canvasRef} className="h-full w-full" style={{ opacity: live ? 1 : 0, transition: "opacity .6s" }} />
    </div>
  )
}
