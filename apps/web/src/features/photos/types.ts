export interface Photo {
  id: string
  storage_path: string
  label: string | null
  alt_text: string | null
  product_id: string | null
  page: string | null
  sort_order: number
  created_at: string
  deleted_at: string | null
  deleted_by: string | null
}
