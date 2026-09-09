import { supabase } from '@/lib/supabase'
import { resizeImage } from '@/lib/resizeImage'
import type { Photo } from '../types'

export const photoService = {
  getPublicUrl: (storagePath: string): string =>
    supabase.storage.from('product-images').getPublicUrl(storagePath).data.publicUrl,

  uploadPhoto: async (file: File, page?: string): Promise<Photo> => {
    const resized = await resizeImage(file)
    const path = `pages/${Date.now()}.jpg`

    const { error: uploadError } = await supabase.storage.from('product-images').upload(path, resized, {
      contentType: 'image/jpeg',
    })
    if (uploadError) throw uploadError

    const { data, error } = await supabase
      .from('photos')
      .insert({ storage_path: path, page: page ?? null })
      .select()
      .single()

    if (error) throw error
    return data as Photo
  },
}
