import { supabase } from '@/lib/supabase'
import { withActiveOnly } from '@/lib/withActiveOnly'
import type { Enquiry, EnquiryInput, EnquiryStatus } from '../types'

export const enquiryService = {
  createEnquiry: async (input: EnquiryInput): Promise<Enquiry> => {
    const { data, error } = await supabase.from('enquiries').insert(input).select().single()

    if (error) throw error
    return data as Enquiry
  },

  getAllEnquiriesAdmin: async (): Promise<Enquiry[]> => {
    const { data, error } = await withActiveOnly(supabase.from('enquiries').select('*')).order('created_at', {
      ascending: false,
    })

    if (error) throw error
    return data as Enquiry[]
  },

  updateEnquiryStatus: async (id: string, status: EnquiryStatus): Promise<void> => {
    const { error } = await supabase.from('enquiries').update({ status }).eq('id', id)

    if (error) throw error
  },

  softDeleteEnquiry: async (id: string, userId: string): Promise<void> => {
    const { error } = await supabase
      .from('enquiries')
      .update({ deleted_at: new Date().toISOString(), deleted_by: userId })
      .eq('id', id)

    if (error) throw error
  },
}
