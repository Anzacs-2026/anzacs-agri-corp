export type PageName = 'home' | 'about' | 'contact'

export interface PageContent {
  id: string
  page: PageName
  section_key: string
  content: { text: string }
  created_at: string
  deleted_at: string | null
  deleted_by: string | null
}

const HERO_KEYS = ['hero_variant', 'hero_title', 'hero_subtitle', 'hero_image', 'hero_cta_label', 'hero_cta_link']

export const SECTION_KEYS: Record<PageName, string[]> = {
  home: [...HERO_KEYS, 'intro'],
  about: [...HERO_KEYS, 'who_we_are', 'core_capabilities', 'market_position', 'philosophy', 'why_anz', 'future_direction'],
  contact: ['intro'],
}

export const HERO_VARIANTS = ['split', 'mockup', 'minimal'] as const
export type HeroVariantOption = (typeof HERO_VARIANTS)[number]
