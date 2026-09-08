import { useNavigate, useParams } from 'react-router-dom'
import { ProductForm, productService, useCreateProduct, useUpdateProduct } from '@/features/products'
import { useAdminProduct } from '@/features/products/hooks/useAdminProducts'
import type { ProductInput } from '@/features/products'

const AdminProductForm = () => {
  const { id } = useParams<{ id: string }>()
  const isEditing = Boolean(id)
  const { data: existing, isLoading } = useAdminProduct(isEditing ? id : undefined)
  const createProduct = useCreateProduct()
  const updateProduct = useUpdateProduct()
  const navigate = useNavigate()

  const handleSubmit = async (input: ProductInput, photoFile: File | null) => {
    const product = isEditing
      ? await updateProduct.mutateAsync({ id: id as string, input })
      : await createProduct.mutateAsync(input)

    if (photoFile) {
      const path = await productService.uploadProductPhoto(product.id, photoFile)
      const photoId = await productService.attachPhoto(product.id, path)
      await productService.setPrimaryPhoto(product.id, photoId)
    }

    navigate('/admin/products')
  }

  if (isEditing && isLoading) {
    return <p className="py-16 text-center text-forest/60">Loading…</p>
  }

  return (
    <div className="px-4">
      <h1 className="pt-8 text-center text-2xl font-bold">{isEditing ? 'Edit product' : 'Add product'}</h1>
      <ProductForm
        onSubmit={handleSubmit}
        submitting={createProduct.isPending || updateProduct.isPending}
        initialValues={
          existing
            ? {
                name: existing.name,
                slug: existing.slug,
                category: existing.category,
                short_description: existing.short_description ?? '',
                description: existing.description ?? '',
                specs: existing.specs ?? {},
                traits: existing.traits ?? [],
                visible: existing.visible,
              }
            : undefined
        }
      />
    </div>
  )
}

export default AdminProductForm
