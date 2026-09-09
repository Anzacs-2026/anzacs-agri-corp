export { pageContentService } from './services/pageContentService'
export { usePageContent, useUpsertPageContent } from './hooks/usePageContent'
export { SECTION_KEYS, HERO_STYLES, HERO_STYLE_LABELS, isHeroStyle, STATS_STYLES, STATS_STYLE_LABELS, isStatsStyle } from './types'
export type { PageContent, PageName, HeroStyle, HeroSlideContent, StatsStyle } from './types'
export { parseHeroSlides, stringifyHeroSlides, emptyHeroSlide, parseHeroTags } from './heroSlides'
export { default as HeroSlidesEditor } from './components/HeroSlidesEditor'

export const getSectionText = (sections: { section_key: string; content: { text: string } }[] | undefined, key: string, fallback: string): string => {
  const section = sections?.find((s) => s.section_key === key)
  return section?.content.text ?? fallback
}
