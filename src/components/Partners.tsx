import { Reveal } from './ui'
import { content } from '../content'

/* Partner wall — proper names, proper labels, zero dead space.
   Majors carry a role line; the long tail sits in a tidy chip row. */

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
  const rest = all
    .filter((p) => !used.has(p.name))
    .map((p) => NAME_FIX[p.name.toLowerCase().trim()] ?? titleCase(p.name.trim()))

  return (
    <div className="pwall">
      <div className="pwall-grid">
        {[...majorHits, ...EXTRA_MAJORS].map((m, i) => (
          <Reveal key={m.name} className="pw-card" delay={(i % 4) * 60}>
            <span className="pw-name">{m.name}</span>
            <span className="pw-role">{m.role}</span>
          </Reveal>
        ))}
      </div>
      <Reveal className="pw-rest">
        <span className="pw-rest-label">And alongside</span>
        <div className="pw-chips">
          {rest.map((n) => <span className="pw-chip" key={n}>{n}</span>)}
        </div>
      </Reveal>
    </div>
  )
}
