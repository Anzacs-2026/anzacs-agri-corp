import { Link } from 'react-router-dom'
import { usePageContent, getSectionText } from '@/features/pages'
import { useProducts, ProductCard } from '@/features/products'
import { Button } from '@/components/ui/button'
import Section from '@/components/Section'

const Home = () => {
  const { data: sections } = usePageContent('home')
  const { data: products } = useProducts()
  const featured = products?.slice(0, 3) ?? []

  return (
    <>
      <Section background="forest" className="text-center">
        <span className="text-xs font-medium uppercase tracking-[0.2em] text-lime">Seeds for life</span>
        <h1 className="mt-3 font-serif text-4xl leading-tight sm:text-5xl">
          {getSectionText(sections, 'hero_title', 'ANZ Agri Crop Sciences')}
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-cream/80">
          {getSectionText(
            sections,
            'hero_subtitle',
            'Trusted hybrid seeds, farming, and beekeeping — bringing over a decade of research to every field since 2009.',
          )}
        </p>
        <Link to="/products" className="mt-8 inline-block">
          <Button variant="outline" size="default" className="border-gold text-cream hover:bg-gold/20">
            Explore products
          </Button>
        </Link>
      </Section>

      <Section>
        <p className="mx-auto max-w-2xl text-center text-lg text-forest/80">
          {getSectionText(
            sections,
            'intro',
            'An integrated agricultural enterprise with a strong foundation in plant genetics and seed production — delivering 100% pure, high-yield hybrid and open-pollinated varieties to growers nationwide and beyond.',
          )}
        </p>
      </Section>

      {featured.length > 0 && (
        <Section background="cream">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="font-serif text-2xl text-forest">Featured products</h2>
            <Link to="/products" className="text-sm font-medium text-forest underline underline-offset-4">
              View all
            </Link>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            {featured.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </Section>
      )}
    </>
  )
}

export default Home
