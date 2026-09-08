import { useQuery } from '@tanstack/react-query'
import { productService } from '../services/productService'

export const useProduct = (slug: string) =>
  useQuery({
    queryKey: ['products', slug],
    queryFn: () => productService.getProductBySlug(slug),
    enabled: Boolean(slug),
  })

export const useRelatedProducts = (category: string | undefined, excludeId: string | undefined) =>
  useQuery({
    queryKey: ['products', 'related', category, excludeId],
    queryFn: () => productService.getRelatedProducts(category as string, excludeId as string),
    enabled: Boolean(category && excludeId),
  })
