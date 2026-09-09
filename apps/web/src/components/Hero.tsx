import { Link } from 'react-router-dom'
import { CheckCircle2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { isHeroStyle } from '@/features/pages'
import Carousel from '@/components/Carousel'

export interface HeroSlide {
  imageUrl: string | null
  eyebrow?: string
  title: string
  subtitle: string
  ctaLabel?: string
  ctaTo?: string
  ctaLabel2?: string
  ctaTo2?: string
  tags?: string[]
}

interface HeroProps {
  variant: string
  slides: HeroSlide[]
  parallax?: boolean
}

const HeroSlideLayer = ({ slide, align, parallax }: { slide: HeroSlide; align: 'center' | 'left'; parallax?: boolean }) => {
  const hasPhoto = Boolean(slide.imageUrl)
  const hasParallax = hasPhoto && parallax

  return (
    <div className={cn('absolute inset-0 flex items-center overflow-hidden px-4 pb-28 pt-28 sm:py-24', !hasPhoto && 'bg-forest')}>
      {hasPhoto &&
        (hasParallax ? (
          <div className="absolute inset-0 bg-fixed bg-cover bg-center" style={{ backgroundImage: `url(${slide.imageUrl})` }} />
        ) : (
          <img src={slide.imageUrl ?? undefined} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ))}
      {hasPhoto && <div className="absolute inset-0 bg-forest/70" />}

      <div className={cn('relative mx-auto w-full', align === 'center' ? 'max-w-3xl text-center' : 'max-w-2xl text-left')}>
        {slide.eyebrow && (
          <span className="inline-block rounded-full bg-lime/20 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-lime">
            {slide.eyebrow}
          </span>
        )}
        <h1 className="mt-3 font-serif text-4xl leading-tight text-cream sm:text-5xl">
          {slide.title.split('\n').map((line, i, lines) => (
            <span key={i} className={cn('block', i === lines.length - 1 && lines.length > 1 && 'text-lime')}>
              {line}
            </span>
          ))}
        </h1>
        <p className={cn('mt-4 max-w-xl text-cream/80', align === 'center' && 'mx-auto')}>{slide.subtitle}</p>

        {(slide.ctaLabel || slide.ctaLabel2) && (
          <div className={cn('mt-8 flex flex-wrap items-center gap-4', align === 'center' && 'justify-center')}>
            {slide.ctaLabel && slide.ctaTo && (
              <Link to={slide.ctaTo}>
                <Button size="default" className="bg-gold text-forest hover:opacity-90">
                  {slide.ctaLabel}
                </Button>
              </Link>
            )}
            {slide.ctaLabel2 && slide.ctaTo2 && (
              <Link to={slide.ctaTo2}>
                <Button variant="outline" size="default" className="border-cream/60 text-cream hover:bg-cream/10">
                  {slide.ctaLabel2}
                </Button>
              </Link>
            )}
          </div>
        )}

        {slide.tags && slide.tags.length > 0 && (
          <div className={cn('mt-5 flex flex-wrap gap-x-5 gap-y-2', align === 'center' && 'justify-center')}>
            {slide.tags.slice(0, 3).map((tag) => (
              <span key={tag} className="inline-flex items-center gap-1.5 text-xs font-medium text-cream/80">
                <CheckCircle2 size={14} className="text-lime" aria-hidden />
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

const Hero = ({ variant, slides, parallax }: HeroProps) => {
  const align = isHeroStyle(variant) && variant === 'banner-center' ? 'center' : 'left'

  if (slides.length === 0) return null

  return (
    <Carousel
      items={slides}
      ariaLabel="Hero banner"
      intervalMs={5500}
      className="min-h-[640px] sm:min-h-[580px]"
      renderItem={(slide) => <HeroSlideLayer slide={slide} align={align} parallax={parallax} />}
      renderNav={
        slides.length > 1
          ? ({ items, index, setIndex }) => (
              <div className="absolute inset-x-0 bottom-0 z-10 flex flex-col gap-2 bg-forest/70 px-4 py-3 sm:flex-row sm:items-center sm:justify-center sm:gap-10">
                {items.map((slide, i) => (
                  <button
                    key={slide.title + i}
                    type="button"
                    onClick={() => setIndex(i)}
                    aria-current={i === index}
                    className="flex items-center gap-3 text-left"
                  >
                    <span
                      className={cn(
                        'flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-sm font-medium transition-colors',
                        i === index ? 'border-cream bg-cream text-forest' : 'border-cream/50 text-cream',
                      )}
                    >
                      {i + 1}
                    </span>
                    <span className={cn('text-sm font-medium transition-colors', i === index ? 'text-cream' : 'text-cream/70')}>
                      {slide.title}
                    </span>
                  </button>
                ))}
              </div>
            )
          : undefined
      }
    />
  )
}

export default Hero
