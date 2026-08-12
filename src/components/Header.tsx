import { useEffect, useState } from 'react'
import { NavLink, useNavigate, useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { AnimatePresence, motion } from 'framer-motion'
import type { Locale } from '../content'

const LOCALES: { code: Locale; label: string; geez: boolean }[] = [
  { code: 'en', label: 'EN', geez: false },
  { code: 'ti', label: 'ትግ', geez: true },
  { code: 'am', label: 'አማ', geez: true },
]

export function localePath(lng: Locale, path: string) {
  const clean = path.replace(/^\/(ti|am)(?=\/|$)/, '') || '/'
  return lng === 'en' ? clean : `/${lng}${clean === '/' ? '' : clean}`
}

export default function Header() {
  const { t, i18n } = useTranslation()
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const cur = (location.pathname.match(/^\/(ti|am)(\/|$)/)?.[1] ?? 'en') as Locale

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 40)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => setOpen(false), [location.pathname])

  /* The home hero opens on a white ground (cinema mode), so light-on-photo nav
     only applies where the hero is actually a full-bleed photo: static mode. */
  const isHome = /^\/(ti|am)?\/?$/.test(location.pathname)
  const heroIsStatic =
    typeof window !== 'undefined' &&
    (window.matchMedia('(prefers-reduced-motion: reduce)').matches || window.innerWidth < 880)
  const onPhoto = isHome && heroIsStatic

  const switchTo = (code: Locale) => {
    i18n.changeLanguage(code)
    navigate(localePath(code, location.pathname), { replace: false })
  }

  const links = [
    { to: 'story', label: t('nav.story') },
    { to: 'work', label: t('nav.work') },
    { to: 'projects', label: t('nav.projects') },
    { to: 'stories', label: t('nav.stories') },
    { to: 'involved', label: t('nav.involved') },
    { to: 'contact', label: t('nav.contact') },
  ]
  const base = cur === 'en' ? '' : `/${cur}`

  return (
    <>
      <header className={`hdr ${scrolled ? 'scrolled' : ''} ${onPhoto ? 'on-photo' : ''}`}>
        <NavLink to={base || '/'} className="brand" aria-label="REST — home">
          <span className="wordmark">REST</span>
          <span className="gz" lang="ti">ማሕበር ረድኤት ትግራይ</span>
        </NavLink>
        <nav className="desktop" aria-label="Primary">
          {links.map((l) => (
            <NavLink key={l.to} to={`${base}/${l.to}`} lang={cur} className={({ isActive }) => (isActive ? 'active' : '')}>
              {l.label}
            </NavLink>
          ))}
          <NavLink to={`${base}/involved`} lang={cur} className="donate">{t('nav.donate')}</NavLink>
          <div className="langs" role="group" aria-label="Language">
            {LOCALES.map((L) => (
              <button key={L.code} className={`${L.geez ? 'geezb' : ''} ${cur === L.code ? 'on' : ''}`} onClick={() => switchTo(L.code)} aria-pressed={cur === L.code}>
                {L.label}
              </button>
            ))}
          </div>
        </nav>
        <button className="menu-btn" onClick={() => setOpen(true)} aria-expanded={open}>Menu</button>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            className="sheet"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <button className="menu-btn" style={{ position: 'absolute', top: 16, right: 'var(--pad-x)' }} onClick={() => setOpen(false)}>
              Close
            </button>
            {links.map((l, i) => (
              <motion.div key={l.to} initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.06 * i, duration: 0.4 }}>
                <NavLink to={`${base}/${l.to}`} lang={cur}>{l.label}</NavLink>
              </motion.div>
            ))}
            <div className="langs">
              {LOCALES.map((L) => (
                <button key={L.code} className={`${L.geez ? 'geezb' : ''} ${cur === L.code ? 'on' : ''}`} onClick={() => switchTo(L.code)}>
                  {L.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
