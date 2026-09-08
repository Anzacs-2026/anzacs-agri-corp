import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { photoService } from '../services/photoService'
import { useAuth } from '@/features/auth'

export const useAdminPhotos = () =>
  useQuery({
    queryKey: ['admin', 'photos'],
    queryFn: photoService.getAllPhotosAdmin,
  })

export const useUploadPhoto = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ file, page }: { file: File; page?: string }) => photoService.uploadPhoto(file, page),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'photos'] }),
  })
}

export const useUpdatePhotoLabel = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, label }: { id: string; label: string }) => photoService.updatePhotoLabel(id, label),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'photos'] }),
  })
}

export const useSoftDeletePhoto = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (id: string) => photoService.softDeletePhoto(id, user?.id ?? ''),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'photos'] }),
  })
}
