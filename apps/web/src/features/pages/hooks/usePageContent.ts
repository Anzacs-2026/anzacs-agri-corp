import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { pageContentService } from '../services/pageContentService'
import type { PageName } from '../types'

export const usePageContent = (page: PageName) =>
  useQuery({
    queryKey: ['pages', page],
    queryFn: () => pageContentService.getPageContent(page),
  })

export const useUpsertPageContent = (page: PageName) => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ sectionKey, content }: { sectionKey: string; content: { text: string } }) =>
      pageContentService.upsertPageContent(page, sectionKey, content),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['pages', page] }),
  })
}
