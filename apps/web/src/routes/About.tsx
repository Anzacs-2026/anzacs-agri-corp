import { usePageContent, getSectionText, HERO_VARIANTS, type HeroVariantOption } from '@/features/pages'
import { humanizeKey } from '@/lib/humanize'
import { photoService } from '@/features/photos/services/photoService'
import Hero from '@/components/Hero'
import Section from '@/components/Section'

const DEFAULTS: Record<string, string> = {
  who_we_are:
    'ANZ Agri Crop Sciences is an integrated agricultural enterprise with over 12 years of dedicated research and development in plant genetics, conventional breeding, and seed production. The company operates across farming, seed commerce, and apiculture (beekeeping), creating a synergistic model that supports both crop productivity and diversified revenue streams.',
  core_capabilities:
    'Seed Genetics & R&D – A strong foundation in plant heredity and innovative germination techniques drives the development of high-performance seed varieties.\nQuality Assurance – Every product undergoes rigorous handling in controlled environments supervised by expert horticulturists, ensuring 100% purity, extended shelf life, superior taste, nutritional density, and hygienic standards.\nSupply Chain Excellence – As a reliable manufacturer, shipper, exporter, and supplier, the organization ensures seamless distribution to agricultural markets across multiple geographies.\nBeekeeping Integration – Recently launched apiculture operations complement farming activities through natural pollination and open avenues for honey and hive-product commercialization.',
  market_position:
    "ANZ Agri Crop Sciences has earned broad customer recognition for consistency and product integrity. The company's commitment to zero-compromise quality has positioned it as a trusted partner among farmers, distributors, and agro-retailers nationally. Export operations extend the company's reach to international markets, adhering to stringent phytosanitary and trade compliance standards.",
  philosophy:
    'Agriculture remains the foundation of national economic growth, and seeds are its starting point — the very essence of food security. ANZ Agri Crop Sciences embraces this philosophy by continuously refining seed technologies, improving germination rates, and ensuring that high-quality genetic material reaches every farm gate. This approach contributes directly to higher yields, better farmer incomes, and sustainable food systems.',
  why_anz:
    'Purity: 100% certified\nShelf Life: Optimized through scientific storage\nNutrition: Preserved through careful processing\nTraceability: End-to-end batch tracking\nInnovation: Continuous investment in breeding R&D',
  future_direction:
    "Building on a decade of operational excellence, the organization is scaling its beekeeping division, expanding export footprints, and investing in climate-resilient seed traits. The goal remains clear: to remain at the forefront of India's agricultural evolution by delivering science-backed, farmer-first solutions.",
}

const parsePairs = (text: string) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split(':')
      return { label: label.trim(), value: rest.join(':').trim() }
    })

const parseBullets = (text: string) =>
  text
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [label, ...rest] = line.split(' – ')
      return rest.length ? { label: label.trim(), value: rest.join(' – ').trim() } : { label: '', value: line }
    })

const About = () => {
  const { data: sections } = usePageContent('about')
  const text = (key: string) => getSectionText(sections, key, DEFAULTS[key] ?? '')
  const heroVariant = getSectionText(sections, 'hero_variant', HERO_VARIANTS[0]) as HeroVariantOption
  const heroImagePath = getSectionText(sections, 'hero_image', '')
  const heroImageUrl = heroImagePath ? photoService.getPublicUrl(heroImagePath) : null

  return (
    <>
      <Hero
        variant={HERO_VARIANTS.includes(heroVariant) ? heroVariant : 'split'}
        eyebrow="Our story"
        title={getSectionText(sections, 'hero_title', 'About Us')}
        subtitle={getSectionText(
          sections,
          'hero_subtitle',
          'Established 2009 · Headquartered in India · Seeds, Farming & Beekeeping',
        )}
        ctaLabel={getSectionText(sections, 'hero_cta_label', 'Contact us')}
        ctaTo={getSectionText(sections, 'hero_cta_link', '/contact')}
        imageUrl={heroImageUrl}
      />

      <Section>
        <h2 className="mb-3 font-serif text-2xl text-forest">{humanizeKey('who_we_are')}</h2>
        <p className="max-w-3xl leading-relaxed text-forest/80">{text('who_we_are')}</p>
      </Section>

      <Section background="cream">
        <h2 className="mb-4 font-serif text-2xl text-forest">{humanizeKey('core_capabilities')}</h2>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {parseBullets(text('core_capabilities')).map(({ label, value }) => (
            <li key={label || value} className="rounded-xl border border-forest/10 bg-white p-4 shadow-sm">
              {label && <div className="mb-1 font-medium text-forest">{label}</div>}
              <div className="text-sm text-forest/70">{value}</div>
            </li>
          ))}
        </ul>
      </Section>

      <Section>
        <h2 className="mb-3 font-serif text-2xl text-forest">{humanizeKey('market_position')}</h2>
        <p className="max-w-3xl leading-relaxed text-forest/80">{text('market_position')}</p>
      </Section>

      <Section background="forest">
        <h2 className="mb-3 font-serif text-2xl">Philosophy: Seeds as Food</h2>
        <p className="max-w-3xl leading-relaxed text-cream/80">{text('philosophy')}</p>
      </Section>

      <Section>
        <h2 className="mb-4 font-serif text-2xl text-forest">{humanizeKey('why_anz')}</h2>
        <dl className="grid grid-cols-1 gap-4 rounded-xl border border-forest/10 bg-white p-5 shadow-sm sm:grid-cols-2">
          {parsePairs(text('why_anz')).map(({ label, value }) => (
            <div key={label}>
              <dt className="font-medium text-forest">{label}</dt>
              <dd className="text-sm text-forest/70">{value}</dd>
            </div>
          ))}
        </dl>
      </Section>

      <Section background="cream">
        <h2 className="mb-3 font-serif text-2xl text-forest">{humanizeKey('future_direction')}</h2>
        <p className="max-w-3xl leading-relaxed text-forest/80">{text('future_direction')}</p>
      </Section>
    </>
  )
}

export default About
