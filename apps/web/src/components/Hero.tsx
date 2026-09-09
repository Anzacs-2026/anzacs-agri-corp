import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import ProductCard from '@/features/products/components/ProductCard'
import { parseHeroVariant } from '@/features/pages'
import type { Product } from '@/features/products'

interface HeroProps {
  variant: string
  eyebrow?: string
  title: string
  subtitle: string
  ctaLabel?: string
  ctaTo?: string
  ctaLabel2?: string
  ctaTo2?: string
  imageUrl?: string | null
  products?: Pick<Product, 'id' | 'name' | 'slug' | 'category' | 'short_description' | 'primary_photo'>[]
  stats?: { label: string; value: string }[]
}

// Sub-types that assume assets this site doesn't have (device frames, 3D
// renders, video, illustration) fall back to the nearest buildable
// sub-type in the same category, so every option in the admin menu is
// selectable and renders something coherent.
const FALLBACK_SUBTYPE: Record<string, string> = {
  'text-illustration': 'text-image',
  'text-video': 'text-image',
  desktop: 'floating-ui',
  mobile: 'floating-ui',
  'desktop-mobile': 'floating-ui',
  dashboard: 'floating-ui',
  browser: 'floating-ui',
  '3d': 'floating-ui',
}

const HeroText = ({
  eyebrow,
  title,
  subtitle,
  ctaLabel,
  ctaTo,
  ctaLabel2,
  ctaTo2,
  align,
  showCta = true,
  titleClassName,
  subtitleClassName,
  eyebrowClassName,
}: Pick<HeroProps, 'eyebrow' | 'title' | 'subtitle' | 'ctaLabel' | 'ctaTo' | 'ctaLabel2' | 'ctaTo2'> & {
  align: 'center' | 'left'
  showCta?: boolean
  titleClassName?: string
  subtitleClassName?: string
  eyebrowClassName?: string
}) => (
  <div className={align === 'center' ? 'text-center' : 'text-left'}>
    {eyebrow && (
      <span className={cn('text-xs font-medium uppercase tracking-[0.2em] text-lime', eyebrowClassName)}>
        {eyebrow}
      </span>
    )}
    <h1 className={cn('mt-3 font-serif text-4xl leading-tight text-cream sm:text-5xl', titleClassName)}>{title}</h1>
    <p className={cn('mt-4 max-w-xl text-cream/80', align === 'center' && 'mx-auto', subtitleClassName)}>
      {subtitle}
    </p>
    {showCta && (ctaLabel || ctaLabel2) && (
      <div className={cn('mt-8 flex flex-wrap items-center gap-4', align === 'center' && 'justify-center')}>
        {ctaLabel && ctaTo && (
          <Link to={ctaTo}>
            <Button size="default" className="bg-gold text-forest hover:opacity-90">
              {ctaLabel}
            </Button>
          </Link>
        )}
        {ctaLabel2 && ctaTo2 && (
          <Link to={ctaTo2}>
            <Button variant="outline" size="default" className="border-cream/60 text-cream hover:bg-cream/10">
              {ctaLabel2}
            </Button>
          </Link>
        )}
      </div>
    )}
  </div>
)

const NoPhotoVisual = ({
  category,
  subtype,
  products,
  stats,
}: {
  category: 'split' | 'mockup'
  subtype: string
  products?: HeroProps['products']
  stats?: HeroProps['stats']
}) => {
  if (category === 'split' && subtype === 'text-stats' && stats && stats.length > 0) {
    return (
      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat) => (
          <div key={stat.label} className="rounded-xl border border-cream/20 bg-cream/5 p-5 text-center">
            <div className="font-serif text-3xl text-lime">{stat.value}</div>
            <div className="mt-1 text-xs uppercase tracking-wide text-cream/70">{stat.label}</div>
          </div>
        ))}
      </div>
    )
  }

  const mockupProducts = category === 'mockup' ? (products?.slice(0, 2) ?? []) : []

  if (mockupProducts.length > 0) {
    return (
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
    )
  }

  return <img src="/anz_logos/badge.webp" alt="" className="h-56 w-56" />
}

const Hero = ({
  variant,
  eyebrow,
  title,
  subtitle,
  ctaLabel,
  ctaTo,
  ctaLabel2,
  ctaTo2,
  imageUrl,
  products,
  stats,
}: HeroProps) => {
  const parsed = parseHeroVariant(variant)
  const subtype = FALLBACK_SUBTYPE[parsed.subtype] ?? parsed.subtype

  // A real photo always renders as a full-bleed banner (image behind the
  // text, not a side-by-side card) — the one exception is Split's
  // "Text + Stats" sub-type, which shows data, not a photo, regardless.
  const isBannerable = !(parsed.category === 'split' && subtype === 'text-stats')
  const hasBackgroundPhoto = Boolean(imageUrl) && isBannerable

  if (parsed.category === 'minimal' || hasBackgroundPhoto) {
    const isWhitespace = parsed.category === 'minimal' && subtype === 'whitespace'
    const align = parsed.category === 'minimal' ? 'center' : 'left'

    return (
      <section
        className={cn(
          'relative overflow-hidden px-4 text-cream',
          !hasBackgroundPhoto &&
            (subtype === 'subtle-background' ? 'bg-gradient-to-br from-forest via-forest to-leaf/30' : 'bg-forest'),
          isWhitespace ? 'py-32 sm:py-40' : 'py-24',
        )}
      >
        {hasBackgroundPhoto && (
          <>
            <img src={imageUrl ?? undefined} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-forest/70" />
          </>
        )}

        <div
          className={cn(
            'relative mx-auto',
            align === 'center' ? (subtype === 'editorial' ? 'max-w-4xl' : 'max-w-3xl') : 'max-w-2xl',
          )}
        >
          <HeroText
            eyebrow={isWhitespace ? undefined : eyebrow}
            title={title}
            subtitle={subtitle}
            ctaLabel={ctaLabel}
            ctaTo={ctaTo}
            ctaLabel2={ctaLabel2}
            ctaTo2={ctaTo2}
            align={align}
            showCta={subtype !== 'text-only'}
            eyebrowClassName={subtype === 'editorial' ? 'tracking-[0.35em]' : undefined}
            titleClassName={cn(
              subtype === 'typography-led' && 'text-5xl sm:text-6xl md:text-7xl',
              subtype === 'editorial' && 'font-normal',
            )}
            subtitleClassName={subtype === 'typography-led' ? 'text-cream/60' : undefined}
          />
          {subtype === 'small-visual' && !hasBackgroundPhoto && (
            <img src="/anz_logos/badge.webp" alt="" className="mx-auto mt-6 h-16 w-16" />
          )}
        </div>
      </section>
    )
  }

  // No photo: split (text-stats) or mockup (floating product cards / badge fallback)
  return (
    <section className="bg-forest px-4 py-20 text-cream">
      <div className="mx-auto grid max-w-5xl grid-cols-1 items-center gap-10 md:grid-cols-2">
        <HeroText
          eyebrow={eyebrow}
          title={title}
          subtitle={subtitle}
          ctaLabel={ctaLabel}
          ctaTo={ctaTo}
          ctaLabel2={ctaLabel2}
          ctaTo2={ctaTo2}
          align="left"
        />
        <div className="flex justify-center">
          <NoPhotoVisual category={parsed.category === 'split' ? 'split' : 'mockup'} subtype={subtype} products={products} stats={stats} />
        </div>
      </div>
    </section>
  )
}

export default Hero
