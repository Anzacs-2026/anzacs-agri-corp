import { Link } from 'react-router-dom'
import { usePageContent, getSectionText, parseHeroSlides } from '@/features/pages'
import { useProducts, ProductCard } from '@/features/products'
import { useShownTestimonials, TestimonialCard } from '@/features/testimonials'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { photoService } from '@/features/photos/services/photoService'
import Hero, { type HeroSlide } from '@/components/Hero'
import Carousel from '@/components/Carousel'
import Section from '@/components/Section'
import Seo from '@/components/Seo'
import { parsePairs, parseBullets } from '@/lib/parseSectionText'
import { Leaf, ShieldCheck, TrendingUp, Users } from 'lucide-react'

const FEATURE_ICONS = [Leaf, ShieldCheck, TrendingUp, Users]

const DEFAULT_FEATURES =
  'Certified Genetics – Every seed batch is lab-tested for purity and germination before it leaves our facility.\nNationwide Reach – Trusted by farmers, distributors, and agro-retailers across the country.\nResearch-Backed – Over a decade of plant genetics and breeding R&D behind every variety.\nDedicated Support – Agronomy guidance from planting through harvest.'

const DEFAULT_STATS = '24+ : Years of Experience\n500+ : Farmer Partners\n50+ : Seed Varieties\n100% : Purity Certified'

const Home = () => {
  const { data: sections } = usePageContent('home')
  const { data: products } = useProducts()
  const { data: settings } = useSiteSettings()
  const { data: testimonials } = useShownTestimonials()
  const featured = products?.slice(0, 3) ?? []

  const heroVariant = getSectionText(sections, 'hero_variant', 'banner-left')
  const heroImagePath = getSectionText(sections, 'hero_image', '')
  const heroImageUrl = heroImagePath ? photoService.getPublicUrl(heroImagePath) : '/hero_banner_images/split-hero-seedling.webp'
  const heroParallax = getSectionText(sections, 'hero_parallax', 'true') === 'true'

  const heroSlidesRaw = parseHeroSlides(getSectionText(sections, 'hero_slides', ''))
  const slides: HeroSlide[] =
    heroSlidesRaw.length > 0
      ? heroSlidesRaw.map((s) => ({
          imageUrl: s.imagePath ? photoService.getPublicUrl(s.imagePath) : null,
          eyebrow: s.eyebrow || undefined,
          title: s.title,
          subtitle: s.subtitle,
          ctaLabel: s.ctaLabel || undefined,
          ctaTo: s.ctaTo || undefined,
          ctaLabel2: s.ctaLabel2 || undefined,
          ctaTo2: s.ctaTo2 || undefined,
        }))
      : [
          {
            imageUrl: heroImageUrl,
            eyebrow: 'Growing possibilities',
            title: getSectionText(sections, 'hero_title', 'Sowing Potential. Harvesting Progress.'),
            subtitle: getSectionText(
              sections,
              'hero_subtitle',
              'Empowering agriculture with quality seeds, dependable performance and solutions created for sustainable growth.',
            ),
            ctaLabel: getSectionText(sections, 'hero_cta_label', 'Discover ANZ Agricrop'),
            ctaTo: getSectionText(sections, 'hero_cta_link', '/about'),
            ctaLabel2: getSectionText(sections, 'hero_cta_label2', 'Our Products'),
            ctaTo2: getSectionText(sections, 'hero_cta_link2', '/products'),
          },
        ]

  const featuresEnabled = getSectionText(sections, 'features_enabled', 'true') === 'true'
  const featuresTitle = getSectionText(sections, 'features_title', 'Why choose ANZ Agri Crop Sciences')
  const features = parseBullets(getSectionText(sections, 'features', DEFAULT_FEATURES))

  const statsEnabled = getSectionText(sections, 'stats_enabled', 'true') === 'true'
  const statsTitle = getSectionText(sections, 'stats_title', 'ANZ by the numbers')
  const stats = parsePairs(getSectionText(sections, 'stats', DEFAULT_STATS))

  return (
    <>
      <Seo
        title="ANZ Agri Crop Sciences"
        description="Trusted hybrid and open-pollinated seeds, farming, and beekeeping from ANZ Agri Crop Sciences — over a decade of research behind every field."
        path="/"
      />

      <Hero variant={heroVariant} slides={slides} parallax={heroParallax} />

      <Section>
        <p className="mx-auto max-w-2xl text-center text-lg text-forest/80">
          {getSectionText(
            sections,
            'intro',
            'An integrated agricultural enterprise with a strong foundation in plant genetics and seed production — delivering 100% pure, high-yield hybrid and open-pollinated varieties to growers nationwide and beyond.',
          )}
        </p>
      </Section>

      {featuresEnabled && features.length > 0 && (
        <Section background="cream">
          <h2 className="mb-6 text-center font-serif text-2xl text-forest">{featuresTitle}</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {features.map(({ label, value }, i) => {
              const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length]
              return (
                <div key={label || value} className="rounded-xl border border-forest/10 bg-white p-5 text-center shadow-sm">
                  <Icon className="mx-auto h-8 w-8 text-leaf" />
                  {label && <div className="mt-3 font-medium text-forest">{label}</div>}
                  <div className="mt-1 text-sm text-forest/70">{value}</div>
                </div>
              )
            })}
          </div>
        </Section>
      )}

      {featured.length > 0 && (
        <Section background="cream">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-2xl text-forest">Featured products</h2>
            <Link to="/products" className="text-sm font-medium text-forest underline underline-offset-4">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Section>
      )}

      {statsEnabled && stats.length > 0 && (
        <Section background="forest">
          <h2 className="mb-6 text-center font-serif text-2xl text-cream">{statsTitle}</h2>
          <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
            {stats.map(({ label, value }) => (
              <div key={label} className="text-center">
                <div className="font-serif text-3xl text-lime sm:text-4xl">{label}</div>
                <div className="mt-1 text-sm text-cream/70">{value}</div>
              </div>
            ))}
          </div>
        </Section>
      )}

      {settings?.testimonials_enabled && testimonials && testimonials.length > 0 && (
        <Section>
          <h2 className="mb-6 text-center font-serif text-2xl text-forest">What growers say</h2>
          <Carousel
            items={testimonials}
            getKey={(t) => t.id}
            ariaLabel="Customer testimonials"
            intervalMs={6000}
            dotTone="dark"
            className="mx-auto h-72 max-w-xl sm:h-64"
            renderItem={(testimonial) => <TestimonialCard testimonial={testimonial} />}
          />
        </Section>
      )}
    </>
  )
}

export default Home
