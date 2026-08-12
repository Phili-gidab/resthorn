import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Hero from '../components/Hero'
import { projects, projectPhoto } from './Projects'
import NumberStrip from '../components/NumberStrip'
import Partners from '../components/Partners'
import LegacyRail from '../components/LegacyRail'
import RiverThread from '../components/RiverThread'
import { Marker, Reveal } from '../components/ui'
import { Lines, Marquee, Magnetic } from '../components/motion'
import { content, t as pick, cms, featuredStoryIndexes, type Locale } from '../content'

const STORY_PHOTOS: Record<string, string> = {
  Birhan: '/photos/birhan.jpg',
  Aregawi: '/photos/aregawi.jpg',
}

const LEGACY_PICKS = [0, 1, 3, 6] // 1978 · 1984-85 · 1993 · Nov 2020

export default function Home({ lng, base }: { lng: Locale; base: string }) {
  const { t } = useTranslation()
  const featured = featuredStoryIndexes.slice(0, 3).map((i) => ({ ...content.stories[i], idx: i }))
  const services = content.services
  /* the pinned rail runs at every width — the vertical list is the
     reduced-motion reading, nothing else */
  const [railMode] = useState(() =>
    typeof window !== 'undefined' &&
    !window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  )

  return (
    <div className="home-flow">
      <RiverThread />

      {/* ============ HERO ============ */}
      <Hero lng={lng} base={base} />

      {/* ============ INTRO ============ */}
      <section className="band" data-elev="3200">
        <div className="shell">
          <Marker elev="≈3,200 m" label={t('home.introKick')} />
          <div className="grid2">
            <Lines as="h2" className="h2" lang={lng}>{t('home.introTitle')}</Lines>
            <div className="prose">
              <Reveal as="p"><span lang={lng}>{t('home.introBody1')}</span></Reveal>
              <Reveal as="p" delay={80} style={{ marginTop: '1.1em' }}><span lang={lng}>{t('home.introBody2')}</span></Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* ============ MARQUEE ============ */}
      <div className="mq-band" aria-hidden="true">
        <Marquee items={[
          <em key="1">From the land</em>,
          <span className="geez" lang="ti" key="2">ካብ ምድሪ</span>,
          <em key="3">to life</em>,
          <span className="geez" lang="ti" key="4">ናብ ህይወት</span>,
          <span className="mq-outline" key="5">since 1978</span>,
        ]} />
      </div>

      {/* ============ LEGACY — since 1978, the dark chapter ============ */}
      <section className="band legacy" data-elev="2800">
        <div className="shell">
          <div className="marker legacy-marker"><span className="elev">≈2,800 m</span><span className="tick" /><span className="lab">{t('nav.story')}</span><span className="rule" /></div>
          {railMode ? (
            <Lines as="h2" className="h2 legacy-head" lang={lng}>
              {lng === 'ti' ? '48 ዓመታት፡ ሓደ ዘይተቋረጸ መስመር።' : lng === 'am' ? '48 ዓመታት፣ አንድ ያልተቋረጠ መስመር።' : (
                <>Forty-eight years, <em className="it">one unbroken line.</em></>
              )}
            </Lines>
          ) : (
            <div className="legacy-grid">
              <div>
                <Lines as="h2" className="h2" lang={lng}>
                  {lng === 'ti' ? '48 ዓመታት፡ ሓደ ዘይተቋረጸ መስመር።' : lng === 'am' ? '48 ዓመታት፣ አንድ ያልተቋረጠ መስመር።' : (
                    <>Forty-eight years, <em className="it">one unbroken line.</em></>
                  )}
                </Lines>
                <ul className="legacy-list">
                  {LEGACY_PICKS.map((i) => {
                    const m = content.history[i]
                    if (!m) return null
                    return (
                      <Reveal as="div" key={i}>
                        <li>
                          <span className="ly">{m.year}</span>
                          <span className="lt" lang={lng}>{pick(m.body, lng).slice(0, 118)}…</span>
                        </li>
                      </Reveal>
                    )
                  })}
                </ul>
                <Reveal style={{ marginTop: 'clamp(24px,3vw,40px)' }}>
                  <Magnetic><Link to={`${base}/story`} className="btn ghost-light" lang={lng}>{t('nav.story')} <span className="arr">→</span></Link></Magnetic>
                </Reveal>
              </div>
              <Reveal className="legacy-fig" delay={120}>
                <span className="legacy-mark" aria-hidden="true">1978</span>
                <figure className="fig">
                  <img src="/photos/legacy.jpg" alt="REST relief operations — archive photograph" loading="lazy" />
                  <figcaption><span>A legacy of response and resilience</span><span className="loc">REST archive</span></figcaption>
                </figure>
              </Reveal>
            </div>
          )}
        </div>
        {railMode && <LegacyRail lng={lng} base={base} />}
      </section>

      {/* ============ NUMBERS — the record ============ */}
      <NumberStrip lng={lng} />

      {/* ============ PROOF — completed projects ============ */}
      <section className="band" data-elev="2500">
        <div className="shell">
          <Marker elev="≈2,500 m" label={t('nav.projects')} />
          <div className="grid2" style={{ marginBottom: 'clamp(30px,4vw,52px)' }}>
            <Lines as="h2" className="h2" lang={lng}>
              {lng === 'ti' ? 'ኣብ መሬት ዘሎ መርትዖ።' : lng === 'am' ? 'በመሬት ላይ ያለ ማስረጃ።' : (
                <>Give work. <em>Get proof.</em></>
              )}
            </Lines>
            <div>
              <Reveal className="kick" as="p">
                <span lang={lng}>
                  {lng === 'en'
                    ? 'Every structure has a place, a date, and a community that keeps it running — dams, diversions, wells and restored catchments, documented the way charity: water documents theirs. Because REST builds theirs too.'
                    : ''}
                </span>
              </Reveal>
              <Reveal as="p" delay={80}>
                <span className="proof-line"><span className="proof-dot" /> REST is a charity: water local partner in Ethiopia</span>
              </Reveal>
            </div>
          </div>
          <div className="proj-grid home3">
            {[projects[1], projects[3], projects[0]].map((p, i) => (
              <Reveal key={p.slug} className="proj-card" delay={i * 90}>
                <Link to={`${base}/projects/${p.slug}`}>
                  <div className="pc-img">
                    {p.image
                      ? <img src={projectPhoto(p)} alt={`${p.title} — ${p.type}`} loading="lazy" />
                      : <span className="pc-icon" aria-hidden="true">◉</span>}
                    <span className="pc-type">{p.type}</span>
                  </div>
                  <div className="pc-body">
                    <h3>{p.title}</h3>
                    <p className="pc-loc">{p.woreda}{p.tabia ? ` · ${p.tabia}` : ''}</p>
                    <p className="pc-stat"><b>{p.stat.value}</b> {p.stat.label.toLowerCase()}</p>
                  </div>
                </Link>
              </Reveal>
            ))}
          </div>
          <Reveal style={{ marginTop: 'clamp(28px,4vw,44px)' }}>
            <Magnetic><Link className="btn" to={`${base}/projects`} lang={lng}>{t('nav.projects')} <span className="arr">→</span></Link></Magnetic>
          </Reveal>
        </div>
      </section>

      {/* ============ THREE LINES OF WORK ============ */}
      <section className="band" data-elev="2400">
        <div className="shell">
          <Marker elev="≈2,400 m" label={t('home.servicesLabel')} />
          <div className="svc-grid">
            {services.map((s, i) => (
              <Reveal key={i} className="svc-card" delay={i * 90}>
                <div className="svc-img">
                  <img src={i === 0 ? '/photos/terrace.jpg' : i === 1 ? '/photos/legacy.jpg' : '/photos/seedlings.jpg'} alt="" loading="lazy" />
                  <span className="svc-num" aria-hidden="true">0{i + 1}</span>
                </div>
                <h3 lang={lng}>{pick(s.title, lng)}</h3>
                <p lang={lng}>{pick(s.body, lng).slice(0, 165)}…</p>
                <Link to={`${base}/work`} className="svc-more" lang={lng}>{t('misc.readMore')} →</Link>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ============ STORIES ============ */}
      <section className="band stories-band" data-elev="1800">
        <div className="shell">
          <Marker elev="≈1,800 m" label={t('home.storiesLabel')} />
          <div className="grid2" style={{ marginBottom: 'clamp(30px,4vw,52px)' }}>
            <Lines as="h2" className="h2" lang={lng}>{t('home.storiesTitle')}</Lines>
            <Reveal className="kick" as="p">
              <span lang={lng}>
                {lng === 'ti'
                  ? 'ብርሃን በርሀ። ኣረጋዊ ግርማይ። ኣለም ተካ። ዛንታታት ብስም ይጅምሩ።'
                  : lng === 'am'
                    ? 'ብርሃን በርሀ። አረጋዊ ግርማይ። አለም ተካ። ታሪኮች በስም ይጀምራሉ።'
                    : 'Birhan Berhe. Aregawi Girmay. Alem Teka. Every story here begins with a name and a village — dignity is the editorial policy.'}
              </span>
            </Reveal>
          </div>
          <div className="story-grid">
            {featured.map((s, i) => {
              const localKey = Object.keys(STORY_PHOTOS).find((k) => s.title.en.includes(k))
              const img = localKey ? STORY_PHOTOS[localKey] : cms(s.image)
              return (
                <Reveal key={s.idx} className="story-card" delay={i * 90}>
                  <Link to={`${base}/stories/${s.idx}`}>
                    <div className="sc-img"><img src={img} alt="" loading="lazy" /></div>
                    <h3 lang={lng}>{pick(s.title, lng)}</h3>
                    <p lang={lng}>{pick(s.body, lng).slice(0, 130)}…</p>
                    <span className="svc-more" lang={lng}>{t('home.readStory')} →</span>
                  </Link>
                </Reveal>
              )
            })}
          </div>
          <Reveal style={{ marginTop: 'clamp(30px,4vw,48px)' }}>
            <Magnetic><Link className="btn" to={`${base}/stories`} lang={lng}>{t('home.allStories')} <span className="arr">→</span></Link></Magnetic>
          </Reveal>
        </div>
      </section>

      {/* ============ CONFLUENCE ============ */}
      <section className="band confluence-band" data-elev="1200">
        <div className="shell">
          <Marker elev="≈1,200 m" label={t('home.partnersLabel')} />
          <div className="grid2" style={{ marginBottom: 'clamp(26px,4vw,46px)' }}>
            <Lines as="h2" className="h2" lang={lng}>{t('home.partnersTitle')}</Lines>
            <Reveal className="kick" as="p"><span lang={lng}>{t('home.partnersBody')}</span></Reveal>
          </div>
        </div>
        <Partners />
      </section>

      {/* ============ CTA — the finale ============ */}
      <section className="close-band" data-elev="600">
        <span className="cb-watermark geez" aria-hidden="true" lang="ti">ትግራይ</span>
        <div className="shell cb-grid">
          <div>
            <p className="geez-lead" lang="ti"><Reveal as="span">ካብ ምድሪ · ናብ ህይወት</Reveal></p>
            <Lines as="h2" className="big" lang={lng}>{t('home.ctaTitle')}</Lines>
            <Reveal as="p" className="sub"><span lang={lng}>{t('home.ctaBody')}</span></Reveal>
            <Reveal style={{ marginTop: 34 }}>
              <div className="cb-actions">
                <Magnetic><Link className="btn solid" to={`${base}/involved`} lang={lng}>{t('nav.donate')} <span className="arr">→</span></Link></Magnetic>
                <Magnetic><Link className="btn ghost-light" to={`${base}/contact`} lang={lng}>{t('nav.contact')} <span className="arr">→</span></Link></Magnetic>
              </div>
            </Reveal>
          </div>
          <Reveal className="cb-fig" delay={140}>
            <figure className="fig">
              <img src="/photos/seedlings.jpg" alt="Tree seedlings ready for planting in Kilte Awlaelo" loading="lazy" />
              <figcaption><span>Seedlings, Kilte Awlaelo — the work and the metaphor are the same</span></figcaption>
            </figure>
          </Reveal>
        </div>
      </section>
    </div>
  )
}
