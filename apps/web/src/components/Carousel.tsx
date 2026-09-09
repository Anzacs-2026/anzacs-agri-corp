import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useCarousel } from '@/hooks/useCarousel'

interface CarouselProps<T> {
  items: T[]
  renderItem: (item: T, index: number, isActive: boolean) => ReactNode
  getKey?: (item: T, index: number) => string | number
  intervalMs?: number
  ariaLabel: string
  className?: string
  dotsClassName?: string
  showDots?: boolean
  dotTone?: 'light' | 'dark'
}

// Absolutely-positioned slides collapse the wrapper's height — the caller
// must give `className` an explicit height (e.g. min-h-[...] or h-64).
const Carousel = <T,>({
  items,
  renderItem,
  getKey = (_item, index) => index,
  intervalMs,
  ariaLabel,
  className,
  dotsClassName,
  showDots = true,
  dotTone = 'light',
}: CarouselProps<T>) => {
  const { index, setIndex, pause, resume } = useCarousel({ length: items.length, intervalMs })

  if (items.length === 0) return null

  if (items.length === 1) {
    return <div className={className}>{renderItem(items[0], 0, true)}</div>
  }

  return (
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions -- pause-on-hover/focus is the intended carousel behavior
    <section
      aria-roledescription="carousel"
      aria-label={ariaLabel}
      className={cn('relative', className)}
      onMouseEnter={pause}
      onMouseLeave={resume}
      onFocus={pause}
      onBlur={resume}
    >
      {items.map((item, i) => (
        <div
          key={getKey(item, i)}
          className={cn('absolute inset-0 transition-opacity duration-700', i === index ? 'opacity-100' : 'pointer-events-none opacity-0')}
          aria-hidden={i !== index}
        >
          {renderItem(item, i, i === index)}
        </div>
      ))}

      {showDots && (
        <div className={cn('absolute inset-x-0 bottom-4 z-10 flex justify-center gap-2', dotsClassName)}>
          {items.map((item, i) => (
            <button
              key={getKey(item, i)}
              type="button"
              aria-label={`Go to slide ${i + 1}`}
              aria-current={i === index}
              onClick={() => setIndex(i)}
              className={cn(
                'h-2 w-2 rounded-full transition-colors',
                dotTone === 'light'
                  ? i === index
                    ? 'bg-cream'
                    : 'bg-cream/40 hover:bg-cream/60'
                  : i === index
                    ? 'bg-forest'
                    : 'bg-forest/30 hover:bg-forest/50',
              )}
            />
          ))}
        </div>
      )}
    </section>
  )
}

export default Carousel
