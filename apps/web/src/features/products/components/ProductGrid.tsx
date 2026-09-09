import { useEffect, useMemo, useState } from 'react'
import { LayoutGrid, List } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { useProducts } from '../hooks/useProducts'
import ProductCard from './ProductCard'

const PAGE_SIZE = 9

const ProductGrid = () => {
  const { data: products, isLoading } = useProducts()
  const [search, setSearch] = useState('')
  const [category, setCategory] = useState('')
  const [view, setView] = useState<'grid' | 'list'>('grid')
  const [page, setPage] = useState(1)

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

  useEffect(() => {
    setPage(1)
  }, [search, category])

  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const currentPage = Math.min(page, pageCount)
  const paginated = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE)

  return (
    <div className="mx-auto max-w-5xl px-4 py-12">
      <div className="mb-8 text-center">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-leaf">Catalog</span>
        <h1 className="mt-2 font-serif text-3xl text-forest">Our Products</h1>
      </div>

      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-forest/10 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center gap-4">
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

        {/* oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- role="group" + aria-label is valid ARIA; a <fieldset> here would need default-style overrides for no real gain */}
        <div role="group" aria-label="View" className="flex gap-1 rounded-lg bg-forest/5 p-1">
          <button
            type="button"
            onClick={() => setView('grid')}
            aria-label="Grid view"
            className={cn('rounded-md p-1.5', view === 'grid' ? 'bg-forest text-cream' : 'text-forest/60 hover:text-forest')}
          >
            <LayoutGrid size={16} />
          </button>
          <button
            type="button"
            onClick={() => setView('list')}
            aria-label="List view"
            className={cn('rounded-md p-1.5', view === 'list' ? 'bg-forest text-cream' : 'text-forest/60 hover:text-forest')}
          >
            <List size={16} />
          </button>
        </div>
      </div>

      {isLoading && <p className="text-forest/70">Loading products…</p>}

      <div className={cn('grid grid-cols-1 gap-6', view === 'grid' ? 'sm:grid-cols-2 lg:grid-cols-3' : '')}>
        {paginated.map((product) => (
          <ProductCard key={product.id} product={product} layout={view} />
        ))}
      </div>

      {!isLoading && filtered.length === 0 && <p className="text-forest/70">No products found.</p>}

      {pageCount > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          {Array.from({ length: pageCount }, (_, i) => i + 1).map((pageNumber) => (
            <button
              key={pageNumber}
              type="button"
              onClick={() => setPage(pageNumber)}
              className={cn(
                'h-8 w-8 rounded-md text-sm font-medium',
                pageNumber === currentPage ? 'bg-forest text-cream' : 'text-forest/60 hover:bg-forest/5',
              )}
            >
              {pageNumber}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default ProductGrid
