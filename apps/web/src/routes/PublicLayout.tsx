import { Outlet, useLocation } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { routeHasHero } from '@/lib/heroRoutes'
import { cn } from '@/lib/utils'

const PublicLayout = () => {
  const location = useLocation()
  const hasHero = routeHasHero(location.pathname)

  return (
    <div className="flex min-h-screen flex-col bg-cream">
      <Header />
      <main className={cn('flex-1', !hasHero && 'pt-20 md:pt-24')}>
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

export default PublicLayout
