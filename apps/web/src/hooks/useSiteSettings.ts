import { useQuery } from '@tanstack/react-query'
import { getSiteSettings } from '@/lib/siteSettingsService'

export const useSiteSettings = () =>
  useQuery({
    queryKey: ['site_settings'],
    queryFn: getSiteSettings,
  })
