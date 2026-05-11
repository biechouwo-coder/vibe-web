/**
 * Shared academic keyword derivation for DailyCard and ContentDetail.
 *
 * Both components use this same function so tags / keywords /
 * title fallback logic stays consistent.
 */

const STRUCTURAL_TAGS = new Set([
  'daily', 'conversation', 'vocabulary', 'passage', 'journal',
  'core', 'cnf', 'academic',
])

function formatTagLabel(tag: string): string {
  if (tag === 'eu-ets') return 'EU ETS'
  if (tag === 'esg') return 'ESG'
  return tag.split('-').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')
}

function deriveTitleKeywords(title: string): string[] {
  // Conversation
  if (title.includes('Introducing Yourself')) return ['Introduction']
  if (title.includes('Group Project')) return ['Group Project']
  if (title.includes('Presenting Data')) return ['Presentation']

  // Vocabulary
  if (title.includes('Carbon Pricing & Trading')) return ['Carbon Pricing', 'Carbon Trading']
  if (title.includes('Carbon Market')) return ['Carbon Markets']
  if (title.includes('Carbon Accounting')) return ['Carbon Accounting']
  if (title.includes('ESG & Sustainable')) return ['ESG Investing']
  if (title.includes('Climate Science')) return ['Climate Policy']
  if (title.includes('Energy Economics')) return ['Energy Economics']
  if (title.includes('Green Finance')) return ['Green Finance']
  if (title.includes('Academic Research')) return ['Research Methods']

  // Passage / paper
  if (title.includes('meta-analysis') || title.includes('Meta-Analysis') || title.includes('Meta Analysis')) return ['Meta Analysis']
  if (title.includes('EU ETS') || title.includes('Emissions Trading')) return ['EU ETS']
  if (title.includes('Green Bond') || title.includes('carbon-linked bond')) return ['Green Bond', 'Carbon Finance']
  if (title.includes('Credit Risk') || title.includes('credit risk')) return ['Credit Risk']
  if (title.includes('Quasi-Experimental')) return ['Carbon Pricing', 'Empirical']
  if (title.includes('carbon pricing') || title.includes('Carbon Pricing')) return ['Carbon Pricing']

  return []
}

/**
 * Derive 1-3 academic-relevant keywords for display on a card or detail meta line.
 * Merges title-derived topics with meaningful tags, deduplicates.
 */
export function getAcademicKeywords(title: string, tags: string | null): string[] {
  const result: string[] = []

  for (const k of deriveTitleKeywords(title)) {
    if (!result.includes(k)) result.push(k)
  }

  if (tags) {
    const fromTags = tags
      .split(',')
      .map((t) => t.trim().toLowerCase())
      .filter((t) => !STRUCTURAL_TAGS.has(t))
      .map(formatTagLabel)
    for (const k of fromTags) {
      if (!result.includes(k)) result.push(k)
    }
  }

  return result.slice(0, 3)
}
