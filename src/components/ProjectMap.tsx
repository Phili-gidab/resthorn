import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import type { Map as MLMap, Marker as MLMarker, LngLatBoundsLike } from 'maplibre-gl'

export interface MapPin {
  lat: number
  lng: number
  title: string
  sub?: string
  href?: string
  type?: string
  stat?: string
  year?: string
}

/* ============================================================
   Survey station — the land, seen from the field.
   Esri satellite imagery draped over real elevation, read from a
   low tilted angle while the camera walks a slow circle around the
   site. A survey stake stands on the ground; a leaflet card is
   tethered to its head by a leader line that redraws every frame,
   so the annotation holds still while the mountain turns beneath.
   HUD reads bearing and the terrain elevation under the stake.
   Drag interrupts the orbit; it resumes once you let go.
   ============================================================ */

const ORBIT_DEG_PER_MS = 0.0032 // ≈ one revolution every 110s
const RESUME_AFTER = 2600

export default function ProjectMap({ pins, zoom, height = 420 }: { pins: MapPin[]; zoom?: number; height?: number }) {
  const frame = useRef<HTMLDivElement>(null)
  const host = useRef<HTMLDivElement>(null)
  const callout = useRef<HTMLDivElement>(null)
  const leader = useRef<SVGSVGElement>(null)
  const needle = useRef<SVGGElement>(null)
  const bearingOut = useRef<HTMLSpanElement>(null)
  const elevOut = useRef<HTMLElement>(null)

  const mapRef = useRef<MLMap | null>(null)
  const markers = useRef<MLMarker[]>([])
  const orbiting = useRef(true)
  const selRef = useRef<number | null>(null)

  const single = pins.length === 1
  const [sel, setSel] = useState<number | null>(single ? 0 : null)
  const [orbitOn, setOrbitOn] = useState(true)
  const [wide, setWide] = useState(!single)
  const [ready, setReady] = useState(false)

  /* pins arrive as a fresh array each render — key the map build on content */
  const sig = useMemo(() => pins.map((p) => `${p.lng},${p.lat},${p.title}`).join('|'), [pins])
  const pinsRef = useRef(pins)
  pinsRef.current = pins

  useEffect(() => { selRef.current = sel }, [sel])
  useEffect(() => { orbiting.current = orbitOn }, [orbitOn])

  /* --- fly to one site, or back out to the whole region --- */
  const focus = useCallback((i: number | null) => {
    const map = mapRef.current
    setSel(i)
    if (!map) return
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (i === null) {
      setWide(true)
      const list = pinsRef.current
      const b = list.reduce<[[number, number], [number, number]]>(
        (acc, p) => [
          [Math.min(acc[0][0], p.lng), Math.min(acc[0][1], p.lat)],
          [Math.max(acc[1][0], p.lng), Math.max(acc[1][1], p.lat)],
        ],
        [[180, 90], [-180, -90]],
      )
      map.fitBounds(b as LngLatBoundsLike, { padding: 80, pitch: 46, duration: reduced ? 0 : 1600 })
    } else {
      setWide(false)
      const p = pinsRef.current[i]
      const target = { center: [p.lng, p.lat] as [number, number], zoom: zoom ?? 12.7, pitch: 70 }
      if (reduced) map.jumpTo(target)
      else map.flyTo({ ...target, duration: 2200, curve: 1.5, essential: false })
    }
  }, [zoom])

  useEffect(() => {
    let dead = false
    let raf = 0
    let resumeAt = 0

    Promise.all([import('maplibre-gl'), import('maplibre-gl/dist/maplibre-gl.css')]).then(([maplibregl]) => {
      if (dead || !host.current || mapRef.current) return
      const list = pinsRef.current
      if (!list.length) return
      const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
      const one = list.length === 1

      const map = new maplibregl.Map({
        container: host.current,
        style: {
          version: 8,
          sources: {
            sat: {
              type: 'raster',
              tiles: ['https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'],
              tileSize: 256,
              maxzoom: 16,
              attribution: 'Imagery © Esri · Maxar · Earthstar Geographics · Terrain © Mapzen/AWS',
            },
            /* same tiles, two sources on purpose: maplibre samples terrain and
               hillshade differently and renders both poorly if they share one */
            dem: {
              type: 'raster-dem',
              tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
              encoding: 'terrarium',
              tileSize: 256,
              maxzoom: 13,
            },
            demShade: {
              type: 'raster-dem',
              tiles: ['https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png'],
              encoding: 'terrarium',
              tileSize: 256,
              maxzoom: 13,
            },
          },
          layers: [
            { id: 'sat', type: 'raster', source: 'sat' },
            {
              id: 'relief',
              type: 'hillshade',
              source: 'demShade',
              paint: {
                'hillshade-exaggeration': 0.32,
                'hillshade-shadow-color': '#1b1a16',
                'hillshade-highlight-color': '#fff6e2',
                'hillshade-accent-color': '#53900f',
              },
            },
          ],
          /* dusty highland air, so the horizon reads as distance */
          sky: {
            'sky-color': '#9dc0d8',
            'horizon-color': '#e8dcc2',
            'fog-color': '#d9cfb8',
            'fog-ground-blend': 0.62,
            'horizon-fog-blend': 0.42,
            'sky-horizon-blend': 0.7,
            'atmosphere-blend': 0.75,
          },
        },
        center: [list[0].lng, list[0].lat],
        zoom: one ? 9.6 : 6.4,
        pitch: one ? 24 : 30,
        bearing: -24,
        maxPitch: 80,
        cooperativeGestures: true,
        attributionControl: { compact: true },
      })
      mapRef.current = map

      map.on('style.load', () => {
        try { map.setTerrain({ source: 'dem', exaggeration: 1.55 }) } catch { /* flat fallback */ }
      })

      /* --- survey stakes --- */
      list.forEach((p, i) => {
        const node = document.createElement('button')
        node.type = 'button'
        node.className = 'stake'
        node.setAttribute('aria-label', `${p.title}${p.sub ? ` — ${p.sub}` : ''}`)
        node.innerHTML = '<span class="stake-ring"></span><span class="stake-mast"></span><span class="stake-head"></span>'
        node.addEventListener('click', (e) => { e.stopPropagation(); focus(i) })
        markers.current.push(
          new maplibregl.Marker({ element: node, anchor: 'bottom' }).setLngLat([p.lng, p.lat]).addTo(map),
        )
      })

      /* --- the leader line: annotation holds, mountain turns --- */
      const draw = () => {
        const svg = leader.current, card = callout.current, box = frame.current
        const i = selRef.current
        if (!svg || !card || !box) return
        const path = svg.querySelector<SVGPathElement>('.ld-path')
        const dot = svg.querySelector<SVGCircleElement>('.ld-dot')
        const mk = i === null ? null : markers.current[i]
        const head = mk?.getElement().querySelector<HTMLElement>('.stake-head')
        if (!path || !dot || !head || card.classList.contains('is-hidden')) {
          svg.style.opacity = '0'
          return
        }
        const b = box.getBoundingClientRect()
        const h = head.getBoundingClientRect()
        const c = card.getBoundingClientRect()
        const px = h.left + h.width / 2 - b.left
        const py = h.top + h.height / 2 - b.top
        /* leave the card from whichever edge faces the stake */
        const fromRight = px > c.left + c.width / 2 - b.left
        const ax = (fromRight ? c.right : c.left) - b.left
        const ay = c.top + c.height / 2 - b.top
        const elbow = ax + (fromRight ? 20 : -20)
        const inside = px > -40 && px < b.width + 40 && py > -40 && py < b.height + 40
        svg.style.opacity = inside ? '1' : '0'
        path.setAttribute('d', `M ${ax.toFixed(1)} ${ay.toFixed(1)} L ${elbow.toFixed(1)} ${ay.toFixed(1)} L ${px.toFixed(1)} ${py.toFixed(1)}`)
        dot.setAttribute('cx', px.toFixed(1))
        dot.setAttribute('cy', py.toFixed(1))
      }

      const readout = () => {
        if (needle.current) needle.current.style.transform = `rotate(${-map.getBearing()}deg)`
        if (bearingOut.current) bearingOut.current.textContent = `${Math.round((map.getBearing() + 360) % 360)}°`
        const i = selRef.current
        if (elevOut.current) {
          const p = i === null ? null : pinsRef.current[i]
          const m = p ? map.queryTerrainElevation([p.lng, p.lat]) : null
          elevOut.current.textContent = m == null ? '—' : `≈${(Math.round(m / 10) * 10).toLocaleString('en-US')} m`
        }
      }

      /* a throw in here would take the whole render loop down with it */
      map.on('render', () => { try { draw(); readout() } catch { /* transient */ } })
      map.on('error', (e) => console.warn('[ProjectMap]', e.error?.message ?? e))

      /* the container is sized by CSS; keep the canvas honest about it */
      const ro = new ResizeObserver(() => map.resize())
      if (frame.current) ro.observe(frame.current)
      map.on('remove', () => ro.disconnect())
      map.on('load', () => {
        if (dead) return
        setReady(true)
        const target = one
          ? { center: [list[0].lng, list[0].lat] as [number, number], zoom: zoom ?? 12.7, pitch: 70, bearing: -24 }
          : null
        if (target) {
          if (reduced) map.jumpTo(target)
          else map.easeTo({ ...target, duration: 3200, essential: false })
        } else {
          const b = list.reduce<[[number, number], [number, number]]>(
            (acc, p) => [
              [Math.min(acc[0][0], p.lng), Math.min(acc[0][1], p.lat)],
              [Math.max(acc[1][0], p.lng), Math.max(acc[1][1], p.lat)],
            ],
            [[180, 90], [-180, -90]],
          )
          map.fitBounds(b as LngLatBoundsLike, { padding: 80, duration: 0 })
          if (reduced) map.setPitch(44)
          else map.easeTo({ pitch: 50, bearing: -18, duration: 2600, essential: false })
        }
      })

      /* --- the orbit --- */
      if (!reduced) {
        let last = 0
        const tick = (now: number) => {
          raf = requestAnimationFrame(tick)
          const dt = last ? Math.min(now - last, 64) : 16
          last = now
          if (!orbiting.current || now < resumeAt || map.isMoving()) return
          map.setBearing(map.getBearing() + dt * ORBIT_DEG_PER_MS)
        }
        raf = requestAnimationFrame(tick)
      }

      /* hands on the map win; the orbit waits its turn */
      const hold = () => { resumeAt = performance.now() + RESUME_AFTER }
      const drag = (e: PointerEvent) => { if (e.buttons) hold() }
      const canvas = map.getCanvasContainer()
      canvas.addEventListener('pointerdown', hold)
      canvas.addEventListener('pointermove', drag)
      canvas.addEventListener('wheel', hold, { passive: true })
      map.on('remove', () => {
        canvas.removeEventListener('pointerdown', hold)
        canvas.removeEventListener('pointermove', drag)
        canvas.removeEventListener('wheel', hold)
      })
    }).catch((err) => console.error('[ProjectMap] failed to load', err))

    return () => {
      dead = true
      if (raf) cancelAnimationFrame(raf)
      markers.current = []
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [sig, zoom, focus])

  const active = sel === null ? null : pins[sel]

  return (
    <div className="proj-map">
      <div className="pm-frame" ref={frame} style={{ height }}>
        <div className="pm-canvas" ref={host} aria-label="Interactive 3D terrain map of project locations" role="application" />

        {/* leader line from card to stake */}
        <svg className="pm-leader" ref={leader} aria-hidden="true">
          <path className="ld-path" d="" />
          <circle className="ld-dot" r="3" />
        </svg>

        {/* the leaflet */}
        <div className={`pm-callout${active ? '' : ' is-hidden'}`} ref={callout}>
          {active && (
            <>
              <span className="pmc-kicker">{active.type ?? 'Site'}{active.year ? ` · ${active.year}` : ''}</span>
              <h4>{active.title}</h4>
              {active.sub && <p className="pmc-loc">{active.sub}</p>}
              {active.stat && <p className="pmc-stat">{active.stat}</p>}
              <dl className="pmc-read">
                <div><dt>Elev.</dt><dd><b ref={elevOut}>—</b></dd></div>
                <div><dt>Coord.</dt><dd>{active.lat.toFixed(3)}°N · {active.lng.toFixed(3)}°E</dd></div>
              </dl>
              {active.href && <Link className="pmc-go" to={active.href}>Open project <span className="arr">→</span></Link>}
            </>
          )}
        </div>

        {/* survey instruments */}
        <div className="pm-hud">
          <div className="pm-compass" title="Camera bearing">
            <svg viewBox="0 0 44 44" aria-hidden="true">
              <circle className="cp-ring" cx="22" cy="22" r="19" />
              <g ref={needle} style={{ transformOrigin: '22px 22px' }}>
                <path className="cp-n" d="M22 6 L26 22 L22 19 L18 22 Z" />
                <path className="cp-s" d="M22 38 L18 22 L22 25 L26 22 Z" />
              </g>
            </svg>
            <span ref={bearingOut}>—</span>
          </div>
          <button
            type="button"
            className={`pm-btn${orbitOn ? ' on' : ''}`}
            onClick={() => setOrbitOn((v) => !v)}
            aria-pressed={orbitOn}
          >
            {orbitOn ? '❙❙ Orbit' : '▶ Orbit'}
          </button>
          {!single && !wide && (
            <button type="button" className="pm-btn" onClick={() => focus(null)}>← All sites</button>
          )}
        </div>

        {!single && wide && ready && (
          <p className="pm-hint">Select a stake to survey the site</p>
        )}
      </div>
      <p className="map-note">
        Satellite imagery draped over real elevation · drag to pan, right-drag to tilt and turn · locations approximate at woreda level.
      </p>
    </div>
  )
}
