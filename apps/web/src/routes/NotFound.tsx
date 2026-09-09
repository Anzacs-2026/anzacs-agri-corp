import { Link } from 'react-router-dom'
import { Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import Seo from '@/components/Seo'

const NotFound = () => {
  return (
    <section className="flex flex-col items-center justify-center py-24 text-center">
      <Seo title="Page Not Found" description="The page you're looking for doesn't exist." path="/404" noindex />

      <span className="font-serif text-6xl text-forest/20">404</span>
      <h1 className="mt-4 text-2xl font-semibold text-forest">Page not found</h1>
      <p className="mt-2 text-forest/70">The page you're looking for doesn't exist.</p>
      <Link to="/" className="mt-6">
        <Button>
          <Home size={16} className="mr-1.5" aria-hidden />
          Back to home
        </Button>
      </Link>
    </section>
  )
}

export default NotFound
