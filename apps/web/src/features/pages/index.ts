export { pageContentService } from './services/pageContentService'
export { usePageContent, useUpsertPageContent } from './hooks/usePageContent'
export {
  SECTION_KEYS,
  HERO_CATEGORIES,
  HERO_SUBTYPES,
  HERO_CATEGORY_LABELS,
  HERO_SUBTYPE_LABELS,
  parseHeroVariant,
} from './types'
export type { PageContent, PageName, HeroCategory, HeroVariant } from './types'

export const getSectionText = (sections: { section_key: string; content: { text: string } }[] | undefined, key: string, fallback: string): string => {
  const section = sections?.find((s) => s.section_key === key)
  return section?.content.text ?? fallback
}
