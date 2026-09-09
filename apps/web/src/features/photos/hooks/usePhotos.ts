import { useMutation } from '@tanstack/react-query'
import { photoService } from '../services/photoService'

export const useUploadPhoto = () =>
  useMutation({
    mutationFn: ({ file, page }: { file: File; page?: string }) => photoService.uploadPhoto(file, page),
  })
