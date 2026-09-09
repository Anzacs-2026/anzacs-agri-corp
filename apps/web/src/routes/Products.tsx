import { usePageContent, getSectionText, parseHeroSlides, parseHeroTags } from '@/features/pages'
import { ProductGrid } from '@/features/products'
import { photoService } from '@/features/photos/services/photoService'
import Hero, { type HeroSlide } from '@/components/Hero'
import Reveal from '@/components/Reveal'
import Seo from '@/components/Seo'

const Products = () => {
  const { data: sections } = usePageContent('products')

  const heroVariant = getSectionText(sections, 'hero_variant', 'banner-left')
  const heroImagePath = getSectionText(sections, 'hero_image', '')
  const heroImageUrl = heroImagePath ? photoService.getPublicUrl(heroImagePath) : '/hero_banner_images/minimal-sorghum-field.webp'
  const heroParallax = getSectionText(sections, 'hero_parallax', 'false') === 'true'

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
            eyebrow: 'Quality that begins with the seed',
            title: getSectionText(sections, 'hero_title', 'Better Seeds. Greater Potential.'),
            subtitle: getSectionText(
              sections,
              'hero_subtitle',
              'Discover dependable, high-performing seeds created to give every crop a strong beginning and every farmer greater confidence.',
            ),
            ctaLabel: getSectionText(sections, 'hero_cta_label', 'View Our Products'),
            ctaTo: getSectionText(sections, 'hero_cta_link', '#product-grid'),
            ctaLabel2: getSectionText(sections, 'hero_cta_label2', 'Enquire Now'),
            ctaTo2: getSectionText(sections, 'hero_cta_link2', '/contact'),
            tags: ['50+ Varieties', 'Lab-Tested Purity', 'Nationwide Supply'],
          },
        ]

  return (
    <>
      <Seo
        title="Our Products"
        description="Browse ANZ Agri Crop Sciences' full catalog of hybrid and open-pollinated seeds — gourds, solanaceous vegetables, cabbage and cauliflower, and more."
        path="/products"
      />

      <Hero variant={heroVariant} slides={slides} parallax={heroParallax} />

      <div id="product-grid" className="scroll-mt-24">
        <Reveal variant="up">
          <ProductGrid />
        </Reveal>
      </div>
    </>
  )
}

export default Products
