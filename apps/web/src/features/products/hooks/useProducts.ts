import { useQuery } from '@tanstack/react-query'
import { productService } from '../services/productService'

export const useProducts = () =>
  useQuery({
    queryKey: ['products'],
    queryFn: productService.getVisibleProducts,
  })
