import { supabase } from '@/lib/supabase'
import { withActiveOnly } from '@/lib/withActiveOnly'
import type { PageContent, PageName } from '../types'

export const pageContentService = {
  getPageContent: async (page: PageName): Promise<PageContent[]> => {
    const { data, error } = await withActiveOnly(supabase.from('page_content').select('*').eq('page', page))

    if (error) throw error
    return data as PageContent[]
  },

  upsertPageContent: async (page: PageName, sectionKey: string, content: { text: string }): Promise<void> => {
    const { error } = await supabase
      .from('page_content')
      .upsert({ page, section_key: sectionKey, content }, { onConflict: 'page,section_key' })

    if (error) throw error
  },
}
