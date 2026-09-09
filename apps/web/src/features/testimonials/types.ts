export interface Testimonial {
  id: string
  customer_name: string
  quote: string
  photo_url: string | null
  shown: boolean
  created_at: string
}

export interface TestimonialInput {
  customer_name: string
  quote: string
}
