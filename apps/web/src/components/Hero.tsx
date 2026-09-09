import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { isHeroStyle } from '@/features/pages'

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
}

const Hero = ({ variant, eyebrow, title, subtitle, ctaLabel, ctaTo, ctaLabel2, ctaTo2, imageUrl }: HeroProps) => {
  const align = isHeroStyle(variant) && variant === 'banner-center' ? 'center' : 'left'
  const hasPhoto = Boolean(imageUrl)

  return (
    <section className={cn('relative overflow-hidden px-4 py-24 text-cream', !hasPhoto && 'bg-forest')}>
      {hasPhoto && (
        <>
          <img src={imageUrl ?? undefined} alt="" className="absolute inset-0 h-full w-full object-cover" />
          <div className="absolute inset-0 bg-forest/70" />
        </>
      )}

      <div
        className={cn(
          'relative mx-auto',
          align === 'center' ? 'max-w-3xl text-center' : 'max-w-2xl text-left',
        )}
      >
        {eyebrow && <span className="text-xs font-medium uppercase tracking-[0.2em] text-lime">{eyebrow}</span>}
        <h1 className="mt-3 font-serif text-4xl leading-tight text-cream sm:text-5xl">{title}</h1>
        <p className={cn('mt-4 max-w-xl text-cream/80', align === 'center' && 'mx-auto')}>{subtitle}</p>

        {(ctaLabel || ctaLabel2) && (
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
    </section>
  )
}

export default Hero
