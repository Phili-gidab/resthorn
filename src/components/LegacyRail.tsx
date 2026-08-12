import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { content, t as pick, cms, type Locale } from '../content'

gsap.registerPlugin(ScrollTrigger)

/* ============================================================
   LegacyRail — the dark counter-chapter.
   Forty-eight years pinned to the viewport and read sideways:
   the scroll drags the chronicle from 1978 to today while a
   giant outline year scrubs behind the cards like an odometer.
   Desktop only — Home falls back to the vertical list elsewhere.
   ============================================================ */

const yearOf = (y: string) => Number(y.match(/\d{4}/)?.[0] ?? '1978')

export default function LegacyRail({ lng, base }: { lng: Locale; base: string }) {
  const { t } = useTranslation()
  const root = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)
  const year = useRef<HTMLSpanElement>(null)
  const today = new Date().getFullYear()

  useEffect(() => {
    const wrap = root.current, tr = track.current, yr = year.current
    if (!wrap || !tr || !yr) return
    const years = [...content.history.map((m) => yearOf(m.year)), today]

    const ctx = gsap.context(() => {
      const dist = () => Math.max(tr.scrollWidth - wrap.offsetWidth, 1)
      gsap.to(tr, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: () => `+=${dist()}`,
          pin: true,
          scrub: 0.6,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const f = self.progress * (years.length - 1)
            const i = Math.min(Math.floor(f), years.length - 2)
            yr.textContent = String(Math.round(years[i] + (years[i + 1] - years[i]) * (f - i)))
          },
        },
      })
      gsap.to('.rail-fill', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: { trigger: wrap, start: 'top top', end: () => `+=${dist()}`, scrub: 0.6 },
      })
    }, wrap)
    return () => ctx.revert()
  }, [lng, today])

  return (
    <div className="rail" ref={root}>
      <span className="rail-year" ref={year} aria-hidden="true">1978</span>
      <div className="rail-line" aria-hidden="true"><div className="rail-fill" /></div>
      <div className="rail-track" ref={track}>
        {content.history.map((m, i) => (
          <article className="rail-card" key={i}>
            <span className="rc-year">{m.year}</span>
            {m.image && <img src={cms(m.image)} alt="" loading={i > 1 ? 'lazy' : undefined} />}
            <p lang={lng}>{pick(m.body, lng)}</p>
          </article>
        ))}
        <article className="rail-card rail-today">
          <span className="rc-year">Today</span>
          <p>The line continues — response, recovery and development, carried out with the people of Tigray.</p>
          <Link to={`${base}/story`} className="btn ghost-light" lang={lng}>
            {t('nav.story')} <span className="arr">→</span>
          </Link>
        </article>
      </div>
    </div>
  )
}
