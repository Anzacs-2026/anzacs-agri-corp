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
