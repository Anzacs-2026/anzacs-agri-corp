import { supabase } from '@/lib/supabase'
import { withActiveOnly } from '@/lib/withActiveOnly'
import { resizeImage } from '@/lib/resizeImage'
import type { Photo } from '../types'

export const photoService = {
  getPublicUrl: (storagePath: string): string => supabase.storage.from('product-images').getPublicUrl(storagePath).data.publicUrl,

  getAllPhotosAdmin: async (): Promise<Photo[]> => {
    const { data, error } = await withActiveOnly(supabase.from('photos').select('*')).order('sort_order')

    if (error) throw error
    return data as Photo[]
  },

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

  updatePhotoLabel: async (id: string, label: string): Promise<void> => {
    const { error } = await supabase.from('photos').update({ label }).eq('id', id)

    if (error) throw error
  },

  softDeletePhoto: async (id: string, userId: string): Promise<void> => {
    const { error } = await supabase
      .from('photos')
      .update({ deleted_at: new Date().toISOString(), deleted_by: userId })
      .eq('id', id)

    if (error) throw error
  },
}
