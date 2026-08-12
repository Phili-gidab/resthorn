import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'

/* Fixed elevation readout — interpolates between [data-elev] sections as you scroll. */
export default function Altimeter() {
  const out = useRef<HTMLElement>(null)
  const location = useLocation()
  const { t } = useTranslation()

  useEffect(() => {
    let marks: HTMLElement[] = []
    const collect = () => { marks = Array.from(document.querySelectorAll<HTMLElement>('[data-elev]')) }
    const upd = () => {
      if (!out.current) return
      if (!marks.length) { collect(); if (!marks.length) return }
      const mid = window.innerHeight * 0.5
      let cur = Number(marks[0].dataset.elev)
      for (let i = 0; i < marks.length; i++) {
        const r = marks[i].getBoundingClientRect()
        const val = Number(marks[i].dataset.elev)
        if (r.top < mid) {
          const nextTop = marks[i + 1] ? marks[i + 1].getBoundingClientRect().top : Infinity
          const span = nextTop - r.top || 1
          const prog = Math.min(Math.max((mid - r.top) / span, 0), 1)
          const tgt = marks[i + 1] ? Number(marks[i + 1].dataset.elev) : val
          cur = val + (tgt - val) * prog
        }
      }
      out.current.textContent = `≈${Math.round(cur / 10) * 10} m`
    }
    // re-collect after route change paints
    const id = window.setTimeout(() => { collect(); upd() }, 350)
    window.addEventListener('scroll', upd, { passive: true })
    return () => { window.clearTimeout(id); window.removeEventListener('scroll', upd) }
  }, [location.pathname])

  return (
    <div id="alti" aria-hidden="true">
      <span className="tri" />
      <span>{t('misc.elevation')}</span>
      <b ref={out}>≈3,900 m</b>
    </div>
  )
}
