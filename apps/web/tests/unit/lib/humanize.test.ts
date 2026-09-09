import { humanizeKey } from '@/lib/humanize'

describe('humanizeKey', () => {
  it('uses the override map for known section keys', () => {
    expect(humanizeKey('hero_title')).toBe('Hero Title')
    expect(humanizeKey('hero_subtitle')).toBe('Hero Subtitle')
    expect(humanizeKey('intro')).toBe('Introduction')
    expect(humanizeKey('body')).toBe('Page Body')
  })

  it('title-cases unknown snake_case keys as a fallback', () => {
    expect(humanizeKey('some_key')).toBe('Some Key')
    expect(humanizeKey('footer_note')).toBe('Footer Note')
  })
})
