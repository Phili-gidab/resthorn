import { useEffect, useRef, useState, type ReactNode, type CSSProperties } from 'react'

/* ---------- clamped text with read-more toggle ---------- */
export function ReadMore({ text, lines = 6, lang }: { text: string; lines?: number; lang?: string }) {
  const [open, setOpen] = useState(false)
  const needsClamp = text.length > 320
  return (
    <>
      <p
        lang={lang}
        className={!open && needsClamp ? 'rm-clamp' : undefined}
        style={!open && needsClamp ? { WebkitLineClamp: lines } : undefined}
      >
        {text}
      </p>
      {needsClamp && (
        <button className="rm-btn" onClick={() => setOpen(!open)} aria-expanded={open}>
          {open ? 'Read less −' : 'Read more +'}
        </button>
      )}
    </>
  )
}

/* ---------- scroll reveal (adds .on when entering viewport) ---------- */
export function Reveal({ children, as = 'div', className = '', style, delay = 0 }: {
  children: ReactNode
  as?: 'div' | 'section' | 'figure' | 'p' | 'h2' | 'h3' | 'span'
  className?: string
  style?: CSSProperties
  delay?: number
}) {
  const ref = useRef<HTMLElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      el.classList.add('on')
      return
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            window.setTimeout(() => el.classList.add('on'), delay)
            io.unobserve(el)
          }
        })
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [delay])
  const Tag = as as 'div'
  return (
    <Tag ref={ref as React.RefObject<HTMLDivElement>} className={`rv ${className}`} style={style}>
      {children}
    </Tag>
  )
}

/* ---------- survey-marker eyebrow ---------- */
export function Marker({ elev, label }: { elev: string; label: string }) {
  return (
    <Reveal className="marker">
      <span className="elev">{elev}</span>
      <span className="tick" />
      <span className="lab">{label}</span>
      <span className="rule" />
    </Reveal>
  )
}

/* ---------- seeded ridge line generator (shared by contour strips) ---------- */
export function mulberry(a: number) {
  return function () {
    a |= 0
    a = (a + 0x6d2b79f5) | 0
    let t = Math.imul(a ^ (a >>> 15), 1 | a)
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296
  }
}

export function makeRidge(rnd: () => number, w: number, amp: number, base: number) {
  const n = 7
  const ph: number[] = [], fr: number[] = [], am: number[] = []
  for (let i = 0; i < n; i++) {
    ph.push(rnd() * Math.PI * 2)
    fr.push(0.5 + rnd() * 2.2)
    am.push(amp * (1 / (i + 1)))
  }
  return (t: number, ctx: CanvasRenderingContext2D) => {
    ctx.beginPath()
    for (let x = 0; x <= w; x += 6) {
      let y = base
      for (let i = 0; i < n; i++) {
        y += Math.sin((x / w) * Math.PI * 2 * fr[i] + ph[i] + t * (i % 2 ? 1 : -1) * 0.18) * am[i]
      }
      if (x === 0) ctx.moveTo(x, y)
      else ctx.lineTo(x, y)
    }
    ctx.stroke()
  }
}

/* ---------- contour divider strip between elevation bands ---------- */
export function ContourStrip({ seed }: { seed: number }) {
  const ref = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const c = ref.current
    if (!c) return
    const draw = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2)
      c.width = c.offsetWidth * dpr
      c.height = 88 * dpr
      const ctx = c.getContext('2d')
      if (!ctx) return
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const rnd = mulberry(1000 + seed * 77)
      const cols = ['rgba(20,26,14,.10)', 'rgba(83,144,15,.14)', 'rgba(20,26,14,.06)']
      for (let i = 0; i < 3; i++) {
        ctx.strokeStyle = cols[i]
        ctx.lineWidth = 1
        makeRidge(rnd, c.offsetWidth, 10 + i * 5, 26 + i * 20)(1.3, ctx)
      }
    }
    draw()
    window.addEventListener('resize', draw)
    return () => window.removeEventListener('resize', draw)
  }, [seed])
  return <canvas ref={ref} className="contour" aria-hidden="true" />
}
