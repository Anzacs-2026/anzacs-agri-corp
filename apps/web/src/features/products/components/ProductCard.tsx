import { Link } from 'react-router-dom'
import { Card, CardContent } from '@/components/ui/card'
import type { Product } from '../types'

const ProductCard = ({ product }: { product: Pick<Product, 'name' | 'slug' | 'category' | 'short_description'> }) => {
  return (
    <Link to={`/products/${product.slug}`}>
      <Card className="h-full transition-shadow hover:shadow-md">
        <CardContent>
          <span className="text-xs font-medium uppercase tracking-wide text-leaf">{product.category}</span>
          <h3 className="mt-1 font-serif text-lg text-forest">{product.name}</h3>
          {product.short_description && <p className="mt-2 text-sm text-forest/70">{product.short_description}</p>}
        </CardContent>
      </Card>
    </Link>
  )
}

export default ProductCard
