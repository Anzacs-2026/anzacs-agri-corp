import { supabase } from '@/lib/supabase'
import { withActiveOnly } from '@/lib/withActiveOnly'
import { resizeImage } from '@/lib/resizeImage'
import type { Testimonial, TestimonialInput } from '../types'

export const testimonialService = {
  getShownTestimonials: async (): Promise<Testimonial[]> => {
    const { data, error } = await withActiveOnly(supabase.from('testimonials').select('*'))
      .eq('shown', true)
      .order('created_at', { ascending: false })

    if (error) throw error
    return data as Testimonial[]
  },

  getAllTestimonialsAdmin: async (): Promise<Testimonial[]> => {
    const { data, error } = await withActiveOnly(supabase.from('testimonials').select('*')).order('created_at', {
      ascending: false,
    })

    if (error) throw error
    return data as Testimonial[]
  },

  createTestimonial: async (input: TestimonialInput & { photo_url?: string | null }): Promise<Testimonial> => {
    const { data, error } = await supabase.from('testimonials').insert(input).select().single()

    if (error) throw error
    return data as Testimonial
  },

  updateTestimonial: async (id: string, input: TestimonialInput): Promise<void> => {
    const { error } = await supabase.from('testimonials').update(input).eq('id', id)

    if (error) throw error
  },

  toggleShown: async (id: string, current: boolean): Promise<void> => {
    const { error } = await supabase.from('testimonials').update({ shown: !current }).eq('id', id)

    if (error) throw error
  },

  uploadTestimonialPhoto: async (file: File): Promise<string> => {
    const resized = await resizeImage(file)
    const path = `testimonials/${Date.now()}.jpg`

    const { error } = await supabase.storage.from('product-images').upload(path, resized, {
      contentType: 'image/jpeg',
    })
    if (error) throw error

    return supabase.storage.from('product-images').getPublicUrl(path).data.publicUrl
  },

  softDeleteTestimonial: async (id: string, userId: string): Promise<void> => {
    const { error } = await supabase
      .from('testimonials')
      .update({ deleted_at: new Date().toISOString(), deleted_by: userId })
      .eq('id', id)

    if (error) throw error
  },
}
