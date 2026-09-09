import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { useAdminProducts, useSoftDeleteProduct, useUpdateProduct } from '../../hooks/useAdminProducts'

const ProductAdminList = () => {
  const { data: products, isLoading } = useAdminProducts()
  const softDelete = useSoftDeleteProduct()
  const update = useUpdateProduct()

  const toggleVisible = (id: string, current: boolean, rest: Parameters<typeof update.mutate>[0]['input']) => {
    update.mutate({ id, input: { ...rest, visible: !current } })
  }

  if (isLoading) return <p className="text-forest/60">Loading…</p>

  return (
    <div className="mx-auto max-w-4xl">
      <AdminPageHeader
        title="Products"
        description="Manage what appears in the public catalog."
        action={
          <Link to="/admin/products/new">
            <Button>Add product</Button>
          </Link>
        }
      />

      <div className="overflow-hidden rounded-xl border border-forest/10 bg-white shadow-sm">
        <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-forest/10 bg-forest/5">
            <th className="px-4 py-3 font-medium text-forest/70">Name</th>
            <th className="px-4 py-3 font-medium text-forest/70">Category</th>
            <th className="px-4 py-3 font-medium text-forest/70">Visible</th>
            <th className="px-4 py-3 font-medium text-forest/70">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((product) => (
            <tr key={product.id} className="border-b border-forest/5 last:border-0">
              <td className="px-4 py-3">{product.name}</td>
              <td className="px-4 py-3">{product.category}</td>
              <td className="px-4 py-3">
                <input
                  type="checkbox"
                  checked={product.visible}
                  onChange={() =>
                    toggleVisible(product.id, product.visible, {
                      name: product.name,
                      slug: product.slug,
                      category: product.category,
                      short_description: product.short_description ?? '',
                      description: product.description ?? '',
                      specs: product.specs ?? {},
                      traits: product.traits ?? [],
                      visible: product.visible,
                    })
                  }
                />
              </td>
              <td className="flex gap-3 px-4 py-3">
                <Link to={`/admin/products/${product.id}/edit`} className="text-sm font-medium text-forest hover:underline">
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => softDelete.mutate(product.id)}
                  className="text-sm font-medium text-red-700 hover:underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
        </table>
      </div>
    </div>
  )
}

export default ProductAdminList
