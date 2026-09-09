import { useParams } from 'react-router-dom'
import { useProduct, useRelatedProducts, ProductCard } from '@/features/products'

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const { data: product, isLoading, error } = useProduct(slug ?? '')
  const { data: related } = useRelatedProducts(product?.category, product?.id)

  if (isLoading) return <p className="py-16 text-center text-forest/60">Loading…</p>
  if (error || !product) return <p className="py-16 text-center text-forest/60">Product not found.</p>

  return (
    <div className="mx-auto max-w-3xl px-4 py-16">
      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-leaf">{product.category}</span>
      <h1 className="mt-2 font-serif text-4xl text-forest">{product.name}</h1>
      {product.short_description && <p className="mt-3 text-lg text-forest/80">{product.short_description}</p>}
      {product.description && (
        <p className="mt-6 whitespace-pre-line leading-relaxed text-forest/80">{product.description}</p>
      )}

      {product.traits && product.traits.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-2">
          {product.traits.map((trait) => (
            <li key={trait} className="rounded-full bg-leaf/15 px-3 py-1 text-xs font-medium text-forest">
              {trait}
            </li>
          ))}
        </ul>
      )}

      {product.specs && Object.keys(product.specs).length > 0 && (
        <dl className="mt-8 grid grid-cols-2 gap-4 rounded-xl border border-forest/10 bg-white p-5 text-sm shadow-sm">
          {Object.entries(product.specs).map(([key, value]) => (
            <div key={key}>
              <dt className="font-medium text-forest">{key}</dt>
              <dd className="text-forest/70">{value}</dd>
            </div>
          ))}
        </dl>
      )}

      {related && related.length > 0 && (
        <div className="mt-16">
          <h2 className="mb-4 font-serif text-xl text-forest">Related products</h2>
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
