import { useTranslation } from 'react-i18next'
import Timeline from '../components/Timeline'
import { Marker, Reveal, ContourStrip } from '../components/ui'
import { Lines } from '../components/motion'
import { content, t as pick, cms, type Locale } from '../content'

export default function Story({ lng }: { lng: Locale }) {
  const { t } = useTranslation()
  const about = content.about

  return (
    <>
      <section className="band page-head" data-elev="3600">
        <div className="shell">
          <Marker elev="≈3,600 m" label={t('nav.story')} />
          <div className="grid2">
            <div>
              <p className="geez-lead" lang="ti">ዛንታና</p>
              <Lines as="h1" className="h2" lang={lng}>
                {lng === 'ti' ? 'ካብ 1978 ጀሚሩ።' : lng === 'am' ? 'ከ1978 ጀምሮ።' : (
                  <>Born in famine. <em>Built for endurance.</em></>
                )}
              </Lines>
            </div>
            <div className="prose">
              <Reveal as="p"><span lang={lng}>{pick(about.establishment, lng)}</span></Reveal>
            </div>
          </div>
          <div className="figrow" style={{ marginTop: 'clamp(40px,6vw,64px)' }}>
            <Reveal as="figure" className="fig">
              <img src="/photos/legacy.jpg" alt="REST field operations — archive photograph" loading="lazy" />
              <figcaption><span>A legacy of response and resilience</span><span className="loc">REST archive</span></figcaption>
            </Reveal>
            <Reveal as="figure" className="fig" delay={90}>
              <img src="/photos/wfp.jpg" alt="Teklewoini Assefa in discussion with WFP Country Director Zlatan Milisic" loading="lazy" />
              <figcaption><span>ED Teklewoini Assefa with WFP's Zlatan Milisic</span><span className="loc">2025</span></figcaption>
            </Reveal>
          </div>
        </div>
      </section>

      <ContourStrip seed={5} />

      {/* mission / vision / values */}
      <section className="band" data-elev="3000">
        <div className="shell">
          <Marker elev="≈3,000 m" label="Mission · Vision · Values" />
          <div className="mvv">
            <Reveal className="mvv-card">
              <h3 className="geez" lang="ti">ተልእኾ</h3>
              <h4>Mission</h4>
              <p lang={lng}>{pick(about.mission, lng)}</p>
            </Reveal>
            <Reveal className="mvv-card" delay={80}>
              <h3 className="geez" lang="ti">ራእይ</h3>
              <h4>Vision</h4>
              <p lang={lng}>{pick(about.vision, lng)}</p>
            </Reveal>
            <Reveal className="mvv-card" delay={160}>
              <h3 className="geez" lang="ti">ክብርታት</h3>
              <h4>Values</h4>
              <p lang={lng}>{pick(about.values, lng)}</p>
            </Reveal>
          </div>
        </div>
      </section>

      {/* pinned timeline */}
      <section data-elev="2200">
        <div className="shell" style={{ paddingBottom: 'clamp(20px,3vw,40px)' }}>
          <Marker elev="≈2,200 m" label="Forty-eight years, one line" />
        </div>
        <Timeline lng={lng} />
      </section>

      <ContourStrip seed={6} />

      {/* leadership */}
      <section className="band" data-elev="1400">
        <div className="shell">
          <Marker elev="≈1,400 m" label="Leadership" />
          <div className="team-grid">
            {content.team.map((m, i) => (
              <Reveal key={m.name} className="team-card" delay={i * 60}>
                <div className="tc-img">{m.image && <img src={cms(m.image)} alt={m.name} loading="lazy" />}</div>
                <b>{m.name}</b>
                <span>{m.role}</span>
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
