import { NavLink, useNavigate } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { authService, useAuth } from '@/features/auth'

const navItems = [
  { to: '/', label: 'Home', end: true },
  { to: '/products', label: 'Products' },
  { to: '/about', label: 'About' },
  { to: '/contact', label: 'Contact' },
]

const adminNavItems = [
  { to: '/admin/products', label: 'Products' },
  { to: '/admin/pages', label: 'Pages' },
  { to: '/admin/photos', label: 'Photos' },
]

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  cn('text-sm text-cream/80 hover:text-cream', isActive && 'font-medium text-cream underline')

const Header = () => {
  const { session } = useAuth()
  const navigate = useNavigate()

  const handleSignOut = async () => {
    await authService.signOut()
    navigate('/admin/login')
  }

  return (
    <header className="bg-forest px-4 py-4 text-cream">
      <div className="mx-auto flex max-w-5xl flex-wrap items-center justify-between gap-4">
        <NavLink to="/" className="font-serif text-xl">
          ANZ Agricrop
        </NavLink>

        <nav className="flex flex-wrap items-center gap-4">
          {navItems.map(({ to, label, end }) => (
            <NavLink key={to} to={to} end={end} className={navLinkClassName}>
              {label}
            </NavLink>
          ))}

          {session && (
            <span className="flex flex-wrap items-center gap-4 border-l border-cream/30 pl-4">
              {adminNavItems.map(({ to, label }) => (
                <NavLink key={to} to={to} className={navLinkClassName}>
                  {label}
                </NavLink>
              ))}
              <button type="button" onClick={handleSignOut} className="text-sm text-cream/80 hover:text-cream">
                Sign out
              </button>
            </span>
          )}
        </nav>
      </div>
    </header>
  )
}

export default Header
