import raw from './data/content.json'

export type Locale = 'en' | 'ti' | 'am'
export type Tri = { en: string; ti: string; am: string }

export interface Story {
  title: Tri
  body: Tri
  date: string
  image: string
}
export interface Milestone {
  year: string
  yearTri: Tri
  body: Tri
  image: string
}
export interface Service {
  title: Tri
  body: Tri
  image: string
  subs: { title: string; body: string }[]
}

interface Content {
  about: { establishment: Tri; mission: Tri; vision: Tri; values: Tri }
  history: Milestone[]
  services: Service[]
  faqs: { q: Tri; a: Tri }[]
  stories: Story[]
  team: { name: string; role: string; image: string }[]
  partners: { name: string; logo: string }[]
  policy: { title: Tri; body: Tri; image: string }[]
  beneficiaries: { title: Tri; body: Tri; image: string }[]
  contact: Record<string, string>
  socials: { name: string; url: string }[]
  imageBase: string
}

export const content = raw as unknown as Content

/** Pick a locale's text, falling back to English when the translation is missing. */
export function t(tri: Tri | undefined, lng: Locale): string {
  if (!tri) return ''
  return (tri[lng] && tri[lng].trim()) || tri.en || ''
}

/** Absolute URL for an image stored in REST's CMS. */
export function cms(file: string): string {
  return file ? content.imageBase + encodeURIComponent(file) : ''
}

/** Impact figures — reconciled from the CMS counters (fields arrive scrambled). */
export const impact = [
  { value: 1978, label: { en: 'Founded in Mekelle, in famine and war', ti: 'ኣብ መቐለ ዝተመስረተ', am: 'በመቀሌ የተመሠረተ' }, format: 'year' },
  { value: 3000000, label: { en: 'Lives transformed across Tigray and beyond', ti: 'ዝተለወጠ ህይወት', am: 'የተለወጠ ሕይወት' }, format: 'plain' },
  { value: 1000, label: { en: 'Completed projects strengthening communities', ti: 'ዝተዛዘሙ ፕሮጀክትታት', am: 'የተጠናቀቁ ፕሮጀክቶች' }, format: 'plus' },
  { value: 29, label: { en: 'Partners, from WFP and UNICEF to the EU', ti: 'መሻርኽቲ ትካላት', am: 'አጋር ድርጅቶች' }, format: 'plain' },
] as const

/** Human stories curated for the editorial layer (2024 features, fully trilingual). */
export const featuredStoryIndexes = (() => {
  const idx: number[] = []
  content.stories.forEach((s, i) => {
    if (/Birhan|Aregawi|Alem Teka|Daba Gray|Wurich|Thirst/i.test(s.title.en)) idx.push(i)
  })
  return idx
})()

export const majorPartners = [
  'WFP', 'UNICEF', 'FAO', 'European Union', 'Oxfam', 'CARE', 'Trocaire',
  'Bread for the World', 'Development Fund', 'DECSI', 'PSNP', 'Water to Thrive',
]
