import { Link, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { content } from '../content'

export default function Footer() {
  const { t } = useTranslation()
  const { pathname } = useLocation()
  const lng = pathname.match(/^\/(ti|am)(\/|$)/)?.[1]
  const base = lng ? `/${lng}` : ''
  const year = new Date().getFullYear()

  return (
    <footer className="ftr">
      <div className="shell">
        <div className="top">
          <div className="fbrand">
            <div className="wordmark">REST</div>
            <div className="gz" lang="ti">ማሕበር ረድኤት ትግራይ</div>
            <p>{t('footer.tag')}</p>
          </div>
          <div>
            <h4>{t('footer.quick')}</h4>
            <ul>
              <li><Link to={`${base}/story`}>{t('nav.story')}</Link></li>
              <li><Link to={`${base}/work`}>{t('nav.work')}</Link></li>
              <li><Link to={`${base}/stories`}>{t('nav.stories')}</Link></li>
              <li><Link to={`${base}/involved`}>{t('nav.involved')}</Link></li>
            </ul>
          </div>
          <div>
            <h4>{t('footer.follow')}</h4>
            <ul>
              {content.socials.map((s) => (
                <li key={s.name}><a href={s.url} target="_blank" rel="noreferrer">{s.name}</a></li>
              ))}
            </ul>
          </div>
          <div>
            <h4>{t('footer.reach')}</h4>
            <ul>
              <li>{content.contact.address}</li>
              <li><a href={`mailto:${content.contact.mail}`}>{content.contact.mail}</a></li>
              <li><a href={`tel:${content.contact.contactNumber?.replace(/[^+\d]/g, '')}`}>{content.contact.contactNumber}</a></li>
              <li>{content.contact.openHours}</li>
            </ul>
          </div>
        </div>
        <div className="base">
          <span>© {year} {t('footer.rights')}</span>
          <span lang="ti" className="geez" style={{ color: 'var(--green)' }}>ካብ ምድሪ · ናብ ህይወት</span>
          <span>{t('footer.credit')}</span>
        </div>
      </div>
    </footer>
  )
}
