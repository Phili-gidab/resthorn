import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

/* ============================================================
   RiverThread — one thin river, drawn by your descent.
   A single hairline path rises below the hero, wanders the page
   gutters from chapter to chapter (every [data-elev] mark is a
   bend), and disappears into the dark valley of the closing ask.
   The stroke draws to wherever you've scrolled; a droplet rides
   the leading edge — the scroll is the water going downhill.
   Wide viewports only; removed entirely for reduced motion.
   ============================================================ */

export default function RiverThread() {
  const ref = useRef<SVGSVGElement>(null)

  useEffect(() => {
    const svg = ref.current
    const host = svg?.parentElement
    if (!svg || !host) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    if (window.innerWidth < 1280) return

    const path = svg.querySelector<SVGPathElement>('.rt-path')
    const drop = svg.querySelector<SVGGElement>('.rt-drop')
    if (!path || !drop) return

    let len = 0
    let samples: { l: number; y: number }[] = []

    const build = () => {
      const W = host.clientWidth
      const H = host.scrollHeight
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`)
      svg.style.height = `${H}px`

      const hostTop = host.getBoundingClientRect().top + window.scrollY
      const anchors = Array.from(host.querySelectorAll<HTMLElement>('[data-elev]'))
        .filter((el) => !el.classList.contains('hero'))
      if (anchors.length < 2) return

      const gutter = Math.max(44, ((W - 1200) / 2) * 0.5)
      const pts = anchors.map((el, i) => {
        const r = el.getBoundingClientRect()
        const y = r.top + window.scrollY - hostTop + (i === 0 ? 96 : 28)
        const last = i === anchors.length - 1
        const x = last ? W * 0.5 : i % 2 === 0 ? gutter : W - gutter
        return { x, y }
      })

      let d = `M ${pts[0].x.toFixed(1)} ${pts[0].y.toFixed(1)}`
      for (let i = 1; i < pts.length; i++) {
        const a = pts[i - 1], b = pts[i]
        const my = ((a.y + b.y) / 2).toFixed(1)
        d += ` C ${a.x.toFixed(1)} ${my}, ${b.x.toFixed(1)} ${my}, ${b.x.toFixed(1)} ${b.y.toFixed(1)}`
      }
      path.setAttribute('d', d)
      len = path.getTotalLength()
      path.style.strokeDasharray = `${len}`
      path.style.strokeDashoffset = `${len}`

      /* y → path-length lookup (y grows monotonically along this path) */
      samples = []
      const N = 360
      for (let i = 0; i <= N; i++) {
        const l = (i / N) * len
        samples.push({ l, y: path.getPointAtLength(l).y })
      }
    }

    let raf = 0
    const update = () => {
      raf = 0
      if (!len || !samples.length) return
      const targetY = window.innerHeight * 0.62 - host.getBoundingClientRect().top
      let l = 0
      for (const s of samples) {
        if (s.y <= targetY) l = s.l
        else break
      }
      path.style.strokeDashoffset = `${Math.max(len - l, 0).toFixed(1)}`
      const pt = path.getPointAtLength(l)
      drop.setAttribute('transform', `translate(${pt.x.toFixed(1)}, ${pt.y.toFixed(1)})`)
      drop.style.opacity = l > 4 && l < len - 2 ? '1' : '0'
    }

    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update) }
    const rebuild = () => { build(); update() }

    rebuild()
    /* re-measure once pin spacers and images have settled */
    const settle = window.setTimeout(rebuild, 700)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('load', rebuild)
    ScrollTrigger.addEventListener('refresh', rebuild)
    return () => {
      window.clearTimeout(settle)
      if (raf) cancelAnimationFrame(raf)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('load', rebuild)
      ScrollTrigger.removeEventListener('refresh', rebuild)
    }
  }, [])

  return (
    <svg ref={ref} className="river-thread" aria-hidden="true">
      <path className="rt-path" d="" />
      <g className="rt-drop" style={{ opacity: 0 }}>
        <circle className="rt-pulse" r="5" />
        <circle className="rt-core" r="3" />
      </g>
    </svg>
  )
}
