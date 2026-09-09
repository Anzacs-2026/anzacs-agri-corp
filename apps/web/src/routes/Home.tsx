import { Link } from 'react-router-dom'
import { usePageContent, getSectionText, HERO_VARIANTS, type HeroVariantOption } from '@/features/pages'
import { useProducts, ProductCard } from '@/features/products'
import { useShownTestimonials, TestimonialCard } from '@/features/testimonials'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import { photoService } from '@/features/photos/services/photoService'
import Hero from '@/components/Hero'
import Section from '@/components/Section'

const Home = () => {
  const { data: sections } = usePageContent('home')
  const { data: products } = useProducts()
  const { data: settings } = useSiteSettings()
  const { data: testimonials } = useShownTestimonials()
  const featured = products?.slice(0, 3) ?? []

  const heroVariant = getSectionText(sections, 'hero_variant', HERO_VARIANTS[1]) as HeroVariantOption
  const heroImagePath = getSectionText(sections, 'hero_image', '')
  const heroImageUrl = heroImagePath ? photoService.getPublicUrl(heroImagePath) : null

  return (
    <>
      <Hero
        variant={HERO_VARIANTS.includes(heroVariant) ? heroVariant : 'mockup'}
        eyebrow="Seeds for life"
        title={getSectionText(sections, 'hero_title', 'ANZ Agri Crop Sciences')}
        subtitle={getSectionText(
          sections,
          'hero_subtitle',
          'Trusted hybrid seeds, farming, and beekeeping — bringing over a decade of research to every field since 2009.',
        )}
        ctaLabel={getSectionText(sections, 'hero_cta_label', 'Explore products')}
        ctaTo={getSectionText(sections, 'hero_cta_link', '/products')}
        imageUrl={heroImageUrl}
        products={featured}
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
