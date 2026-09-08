import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { productService } from '../services/productService'
import { useAuth } from '@/features/auth'
import type { ProductInput } from '../types'

export const useAdminProducts = () =>
  useQuery({
    queryKey: ['admin', 'products'],
    queryFn: productService.getAllProductsAdmin,
  })

export const useAdminProduct = (id: string | undefined) =>
  useQuery({
    queryKey: ['admin', 'products', id],
    queryFn: () => productService.getProductByIdAdmin(id as string),
    enabled: Boolean(id),
  })

export const useCreateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: (input: ProductInput) => productService.createProduct(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }),
  })
}

export const useUpdateProduct = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: ProductInput }) => productService.updateProduct(id, input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }),
  })
}

export const useSoftDeleteProduct = () => {
  const queryClient = useQueryClient()
  const { user } = useAuth()

  return useMutation({
    mutationFn: (id: string) => productService.softDeleteProduct(id, user?.id ?? ''),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['admin', 'products'] }),
  })
}
