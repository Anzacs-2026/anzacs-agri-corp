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

export const SECTION_KEYS: Record<PageName, string[]> = {
  home: ['hero_title', 'hero_subtitle', 'intro'],
  about: ['who_we_are', 'core_capabilities', 'market_position', 'philosophy', 'why_anz', 'future_direction'],
  contact: ['intro'],
}
