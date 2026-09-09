import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import Header from '@/components/Header'
import Footer from '@/components/Footer'
import { routeHasHero } from '@/lib/heroRoutes'
import { cn } from '@/lib/utils'

const PublicLayout = () => {
  const location = useLocation()
  const hasHero = routeHasHero(location.pathname)

  // Client-side nav doesn't trigger the browser's native #hash scroll —
  // do it ourselves so in-page CTAs (e.g. Hero "View Our Products") work.
  useEffect(() => {
    if (!location.hash) return
    const el = document.getElementById(location.hash.slice(1))
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [location.pathname, location.hash])

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
