import { useState } from 'react'
import { Navigate, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, FileText, Image, Mail, LogOut, Menu, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { authService, useAuth } from '@/features/auth'

const navItems = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  { to: '/admin/pages', label: 'Pages', icon: FileText },
  { to: '/admin/photos', label: 'Photos', icon: Image },
  { to: '/admin/enquiries', label: 'Enquiries', icon: Mail },
]

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive ? 'bg-leaf/20 text-forest' : 'text-forest/70 hover:bg-forest/5 hover:text-forest',
  )

const AdminLayout = () => {
  const { session, user, loading } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  if (loading) {
    return null
  }

  if (!session) {
    return <Navigate to="/admin/login" replace />
  }

  const currentPage = navItems.find((item) =>
    item.end ? location.pathname === item.to : location.pathname.startsWith(item.to),
  )

  const handleSignOut = async () => {
    await authService.signOut()
    navigate('/admin/login')
  }

  const sidebarContent = (
    <>
      <div className="px-4 py-6">
        <img src="/crops/logo.png" alt="ANZ Agricrop" className="h-8" />
        <p className="mt-1 text-xs uppercase tracking-wide text-forest/50">Admin</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {navItems.map(({ to, label, icon: Icon, end }) => (
          <NavLink key={to} to={to} end={end} className={navLinkClassName} onClick={() => setMobileOpen(false)}>
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="border-t border-forest/10 px-3 py-4">
        <button
          type="button"
          onClick={handleSignOut}
          className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm font-medium text-forest/70 transition-colors hover:bg-forest/5 hover:text-forest"
        >
          <LogOut size={18} />
          Sign out
        </button>
      </div>
    </>
  )

  return (
    <div className="flex min-h-screen bg-cream">
      <aside className="hidden w-64 flex-col border-r border-forest/10 bg-white md:flex">{sidebarContent}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="absolute inset-0 bg-forest/40" onClick={() => setMobileOpen(false)} />
          <aside className="relative z-50 flex w-64 flex-col bg-white shadow-xl">
            <button
              type="button"
              className="absolute right-3 top-4 text-forest/60"
              onClick={() => setMobileOpen(false)}
              aria-label="Close menu"
            >
              <X size={20} />
            </button>
            {sidebarContent}
          </aside>
        </div>
      )}

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-forest/10 bg-white px-4 py-4 md:px-8">
          <div className="flex items-center gap-3">
            <button
              type="button"
              className="text-forest md:hidden"
              onClick={() => setMobileOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>
            <h1 className="text-lg font-semibold text-forest">{currentPage?.label ?? 'Admin'}</h1>
          </div>
          <span className="text-sm text-forest/60">{user?.email}</span>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
