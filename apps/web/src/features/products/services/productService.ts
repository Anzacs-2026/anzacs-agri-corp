import { supabase } from '@/lib/supabase'
import { withActiveOnly } from '@/lib/withActiveOnly'
import { resizeImage } from '@/lib/resizeImage'
import type { Product, ProductInput } from '../types'

export const productService = {
  getVisibleProducts: async (): Promise<Product[]> => {
    const { data, error } = await withActiveOnly(supabase.from('products').select('*').eq('visible', true)).order(
      'sort_order',
    )

    if (error) throw error
    return data as Product[]
  },

  getProductBySlug: async (slug: string): Promise<Product> => {
    const { data, error } = await withActiveOnly(supabase.from('products').select('*').eq('slug', slug)).single()

    if (error) throw error
    return data as Product
  },

  getRelatedProducts: async (category: string, excludeId: string): Promise<Product[]> => {
    const { data, error } = await withActiveOnly(
      supabase.from('products').select('*').eq('category', category).eq('visible', true).neq('id', excludeId),
    )
      .order('sort_order')
      .limit(4)

    if (error) throw error
    return data as Product[]
  },

  getProductByIdAdmin: async (id: string): Promise<Product> => {
    const { data, error } = await supabase.from('products').select('*').eq('id', id).single()

    if (error) throw error
    return data as Product
  },

  getAllProductsAdmin: async (): Promise<Product[]> => {
    const { data, error } = await withActiveOnly(supabase.from('products').select('*')).order('sort_order')

    if (error) throw error
    return data as Product[]
  },

  createProduct: async (input: ProductInput): Promise<Product> => {
    const { data, error } = await supabase.from('products').insert(input).select().single()

    if (error) throw error
    return data as Product
  },

  updateProduct: async (id: string, input: ProductInput): Promise<Product> => {
    const { data, error } = await supabase.from('products').update(input).eq('id', id).select().single()

    if (error) throw error
    return data as Product
  },

  softDeleteProduct: async (id: string, userId: string): Promise<void> => {
    const { error } = await supabase
      .from('products')
      .update({ deleted_at: new Date().toISOString(), deleted_by: userId })
      .eq('id', id)

    if (error) throw error
  },

  uploadProductPhoto: async (productId: string, file: File): Promise<string> => {
    const resized = await resizeImage(file)
    const path = `${productId}/${Date.now()}.jpg`

    const { error } = await supabase.storage.from('product-images').upload(path, resized, {
      contentType: 'image/jpeg',
    })

    if (error) throw error
    return path
  },

  attachPhoto: async (productId: string, storagePath: string): Promise<string> => {
    const { data, error } = await supabase
      .from('photos')
      .insert({ product_id: productId, storage_path: storagePath })
      .select('id')
      .single()

    if (error) throw error
    return data.id as string
  },

  setPrimaryPhoto: async (productId: string, photoId: string): Promise<void> => {
    const { error } = await supabase.from('products').update({ primary_photo_id: photoId }).eq('id', productId)

    if (error) throw error
  },
}
