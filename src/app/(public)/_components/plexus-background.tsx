'use client'

import { useEffect, useRef } from 'react'

const baseSettings = {
  countMin: 100,
  countMax: 300,
  speed: 0.18,
  /** >1 concentra mais pontos (e linhas) à direita: x = w * (1 - (1-u)^skew). */
  rightDensitySkew: 1.75,
  reachRatio: 0.15,
  minSeparationRatio: 0.05,
  lineOpacityMax: 0.22,
  dotOpacity: 0.6,
  lineWidth: 0.6,
} as const

const subtleSettings = {
  countMin: 100,
  countMax: 150,
  lineOpacityMax: 0.1,
  dotOpacity: 0.15,
} as const

const defaultNetworkColor = '255, 120, 0' as const

type Particle = { x: number; y: number; vx: number; vy: number; size: number }

function particleCountForSize(w: number, h: number) {
  const m = Math.min(w, h)
  const ref = 420
  const t = Math.max(1, m / ref)
  return Math.min(
    baseSettings.countMax,
    Math.max(baseSettings.countMin, Math.round(baseSettings.countMin * t))
  )
}

function minSeparationForCount(
  baseRatio: number,
  count: number,
  countMin: number
) {
  const t =
    (count - countMin) /
    Math.max(1, baseSettings.countMax - baseSettings.countMin)
  return Math.max(0.03, baseRatio * (1 - 0.2 * t))
}

function rectLayout(w: number, h: number) {
  const maxDim = Math.max(w, h)
  const reach = Math.max(25, Math.round(maxDim * baseSettings.reachRatio))
  return { width: w, height: h, reach }
}

/** Distribui x com mais massa à direita (u uniforme em [0,1]). */
function randomXRightHeavy(w: number, skew: number) {
  const u = Math.random()
  return w * (1 - Math.pow(1 - u, skew))
}

type PlexusBackgroundProps = {
  /** Cor RGB da rede, ex.: `"0, 212, 255"` (cyan) ou padrão laranja. */
  networkColor?: string
  /** Menos pontos e mais transparentes — para páginas internas. */
  subtle?: boolean
}

function bounceOffEdges(p: Particle, w: number, h: number) {
  if (p.x < 0 || p.x > w) {
    p.vx *= -1
    if (p.x < 0) p.x = 0.5
    if (p.x > w) p.x = w - 0.5
  }
  if (p.y < 0 || p.y > h) {
    p.vy *= -1
    if (p.y < 0) p.y = 0.5
    if (p.y > h) p.y = h - 0.5
  }
}

export function PlexusBackground({
  networkColor = defaultNetworkColor,
  subtle = false,
}: PlexusBackgroundProps) {
  const settings = subtle
    ? { ...baseSettings, ...subtleSettings }
    : baseSettings
  const wrapperRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const wrapper = wrapperRef.current
    const canvas = canvasRef.current
    if (!wrapper || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const colorRgb = networkColor
    const wrapEl = wrapper
    const canvasEl = canvas
    const drawCtx = ctx

    let particles: Particle[] = []
    let raf = 0
    let width = 0
    let height = 0
    let dpr = 1

    function syncSize() {
      const rect = wrapEl.getBoundingClientRect()
      width = Math.max(1, Math.floor(rect.width))
      height = Math.max(1, Math.floor(rect.height))
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvasEl.width = Math.floor(width * dpr)
      canvasEl.height = Math.floor(height * dpr)
      canvasEl.style.width = `${width}px`
      canvasEl.style.height = `${height}px`
    }

    function initParticles() {
      const { width: w, height: h } = rectLayout(width, height)
      const m = Math.min(width, height)
      const ref = 420
      const t = Math.max(1, m / ref)
      const count = Math.min(
        settings.countMax,
        Math.max(settings.countMin, Math.round(settings.countMin * t))
      )
      const minRatio = minSeparationForCount(
        settings.minSeparationRatio,
        count,
        settings.countMin
      )
      const minD = Math.max(width, height) * minRatio
      particles = []
      for (let i = 0; i < count; i++) {
        let x = 0
        let y = 0
        let guard = 0
        while (guard < 100) {
          x = randomXRightHeavy(w, settings.rightDensitySkew)
          y = Math.random() * h
          const ok = particles.every(p => Math.hypot(p.x - x, p.y - y) >= minD)
          if (ok) break
          guard++
        }
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * settings.speed,
          vy: (Math.random() - 0.5) * settings.speed,
          size: Math.random() * 1.2 + 1,
        })
      }
    }

    function setup() {
      syncSize()
      initParticles()
    }

    function animate() {
      const { width: w, height: h, reach } = rectLayout(width, height)

      drawCtx.setTransform(1, 0, 0, 1, 0, 0)
      drawCtx.clearRect(0, 0, canvasEl.width, canvasEl.height)
      drawCtx.setTransform(dpr, 0, 0, dpr, 0, 0)

      drawCtx.save()

      for (const p of particles) {
        p.x += p.vx
        p.y += p.vy
        bounceOffEdges(p, w, h)
      }

      const n = particles.length
      for (let i = 0; i < n; i++) {
        const p = particles[i]
        for (let j = i + 1; j < n; j++) {
          const p2 = particles[j]
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y)
          if (dist < reach) {
            const opacity = 1 - dist / reach
            drawCtx.strokeStyle = `rgba(${colorRgb}, ${opacity * settings.lineOpacityMax})`
            drawCtx.lineWidth = settings.lineWidth
            drawCtx.beginPath()
            drawCtx.moveTo(p.x, p.y)
            drawCtx.lineTo(p2.x, p2.y)
            drawCtx.stroke()
          }
        }
      }

      for (const p of particles) {
        drawCtx.fillStyle = `rgba(${colorRgb}, ${settings.dotOpacity})`
        drawCtx.beginPath()
        drawCtx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        drawCtx.fill()
      }

      drawCtx.restore()

      raf = requestAnimationFrame(animate)
    }

    setup()
    raf = requestAnimationFrame(animate)

    const ro = new ResizeObserver(() => {
      setup()
    })
    ro.observe(wrapEl)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
    }
  }, [networkColor, subtle])

  return (
    <div
      ref={wrapperRef}
      className="pointer-events-none absolute inset-0 z-0 overflow-hidden"
      aria-hidden
    >
      <canvas
        ref={canvasRef}
        className="block h-full w-full"
        style={{
          filter: `drop-shadow(0 0 14px rgba(${networkColor}, 0.45))`,
        }}
      />
    </div>
  )
}
