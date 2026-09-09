import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import ProductCard from '@/features/products/components/ProductCard'
import type { Product } from '@/features/products'

export type HeroVariant = 'split' | 'mockup' | 'minimal'

interface HeroProps {
  variant: HeroVariant
  eyebrow?: string
  title: string
  subtitle: string
  ctaLabel?: string
  ctaTo?: string
  imageUrl?: string | null
  products?: Pick<Product, 'id' | 'name' | 'slug' | 'category' | 'short_description'>[]
}

const HeroText = ({ eyebrow, title, subtitle, ctaLabel, ctaTo, align }: Omit<HeroProps, 'variant' | 'products'> & { align: 'center' | 'left' }) => (
  <div className={align === 'center' ? 'text-center' : 'text-left'}>
    {eyebrow && <span className="text-xs font-medium uppercase tracking-[0.2em] text-lime">{eyebrow}</span>}
    <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">{title}</h1>
    <p className={`mt-4 max-w-xl text-cream/80 ${align === 'center' ? 'mx-auto' : ''}`}>{subtitle}</p>
    {ctaLabel && ctaTo && (
      <Link to={ctaTo} className="mt-8 inline-block">
        <Button variant="outline" size="default" className="border-gold text-cream hover:bg-gold/20">
          {ctaLabel}
        </Button>
      </Link>
    )}
  </div>
)

const Hero = ({ variant, eyebrow, title, subtitle, ctaLabel, ctaTo, imageUrl, products }: HeroProps) => {
  if (variant === 'minimal') {
    return (
      <section className="bg-forest px-4 py-20 text-cream">
        <div className="mx-auto max-w-3xl">
          <HeroText eyebrow={eyebrow} title={title} subtitle={subtitle} ctaLabel={ctaLabel} ctaTo={ctaTo} align="center" />
        </div>
      </section>
    )
  }

  const mockupProducts = products?.slice(0, 2) ?? []

  return (
    <section className="bg-forest px-4 py-20 text-cream">
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 md:grid-cols-2">
        <HeroText eyebrow={eyebrow} title={title} subtitle={subtitle} ctaLabel={ctaLabel} ctaTo={ctaTo} align="left" />

        <div className="flex justify-center">
          {imageUrl ? (
            <img src={imageUrl} alt="" className="aspect-square w-full max-w-sm rounded-xl object-cover shadow-lg" />
          ) : variant === 'mockup' && mockupProducts.length > 0 ? (
            <div className="relative w-full max-w-xs">
              {mockupProducts.map((product, index) => (
                <div
                  key={product.id}
                  className="text-forest"
                  style={{
                    transform: index === 0 ? 'rotate(-4deg)' : 'rotate(3deg) translate(24px, 32px)',
                    position: index === 0 ? 'relative' : 'absolute',
                    top: 0,
                    zIndex: mockupProducts.length - index,
                  }}
                >
                  <ProductCard product={product} />
                </div>
              ))}
            </div>
          ) : (
            <img src="/anz_logos/badge.webp" alt="" className="h-56 w-56" />
          )}
        </div>
      </div>
    </section>
  )
}

export default Hero
