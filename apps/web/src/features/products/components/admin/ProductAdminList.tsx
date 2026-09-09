import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Button } from '@/components/ui/button'
import ConfirmDialog from '@/components/ui/confirm-dialog'
import AdminPageHeader from '@/components/admin/AdminPageHeader'
import { useAdminProducts, useSoftDeleteProduct, useUpdateProduct } from '../../hooks/useAdminProducts'
import type { Product } from '../../types'

const ProductAdminList = () => {
  const { data: products, isLoading } = useAdminProducts()
  const softDelete = useSoftDeleteProduct()
  const update = useUpdateProduct()
  const [pendingDeleteId, setPendingDeleteId] = useState<string | null>(null)

  const toggleVisible = (id: string, current: boolean, rest: Parameters<typeof update.mutate>[0]['input']) => {
    update.mutate({ id, input: { ...rest, visible: !current } })
  }

  const confirmDelete = () => {
    if (pendingDeleteId) softDelete.mutate(pendingDeleteId)
    setPendingDeleteId(null)
  }

  const visibleToggle = (product: Product) => (
    <input
      type="checkbox"
      aria-label={`Toggle visibility for ${product.name}`}
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
  )

  if (isLoading) return <p className="text-forest/70">Loading…</p>

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

      {/* Table — md and up */}
      <div className="hidden overflow-hidden rounded-xl border border-forest/10 bg-white shadow-sm md:block">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-forest/10 bg-forest/5">
              <th className="px-4 py-3 font-medium text-forest/70">ID</th>
              <th className="px-4 py-3 font-medium text-forest/70">Name</th>
              <th className="px-4 py-3 font-medium text-forest/70">Category</th>
              <th className="px-4 py-3 font-medium text-forest/70">Visible</th>
              <th className="px-4 py-3 font-medium text-forest/70">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product, index) => (
              <tr key={product.id} className="border-b border-forest/5 last:border-0">
                <td className="px-4 py-3 text-forest/70">{index + 1}</td>
                <td className="px-4 py-3">{product.name}</td>
                <td className="px-4 py-3">{product.category}</td>
                <td className="px-4 py-3">{visibleToggle(product)}</td>
                <td className="flex gap-3 px-4 py-3">
                  <Link to={`/admin/products/${product.id}/edit`} className="text-sm font-medium text-forest hover:underline">
                    Edit
                  </Link>
                  <button
                    type="button"
                    onClick={() => setPendingDeleteId(product.id)}
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

      {/* Cards — below md, no horizontal scroll */}
      <div className="flex flex-col gap-3 md:hidden">
        {products?.map((product) => (
          <div key={product.id} className="rounded-xl border border-forest/10 bg-white p-4 shadow-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="font-medium text-forest">{product.name}</div>
                <div className="text-xs text-forest/60">{product.category}</div>
              </div>
              <label className="flex items-center gap-1.5 text-xs text-forest/70">
                Visible
                {visibleToggle(product)}
              </label>
            </div>
            <div className="mt-3 flex gap-4 border-t border-forest/10 pt-3">
              <Link to={`/admin/products/${product.id}/edit`} className="text-sm font-medium text-forest hover:underline">
                Edit
              </Link>
              <button
                type="button"
                onClick={() => setPendingDeleteId(product.id)}
                className="text-sm font-medium text-red-700 hover:underline"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <ConfirmDialog
        open={pendingDeleteId !== null}
        title="Delete this product?"
        description="This removes it from the public catalog. This can't be undone from here."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDeleteId(null)}
      />
    </div>
  )
}

export default ProductAdminList
