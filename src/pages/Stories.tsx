import { useEffect, useRef } from 'react'
import { Link, useLocation, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import gsap from 'gsap'
import { Marker, Reveal } from '../components/ui'
import { Lines, Magnetic } from '../components/motion'
import { content, t as pick, cms, type Locale } from '../content'

/* The index reads like a ledger of names; the photograph follows the
   cursor and fills upward like water when a new name is touched.
   Touch devices get inline thumbnails instead (CSS decides). */

export function Stories({ lng, base }: { lng: Locale; base: string }) {
  const { t } = useTranslation()
  const [lead, ...rest] = content.stories
  const preview = useRef<HTMLDivElement>(null)
  const previewImg = useRef<HTMLImageElement>(null)
  const enabled = useRef(false)

  useEffect(() => {
    const el = preview.current
    if (!el) return
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    enabled.current = true
    gsap.set(el, { yPercent: -50, scale: 0.92, rotation: 0 })
    const xTo = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'power3' })
    const yTo = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'power3' })
    const rTo = gsap.quickTo(el, 'rotation', { duration: 0.7, ease: 'power2' })
    let lastX = -1
    const move = (e: MouseEvent) => {
      xTo(Math.min(e.clientX + 32, window.innerWidth - el.offsetWidth - 24))
      yTo(e.clientY)
      if (lastX >= 0) rTo(gsap.utils.clamp(-8, 8, (e.clientX - lastX) * 0.4))
      lastX = e.clientX
    }
    window.addEventListener('mousemove', move, { passive: true })
    return () => {
      enabled.current = false
      window.removeEventListener('mousemove', move)
    }
  }, [])

  const showPreview = (src: string) => {
    const el = preview.current, img = previewImg.current
    if (!enabled.current || !el || !img) return
    if (!src) { hidePreview(); return }
    if (img.dataset.src !== src) {
      img.src = src
      img.dataset.src = src
      /* the water line: new image fills the frame from the bottom up */
      gsap.fromTo(img, { clipPath: 'inset(100% 0% 0% 0%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 0.55, ease: 'power3.out' })
    }
    gsap.to(el, { autoAlpha: 1, scale: 1, duration: 0.4, ease: 'power3.out', overwrite: 'auto' })
  }
  const hidePreview = () => {
    if (!preview.current) return
    gsap.to(preview.current, { autoAlpha: 0, scale: 0.92, duration: 0.35, ease: 'power2.out', overwrite: 'auto' })
  }

  return (
    <section className="band page-head" data-elev="2600">
      <div className="shell">
        <Marker elev="≈2,600 m" label={t('nav.stories')} />
        <div className="grid2" style={{ marginBottom: 'clamp(34px,5vw,60px)' }}>
          <div>
            <p className="geez-lead" lang="ti">ዛንታታት</p>
            <Lines as="h1" className="h2" lang={lng}>
              {lng === 'ti' ? 'ካብ ዓውዲ ዝመጹ ዛንታታት።' : lng === 'am' ? 'ከመስክ የመጡ ታሪኮች።' : (
                <>News from the field, <em>told with names.</em></>
              )}
            </Lines>
          </div>
          <p className="kick" lang={lng}>
            {lng === 'en'
              ? 'Water points restored, harvests recovered, ambassadors on the ground — reported from the woredas where it happens.'
              : ''}
          </p>
        </div>

        {/* lead feature */}
        {lead && (
          <Reveal className="feature">
            <Link to={`${base}/stories/0`}>
              <div className="ft-img">{lead.image && <img src={cms(lead.image)} alt="" />}</div>
              <div className="ft-body">
                <span className="si-meta">{lead.date} · latest</span>
                <h2 lang={lng}>{pick(lead.title, lng)}</h2>
                <p lang={lng}>{pick(lead.body, lng).slice(0, 220)}…</p>
                <span className="svc-more" lang={lng}>{t('home.readStory')} →</span>
              </div>
            </Link>
          </Reveal>
        )}

        {/* the ledger */}
        <div className="ix-list" style={{ marginTop: 'clamp(28px,4vw,48px)' }} onMouseLeave={hidePreview}>
          {rest.map((s, j) => {
            const i = j + 1
            return (
              <Reveal key={i} delay={Math.min(j, 6) * 40}>
                <Link
                  className="ix-row"
                  to={`${base}/stories/${i}`}
                  onMouseEnter={() => showPreview(s.image ? cms(s.image) : '')}
                >
                  <span className="ix-date">{s.date}</span>
                  <span className="ix-thumb" aria-hidden="true">
                    {s.image && <img src={cms(s.image)} alt="" loading="lazy" />}
                  </span>
                  <h3 lang={lng}>{pick(s.title, lng)}</h3>
                  <span className="ix-arr" aria-hidden="true">→</span>
                </Link>
              </Reveal>
            )
          })}
        </div>
      </div>

      {/* cursor-following photograph */}
      <div className="ix-preview" ref={preview} aria-hidden="true">
        <img ref={previewImg} alt="" />
      </div>
    </section>
  )
}

export function StoryDetail({ lng, base }: { lng: Locale; base: string }) {
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const idx = Number(pathname.match(/\/stories\/(\d+)/)?.[1] ?? NaN)
  const story = content.stories[idx]
  if (!story) return <Navigate to={`${base}/stories`} replace />

  const body = pick(story.body, lng)
  const paras = body.split(/(?<=\.)\s+(?=[A-Zሀ-፿])/).reduce<string[]>((acc, sentence) => {
    const last = acc[acc.length - 1]
    if (last && last.length < 340) acc[acc.length - 1] = `${last} ${sentence}`
    else acc.push(sentence)
    return acc
  }, [])

  const next = content.stories[idx + 1] ? idx + 1 : 0

  /* a dropcap only works on a letter — CMS copy sometimes opens with an emoji */
  const canDrop = /^[A-Za-zሀ-፿]/.test(paras[0] ?? '')

  return (
    <article className="detail story-article page-head" data-elev="2600">
      <div className="shell">
        <div className="detail-head">
          <Link to={`${base}/stories`} className="svc-more">← {t('misc.back')}</Link>
          <div className="si-meta" style={{ marginTop: 18 }}>{story.date} · REST · Tigray</div>
          <Lines as="h1" lang={lng}>{pick(story.title, lng)}</Lines>
        </div>
        {story.image && (
          <figure className="fig detail-fig">
            <img
              src={cms(story.image)}
              alt=""
              loading="lazy"
              onError={(e) => {
                /* a broken CMS image should vanish, not leave a torn frame */
                const f = e.currentTarget.closest('figure')
                if (f) (f as HTMLElement).style.display = 'none'
              }}
            />
            <figcaption><span>REST field report</span><span className="loc">{story.date}</span></figcaption>
          </figure>
        )}
        <div className="prose detail-body" lang={lng}>
          {paras.map((p, i) => <p key={i} className={i === 0 && canDrop ? 'dropcap' : undefined}>{p}</p>)}
        </div>
        <div className="detail-next">
          <span className="nb-kicker" style={{ color: 'var(--ink-dim)' }}>Next story</span>
          <Magnetic>
            <Link to={`${base}/stories/${next}`} className="dn-link" lang={lng}>
              {pick(content.stories[next].title, lng)} →
            </Link>
          </Magnetic>
        </div>
      </div>
    </article>
  )
}
