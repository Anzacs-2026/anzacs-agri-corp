export interface Product {
  id: string
  name: string
  slug: string
  category: string
  short_description: string | null
  description: string | null
  specs: Record<string, string> | null
  traits: string[] | null
  visible: boolean
  sort_order: number
  primary_photo_id: string | null
  created_at: string
  deleted_at: string | null
  deleted_by: string | null
}

export interface ProductInput {
  name: string
  slug: string
  category: string
  short_description: string
  description: string
  specs: Record<string, string>
  traits: string[]
  visible: boolean
}
