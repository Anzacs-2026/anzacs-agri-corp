const OVERRIDES: Record<string, string> = {
  hero_variant: 'Hero Style',
  hero_title: 'Hero Title',
  hero_subtitle: 'Hero Subtitle',
  hero_image: 'Hero Image',
  hero_cta_label: 'Button Text',
  hero_cta_link: 'Button Link',
  intro: 'Introduction',
  body: 'Page Body',
  who_we_are: 'Who We Are',
  core_capabilities: 'Core Capabilities',
  market_position: 'Market Position',
  philosophy: 'Philosophy',
  why_anz: 'Why ANZ',
  future_direction: 'Future Direction',
}

export const humanizeKey = (key: string): string => {
  if (OVERRIDES[key]) return OVERRIDES[key]

  return key
    .split('_')
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
