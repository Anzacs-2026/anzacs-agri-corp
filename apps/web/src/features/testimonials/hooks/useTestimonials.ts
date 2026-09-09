import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { testimonialService } from '../services/testimonialService'
import { useAuth } from '@/features/auth'
import { useSiteSettings } from '@/hooks/useSiteSettings'
import type { TestimonialInput } from '../types'

export const useShownTestimonials = () => {
  const { data: settings } = useSiteSettings()

  return useQuery({
    queryKey: ['testimonials'],
    queryFn: testimonialService.getShownTestimonials,
    enabled: Boolean(settings?.testimonials_enabled),
  })
}

export const useAdminTestimonials = () =>
  useQuery({
    queryKey: ['admin', 'testimonials'],
    queryFn: testimonialService.getAllTestimonialsAdmin,
  })

export const useCreateTestimonial = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: TestimonialInput & { photo_url?: string | null }) => testimonialService.createTestimonial(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'testimonials'] }),
  })
}

export const useUpdateTestimonial = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: TestimonialInput }) => testimonialService.updateTestimonial(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'testimonials'] }),
  })
}

export const useToggleTestimonialShown = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, current }: { id: string; current: boolean }) => testimonialService.toggleShown(id, current),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'testimonials'] }),
  })
}

export const useSoftDeleteTestimonial = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (id: string) => testimonialService.softDeleteTestimonial(id, user?.id ?? ''),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'testimonials'] }),
  })
}
