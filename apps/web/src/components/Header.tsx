import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { Home, Package, Info, Mail, LogIn, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { routeHasHero } from '@/lib/heroRoutes'
import { useScrollPosition } from '@/hooks/useScrollPosition'

const navItems = [
  { to: '/', label: 'Home', end: true, icon: Home },
  { to: '/about', label: 'About', icon: Info },
  { to: '/products', label: 'Products', icon: Package },
  { to: '/contact', label: 'Contact', icon: Mail },
]

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  cn(
    'inline-flex items-center gap-1.5 text-sm font-medium text-cream/80 transition-colors hover:text-cream',
    isActive && 'text-cream underline decoration-gold decoration-2 underline-offset-4',
  )

const mobileNavLinkClassName = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive ? 'bg-cream/10 text-cream' : 'text-cream/80 hover:bg-cream/5 hover:text-cream',
  )

const Header = () => {
  const location = useLocation()
  const scrolled = useScrollPosition(48)
  const overlay = routeHasHero(location.pathname) && !scrolled
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header
      className={cn(
        'fixed inset-x-0 top-0 z-50 flex h-20 items-center px-4 text-cream transition-colors duration-300 md:h-24',
        overlay && !mobileOpen ? 'bg-transparent' : 'bg-forest shadow-sm',
      )}
    >
      <div className="mx-auto flex w-full max-w-6xl items-center justify-between gap-4">
        <NavLink to="/" className="flex items-center gap-2 font-serif text-xl tracking-tight" end>
          <img src="/anz_logos/badge.webp" alt="ANZ Agricrop" className="h-14 w-14" />
          ANZ Agricrop
        </NavLink>

        <nav className="hidden flex-wrap items-center gap-6 md:flex">
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

        <button
          type="button"
          className="text-cream md:hidden"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="absolute inset-x-0 top-full z-40 flex flex-col gap-1 bg-forest px-4 py-3 shadow-lg md:hidden">
          {navItems.map(({ to, label, end, icon: Icon }) => (
            <NavLink key={to} to={to} end={end} className={mobileNavLinkClassName} onClick={() => setMobileOpen(false)}>
              <Icon size={18} aria-hidden />
              {label}
            </NavLink>
          ))}
          <NavLink
            to="/admin/login"
            className="flex items-center gap-3 rounded-md border border-cream/30 px-3 py-2 text-sm font-medium text-cream/80"
            onClick={() => setMobileOpen(false)}
          >
            <LogIn size={18} aria-hidden />
            Admin
          </NavLink>
        </div>
      )}
    </header>
  )
}

export default Header
