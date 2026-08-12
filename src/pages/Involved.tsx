import { useTranslation } from 'react-i18next'
import TerraceDonate from '../components/TerraceDonate'
import { Marker, Reveal, ContourStrip } from '../components/ui'
import { Lines } from '../components/motion'
import { content, type Locale } from '../content'

export default function Involved({ lng }: { lng: Locale }) {
  const { t } = useTranslation()
  return (
    <>
      <section className="band page-head" data-elev="1800">
        <div className="shell">
          <Marker elev="≈1,800 m" label={t('nav.involved')} />
          <div className="grid2" style={{ marginBottom: 'clamp(34px,5vw,60px)' }}>
            <div>
              <p className="geez-lead" lang="ti">ተሳተፉ</p>
              <Lines as="h1" className="h2" lang={lng}>
                {lng === 'ti' ? 'መደረብኩም ስርሑ።' : lng === 'am' ? 'እርከንዎን ይገንቡ።' : (
                  <>Build a terrace <em>on the hillside.</em></>
                )}
              </Lines>
            </div>
            <p className="kick" lang={lng}>
              {lng === 'en'
                ? 'A terrace is a promise: what you build above decides what lives below. Choose where your support sits on the slope.'
                : ''}
            </p>
          </div>
          <Reveal><TerraceDonate /></Reveal>
        </div>
      </section>

      <ContourStrip seed={9} />

      <section className="band" data-elev="1200">
        <div className="shell">
          <Marker elev="≈1,200 m" label="Other ways in" />
          <div className="mvv">
            <Reveal className="mvv-card">
              <h4>Volunteer</h4>
              <p>Skills in agronomy, WASH engineering, health, translation, or communications travel far here. Write to us with what you can give — time counts like money.</p>
              <a className="svc-more" href={`mailto:${content.contact.mail}?subject=Volunteering with REST`}>Offer your time →</a>
            </Reveal>
            <Reveal className="mvv-card" delay={80}>
              <h4>Careers &amp; tenders</h4>
              <p>Vacancies and procurement calls are posted as they open. No open positions are listed right now — check back, or follow our channels for announcements.</p>
              <a className="svc-more" href={content.socials[0]?.url} target="_blank" rel="noreferrer">Follow announcements →</a>
            </Reveal>
            <Reveal className="mvv-card" delay={160}>
              <h4>Partner with REST</h4>
              <p>Twenty-nine organizations already flow into this work — from WFP and UNICEF to village water committees. Institutional partnerships begin with a conversation.</p>
              <a className="svc-more" href={`mailto:${content.contact.mail}?subject=Partnership with REST`}>Start one →</a>
            </Reveal>
          </div>
        </div>
      </section>
    </>
  )
}
