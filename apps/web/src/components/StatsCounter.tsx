import { cn } from '@/lib/utils'
import type { StatsStyle } from '@/features/pages'
import Section from '@/components/Section'

interface Stat {
  label: string
  value: string
}

interface StatsCounterProps {
  style: StatsStyle
  title: string
  stats: Stat[]
}

const StatTile = ({ label, value, tone }: { label: string; value: string; tone: 'light' | 'dark' }) => (
  <div
    className={cn(
      'rounded-xl border p-4 text-center transition-all duration-200 hover:-translate-y-1',
      tone === 'light'
        ? 'border-forest/10 bg-cream/40 hover:border-leaf/40 hover:shadow-md'
        : 'border-cream/20 bg-cream/5 hover:border-lime/40 hover:bg-cream/10',
    )}
  >
    <div className={cn('font-serif text-2xl sm:text-3xl', tone === 'light' ? 'text-leaf' : 'text-lime')}>{label}</div>
    <div className={cn('mt-1 text-xs sm:text-sm', tone === 'light' ? 'text-forest/70' : 'text-cream/70')}>{value}</div>
  </div>
)

// Two placements: a card that floats over the Hero's bottom edge (must be
// rendered immediately after <Hero> for the negative margin to land right),
// or a plain full-width section wherever it's placed in the page.
const StatsCounter = ({ style, title, stats }: StatsCounterProps) => {
  if (stats.length === 0) return null

  if (style === 'overlap') {
    return (
      <div className="relative z-10 -mt-20 px-4 sm:-mt-24">
        <div className="mx-auto max-w-4xl rounded-2xl border border-forest/10 bg-white p-5 shadow-lg sm:p-8">
          <h2 className="mb-4 text-center font-serif text-lg text-forest sm:text-2xl">{title}</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
            {stats.map(({ label, value }) => (
              <StatTile key={label} label={label} value={value} tone="light" />
            ))}
          </div>
        </div>
      </div>
    )
  }

  return (
    <Section background="forest">
      <h2 className="mb-6 text-center font-serif text-2xl text-cream">{title}</h2>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {stats.map(({ label, value }) => (
          <StatTile key={label} label={label} value={value} tone="dark" />
        ))}
      </div>
    </Section>
  )
}

export default StatsCounter
