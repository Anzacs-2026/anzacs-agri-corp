import { NavLink, useLocation } from 'react-router-dom'
import { Home, Package, Info, Mail, LogIn } from 'lucide-react'
import { cn } from '@/lib/utils'
import { routeHasHero } from '@/lib/heroRoutes'
import { useScrollPosition } from '@/hooks/useScrollPosition'

const navItems = [
  { to: '/', label: 'Home', end: true, icon: Home },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/about', label: 'About', icon: Info },
  { to: '/contact', label: 'Contact', icon: Mail },
]

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  cn(
    'inline-flex items-center gap-1.5 text-sm font-medium text-cream/80 transition-colors hover:text-cream',
    isActive && 'text-cream underline decoration-gold decoration-2 underline-offset-4',
  )

const Header = () => {
  const location = useLocation()
  const scrolled = useScrollPosition(48)
  const overlay = routeHasHero(location.pathname) && !scrolled

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 flex h-20 items-center px-4 text-cream transition-colors duration-300 md:h-24',
        overlay ? 'bg-transparent' : 'bg-forest shadow-sm',
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4">
        <NavLink to="/" className="flex items-center gap-2 font-serif text-xl tracking-tight" end>
          <img src="/anz_logos/badge.webp" alt="ANZ Agricrop" className="h-14 w-14" />
          ANZ Agricrop
        </NavLink>

        <nav className="flex flex-wrap items-center gap-6">
          {navItems.map(({ to, label, end, icon: Icon }) => (
            <NavLink key={to} to={to} end={end} className={navLinkClassName}>
              <Icon size={18} aria-hidden />
              {label}
            </NavLink>
          ))}
          <NavLink
            to="/admin/login"
            className="inline-flex items-center gap-1.5 rounded-md border border-cream/30 px-3 py-1.5 text-sm font-medium text-cream/80 transition-colors hover:border-cream/60 hover:text-cream"
          >
            <LogIn size={18} aria-hidden />
            Admin
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

export default Header
