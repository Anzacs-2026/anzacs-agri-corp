import { usePageContent, getSectionText } from '@/features/pages'
import { ProductGrid } from '@/features/products'
import { photoService } from '@/features/photos/services/photoService'
import Hero from '@/components/Hero'
import Seo from '@/components/Seo'

const Products = () => {
  const { data: sections } = usePageContent('products')

  const heroVariant = getSectionText(sections, 'hero_variant', 'mockup:screenshot')
  const heroImagePath = getSectionText(sections, 'hero_image', '')
  const heroImageUrl = heroImagePath ? photoService.getPublicUrl(heroImagePath) : '/hero_banner_images/hero-product-seed-pouch.webp'

  return (
    <>
      <Seo
        title="Our Products"
        description="Browse ANZ Agri Crop Sciences' full catalog of hybrid and open-pollinated seeds — gourds, solanaceous vegetables, cabbage and cauliflower, and more."
        path="/products"
      />

      <Hero
        variant={heroVariant}
        eyebrow="Quality that begins with the seed"
        title={getSectionText(sections, 'hero_title', 'Better Seeds. Greater Potential.')}
        subtitle={getSectionText(
          sections,
          'hero_subtitle',
          'Discover dependable, high-performing seeds created to give every crop a strong beginning and every farmer greater confidence.',
        )}
        ctaLabel={getSectionText(sections, 'hero_cta_label', 'View Our Products')}
        ctaTo={getSectionText(sections, 'hero_cta_link', '/products')}
        ctaLabel2={getSectionText(sections, 'hero_cta_label2', 'Enquire Now')}
        ctaTo2={getSectionText(sections, 'hero_cta_link2', '/contact')}
        imageUrl={heroImageUrl}
      />

      <ProductGrid />
    </>
  )
}

export default Products
