import { useMemo, useState } from 'react'
import { Input } from '@/components/ui/input'
import { useProducts } from '../hooks/useProducts'
import ProductCard from './ProductCard'

const ProductGrid = () => {
  const { data: products, isLoading } = useProducts()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')

  const categories = useMemo(() => {
    if (!products) return []
    return Array.from(new Set(products.map((p) => p.category))).sort()
  }, [products])

  const filtered = useMemo(() => {
    if (!products) return []
    return products.filter((product) => {
      const matchesSearch = product.name.toLowerCase().includes(search.toLowerCase())
      const matchesCategory = category === '' || product.category === category
      return matchesSearch && matchesCategory
    })
  }, [products, search, category])

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-leaf">Catalog</span>
        <h1 className="mt-2 font-serif text-3xl text-forest">Our Products</h1>
      </div>

      <div className="mb-8 flex flex-wrap items-center gap-4 rounded-xl border border-forest/10 bg-white p-4 shadow-sm">
        <Input placeholder="Search products…" value={search} onChange={(e) => setSearch(e.target.value)} className="max-w-xs" />

        <label className="flex items-center gap-2 text-sm text-forest">
          Category
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="rounded border border-forest/20 bg-cream px-2 py-1"
          >
            <option value="">All</option>
            {categories.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
        </label>
      </div>

      {isLoading && <p className="text-forest/60">Loading products…</p>}

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {!isLoading && filtered.length === 0 && <p className="text-forest/60">No products found.</p>}
    </div>
  )
}

export default ProductGrid
