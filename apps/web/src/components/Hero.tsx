import { Link } from 'react-router-dom'
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
    <div className={cn('relative flex h-full items-center overflow-hidden px-4 py-24 text-cream', !hasPhoto && 'bg-forest')}>
      {hasPhoto &&
        (hasParallax ? (
          <div className="absolute inset-0 bg-fixed bg-cover bg-center" style={{ backgroundImage: `url(${slide.imageUrl})` }} />
        ) : (
          <img src={slide.imageUrl ?? undefined} alt="" className="absolute inset-0 h-full w-full object-cover" />
        ))}
      {hasPhoto && <div className="absolute inset-0 bg-forest/70" />}

      <div className={cn('relative mx-auto w-full', align === 'center' ? 'max-w-3xl text-center' : 'max-w-2xl text-left')}>
        {slide.eyebrow && <span className="text-xs font-medium uppercase tracking-[0.2em] text-lime">{slide.eyebrow}</span>}
        <h1 className="mt-3 font-serif text-4xl leading-tight text-cream sm:text-5xl">{slide.title}</h1>
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
      showDots={slides.length > 1}
      className="min-h-[520px] sm:min-h-[580px]"
      renderItem={(slide) => <HeroSlideLayer slide={slide} align={align} parallax={parallax} />}
    />
  )
}

export default Hero
