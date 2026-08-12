import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { content, t as pick, cms, type Locale } from '../content'

gsap.registerPlugin(ScrollTrigger)

/* "Forty-eight years, one line" — pinned horizontal chronicle, 1978 → today.
   The gold line never breaks; that is the point. */
export default function Timeline({ lng }: { lng: Locale }) {
  const root = useRef<HTMLDivElement>(null)
  const track = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const wrap = root.current
    const tr = track.current
    if (!wrap || !tr) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (reduced) return

    const ctx = gsap.context(() => {
      const dist = () => tr.scrollWidth - wrap.offsetWidth
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
        },
      })
      gsap.to('.tl-line-fill', {
        scaleX: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: wrap,
          start: 'top top',
          end: () => `+=${dist()}`,
          scrub: 0.6,
        },
      })
    }, wrap)
    return () => ctx.revert()
  }, [lng])

  return (
    <div className="tl-wrap" ref={root}>
      <div className="tl-line"><div className="tl-line-fill" /></div>
      <div className="tl-track" ref={track}>
        {content.history.map((m, i) => (
          <article className="tl-card" key={i}>
            <div className="tl-year">{m.year}</div>
            <p lang={lng}>{pick(m.body, lng)}</p>
            {m.image && <img src={cms(m.image)} alt="" loading="lazy" />}
            <span className="tl-dot" />
          </article>
        ))}
        <article className="tl-card tl-today">
          <div className="tl-year accent-it">Today</div>
          <p>The line continues — humanitarian response, recovery, and development, carried out with the people of Tigray.</p>
          <span className="tl-dot" />
        </article>
      </div>
    </div>
  )
}
