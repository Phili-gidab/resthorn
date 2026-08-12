import { Reveal } from './ui'
import { content } from '../content'

/* ============================================================
   Partner stream — the confluence, moving.
   The section is titled "Twenty-nine tributaries, one river", so
   the partners flow: majors drift by as full cards in one stream,
   the long tail runs beneath them in the opposite direction as a
   current of names. Hover holds either stream still. Edges fade
   out under a mask — the river continues beyond the frame.
   Reduced motion: streams stand still and scroll by hand.
   ============================================================ */

const MAJORS: { match: string; name: string; role: string }[] = [
  { match: 'wfp', name: 'UN World Food Programme', role: 'Food assistance & resilience' },
  { match: 'unicef', name: 'UNICEF', role: 'WASH & child protection' },
  { match: 'fao', name: 'FAO', role: 'Agriculture & food security' },
  { match: 'european union', name: 'European Union', role: 'Development funding' },
  { match: 'oxfam', name: 'Oxfam', role: 'Resilience · €2.1M program' },
  { match: 'care', name: 'CARE', role: 'Humanitarian programs' },
  { match: 'trociare', name: 'Trócaire', role: 'Partnership & funding' },
  { match: 'bread', name: 'Bread for the World', role: 'Food security' },
  { match: 'development fund', name: 'Development Fund Norway', role: 'Climate-smart agriculture' },
  { match: 'decsi', name: 'DECSI', role: 'Microfinance — founded by REST' },
  { match: 'psnp', name: 'PSNP', role: 'Productive safety nets' },
  { match: 'water to thrive', name: 'Water to Thrive', role: 'Rural water' },
]

/* charity: water is documented as REST's partner on charitywater.org project pages */
const EXTRA_MAJORS = [
  { name: 'charity: water', role: 'Rural water · REST as local partner' },
]

const NAME_FIX: Record<string, string> = {
  'trociare': 'Trócaire',
  'my book buddy': 'My Book Buddy',
  'glimmers of hope': 'A Glimmer of Hope',
  'water charity': 'Water Charity',
  'well wishers australia': 'Well Wishers Australia',
  'kinder suerer': 'Kinder Suerer',
  'development fund': 'Development Fund Norway',
}

function titleCase(s: string) {
  return s.replace(/\w\S*/g, (w) => (w.length > 3 || /^[a-z]/.test(w) ? w[0].toUpperCase() + w.slice(1) : w))
}

export default function Partners() {
  const all = content.partners
  const majorHits: { name: string; role: string }[] = []
  const used = new Set<string>()

  MAJORS.forEach((m) => {
    const hit = all.find((p) => p.name.toLowerCase().includes(m.match))
    if (hit) {
      majorHits.push({ name: m.name, role: m.role })
      used.add(hit.name)
    }
  })
  const majors = [...majorHits, ...EXTRA_MAJORS]
  const rest = all
    .filter((p) => !used.has(p.name))
    .map((p) => NAME_FIX[p.name.toLowerCase().trim()] ?? titleCase(p.name.trim()))

  /* three copies per track: the loop shifts exactly one copy's width */
  const copies = [0, 1, 2]

  return (
    <div className="pstream">
      <Reveal>
        <div className="ps-band" role="list" aria-label="Major partners">
          <div className="ps-track">
            {copies.map((c) => (
              <div className="ps-row" key={c} aria-hidden={c > 0}>
                {majors.map((m, i) => (
                  <article className="ps-card" role={c === 0 ? 'listitem' : undefined} key={`${c}-${m.name}`}>
                    <span className="ps-top">
                      <span className="ps-idx">{String(i + 1).padStart(2, '0')}</span>
                      <span className="ps-tick" aria-hidden="true" />
                    </span>
                    <span className="ps-name">{m.name}</span>
                    <span className="ps-role">{m.role}</span>
                  </article>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal className="ps-tail" delay={110}>
        <span className="ps-tail-label">— and alongside —</span>
        <div className="ps-band ps-band-rev" role="list" aria-label="Further partners">
          <div className="ps-track">
            {copies.map((c) => (
              <div className="ps-row ps-row-chips" key={c} aria-hidden={c > 0}>
                {rest.map((n) => (
                  <span className="ps-chip" role={c === 0 ? 'listitem' : undefined} key={`${c}-${n}`}>{n}</span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </Reveal>
    </div>
  )
}
