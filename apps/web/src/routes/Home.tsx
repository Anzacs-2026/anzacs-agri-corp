import { Link } from 'react-router-dom'
import { usePageContent, getSectionText } from '@/features/pages'
import { useProducts, ProductCard } from '@/features/products'
import { useShownTestimonials, TestimonialCard } from '@/features/testimonials'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { photoService } from '@/features/photos/services/photoService'
import Hero from '@/components/Hero'
import Section from '@/components/Section'
import Seo from '@/components/Seo'

const Home = () => {
  const { data: sections } = usePageContent('home')
  const { data: products } = useProducts()
  const { data: settings } = useSiteSettings()
  const { data: testimonials } = useShownTestimonials()
  const featured = products?.slice(0, 3) ?? []

  const heroVariant = getSectionText(sections, 'hero_variant', 'split:50-50')
  const heroImagePath = getSectionText(sections, 'hero_image', '')
  const heroImageUrl = heroImagePath ? photoService.getPublicUrl(heroImagePath) : '/hero_banner_images/split-hero-seedling.webp'
  const categoryCount = new Set(products?.map((p) => p.category)).size

  const heroStats = [
    { label: 'Varieties', value: `${products?.length ?? 24}+` },
    { label: 'Categories', value: String(categoryCount || 4) },
    { label: 'Est.', value: '2009' },
    { label: 'Purity', value: '100%' },
  ]

  return (
    <>
      <Seo
        title="ANZ Agri Crop Sciences"
        description="Trusted hybrid and open-pollinated seeds, farming, and beekeeping from ANZ Agri Crop Sciences — over a decade of research behind every field."
        path="/"
      />

      <Hero
        variant={heroVariant}
        eyebrow="Growing possibilities"
        title={getSectionText(sections, 'hero_title', 'Sowing Potential. Harvesting Progress.')}
        subtitle={getSectionText(
          sections,
          'hero_subtitle',
          'Empowering agriculture with quality seeds, dependable performance and solutions created for sustainable growth.',
        )}
        ctaLabel={getSectionText(sections, 'hero_cta_label', 'Discover ANZ Agricrop')}
        ctaTo={getSectionText(sections, 'hero_cta_link', '/about')}
        ctaLabel2={getSectionText(sections, 'hero_cta_label2', 'Our Products')}
        ctaTo2={getSectionText(sections, 'hero_cta_link2', '/products')}
        imageUrl={heroImageUrl}
        products={featured}
        stats={heroStats}
      />

      <Section>
        <p className="mx-auto max-w-2xl text-center text-lg text-forest/80">
          {getSectionText(
            sections,
            'intro',
            'An integrated agricultural enterprise with a strong foundation in plant genetics and seed production — delivering 100% pure, high-yield hybrid and open-pollinated varieties to growers nationwide and beyond.',
          )}
        </p>
      </Section>

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

      {settings?.testimonials_enabled && testimonials && testimonials.length > 0 && (
        <Section>
          <h2 className="mb-6 text-center font-serif text-2xl text-forest">What growers say</h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {testimonials.map((testimonial) => (
              <TestimonialCard key={testimonial.id} testimonial={testimonial} />
            ))}
          </div>
        </Section>
      )}
    </>
  )
}

export default Home
