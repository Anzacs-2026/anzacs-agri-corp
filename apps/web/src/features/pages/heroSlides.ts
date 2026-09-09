import type { HeroSlideContent } from './types'

export const emptyHeroSlide = (): HeroSlideContent => ({
  imagePath: '',
  eyebrow: '',
  title: '',
  subtitle: '',
  ctaLabel: '',
  ctaTo: '',
  ctaLabel2: '',
  ctaTo2: '',
})

const str = (value: unknown): string => (typeof value === 'string' ? value : '')

const coerceSlide = (raw: unknown): HeroSlideContent => {
  const r = (raw ?? {}) as Partial<HeroSlideContent>
  return {
    imagePath: str(r.imagePath),
    eyebrow: str(r.eyebrow),
    title: str(r.title),
    subtitle: str(r.subtitle),
    ctaLabel: str(r.ctaLabel),
    ctaTo: str(r.ctaTo),
    ctaLabel2: str(r.ctaLabel2),
    ctaTo2: str(r.ctaTo2),
  }
}

export const parseHeroSlides = (text: string): HeroSlideContent[] => {
  if (!text) return []
  try {
    const parsed = JSON.parse(text)
    if (!Array.isArray(parsed)) return []
    return parsed.map(coerceSlide)
  } catch {
    return []
  }
}

export const stringifyHeroSlides = (slides: HeroSlideContent[]): string => JSON.stringify(slides)
