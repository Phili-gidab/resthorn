import { useTranslation } from 'react-i18next'
import NumberStrip from '../components/NumberStrip'
import { Marker, Reveal, ContourStrip, ReadMore } from '../components/ui'
import { Lines } from '../components/motion'
import { content, t as pick, type Locale } from '../content'

const SERVICE_PHOTOS = ['/photos/terrace.jpg', '/photos/diversion.jpg', '/photos/seedlings.jpg']

export default function Work({ lng }: { lng: Locale }) {
  const { t } = useTranslation()
  const pillars = content.policy.find((p) => /Strategic Focus/i.test(p.title.en))

  return (
    <>
      <section className="band page-head" data-elev="3400">
        <div className="shell">
          <Marker elev="≈3,400 m" label={t('nav.work')} />
          <div className="grid2">
            <div>
              <p className="geez-lead" lang="ti">ስራሕና</p>
              <Lines as="h1" className="h2" lang={lng}>
                {lng === 'ti' ? 'ሰለስተ መስመራት፡ ሓደ ዕላማ።' : lng === 'am' ? 'ሦስት መስመሮች፣ አንድ ዓላማ።' : (
                  <>Relief, recovery, development — <em>one continuum.</em></>
                )}
              </Lines>
            </div>
            <div className="prose">
              <Reveal as="p">
                <span lang={lng}>
                  {lng === 'en'
                    ? 'REST works the whole arc of crisis: emergency response when systems break, rehabilitation as they mend, and community-driven development that makes the next shock survivable. The three lines run in parallel — the same watershed logic that holds a hillside.'
                    : pick(content.services[0].body, lng)}
                </span>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* three services, alternating editorial rows */}
      <section data-elev="2800">
        <div className="shell">
          {content.services.map((s, i) => (
            <Reveal key={i} className={`svc-row ${i % 2 ? 'flip' : ''}`}>
              <figure className="fig">
                <img src={SERVICE_PHOTOS[i]} alt="" loading="lazy" />
                <figcaption>
                  <span>{pick(s.title, lng)}</span>
                  <span className="loc">{['Kola Tembien', 'Tanqua Abergelle', 'Kilte Awlaelo'][i]}</span>
                </figcaption>
              </figure>
              <div>
                <span className="svc-index">0{i + 1}</span>
                <h2 lang={lng}>{pick(s.title, lng)}</h2>
                <p lang={lng}>{pick(s.body, lng)}</p>
                {s.subs.length > 0 && (
                  <ul className="svc-subs">
                    {s.subs.map((sub) => (
                      <li key={sub.title}><b>{sub.title}</b> — {sub.body.slice(0, 110)}…</li>
                    ))}
                  </ul>
                )}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <ContourStrip seed={7} />

      {/* five pillars */}
      {pillars && (
        <section className="band" data-elev="2000">
          <div className="shell">
            <Marker elev="≈2,000 m" label="Five strategic pillars" />
            <div className="grid2">
              <h2 className="h2" lang={lng}>
                {lng === 'en' ? <>The strategy, <em>terraced.</em></> : pick(pillars.title, lng)}
              </h2>
              <div className="prose">
                <Reveal as="p"><span lang={lng}>{pick(pillars.body, lng)}</span></Reveal>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* beneficiaries */}
      <section className="band" data-elev="1600" style={{ paddingTop: 0 }}>
        <div className="shell">
          <Marker elev="≈1,600 m" label="Who the work reaches" />
          <div className="mvv">
            {content.beneficiaries.map((b, i) => (
              <Reveal key={i} className="mvv-card" delay={i * 80}>
                <h4 lang={lng}>{pick(b.title, lng)}</h4>
                <ReadMore text={pick(b.body, lng)} lines={7} lang={lng} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <ContourStrip seed={8} />

      {/* impact numbers */}
      <section className="band" data-elev="1000">
        <div className="shell">
          <Marker elev="≈1,000 m" label="The record" />
          <Reveal><NumberStrip lng={lng} /></Reveal>
          <div className="jeop-note">
            <Reveal as="p">
              <span lang={lng}>
                {lng === 'en'
                  ? 'In a single recent year under JEOP, with USAID/BHA support, REST distributed 309,918 quintals of food and over 1.5 billion birr directly to families. The Oxfam–Italian Cooperation Resilient Program adds €2.1M across six woredas, reaching ~2,254 households.'
                  : ''}
              </span>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
