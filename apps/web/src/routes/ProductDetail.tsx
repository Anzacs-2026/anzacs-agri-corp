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

  const descriptionParagraphs = product.description ? product.description.split(/\n{2,}/).filter(Boolean) : []

  return (
    <div className="mx-auto max-w-5xl px-4 py-16">
      <Seo
        title={product.name}
        description={product.short_description || `${product.name} — ${product.category} from ANZ Agri Crop Sciences.`}
        path={`/products/${product.slug}`}
        image={imageUrl ?? undefined}
      />

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:items-start">
        {imageUrl && (
          <img
            src={imageUrl}
            alt={product.name}
            className="aspect-square w-full rounded-2xl object-cover shadow-md md:aspect-[4/3]"
          />
        )}

        <div>
          {!imageUrl && (
            <span className="text-xs font-semibold uppercase tracking-[0.2em] text-leaf">{product.category}</span>
          )}
          <h1 className="font-serif text-4xl text-forest">{product.name}</h1>

          {product.specs && Object.keys(product.specs).length > 0 && (
            <dl className="mt-4 space-y-1.5 text-sm">
              {Object.entries(product.specs).map(([key, value]) => (
                <div key={key}>
                  <dt className="inline font-semibold text-forest">{key}</dt>
                  <dd className="inline text-forest/80">: {value}</dd>
                </div>
              ))}
            </dl>
          )}

          {product.traits && product.traits.length > 0 && (
            <ul className="mt-4 flex flex-wrap gap-1.5">
              {product.traits.map((trait) => (
                <li key={trait} className="rounded-full bg-leaf/15 px-3 py-1 text-xs font-medium text-forest">
                  {trait}
                </li>
              ))}
            </ul>
          )}

          {product.short_description && <p className="mt-4 leading-relaxed text-forest/80">{product.short_description}</p>}
        </div>
      </div>

      {descriptionParagraphs.length > 0 && (
        <div className="mt-10 space-y-4">
          {descriptionParagraphs.map((paragraph, i) => (
            <p key={i} className="whitespace-pre-line leading-relaxed text-forest/80">
              {paragraph}
            </p>
          ))}
        </div>
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
