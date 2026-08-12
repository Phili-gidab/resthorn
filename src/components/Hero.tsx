import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { Marquee, Magnetic } from './motion'
import { usePrefs } from '../hooks/usePrefs'
import type { Locale } from '../content'

gsap.registerPlugin(ScrollTrigger)
/* phone address bars collapse mid-scroll; without this, scroll scenes
   re-measure on that resize and visibly jump */
ScrollTrigger.config({ ignoreMobileResize: true })

/* ============================================================
   Hero — the film, full-bleed, at every width.
   No curtain, no pin: the footage runs from the first frame under
   a whisper of green shade. "From the land, to life." sets itself
   line by line out of masks, the CTAs surface, the ticker rises.
   Scrolling on simply hands the frame to the page — the content
   drifts up and away at a slower rate than the scroll itself.
   Reduced-motion / data-saver: poster frame, everything already
   in place.
   ============================================================ */

const LINES: Record<Locale, [string, string]> = {
  en: ['From the land,', 'to life.'],
  ti: ['ካብ ምድሪ፡', 'ናብ ህይወት።'],
  am: ['ከመሬት፣', 'ወደ ሕይወት።'],
}

export default function Hero({ lng, base }: { lng: Locale; base: string }) {
  const { t } = useTranslation()
  const root = useRef<HTMLElement>(null)
  const prefs = usePrefs()
  const film = !prefs.lowPower

  useEffect(() => {
    const el = root.current
    if (!el || prefs.reduced) return
    const ctx = gsap.context(() => {
      /* --- the opening --- */
      const intro = gsap.timeline()
      intro
        .fromTo('.hero-media', { scale: 1.14 }, { scale: 1, duration: 3.2, ease: 'expo.out' }, 0)
        .fromTo('.hero-shade', { opacity: 0 }, { opacity: 1, duration: 1.4, ease: 'power2.out' }, 0)
        .from('.hb-kicker', { y: 20, opacity: 0, duration: 0.75, ease: 'power3.out' }, 0.42)
        .from('.hb-lead', { y: 22, opacity: 0, duration: 0.8, ease: 'power3.out' }, 0.55)
        .from('.hh-line', { yPercent: 115, duration: 1.05, ease: 'power4.out', stagger: 0.13 }, 0.62)
        .from('.hb-sub', { y: 18, opacity: 0, duration: 0.7, ease: 'power3.out' }, 1.15)
        .from('.hero-cta > *', { y: 20, opacity: 0, duration: 0.75, stagger: 0.09, ease: 'power3.out' }, 1.25)
        .from('.hm-scroll', { opacity: 0, duration: 0.8, ease: 'power2.out' }, 1.6)
        .fromTo('.hero-ticker', { yPercent: 100 }, { yPercent: 0, duration: 0.85, ease: 'power3.out' }, 1.35)

      /* --- the departure: no pin, just parallax drift --- */
      gsap.timeline({
        scrollTrigger: { trigger: el, start: 'top top', end: 'bottom top', scrub: 0.5 },
        defaults: { ease: 'none' },
      })
        .to('.hero-body', { yPercent: -22, opacity: 0 }, 0)
        .to('.hero-media', { yPercent: 12, scale: 1.06 }, 0)
        .to('.hm-scroll', { opacity: 0 }, 0)
    }, el)
    return () => ctx.revert()
  }, [prefs.reduced])

  const tickerItems = [
    'Est. 1978 · Mekelle', '3,000,000 lives', '1,000+ projects', '29 partners',
    <span className="geez" lang="ti" key="gz">ካብ ምድሪ · ናብ ህይወት</span>,
    'WFP · UNICEF · FAO · EU · Oxfam',
  ]

  const [l1, l2] = LINES[lng]
  /* the Ge'ez motto sits above the translated headline; when the headline is
     already Ge'ez (ti), the motto would just repeat it */
  const showLead = lng !== 'ti'

  return (
    <section className="hero" data-elev="3900" ref={root}>
      {/* the film */}
      <div className="hero-film">
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
      </div>
      <div className="hero-shade" aria-hidden="true" />

      {/* the statement */}
      <div className="hero-body">
        <div className="shell">
          <p className="hb-kicker">
            {lng === 'en' ? (
              <>
                <span className="geez" lang="ti">ማሕበር ረድኤት ትግራይ</span>
                <span className="kk-sep"> — </span>
                <span className="kk-en">{t('hero.kicker')}</span>
              </>
            ) : (
              /* ti/am kickers already carry the organisation name in Ge'ez script */
              <span className="geez" lang={lng}>{t('hero.kicker')}</span>
            )}
          </p>
          {showLead && <p className="hb-lead geez" lang="ti">ካብ ምድሪ · ናብ ህይወት</p>}
          <h1 lang={lng}>
            <span className="hh-mask"><span className="hh-line">{l1}</span></span>
            <span className="hh-mask"><span className="hh-line thin">{l2}</span></span>
          </h1>
          <p className="hb-sub" lang={lng}>{t('hero.sub')}</p>
          <div className="hero-cta">
            <Magnetic><Link className="btn solid" to={`${base}/work`} lang={lng}>{t('hero.cta')} <span className="arr">→</span></Link></Magnetic>
            <Magnetic><Link className="btn ghost-light" to={`${base}/involved`} lang={lng}>{t('nav.donate')} <span className="arr">→</span></Link></Magnetic>
          </div>
        </div>
      </div>

      <span className="hm-scroll" lang={lng}>{t('hero.scroll')} ↓</span>
      <span className="hero-credit">Clean water · REST field footage · Tigray</span>
      <div className="hero-ticker"><Marquee items={tickerItems} /></div>
    </section>
  )
}
