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
      <div className={cn('mt-8 flex flex-wrap items-center gap-5', align === 'center' && 'justify-center')}>
        {ctaLabel && ctaTo && (
          <Link to={ctaTo}>
            <Button variant="outline" size="default" className="border-gold text-cream hover:bg-gold/20">
              {ctaLabel}
            </Button>
          </Link>
        )}
        {ctaLabel2 && ctaTo2 && (
          <Link to={ctaTo2} className="text-sm font-medium text-cream underline underline-offset-4 hover:text-lime">
            {ctaLabel2}
          </Link>
        )}
      </div>
    )}
  </div>
)

const SPLIT_GRID_COLS: Record<string, string> = {
  '50-50': 'md:grid-cols-2',
  '60-40': 'md:grid-cols-[3fr_2fr]',
  '40-60': 'md:grid-cols-[2fr_3fr]',
  asymmetric: 'md:grid-cols-2',
  'text-image': 'md:grid-cols-2',
  'text-stats': 'md:grid-cols-2',
}

const SplitVisual = ({ subtype, imageUrl, stats }: { subtype: string; imageUrl?: string | null; stats?: HeroProps['stats'] }) => {
  if (subtype === 'text-stats' && stats && stats.length > 0) {
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

  return (
    <div className={cn('flex justify-center', subtype === 'asymmetric' && 'md:-translate-y-4 md:rotate-2')}>
      {imageUrl ? (
        <img src={imageUrl} alt="" className="aspect-square w-full max-w-sm rounded-xl object-cover shadow-lg" />
      ) : (
        <img src="/anz_logos/badge.webp" alt="" className="h-56 w-56" />
      )}
    </div>
  )
}

const ProductVisual = ({
  subtype,
  imageUrl,
  products,
}: {
  subtype: string
  imageUrl?: string | null
  products?: HeroProps['products']
}) => {
  if (subtype === 'screenshot') {
    return (
      <div className="flex justify-center">
        <img
          src={imageUrl ?? '/anz_logos/badge.webp'}
          alt=""
          className={cn(
            'w-full max-w-sm rounded-xl object-cover shadow-lg',
            imageUrl ? 'aspect-square' : 'h-56 w-56 max-w-none',
          )}
        />
      </div>
    )
  }

  const mockupProducts = products?.slice(0, 2) ?? []

  if (mockupProducts.length === 0) {
    return (
      <div className="flex justify-center">
        <img src="/anz_logos/badge.webp" alt="" className="h-56 w-56" />
      </div>
    )
  }

  return (
    <div className="flex justify-center">
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
    </div>
  )
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

  if (parsed.category === 'minimal') {
    const isWhitespace = subtype === 'whitespace'
    const hasBackgroundPhoto = Boolean(imageUrl)

    return (
      <section
        className={cn(
          'relative overflow-hidden px-4 text-cream',
          !hasBackgroundPhoto && (subtype === 'subtle-background' ? 'bg-gradient-to-br from-forest via-forest to-leaf/30' : 'bg-forest'),
          isWhitespace ? 'py-32 sm:py-40' : 'py-24',
        )}
      >
        {hasBackgroundPhoto && (
          <>
            <img src={imageUrl ?? undefined} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-forest/70" />
          </>
        )}

        <div className={cn('relative mx-auto', subtype === 'editorial' ? 'max-w-4xl' : 'max-w-3xl')}>
          <HeroText
            eyebrow={isWhitespace ? undefined : eyebrow}
            title={title}
            subtitle={subtitle}
            ctaLabel={ctaLabel}
            ctaTo={ctaTo}
            ctaLabel2={ctaLabel2}
            ctaTo2={ctaTo2}
            align="center"
            showCta={subtype !== 'text-only' && subtype !== 'cta-focused'}
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
          {subtype === 'cta-focused' && (ctaLabel || ctaLabel2) && (
            <div className="mt-4 flex flex-wrap items-center justify-center gap-5">
              {ctaLabel && ctaTo && (
                <Link to={ctaTo}>
                  <Button size="default" className="bg-gold px-8 py-3 text-forest hover:opacity-90">
                    {ctaLabel}
                  </Button>
                </Link>
              )}
              {ctaLabel2 && ctaTo2 && (
                <Link to={ctaTo2} className="text-sm font-medium text-cream underline underline-offset-4 hover:text-lime">
                  {ctaLabel2}
                </Link>
              )}
            </div>
          )}
        </div>
      </section>
    )
  }

  return (
    <section className="bg-forest px-4 py-20 text-cream">
      <div className={cn('mx-auto grid max-w-5xl grid-cols-1 items-center gap-10', SPLIT_GRID_COLS[subtype] ?? 'md:grid-cols-2')}>
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

        {parsed.category === 'split' ? (
          <SplitVisual subtype={subtype} imageUrl={imageUrl} stats={stats} />
        ) : (
          <ProductVisual subtype={subtype} imageUrl={imageUrl} products={products} />
        )}
      </div>
    </section>
  )
}

export default Hero
