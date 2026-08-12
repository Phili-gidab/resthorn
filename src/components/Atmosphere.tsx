import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'

/* ============================================================
   Atmosphere — the descent, felt.
   The page ground itself loses altitude with you: cool thin-air
   white near 3,900 m, warming through parchment on the mid-slopes,
   settling into sun-baked earth tones just above the dark valley.
   Reads the same [data-elev] survey marks the altimeter reads and
   interpolates the ground tokens continuously between stops.
   Skipped for reduced-motion users — their palette stays still.
   ============================================================ */

const VARS = ['--bg', '--surface', '--tint', '--line', '--line-soft'] as const

/* colors listed in VARS order */
const STOPS: { elev: number; c: string[] }[] = [
  { elev: 3900, c: ['#fcfcfb', '#ffffff', '#f2f1ec', '#e2e0d8', '#eceae4'] },
  { elev: 3200, c: ['#fdfcfa', '#ffffff', '#f4f1e9', '#e3dfd4', '#edeae1'] },
  { elev: 2500, c: ['#fbf8ef', '#fffefa', '#f4eee0', '#e2dbc8', '#ece5d5'] },
  { elev: 1800, c: ['#f9f4e6', '#fefbf2', '#f1e9d5', '#dfd5bd', '#e9e1cc'] },
  { elev: 1200, c: ['#f6efdc', '#fcf7ea', '#eee4ca', '#d9ccad', '#e3d8bc'] },
  { elev: 600, c: ['#f2e9d2', '#f9f2e1', '#e9ddbf', '#d1c2a0', '#ddd1b2'] },
]

function palette(elev: number): string[] {
  const first = STOPS[0], last = STOPS[STOPS.length - 1]
  if (elev >= first.elev) return first.c
  if (elev <= last.elev) return last.c
  let a = first, b = last
  for (let i = 0; i < STOPS.length - 1; i++) {
    if (elev <= STOPS[i].elev && elev >= STOPS[i + 1].elev) {
      a = STOPS[i]
      b = STOPS[i + 1]
      break
    }
  }
  const t = (a.elev - elev) / (a.elev - b.elev || 1)
  return VARS.map((_, i) => gsap.utils.interpolate(a.c[i], b.c[i], t))
}

export default function Atmosphere() {
  const location = useLocation()

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const rootStyle = document.documentElement.style
    let marks: HTMLElement[] = []
    let raf = 0

    const collect = () => { marks = Array.from(document.querySelectorAll<HTMLElement>('[data-elev]')) }

    const apply = () => {
      raf = 0
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
      const cols = palette(cur)
      VARS.forEach((v, i) => rootStyle.setProperty(v, cols[i]))
    }

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(apply) }

    // re-collect after the new route paints (same rhythm as the altimeter)
    const id = window.setTimeout(() => { collect(); apply() }, 350)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.clearTimeout(id)
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [location.pathname])

  useEffect(() => () => {
    const rootStyle = document.documentElement.style
    VARS.forEach((v) => rootStyle.removeProperty(v))
  }, [])

  return null
}
