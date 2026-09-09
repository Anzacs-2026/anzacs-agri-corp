import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/products', label: 'Products' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  cn(
    'text-sm font-medium text-cream/80 transition-colors hover:text-cream',
    isActive && 'text-cream underline decoration-gold decoration-2 underline-offset-4',
  )

const Header = () => {
  return (
    <header className="bg-forest px-4 py-5 text-cream shadow-sm md:py-6">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4">
        <NavLink to="/" className="flex items-center gap-2 font-serif text-xl tracking-tight" end>
          <img src="/anz_logos/badge.webp" alt="ANZ Agricrop" className="h-14 w-14" />
          ANZ Agricrop
        </NavLink>

        <nav className="flex flex-wrap items-center gap-6">
          {navItems.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={navLinkClassName}>
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header
