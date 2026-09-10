import { supabase } from './supabase'

export interface PublicSiteSettings {
  testimonials_enabled: boolean
  whatsapp_number: string | null
  contact_phone: string | null
  contact_address: string | null
  contact_email: string | null
  map_embed_url: string | null
  social_facebook: string | null
  social_instagram: string | null
  social_twitter: string | null
  social_linkedin: string | null
  social_youtube: string | null
  enquiry_subjects: string[]
}

const PUBLIC_SETTINGS_COLUMNS =
  'testimonials_enabled, whatsapp_number, contact_phone, contact_address, contact_email, map_embed_url, social_facebook, social_instagram, social_twitter, social_linkedin, social_youtube, enquiry_subjects'

export const getSiteSettings = async (): Promise<PublicSiteSettings> => {
  const { data, error } = await supabase.from('site_settings').select(PUBLIC_SETTINGS_COLUMNS).single()

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

export type ContactSettingsInput = Pick<
  PublicSiteSettings,
  | 'whatsapp_number'
  | 'contact_phone'
  | 'contact_address'
  | 'contact_email'
  | 'map_embed_url'
  | 'social_facebook'
  | 'social_instagram'
  | 'social_twitter'
  | 'social_linkedin'
  | 'social_youtube'
>

export const updateContactSettings = async (input: ContactSettingsInput): Promise<void> => {
  const id = await getSiteSettingsIdAdmin()
  const { error } = await supabase.from('site_settings').update(input).eq('id', id)

  if (error) throw error
}
