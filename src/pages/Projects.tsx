import { Link, useLocation, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import raw from '../data/projects.json'
import { Marker, Reveal } from '../components/ui'
import { Lines, Magnetic } from '../components/motion'
import ProjectMap from '../components/ProjectMap'
import type { Locale } from '../content'

export interface Project {
  slug: string
  title: string
  type: string
  woreda: string
  tabia: string
  year: string
  stat: { label: string; value: string }
  funder: string
  partner: string
  body: string
  image: string
  lat?: number
  lng?: number
  ext?: string
  story?: number
}

export const projects = (raw as { projects: Project[] }).projects
export const projectPhoto = (p: Project) => (p.image ? `/photos/projects/${p.slug}.jpg` : '')

/* Solution explainers — charity:water-style educational blocks, per type */
const SOLUTIONS: Record<string, string> = {
  'Well with hand pump':
    'A borehole drilled to safe groundwater, fitted with a hand pump (typically India Mark II or Afridev). Cost-effective, easy for a village committee to maintain, and immune to surface contamination — the workhorse of rural water supply.',
  'River diversion':
    'A low concrete weir across a seasonal river that redirects flow into lined canals. One structure can put hundreds of hectares under irrigation, turning a single unreliable rainy season into two dependable growing seasons.',
  'Earth dam':
    'A compacted embankment that captures the runoff of the rains. The reservoir waters livestock, recharges shallow wells downstream, and slows the flood pulse that would otherwise strip the valley soil.',
  'Water point':
    'A protected community tap or spring, managed by a trained village water committee. REST maintenance crews keep points flowing through conflict and drought — a broken water point is a health emergency measured in days.',
  'Solar water scheme':
    'A submersible pump powered by photovoltaic panels — no fuel deliveries, no generator maintenance, no running costs a remote tabia cannot carry. Sunlight is the one supply chain that never breaks.',
  'Land restoration':
    'Check dams, bench terraces, gully plugs and replanting that heal eroded catchments. Restoration is the slowest infrastructure REST builds and the foundation of all the rest — soil that holds is the first water storage.',
  'Irrigation':
    'Canals, catchments and micro-dams that move captured water to smallholder plots, managed by farmer associations.',
}

const TYPE_ICON: Record<string, string> = {
  'Well with hand pump': '◉',
  'River diversion': '≋',
  'Earth dam': '▲',
  'Water point': '◍',
  'Solar water scheme': '☀',
  'Land restoration': '❋',
  Irrigation: '≈',
}

export function ProjectsPage({ lng, base }: { lng: Locale; base: string }) {
  const { t } = useTranslation()
  return (
    <section className="band page-head" data-elev="2500">
      <div className="shell">
        <Marker elev="≈2,500 m" label={t('nav.projects')} />
        <div className="grid2" style={{ marginBottom: 'clamp(34px,5vw,60px)' }}>
          <div>
            <p className="geez-lead" lang="ti">ፕሮጀክትታት</p>
            <Lines as="h1" className="h2" lang={lng}>
              {lng === 'ti' ? 'ኣብ መሬት ዘሎ መርትዖ።' : lng === 'am' ? 'በመሬት ላይ ያለ ማስረጃ።' : (
                <>Proof, <em>standing on the land.</em></>
              )}
            </Lines>
          </div>
          <div>
            <p className="kick" lang={lng}>
              {lng === 'en'
                ? 'Every structure has a place, a date, and a community that keeps it running. A selection of completed works from REST’s 1,000+ projects — dams, diversions, wells, and restored catchments across Tigray’s woredas.'
                : ''}
            </p>
            <p className="proof-line">
              <span className="proof-dot" /> Documented the charity: water way — REST is a charity: water local partner in Ethiopia.
            </p>
          </div>
        </div>

        <Reveal style={{ marginBottom: 'clamp(34px,5vw,56px)' }}>
          <ProjectMap
            height={440}
            pins={projects
              .filter((p) => p.lat && p.lng)
              .map((p) => ({
                lat: p.lat!, lng: p.lng!,
                title: p.title,
                sub: `${p.woreda}${p.tabia ? ` · ${p.tabia}` : ''}`,
                type: p.type,
                year: p.year,
                stat: `${p.stat.value} ${p.stat.label.toLowerCase()}`,
                href: `${base}/projects/${p.slug}`,
              }))}
          />
        </Reveal>

        <div className="proj-grid">
          {projects.map((p, i) => (
            <Reveal key={p.slug} className="proj-card" delay={(i % 3) * 70}>
              <Link to={`${base}/projects/${p.slug}`}>
                <div className="pc-img">
                  {p.image
                    ? <img src={projectPhoto(p)} alt={`${p.title} — ${p.type}`} loading="lazy" />
                    : <span className="pc-icon" aria-hidden="true">{TYPE_ICON[p.type] ?? '◉'}</span>}
                  <span className="pc-type">{p.type}</span>
                </div>
                <div className="pc-body">
                  <h3>{p.title}</h3>
                  <p className="pc-loc">{p.woreda}{p.tabia ? ` · ${p.tabia}` : ''}</p>
                  <p className="pc-stat"><b>{p.stat.value}</b> {p.stat.label.toLowerCase()}</p>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}

export function ProjectDetail({ lng, base }: { lng: Locale; base: string }) {
  const { pathname } = useLocation()
  const { t } = useTranslation()
  const slug = decodeURIComponent(pathname.match(/\/projects\/([^/]+)/)?.[1] ?? '')
  const idx = projects.findIndex((p) => p.slug === slug)
  const p = projects[idx]
  if (!p) return <Navigate to={`${base}/projects`} replace />
  const next = projects[(idx + 1) % projects.length]
  const solution = SOLUTIONS[p.type]

  return (
    <article className="detail page-head" data-elev="2500">
      {p.image && (
        <div className="detail-hero">
          <img src={projectPhoto(p)} alt={`${p.title} — ${p.type}, ${p.woreda}`} />
        </div>
      )}
      <div className="shell">
        <div className="detail-head" style={{ maxWidth: '100%' }}>
          <Link to={`${base}/projects`} className="svc-more">← {t('nav.projects')}</Link>
          <div className="si-meta" style={{ marginTop: 18 }}>{p.type} · {p.year}</div>
          <Lines as="h1" lang={lng}>{p.title}</Lines>
        </div>

        {/* key metrics — the charity:water key-value strip */}
        <Reveal className="pd-metrics">
          <div><span className="pdm-l">{p.stat.label}</span><span className="pdm-v">{p.stat.value}</span></div>
          <div><span className="pdm-l">Location</span><span className="pdm-v">{p.woreda}{p.tabia ? ` · ${p.tabia}` : ''}</span></div>
          {p.lat && p.lng && (
            <div><span className="pdm-l">Coordinates ≈</span><span className="pdm-v">{p.lat.toFixed(2)}°N · {p.lng.toFixed(2)}°E</span></div>
          )}
          <div><span className="pdm-l">Solution</span><span className="pdm-v">{p.type}</span></div>
          <div><span className="pdm-l">Status</span><span className="pdm-v">{p.year}</span></div>
          <div><span className="pdm-l">With thanks to</span><span className="pdm-v">{p.funder}</span></div>
        </Reveal>

        {/* where it stands — satellite proof, full width */}
        {p.lat && p.lng && (
          <Reveal style={{ marginBottom: 'clamp(30px, 4vw, 50px)' }}>
            <ProjectMap
              height={460}
              zoom={12}
              pins={[{
                lat: p.lat, lng: p.lng,
                title: p.title,
                sub: `${p.woreda}${p.tabia ? ' · ' + p.tabia : ''}`,
                type: p.type,
                year: p.year,
                stat: `${p.stat.value} ${p.stat.label.toLowerCase()}`,
              }]}
            />
          </Reveal>
        )}

        <div className="pd-cols">
          <div className="prose detail-body">
            <p className="dropcap">{p.body}</p>
            {p.ext && (
              <p style={{ marginTop: '1.2em' }}>
                <a href={p.ext} target="_blank" rel="noreferrer" className="svc-more">
                  See this project on charitywater.org →
                </a>
              </p>
            )}
            {typeof p.story === 'number' && (
              <p style={{ marginTop: '1.2em' }}>
                <Link to={`${base}/stories/${p.story}`} className="svc-more">Read the field story →</Link>
              </p>
            )}
          </div>
          <div className="pd-side">
            {solution && (
              <aside className="pd-solution">
                <h4>About the solution</h4>
                <p>{solution}</p>
                <p className="pds-partner"><b>Local partner</b> {p.partner}</p>
              </aside>
            )}
          </div>
        </div>

        <div className="detail-next">
          <span className="nb-kicker" style={{ color: 'var(--ink-dim)' }}>Next project</span>
          <Magnetic>
            <Link to={`${base}/projects/${next.slug}`} className="dn-link">{next.title} →</Link>
          </Magnetic>
        </div>
      </div>
    </article>
  )
}
