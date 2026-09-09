export type PageName = 'home' | 'about' | 'contact' | 'products'

export interface PageContent {
  id: string
  page: PageName
  section_key: string
  content: { text: string }
  created_at: string
  deleted_at: string | null
  deleted_by: string | null
}

const HERO_KEYS = [
  'hero_variant',
  'hero_title',
  'hero_subtitle',
  'hero_image',
  'hero_parallax',
  'hero_cta_label',
  'hero_cta_link',
  'hero_cta_label2',
  'hero_cta_link2',
  'hero_slides',
]

export const SECTION_KEYS: Record<PageName, string[]> = {
  home: [
    ...HERO_KEYS,
    'intro',
    'features_enabled',
    'features_title',
    'features',
    'stats_enabled',
    'stats_title',
    'stats',
  ],
  about: [...HERO_KEYS, 'who_we_are', 'core_capabilities', 'market_position', 'philosophy', 'why_anz', 'future_direction'],
  contact: ['intro'],
  products: [...HERO_KEYS],
}

// A hero slide as stored in page_content: 'hero_slides' content.text holds
// JSON.stringify(HeroSlideContent[]) — storage paths and raw strings only,
// nothing resolved to a public URL (that happens where it's consumed).
export interface HeroSlideContent {
  imagePath: string
  eyebrow: string
  title: string
  subtitle: string
  ctaLabel: string
  ctaTo: string
  ctaLabel2: string
  ctaTo2: string
}

// Hero has two layouts: same full-bleed banner photo behind the text,
// differing only in text alignment.
export const HERO_STYLES = ['banner-left', 'banner-center'] as const
export type HeroStyle = (typeof HERO_STYLES)[number]

export const HERO_STYLE_LABELS: Record<HeroStyle, string> = {
  'banner-left': 'Banner (left-aligned)',
  'banner-center': 'Minimal (centered)',
}

export const isHeroStyle = (value: string): value is HeroStyle => (HERO_STYLES as readonly string[]).includes(value)
