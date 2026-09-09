import { supabase } from './supabase'

export interface PublicSiteSettings {
  testimonials_enabled: boolean
  whatsapp_number: string | null
  contact_phone: string | null
  contact_address: string | null
  enquiry_subjects: string[]
}

export const getSiteSettings = async (): Promise<PublicSiteSettings> => {
  const { data, error } = await supabase
    .from('site_settings')
    .select('testimonials_enabled, whatsapp_number, contact_phone, contact_address, enquiry_subjects')
    .single()

  if (error) {
    throw error
  }

  return data
}

export const getSiteSettingsIdAdmin = async (): Promise<string> => {
  const { data, error } = await supabase.from('site_settings').select('id').single()

  if (error) throw error
  return data.id as string
}

export const updateTestimonialsEnabled = async (enabled: boolean): Promise<void> => {
  const id = await getSiteSettingsIdAdmin()
  const { error } = await supabase.from('site_settings').update({ testimonials_enabled: enabled }).eq('id', id)

  if (error) throw error
}
