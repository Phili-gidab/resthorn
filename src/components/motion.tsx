import { useEffect, useRef, type ReactNode, type CSSProperties } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'

gsap.registerPlugin(ScrollTrigger, SplitText)

const reducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ---------- masked line reveal (SplitText) ---------- */
export function Lines({ children, as = 'h2', className = '', lang, delay = 0, style }: {
  children: ReactNode
  as?: 'h1' | 'h2' | 'h3' | 'p' | 'div'
  className?: string
  lang?: string
  delay?: number
  style?: CSSProperties
}) {
  const ref = useRef<HTMLElement | null>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion()) return
    let split: SplitText | null = null
    let st: ScrollTrigger | null = null
    let cancelled = false
    document.fonts.ready.then(() => {
      if (cancelled || !el) return
      split = new SplitText(el, { type: 'lines', mask: 'lines', linesClass: 'sl' })
      const tween = gsap.from(split.lines, {
        yPercent: 112,
        duration: 0.9,
        ease: 'power3.out',
        stagger: 0.09,
        delay,
        scrollTrigger: { trigger: el, start: 'top 86%', once: true },
      })
      st = tween.scrollTrigger ?? null
    })
    return () => {
      cancelled = true
      st?.kill()
      split?.revert()
    }
  }, [delay])
  const Tag = as as 'div'
  return <Tag ref={ref as React.RefObject<HTMLDivElement>} className={className} lang={lang} style={style}>{children}</Tag>
}

/* ---------- endless marquee band ---------- */
export function Marquee({ items, reverse = false }: { items: ReactNode[]; reverse?: boolean }) {
  const row = (key: string) => (
    <div className="mq-row" key={key} aria-hidden={key !== 'a'}>
      {items.map((it, i) => (
        <span className="mq-item" key={i}>
          {it}
          <span className="mq-dot">·</span>
        </span>
      ))}
    </div>
  )
  return (
    <div className={`mq ${reverse ? 'mq-rev' : ''}`}>
      <div className="mq-track">{row('a')}{row('b')}{row('c')}</div>
    </div>
  )
}

/* ---------- magnetic hover (desktop pointer only) ---------- */
export function Magnetic({ children, strength = 0.32 }: { children: ReactNode; strength?: number }) {
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const el = ref.current
    if (!el || reducedMotion() || !window.matchMedia('(pointer: fine)').matches) return
    const xTo = gsap.quickTo(el, 'x', { duration: 0.4, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.4, ease: 'power3' })
    const move = (e: MouseEvent) => {
      const r = el.getBoundingClientRect()
      xTo((e.clientX - (r.left + r.width / 2)) * strength)
      yTo((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const leave = () => { xTo(0); yTo(0) }
    el.addEventListener('mousemove', move)
    el.addEventListener('mouseleave', leave)
    return () => { el.removeEventListener('mousemove', move); el.removeEventListener('mouseleave', leave) }
  }, [strength])
  return <div ref={ref} style={{ display: 'inline-block' }}>{children}</div>
}

/* ---------- concentric topo rings, drawn on ---------- */
export function TopoRings({ className = '' }: { className?: string }) {
  const ref = useRef<SVGSVGElement>(null)

  const ringPath = (cx: number, cy: number, r: number, wob: number, seed: number) => {
    const pts: string[] = []
    const N = 46
    for (let i = 0; i <= N; i++) {
      const a = (i / N) * Math.PI * 2
      const rr = r + Math.sin(a * 3 + seed) * wob + Math.cos(a * 5 + seed * 2) * wob * 0.6
      const x = cx + Math.cos(a) * rr
      const y = cy + Math.sin(a) * rr * 0.86
      pts.push(`${i === 0 ? 'M' : 'L'}${x.toFixed(1)} ${y.toFixed(1)}`)
    }
    return pts.join(' ') + 'Z'
  }

  useEffect(() => {
    const svg = ref.current
    if (!svg) return
    const paths = svg.querySelectorAll('path')
    if (reducedMotion()) return
    paths.forEach((p) => {
      const len = p.getTotalLength()
      p.style.strokeDasharray = String(len)
      p.style.strokeDashoffset = String(len)
    })
    const ctx = gsap.context(() => {
      gsap.to(paths, {
        strokeDashoffset: 0,
        duration: 2.2,
        ease: 'power2.inOut',
        stagger: 0.16,
        delay: 0.7,
      })
      gsap.to(svg, { rotation: 8, duration: 40, repeat: -1, yoyo: true, ease: 'sine.inOut' })
    }, svg)
    return () => ctx.revert()
  }, [])

  return (
    <svg ref={ref} className={className} viewBox="0 0 300 300" aria-hidden="true">
      {[104, 84, 66, 50, 36, 24].map((r, i) => (
        <path key={r} d={ringPath(150, 150, r, 5 + i * 1.2, i * 1.7)} fill="none"
          stroke="rgba(255,255,255,0.5)" strokeWidth={i === 2 ? 1.5 : 1} />
      ))}
      <circle cx="150" cy="150" r="3" fill="#d8e8b8" />
    </svg>
  )
}
