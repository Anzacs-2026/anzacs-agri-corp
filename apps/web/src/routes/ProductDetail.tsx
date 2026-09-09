import { useParams } from 'react-router-dom'
import { useProduct, useRelatedProducts, ProductCard } from '@/features/products'
import { photoService } from '@/features/photos/services/photoService'
import Seo from '@/components/Seo'

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>()
  const { data: product, isLoading, error } = useProduct(slug ?? '')
  const { data: related } = useRelatedProducts(product?.category, product?.id)

  if (isLoading) return <p className="py-16 text-center text-forest/70">Loading…</p>
  if (error || !product) return <p className="py-16 text-center text-forest/70">Product not found.</p>

  const imageUrl = product.primary_photo?.storage_path
    ? photoService.getPublicUrl(product.primary_photo.storage_path)
    : null

  return (
    <div className="mx-auto max-w-4xl px-4 py-16">
      <Seo
        title={product.name}
        description={product.short_description || `${product.name} — ${product.category} from ANZ Agri Crop Sciences.`}
        path={`/products/${product.slug}`}
        image={imageUrl ?? undefined}
      />

      {imageUrl && (
        <div className="relative mb-6 aspect-[16/8] w-full overflow-hidden rounded-2xl shadow-md md:aspect-[21/9]">
          <img src={imageUrl} alt={product.name} className="h-full w-full object-cover" />
          <span className="absolute bottom-4 left-4 rounded-full bg-forest/80 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-cream">
            {product.category}
          </span>
        </div>
      )}
      {!imageUrl && (
        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-leaf">{product.category}</span>
      )}
      <h1 className="mt-2 font-serif text-4xl text-forest">{product.name}</h1>
      {product.short_description && <p className="mt-3 text-lg text-forest/80">{product.short_description}</p>}
      {product.description && (
        <p className="mt-6 whitespace-pre-line leading-relaxed text-forest/80">{product.description}</p>
      )}

      {product.traits && product.traits.length > 0 && (
        <ul className="mt-6 flex flex-wrap gap-1.5">
          {product.traits.map((trait) => (
            <li key={trait} className="rounded-full bg-leaf/15 px-3 py-1 text-xs font-medium text-forest">
              {trait}
            </li>
          ))}
        </ul>
      )}

      {product.specs && Object.keys(product.specs).length > 0 && (
        <dl className="mt-8 grid grid-cols-2 gap-x-6 gap-y-5 rounded-xl border border-forest/10 bg-white p-6 shadow-sm sm:grid-cols-3">
          {Object.entries(product.specs).map(([key, value]) => (
            <div key={key}>
              <dt className="text-xs font-semibold uppercase tracking-wide text-forest/60">{key}</dt>
              <dd className="mt-1 text-base text-forest">{value}</dd>
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
