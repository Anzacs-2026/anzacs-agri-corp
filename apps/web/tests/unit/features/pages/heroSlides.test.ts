import { parseHeroSlides, stringifyHeroSlides, emptyHeroSlide } from '@/features/pages/heroSlides'

describe('heroSlides', () => {
  it('returns an empty array for an empty string', () => {
    expect(parseHeroSlides('')).toEqual([])
  })

  it('returns an empty array for malformed JSON', () => {
    expect(parseHeroSlides('not json')).toEqual([])
  })

  it('returns an empty array when the JSON is not an array', () => {
    expect(parseHeroSlides('{"foo":"bar"}')).toEqual([])
  })

  it('coerces missing/non-string fields to empty strings', () => {
    const result = parseHeroSlides('[{"title":"Hello","extra":123}]')
    expect(result).toEqual([{ ...emptyHeroSlide(), title: 'Hello' }])
  })

  it('round-trips through stringify/parse', () => {
    const slides = [{ ...emptyHeroSlide(), title: 'Slide One' }, { ...emptyHeroSlide(), title: 'Slide Two' }]
    expect(parseHeroSlides(stringifyHeroSlides(slides))).toEqual(slides)
  })
})
