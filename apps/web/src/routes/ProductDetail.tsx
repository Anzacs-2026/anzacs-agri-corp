import { useParams } from 'react-router-dom'
import { useProduct, useRelatedProducts, ProductCard } from '@/features/products'

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const { data: product, isLoading, error } = useProduct(slug ?? '')
  const { data: related } = useRelatedProducts(product?.category, product?.id)

  if (isLoading) return <p className="py-16 text-center text-forest/60">Loading…</p>
  if (error || !product) return <p className="py-16 text-center text-forest/60">Product not found.</p>

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <span className="text-xs font-medium uppercase tracking-wide text-leaf">{product.category}</span>
      <h1 className="mt-1 font-serif text-3xl text-forest">{product.name}</h1>
      {product.short_description && <p className="mt-2 text-forest/80">{product.short_description}</p>}
      {product.description && <p className="mt-4 whitespace-pre-line text-forest/80">{product.description}</p>}

      {product.traits && product.traits.length > 0 && (
        <ul className="mt-4 flex flex-wrap gap-2">
          {product.traits.map((trait) => (
            <li key={trait} className="rounded-full bg-leaf/20 px-3 py-1 text-xs text-forest">
              {trait}
            </li>
          ))}
        </ul>
      )}

      {product.specs && Object.keys(product.specs).length > 0 && (
        <dl className="mt-6 grid grid-cols-2 gap-2 text-sm">
          {Object.entries(product.specs).map(([key, value]) => (
            <div key={key}>
              <dt className="font-medium text-forest">{key}</dt>
              <dd className="text-forest/70">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      {related && related.length > 0 && (
        <div className="mt-12">
          <h2 className="mb-4 text-xl font-bold text-forest">Related products</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {related.map((r) => (
              <ProductCard key={r.id} product={r} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

export default ProductDetail
