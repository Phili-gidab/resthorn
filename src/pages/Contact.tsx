import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Marker, Reveal } from '../components/ui'
import { Lines } from '../components/motion'
import { content, t as pick, type Locale } from '../content'

export default function Contact({ lng }: { lng: Locale }) {
  const { t } = useTranslation()
  const [open, setOpen] = useState<number | null>(0)
  const c = content.contact

  return (
    <>
      <section className="band page-head" data-elev="2200">
        <div className="shell">
          <Marker elev="≈2,200 m" label={t('nav.contact')} />
          <div className="grid2" style={{ marginBottom: 'clamp(34px,5vw,56px)' }}>
            <div>
              <p className="geez-lead" lang="ti">ርኸቡና</p>
              <Lines as="h1" className="h2" lang={lng}>
                {lng === 'ti' ? 'ደሃይ ግበሩልና።' : lng === 'am' ? 'ያግኙን።' : (
                  <>Godena Guna, <em>Mekelle.</em></>
                )}
              </Lines>
            </div>
            <div className="contact-cards">
              <Reveal className="mvv-card">
                <h4>Visit</h4>
                <p>{c.address}</p>
                <p style={{ marginTop: 8, color: 'var(--ink-dim)' }}>{c.openHours}</p>
              </Reveal>
              <Reveal className="mvv-card" delay={70}>
                <h4>Write · Call</h4>
                <p><a href={`mailto:${c.mail}`}>{c.mail}</a></p>
                <p><a href={`mailto:${c.mail2}`}>{c.mail2}</a></p>
                <p style={{ marginTop: 8 }}><a href={`tel:${c.contactNumber?.replace(/[^+\d]/g, '')}`}>{c.contactNumber}</a></p>
              </Reveal>
              <Reveal className="mvv-card" delay={140}>
                <h4>{t('footer.follow')}</h4>
                <p style={{ display: 'flex', flexWrap: 'wrap', gap: '6px 18px' }}>
                  {content.socials.map((s) => (
                    <a key={s.name} href={s.url} target="_blank" rel="noreferrer">{s.name}</a>
                  ))}
                </p>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="band" data-elev="1400" style={{ paddingTop: 0 }}>
        <div className="shell">
          <Marker elev="≈1,400 m" label="Questions, answered" />
          <div className="faq">
            {content.faqs.map((f, i) => (
              <Reveal key={i} className="faq-item" delay={i * 40}>
                <button className="faq-q" aria-expanded={open === i} onClick={() => setOpen(open === i ? null : i)}>
                  <span lang={lng}>{pick(f.q, lng)}</span>
                  <span className="faq-x">{open === i ? '−' : '+'}</span>
                </button>
                {open === i && <p className="faq-a" lang={lng}>{pick(f.a, lng)}</p>}
              </Reveal>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
