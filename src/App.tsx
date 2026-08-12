import { useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { useTranslation } from 'react-i18next'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Header from './components/Header'
import Footer from './components/Footer'
import Altimeter from './components/Altimeter'
import Atmosphere from './components/Atmosphere'
import Home from './pages/Home'
import Story from './pages/Story'
import Work from './pages/Work'
import { Stories, StoryDetail } from './pages/Stories'
import { ProjectsPage, ProjectDetail } from './pages/Projects'
import Involved from './pages/Involved'
import Contact from './pages/Contact'
import { useSmoothScroll } from './hooks/useSmoothScroll'
import { usePrefs } from './hooks/usePrefs'
import type { Locale } from './content'

const LOCALES: Locale[] = ['en', 'ti', 'am']

function LocalePages({ locale }: { locale: Locale }) {
  const { i18n } = useTranslation()
  const location = useLocation()
  const prefs = usePrefs()
  const base = locale === 'en' ? '' : `/${locale}`

  useEffect(() => {
    if (i18n.language !== locale) i18n.changeLanguage(locale)
    document.documentElement.lang = locale
  }, [locale, i18n])

  useEffect(() => {
    window.scrollTo(0, 0)
    const id = window.setTimeout(() => ScrollTrigger.refresh(), 420)
    return () => window.clearTimeout(id)
  }, [location.pathname])

  const sub = location.pathname.replace(new RegExp(`^/${locale === 'en' ? '' : locale + '/?'}`), '/').replace(/\/+/, '/')

  let page: React.ReactNode
  const m = sub.match(/^\/stories\/(\d+)/)
  if (m) page = <StoryDetail lng={locale} base={base} />
  else if (sub.match(/^\/projects\/.+/)) page = <ProjectDetail lng={locale} base={base} />
  else if (sub.startsWith('/projects')) page = <ProjectsPage lng={locale} base={base} />
  else if (sub.startsWith('/story')) page = <Story lng={locale} />
  else if (sub.startsWith('/stories')) page = <Stories lng={locale} base={base} />
  else if (sub.startsWith('/work')) page = <Work lng={locale} />
  else if (sub.startsWith('/involved')) page = <Involved lng={locale} />
  else if (sub.startsWith('/contact')) page = <Contact lng={locale} />
  else page = <Home lng={locale} base={base} />

  return (
    <>
      <Header />
      <AnimatePresence mode="wait" initial={false}>
        <motion.main
          key={location.pathname}
          initial={prefs.reduced ? false : { opacity: 0, y: 26 }}
          animate={{ opacity: 1, y: 0 }}
          exit={prefs.reduced ? undefined : { opacity: 0, y: -18 }}
          transition={{ duration: 0.45, ease: [0.2, 0.65, 0.2, 1] }}
        >
          {page}
        </motion.main>
      </AnimatePresence>
      <Altimeter />
      <Atmosphere />
      <Footer />
    </>
  )
}

export default function App() {
  const prefs = usePrefs()
  useSmoothScroll(!prefs.reduced)

  return (
    <Routes>
      {LOCALES.map((loc) => {
        const prefix = loc === 'en' ? '' : `/${loc}`
        return (
          <Route key={loc} path={`${prefix}/*`} element={<LocalePages locale={loc} />} />
        )
      })}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
