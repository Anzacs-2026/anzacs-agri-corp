import { ProductGrid } from '@/features/products'
import Seo from '@/components/Seo'

const Products = () => {
  return (
    <>
      <Seo
        title="Our Products"
        description="Browse ANZ Agri Crop Sciences' full catalog of hybrid and open-pollinated seeds — gourds, solanaceous vegetables, brassicas, and more."
        path="/products"
      />
      <ProductGrid />
    </>
  )
}

export default Products
