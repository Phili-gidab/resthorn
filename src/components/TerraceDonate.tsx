import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { content } from '../content'

/* Donation tiers as terrace steps on a hillside cross-section. */

const TIERS = [
  { key: 'terrace', name: 'Terrace', amount: 50, funds: 'Seedlings and soil bunds for one smallholder plot' },
  { key: 'field', name: 'Field', amount: 150, funds: 'A season of climate-smart seed and training for a farming family' },
  { key: 'reservoir', name: 'Reservoir', amount: 500, funds: 'Maintenance that keeps a village water point flowing' },
  { key: 'watershed', name: 'Watershed', amount: 1500, funds: 'A share of a full catchment restoration — terraces to river' },
]

/* Step geometry: hillside descending left → right */
const STEPS = [
  { x1: 60, y: 90, x2: 260 },
  { x1: 260, y: 150, x2: 460 },
  { x1: 460, y: 210, x2: 660 },
  { x1: 660, y: 270, x2: 860 },
]

export default function TerraceDonate() {
  const { t } = useTranslation()
  const [sel, setSel] = useState(1)
  const tier = TIERS[sel]

  const hillPath = () => {
    let d = `M 40 60 L ${STEPS[0].x1} 60 L ${STEPS[0].x1} ${STEPS[0].y}`
    STEPS.forEach((s, i) => {
      d += ` L ${s.x2} ${s.y}`
      if (i < STEPS.length - 1) d += ` L ${s.x2} ${STEPS[i + 1].y}`
    })
    d += ' L 880 330'
    return d
  }

  return (
    <div className="terrace-donate">
      <div className="td-viz">
        <svg viewBox="0 0 900 360" role="img" aria-label="Hillside cross-section with donation tiers drawn as terrace steps">
          <path d={hillPath()} fill="none" stroke="var(--ink-dim)" strokeWidth="1.4" />
          {STEPS.map((s, i) => (
            <g key={i}>
              <path
                d={`M ${s.x1} ${s.y} L ${s.x2} ${s.y}`}
                stroke={sel === i ? 'var(--green)' : 'transparent'}
                strokeWidth="3.5"
                strokeLinecap="round"
              />
              {sel === i && (
                <>
                  <path
                    className="td-water"
                    d={`M ${(s.x1 + s.x2) / 2} 18 L ${(s.x1 + s.x2) / 2} ${s.y - 6}`}
                    stroke="var(--river)"
                    strokeWidth="1.6"
                    strokeDasharray="4 6"
                  />
                  <circle cx={(s.x1 + s.x2) / 2} cy={s.y - 3} r="3.5" fill="var(--river)" />
                </>
              )}
            </g>
          ))}
          <text x="878" y="352" textAnchor="end" fill="var(--ink-dim)" fontSize="11" fontFamily="var(--sans)" letterSpacing="2">
            FIELDS BELOW
          </text>
        </svg>
      </div>
      <div className="td-panel">
        <p className="td-label">{t('involved.tiers')}</p>
        <div className="td-tiers" role="radiogroup" aria-label="Donation tier">
          {TIERS.map((tr, i) => (
            <button
              key={tr.key}
              role="radio"
              aria-checked={sel === i}
              className={sel === i ? 'on' : ''}
              onClick={() => setSel(i)}
            >
              <b>${tr.amount}</b>
              <span>{tr.name}</span>
            </button>
          ))}
        </div>
        <p className="td-funds">{tier.funds}.</p>
        <a
          className="btn solid"
          href={`mailto:${content.contact.mail}?subject=${encodeURIComponent(`Donation pledge — ${tier.name} ($${tier.amount})`)}`}
        >
          {t('involved.give')} <span className="arr">→</span>
        </a>
        <p className="td-note">
          Card and mobile-money rails are wired at launch; today, pledges route to{' '}
          <a href={`mailto:${content.contact.mail}`}>{content.contact.mail}</a>.
        </p>
      </div>
    </div>
  )
}
