import { Link } from 'react-router-dom'
import type { ReactNode } from 'react'
import { usePageContent, getSectionText, parseHeroSlides, parseHeroTags, isStatsStyle } from '@/features/pages'
import { renderRichText } from '@/lib/richText'
import { useProducts, ProductCard } from '@/features/products'
import { useShownTestimonials, TestimonialCard } from '@/features/testimonials'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { photoService } from '@/features/photos/services/photoService'
import Hero, { type HeroSlide } from '@/components/Hero'
import Carousel from '@/components/Carousel'
import Section from '@/components/Section'
import StatsCounter from '@/components/StatsCounter'
import Reveal from '@/components/Reveal'
import Seo from '@/components/Seo'
import { Button } from '@/components/ui/button'
import { parsePairs, parseBullets } from '@/lib/parseSectionText'
import { cn } from '@/lib/utils'
import { ArrowRight, LayoutGrid, Leaf, ShieldCheck, TrendingUp, Users } from 'lucide-react'

const FEATURE_ICONS = [Leaf, ShieldCheck, TrendingUp, Users]

const DEFAULT_FEATURES =
  'Certified Genetics – Every seed batch is lab-tested for purity and germination before it leaves our facility.\nNationwide Reach – Trusted by farmers, distributors, and agro-retailers across the country.\nResearch-Backed – Over a decade of plant genetics and breeding R&D behind every variety.\nDedicated Support – Agronomy guidance from planting through harvest.'

const DEFAULT_STATS = '24+ : Years of Experience\n500+ : Farmer Partners\n50+ : Seed Varieties\n100% : Purity Certified'

const HOME_FEATURE_SLIDES: {
  image: string
  eyebrow: string
  title: string
  body: string
  contentSide: 'left' | 'right'
}[] = [
  {
    image: '/hero_banner_images/split-hero-seedling.webp',
    eyebrow: 'What are we doing at ANZ Agri',
    title: 'Growing a stronger agricultural future',
    body: 'Agriculture is the backbone of every economy. We create practical, science-backed seed solutions that help growers improve production and build more resilient farms.',
    contentSide: 'left',
  },
  {
    image: '/hero_banner_images/split-hero-maize-field.webp',
    eyebrow: 'Our core services',
    title: 'Our Core Services',
    body: 'From quality genetics to agronomy guidance, we work alongside farmers and partners to make every growing season more productive.',
    contentSide: 'right',
  },
  {
    image: '/hero_banner_images/minimal-sorghum-field.webp',
    eyebrow: 'Field-tested performance',
    title: 'Seeds built for every season',
    body: 'Our hybrid and open-pollinated varieties are selected for dependable performance across diverse soils, climates, and growing conditions.',
    contentSide: 'left',
  },
  {
    image: '/hero_banner_images/hero-product-seed-pouch.webp',
    eyebrow: 'Farmer-first support',
    title: 'From our fields to yours',
    body: 'We pair quality seed with practical guidance, dependable supply, and a growing network of partners who care about better harvests.',
    contentSide: 'right',
  },
]

const HeadingRule = ({
  children,
  align = 'center',
  tone = 'forest',
}: {
  children: ReactNode
  align?: 'left' | 'center' | 'right'
  tone?: 'forest' | 'cream'
}) =>
  align === 'center' ? (
    <h2 className="text-center font-serif text-2xl text-forest">{children}</h2>
  ) : (
    <h2
      className={cn(
        'min-w-0 flex-1 font-serif text-3xl leading-tight sm:text-4xl',
        tone === 'cream' ? 'text-cream' : 'text-forest',
        align === 'right' && 'text-right',
      )}
    >
      {children}
    </h2>
  )

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
          tags: parseHeroTags(s.tags),
        }))
      : [
          {
            imageUrl: heroImageUrl,
            eyebrow: 'Growing possibilities',
            title: getSectionText(sections, 'hero_title', 'Sowing Potential.\nHarvesting Progress.'),
            subtitle: getSectionText(
              sections,
              'hero_subtitle',
              'Empowering agriculture with quality seeds, dependable performance and solutions created for sustainable growth.',
            ),
            ctaLabel: getSectionText(sections, 'hero_cta_label', 'Discover ANZ Agricrop'),
            ctaTo: getSectionText(sections, 'hero_cta_link', '/about'),
            ctaLabel2: getSectionText(sections, 'hero_cta_label2', 'Our Products'),
            ctaTo2: getSectionText(sections, 'hero_cta_link2', '/products'),
            tags: ['Certified Genetics', 'Nationwide Delivery', 'Farmer-First'],
          },
          {
            imageUrl: '/hero_banner_images/split-hero-maize-field.webp',
            eyebrow: 'Field-tested performance',
            title: 'Built for Every\nGrowing Season',
            subtitle: 'Hybrid and open-pollinated varieties bred for consistent yield across diverse soils and climates.',
            ctaLabel: 'Explore Products',
            ctaTo: '/products',
            tags: ['Consistent Yield', 'Climate-Resilient', 'Multi-Soil'],
          },
          {
            imageUrl: '/hero_banner_images/minimal-sorghum-field.webp',
            eyebrow: 'Trusted nationwide',
            title: 'From Our Fields\nto Yours',
            subtitle: 'Over a decade of research and a growing network of farmer partners across the country.',
            ctaLabel: 'Get in Touch',
            ctaTo: '/contact',
            tags: ['500+ Farmer Partners', 'Since 2009', 'Pan-India'],
          },
        ]

  const featuresEnabled = getSectionText(sections, 'features_enabled', 'true') === 'true'
  const featuresTitle = getSectionText(sections, 'features_title', 'Why choose ANZ Agri Crop Sciences')
  const features = parseBullets(getSectionText(sections, 'features', DEFAULT_FEATURES))

  const statsEnabled = getSectionText(sections, 'stats_enabled', 'true') === 'true'
  const rawStatsStyle = getSectionText(sections, 'stats_style', 'section')
  const statsStyle = isStatsStyle(rawStatsStyle) ? rawStatsStyle : 'section'
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

      {statsEnabled && (
        <Reveal variant="scale">
          <StatsCounter style={statsStyle} title={statsTitle} stats={stats} />
        </Reveal>
      )}

      <Reveal variant="fade">
        <Section>
          <div className="mx-auto max-w-2xl space-y-3 text-center text-lg text-forest/80">
            {renderRichText(
              getSectionText(
                sections,
                'intro',
                'An integrated agricultural enterprise with a strong foundation in plant genetics and seed production — delivering 100% pure, high-yield hybrid and open-pollinated varieties to growers nationwide and beyond.',
              ),
            )}
          </div>
        </Section>
      </Reveal>

      <Reveal variant="up">
        <Section background="forest" className="overflow-hidden">
          <Carousel
            items={HOME_FEATURE_SLIDES}
            ariaLabel="What we do at ANZ Agri"
            intervalMs={4500}
            dotTone="light"
            dotsClassName="bottom-3"
            className="mx-auto h-[30rem] max-w-5xl sm:h-96"
            renderItem={(slide) => (
              <div className="grid h-full grid-cols-1 items-center gap-6 px-5 py-8 sm:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] sm:px-12 sm:py-10">
                <div
                  className={cn(
                    'order-1 text-center sm:text-left',
                    slide.contentSide === 'right' ? 'sm:order-2 sm:text-right' : 'sm:order-1',
                  )}
                >
                  <p className="text-xs font-semibold uppercase tracking-[0.2em] text-lime">{slide.eyebrow}</p>
                  <div className="mt-3">
                    <HeadingRule align={slide.contentSide} tone="cream">
                      {slide.title}
                    </HeadingRule>
                  </div>
                  <p className={cn('mt-4 max-w-xl text-sm leading-6 text-cream/75 sm:text-base', slide.contentSide === 'right' && 'sm:ml-auto')}>
                    {slide.body}
                  </p>
                  <Link to="/about" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-lime hover:text-cream">
                    Learn more <ArrowRight size={16} aria-hidden />
                  </Link>
                </div>
                <div
                  className={cn(
                    'order-2 flex h-36 items-center justify-center sm:h-full',
                    slide.contentSide === 'right' ? 'sm:order-1' : 'sm:order-2',
                  )}
                >
                  <img src={slide.image} alt="" className="h-full w-full rounded-lg object-cover shadow-xl sm:max-h-64" />
                </div>
              </div>
            )}
          />
        </Section>
      </Reveal>

      {featuresEnabled && features.length > 0 && (
        <Reveal variant="up">
          <Section background="cream">
            <div className="mb-6">
              <HeadingRule>{featuresTitle}</HeadingRule>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {features.map(({ label, value }, i) => {
                const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length]
                return (
                  <div
                    key={label || value}
                    className="group rounded-xl border border-forest/10 bg-white p-5 text-center shadow-sm transition-all duration-200 hover:-translate-y-1 hover:border-leaf/40 hover:shadow-lg"
                  >
                    <Icon className="mx-auto h-8 w-8 text-leaf group-hover:animate-bounce" />
                    {label && <div className="mt-3 font-medium text-forest">{label}</div>}
                    <div className="mt-1 text-sm text-forest/70">{value}</div>
                  </div>
                )
              })}
            </div>
          </Section>
        </Reveal>
      )}

      {featured.length > 0 && (
        <Reveal variant="left">
          <Section background="cream">
            <div className="mb-6 flex items-center justify-between gap-4">
              <HeadingRule align="left">
                Featured products
              </HeadingRule>
              <Link to="/products" className="shrink-0">
                <Button variant="outline" size="sm" className="whitespace-nowrap">
                  <LayoutGrid size={16} className="mr-1.5" aria-hidden />
                  View all
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </Section>
        </Reveal>
      )}

      {settings?.testimonials_enabled && testimonials && testimonials.length > 0 && (
        <Reveal variant="right">
          <Section>
            <p className="text-center text-sm font-semibold uppercase tracking-[0.2em] text-leaf">What customer say about us</p>
            <div className="mb-6 mt-2">
              <HeadingRule>Testimonials</HeadingRule>
            </div>
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
        </Reveal>
      )}
    </>
  )
}

export default Home
