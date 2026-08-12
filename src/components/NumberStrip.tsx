import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { impact, type Locale } from '../content'

gsap.registerPlugin(ScrollTrigger)

function fmt(v: number, kind: string) {
  if (kind === 'year') return String(Math.round(v))
  const s = Math.round(v).toLocaleString('en-US')
  return kind === 'plus' ? `${s}+` : s
}

/* The record — full-bleed brand-green band, counters + drawn arc gauges. */
export default function NumberStrip({ lng }: { lng: Locale }) {
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = root.current
    if (!el) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const nums = Array.from(el.querySelectorAll<HTMLElement>('.nb-n'))
    if (reduced) {
      nums.forEach((n) => { n.textContent = fmt(Number(n.dataset.v), n.dataset.k || 'plain') })
      return
    }
    const ctx = gsap.context(() => {
      nums.forEach((n) => {
        const target = Number(n.dataset.v)
        const kind = n.dataset.k || 'plain'
        const obj = { v: kind === 'year' ? 1900 : 0 }
        gsap.to(obj, {
          v: target,
          duration: target > 10000 ? 2.0 : 1.4,
          ease: 'power3.out',
          scrollTrigger: { trigger: n, start: 'top 88%', once: true },
          onUpdate: () => { n.textContent = fmt(obj.v, kind) },
        })
      })
      gsap.fromTo(el.querySelectorAll<SVGCircleElement>('.nb-arc'),
        { strokeDashoffset: 100 },
        {
          strokeDashoffset: 18,
          duration: 1.8,
          ease: 'power2.inOut',
          stagger: 0.14,
          scrollTrigger: { trigger: el, start: 'top 80%', once: true },
        })
      gsap.from(el.querySelectorAll('.nb-item'), {
        y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', stagger: 0.1,
        scrollTrigger: { trigger: el, start: 'top 82%', once: true },
      })
    }, el)
    return () => ctx.revert()
  }, [])

  return (
    <div className="numband" ref={root} data-elev="2600">
      <div className="shell">
        <div className="nb-head">
          <span className="nb-kicker">The record · ግድብ ናይ ስራሕ</span>
          <span className="nb-rule" />
          <span className="nb-kicker">1978 — {new Date().getFullYear()}</span>
        </div>
        <div className="nb-grid">
          {impact.map((it) => (
            <div className="nb-item" key={it.value}>
              <svg viewBox="0 0 72 72" className="nb-gauge" aria-hidden="true">
                <circle cx="36" cy="36" r="31" pathLength={100} className="nb-track" />
                <circle cx="36" cy="36" r="31" pathLength={100} className="nb-arc" />
              </svg>
              <div>
                <div className="nb-n" data-v={it.value} data-k={it.format} aria-label={fmt(it.value, it.format)}>
                  {fmt(it.value, it.format)}
                </div>
                <div className="nb-d" lang={lng}>{it.label[lng] || it.label.en}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="nb-src">Figures from REST's own records and published counters · resthorn.org</p>
      </div>
    </div>
  )
}
