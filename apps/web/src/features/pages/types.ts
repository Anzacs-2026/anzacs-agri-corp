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
  'hero_cta_label',
  'hero_cta_link',
  'hero_cta_label2',
  'hero_cta_link2',
]

export const SECTION_KEYS: Record<PageName, string[]> = {
  home: [...HERO_KEYS, 'intro'],
  about: [...HERO_KEYS, 'who_we_are', 'core_capabilities', 'market_position', 'philosophy', 'why_anz', 'future_direction'],
  contact: ['intro'],
  products: [...HERO_KEYS],
}

export const HERO_CATEGORIES = ['split', 'mockup', 'minimal'] as const
export type HeroCategory = (typeof HERO_CATEGORIES)[number]

export const HERO_SUBTYPES: Record<HeroCategory, string[]> = {
  split: ['50-50', '60-40', '40-60', 'asymmetric', 'text-image', 'text-illustration', 'text-video', 'text-stats'],
  mockup: ['floating-ui', 'screenshot', 'desktop', 'mobile', 'desktop-mobile', 'dashboard', 'browser', '3d'],
  minimal: [
    'centered',
    'typography-led',
    'cta-focused',
    'text-only',
    'subtle-background',
    'small-visual',
    'editorial',
    'whitespace',
  ],
}

export const HERO_CATEGORY_LABELS: Record<HeroCategory, string> = {
  split: 'Split Hero',
  mockup: 'Product Hero',
  minimal: 'Minimal Hero',
}

export const HERO_SUBTYPE_LABELS: Record<string, string> = {
  '50-50': '50/50 Split',
  '60-40': '60/40 Split',
  '40-60': '40/60 Split',
  asymmetric: 'Asymmetric Split',
  'text-image': 'Text + Image',
  'text-illustration': 'Text + Illustration',
  'text-video': 'Text + Video',
  'text-stats': 'Text + Stats',
  'floating-ui': 'Floating UI',
  screenshot: 'Product Screenshot',
  desktop: 'Desktop Mockup',
  mobile: 'Mobile Mockup',
  'desktop-mobile': 'Desktop + Mobile',
  dashboard: 'Dashboard Mockup',
  browser: 'Browser Mockup',
  '3d': '3D Product Mockup',
  centered: 'Centered Minimal',
  'typography-led': 'Typography-led',
  'cta-focused': 'CTA-focused',
  'text-only': 'Text-only',
  'subtle-background': 'Text + Subtle Background',
  'small-visual': 'Text + Small Visual',
  editorial: 'Editorial Minimal',
  whitespace: 'Whitespace Hero',
}

export interface HeroVariant {
  category: HeroCategory
  subtype: string
}

export const parseHeroVariant = (value: string): HeroVariant => {
  const [category, subtype] = value.split(':')
  if ((HERO_CATEGORIES as readonly string[]).includes(category)) {
    const validCategory = category as HeroCategory
    const subtypes = HERO_SUBTYPES[validCategory]
    return { category: validCategory, subtype: subtypes.includes(subtype) ? subtype : subtypes[0] }
  }
  return { category: 'minimal', subtype: 'centered' }
}
