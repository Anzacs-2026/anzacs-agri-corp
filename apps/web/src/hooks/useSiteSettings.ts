import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { getSiteSettings, updateContactSettings, type ContactSettingsInput } from '@/lib/siteSettingsService'

export const useSiteSettings = () =>
  useQuery({
    queryKey: ['site_settings'],
    queryFn: getSiteSettings,
  })

export const useUpdateContactSettings = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ContactSettingsInput) => updateContactSettings(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['site_settings'] }),
  })
}
