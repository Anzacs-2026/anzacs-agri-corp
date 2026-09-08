import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/products', label: 'Products' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

const Header = () => {
  return (
    <header className="bg-forest px-4 py-4 text-cream">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
        <NavLink to="/" className="font-serif text-xl">
          ANZ Agricrop
        </NavLink>

        <nav className="flex flex-wrap gap-4">
          {navItems.map(({ to, label, end }) => (
            <NavLink
              key={to}
              to={to}
              end={end}
              className={({ isActive }) => cn('text-sm text-cream/80 hover:text-cream', isActive && 'font-medium text-cream underline')}
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </div>
    </header>
  )
}

export default Header
