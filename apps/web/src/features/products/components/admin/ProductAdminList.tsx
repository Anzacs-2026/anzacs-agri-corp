import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
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
    <div className="mx-auto max-w-3xl px-4 py-8">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link to="/admin/products/new">
          <Button>Add product</Button>
        </Link>
      </div>

      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-forest/20">
            <th className="py-2">Name</th>
            <th className="py-2">Category</th>
            <th className="py-2">Visible</th>
            <th className="py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products?.map((product) => (
            <tr key={product.id} className="border-b border-forest/10">
              <td className="py-2">{product.name}</td>
              <td className="py-2">{product.category}</td>
              <td className="py-2">
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
              <td className="flex gap-2 py-2">
                <Link to={`/admin/products/${product.id}/edit`} className="text-sm text-forest underline">
                  Edit
                </Link>
                <button
                  type="button"
                  onClick={() => softDelete.mutate(product.id)}
                  className="text-sm text-red-700 underline"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default ProductAdminList
