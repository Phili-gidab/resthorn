import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Marquee, Magnetic } from './motion'
import { usePrefs } from '../hooks/usePrefs'
import type { Locale } from '../content'

gsap.registerPlugin(ScrollTrigger)

/* ============================================================
   Hero — a cinematic opening scene, in three cuts.

   cinema (desktop): curtain lifts, the headline sets itself line
     by line over a framed photograph, then the frame swallows the
     viewport on scroll — the land takes over — and releases.

   mobile: the film runs full-bleed from the first frame. Same
     curtain, same line-by-line setting, a slow drift across the
     footage, and a scrolled departure rather than a pinned scene —
     pinning fights the address bar on phones and loses.

   still: reduced motion or a metered connection. Poster frame,
     no choreography, everything legible immediately.
   ============================================================ */

type Mode = 'cinema' | 'mobile' | 'still'

export default function Hero({ lng, base }: { lng: Locale; base: string }) {
  const { t } = useTranslation()
  const root = useRef<HTMLElement>(null)
  const prefs = usePrefs()
  const [mode] = useState<Mode>(() => {
    if (typeof window === 'undefined') return 'still'
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return 'still'
    return window.innerWidth >= 880 ? 'cinema' : 'mobile'
  })
  /* the footage is the atmosphere — but not at the cost of someone's data plan */
  const film = mode !== 'still' && !prefs.saveData

  useEffect(() => {
    const el = root.current
    if (!el || mode === 'still') return

    const ctx = gsap.context(() => {
      if (mode === 'mobile') {
        /* ---------- phones: full-bleed film, scrolled departure ---------- */
        const intro = gsap.timeline({ defaults: { ease: 'expo.inOut' } })
        intro
          .to('.hc-2', { yPercent: -100, duration: 0.78, delay: 0.05 })
          .to('.hc-1', { yPercent: -100, duration: 0.84 }, '-=0.6')
          .from('.hh-kicker', { y: 18, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.48')
          .from('.hh-line', { yPercent: 118, duration: 0.88, ease: 'power4.out', stagger: 0.1 }, '-=0.46')
          .from('.hero-meta', { y: 16, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.58')
          .from('.hero-geez', { y: 14, opacity: 0, duration: 0.55, ease: 'power3.out' }, '-=0.42')
          .from('.hero-cta', { y: 16, opacity: 0, duration: 0.6, ease: 'power3.out' }, '-=0.4')
          .from('.hero-ticker', { yPercent: 100, duration: 0.7, ease: 'power3.out' }, '-=0.42')

        /* a slow push across the footage so the frame is never quite still */
        gsap.fromTo('.hero-media', { scale: 1.18 }, { scale: 1.03, duration: 10, ease: 'none' })

        /* departure on scroll — no pin: mobile chrome resizes mid-scroll and
           a pinned 100svh scene tears itself apart when it does */
        gsap.timeline({
          scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.5 },
        })
          .to('.hero-head', { yPercent: -30, opacity: 0, ease: 'none' }, 0)
          .to('.hero-over', { yPercent: -16, opacity: 0, ease: 'none' }, 0)
          .to('.hero-photo .hero-media', { scale: 1.16, ease: 'none' }, 0)
        return
      }

      /* ---------- desktop: the framed window that swallows the viewport ---------- */
      const frameClip = () => {
        const head = el.querySelector<HTMLElement>('.hero-head')
        const h = el.offsetHeight || window.innerHeight
        const top = head ? Math.min(head.getBoundingClientRect().height + 18, h * 0.62) : h * 0.45
        return `inset(${Math.round(top)}px 15% 8% 15% round 10px)`
      }
      gsap.set('.hero-photo', { clipPath: frameClip() })

      const intro = gsap.timeline({ defaults: { ease: 'expo.inOut' } })
      intro
        .to('.hc-2', { yPercent: -100, duration: 0.85, delay: 0.1 })
        .to('.hc-1', { yPercent: -100, duration: 0.9 }, '-=0.68')
        .from('.hh-kicker', { y: 26, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.55')
        .from('.hh-line', { yPercent: 118, duration: 1.0, ease: 'power4.out', stagger: 0.11 }, '-=0.55')
        .fromTo('.hero-photo .hero-media', { scale: 1.28 }, { scale: 1.12, duration: 2.0, ease: 'expo.out' }, '-=1.2')
        .from('.hero-meta', { y: 22, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=1.4')

      const scene = gsap.timeline({
        scrollTrigger: {
          trigger: el,
          start: 'top top',
          end: '+=130%',
          pin: true,
          scrub: 0.55,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
        defaults: { ease: 'none' },
      })
      scene
        .fromTo('.hero-photo',
          { clipPath: frameClip },
          { clipPath: 'inset(0px 0% 0% 0% round 0px)', duration: 1 }, 0)
        .fromTo('.hero-photo .hero-media', { scale: 1.12 }, { scale: 1, duration: 1 }, 0)
        .to('.hero-head', { yPercent: -46, opacity: 0, duration: 0.62 }, 0.05)
        .to('.hero-meta', { opacity: 0, duration: 0.3 }, 0)
        .fromTo('.hero-over', { opacity: 0, y: 30 }, { opacity: 1, y: 0, duration: 0.34, ease: 'power2.out' }, 0.58)
        .fromTo('.hero-ticker', { yPercent: 100 }, { yPercent: 0, duration: 0.3, ease: 'power2.out' }, 0.66)

      const onResize = () => ScrollTrigger.refresh()
      window.addEventListener('resize', onResize)
      return () => window.removeEventListener('resize', onResize)
    }, el)
    return () => ctx.revert()
  }, [mode])

  const tickerItems = [
    'Est. 1978 · Mekelle', '3,000,000 lives', '1,000+ projects', '29 partners',
    <span className="geez" lang="ti" key="gz">ካብ ምድሪ · ናብ ህይወት</span>,
    'WFP · UNICEF · FAO · EU · Oxfam',
  ]

  const shell = mode === 'cinema' ? 'cinema' : mode === 'mobile' ? 'static mobile' : 'static'

  return (
    <section className={`hero ${shell}`} data-elev="3900" ref={root}>
      {mode !== 'still' && (
        <div className="hero-curtain" aria-hidden="true"><span className="hc-1" /><span className="hc-2" /></div>
      )}

      {/* headline layer */}
      <div className="hero-head">
        <div className="shell">
          {/* three parts so phones can stack the lockup instead of wrapping it */}
          <p className="hh-kicker">
            <span className="geez" lang="ti">ማሕበር ረድኤት ትግራይ</span>
            <span className="kk-sep"> — </span>
            <span className="kk-en">{t('hero.kicker')}</span>
          </p>
          <h1 lang={lng}>
            <span className="hh-mask"><span className="hh-line">{t('hero.title1')}</span></span>
            <span className="hh-mask"><span className="hh-line thin">{t('hero.title2')}</span></span>
          </h1>
        </div>
        <div className="shell hero-meta">
          <p className="hm-sub" lang={lng}>{t('hero.sub')}</p>
          <span className="hm-scroll" lang={lng}>{t('hero.scroll')} ↓</span>
        </div>
      </div>

      {/* the film */}
      <div className="hero-photo">
        {film ? (
          <video
            className="hero-media"
            src="/hero-loop.mp4"
            poster="/photos/hero-poster.jpg"
            autoPlay muted loop playsInline
            preload="auto"
            aria-label="Clean water flowing at a REST water point"
          />
        ) : (
          <img className="hero-media" src="/photos/hero-poster.jpg" alt="Clean water flowing at a REST water point" fetchPriority="high" />
        )}
        <span className="hero-credit">Clean water · REST field footage · Tigray</span>
      </div>

      {/* overlay content */}
      <div className="hero-over">
        <div className="shell">
          <p className="hero-geez" lang="ti">ካብ ምድሪ · ናብ ህይወት</p>
          <p className="ho-line" lang={lng}>{t('home.ctaTitle')}</p>
          <div className="hero-cta">
            <Magnetic><Link className="btn solid" to={`${base}/work`} lang={lng}>{t('hero.cta')} <span className="arr">→</span></Link></Magnetic>
            <Magnetic><Link className="btn ghost-light" to={`${base}/involved`} lang={lng}>{t('nav.donate')} <span className="arr">→</span></Link></Magnetic>
          </div>
        </div>
      </div>

      <div className="hero-ticker"><Marquee items={tickerItems} /></div>
    </section>
  )
}
