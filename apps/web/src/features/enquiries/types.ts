export type EnquiryStatus = 'new' | 'in_progress' | 'done'

export interface Enquiry {
  id: string
  name: string
  email: string
  phone: string
  subject: string
  message: string
  status: EnquiryStatus
  created_at: string
}

export interface EnquiryInput {
  name: string
  email: string
  phone: string
  subject: string
  message: string
}
