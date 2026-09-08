import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { enquiryService } from '../services/enquiryService'
import { useAuth } from '@/features/auth'
import type { EnquiryStatus } from '../types'

export const useAdminEnquiries = () =>
  useQuery({
    queryKey: ['admin', 'enquiries'],
    queryFn: enquiryService.getAllEnquiriesAdmin,
  })

export const useUpdateEnquiryStatus = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, status }: { id: string; status: EnquiryStatus }) =>
      enquiryService.updateEnquiryStatus(id, status),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'enquiries'] }),
  })
}

export const useSoftDeleteEnquiry = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (id: string) => enquiryService.softDeleteEnquiry(id, user?.id ?? ''),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'enquiries'] }),
  })
}
