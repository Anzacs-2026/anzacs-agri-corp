import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import { photoService } from '@/features/photos/services/photoService'
import { cn } from '@/lib/utils'
import type { Product } from '../types'

interface ProductCardProps {
  product: Pick<Product, 'name' | 'slug' | 'category' | 'short_description' | 'primary_photo'>
  layout?: 'grid' | 'list'
}

const ProductCard = ({ product, layout = 'grid' }: ProductCardProps) => {
  const imageUrl = product.primary_photo?.storage_path
    ? photoService.getPublicUrl(product.primary_photo.storage_path)
    : null

  const isList = layout === 'list'

  return (
    <Link to={`/products/${product.slug}`} className="group block h-full">
      <Card
        className={cn(
          'h-full overflow-hidden hover:-translate-y-0.5 hover:shadow-lg',
          isList && 'flex flex-row items-stretch hover:translate-y-0',
        )}
      >
        <div
          className={cn(
            'aspect-square overflow-hidden rounded-t-xl bg-forest/5',
            isList && 'aspect-square w-32 shrink-0 rounded-l-xl rounded-tr-none sm:w-40',
          )}
        >
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={product.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-xs text-forest/30">No photo</div>
          )}
        </div>
        <CardContent className={cn(isList && 'flex flex-1 flex-col justify-center')}>
          <span className="text-xs font-semibold uppercase tracking-wide text-leaf">{product.category}</span>
          <h3 className="mt-2 font-serif text-lg text-forest">{product.name}</h3>
          {product.short_description && <p className="mt-2 text-sm text-forest/70">{product.short_description}</p>}
        </CardContent>
      </Card>
    </Link>
  )
}

export default ProductCard
