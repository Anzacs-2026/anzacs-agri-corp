import { useParams } from 'react-router-dom'

const ProductDetail = () => {
  const { slug } = useParams<{ slug: string }>()

  return (
    <section className="py-16 text-center">
      <h1 className="text-4xl font-bold">Product: {slug}</h1>
      <p className="mt-4 text-forest/80">Placeholder — Phase 3 wires product detail from the database.</p>
    </section>
  )
}

export default ProductDetail
