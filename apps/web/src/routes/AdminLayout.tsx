import { Suspense, useState } from 'react'
import { Navigate, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { LayoutDashboard, Package, FileText, Mail, Quote, LogOut, Menu, X, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import { authService, useAuth } from '@/features/auth'
import Seo from '@/components/Seo'

interface LinkItem {
  to: string
  label: string
  icon: LucideIcon
  end?: boolean
}

interface GroupItem {
  label: string
  icon: LucideIcon
  children: { to: string; label: string }[]
}

const navItems: (LinkItem | GroupItem)[] = [
  { to: '/admin', label: 'Dashboard', icon: LayoutDashboard, end: true },
  { to: '/admin/products', label: 'Products', icon: Package },
  {
    label: 'Pages',
    icon: FileText,
    children: [
      { to: '/admin/pages/home', label: 'Home' },
      { to: '/admin/pages/about', label: 'About' },
      { to: '/admin/pages/contact', label: 'Contact' },
      { to: '/admin/pages/products', label: 'Products Page' },
    ],
  },
  { to: '/admin/enquiries', label: 'Enquiries', icon: Mail },
  { to: '/admin/testimonials', label: 'Testimonials', icon: Quote },
]

const isGroup = (item: LinkItem | GroupItem): item is GroupItem => 'children' in item

const navLinkClassName = ({ isActive }: { isActive: boolean }) =>
  cn(
    'flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors',
    isActive ? 'bg-leaf/20 text-forest' : 'text-forest/70 hover:bg-forest/5 hover:text-forest',
  )

const subNavLinkClassName = ({ isActive }: { isActive: boolean }) =>
  cn(
    'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
    isActive ? 'bg-leaf/20 text-forest' : 'text-forest/70 hover:bg-forest/5 hover:text-forest',
  )

const flatItems = navItems.flatMap((item) => (isGroup(item) ? item.children : [item]))

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

  const currentPage = flatItems.find((item) =>
    'end' in item && item.end ? location.pathname === item.to : location.pathname.startsWith(item.to),
  )

  const handleSignOut = async () => {
    await authService.signOut()
    navigate('/admin/login')
  }

  const sidebarContent = (
    <>
      <div className="px-4 py-6">
        <img src="/crops/logo.png" alt="ANZ Agricrop" className="h-8" />
        <p className="mt-1 text-xs uppercase tracking-wide text-forest/70">Admin</p>
      </div>

      <nav className="flex flex-1 flex-col gap-1 px-3">
        {navItems.map((item) =>
          isGroup(item) ? (
            <div key={item.label} className="mb-1">
              <div className="flex items-center gap-3 px-3 py-2 text-sm font-medium text-forest/70">
                <item.icon size={18} />
                {item.label}
              </div>
              <div className="ml-9 flex flex-col gap-0.5">
                {item.children.map((child) => (
                  <NavLink key={child.to} to={child.to} className={subNavLinkClassName} onClick={() => setMobileOpen(false)}>
                    {child.label}
                  </NavLink>
                ))}
              </div>
            </div>
          ) : (
            <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClassName} onClick={() => setMobileOpen(false)}>
              <item.icon size={18} />
              {item.label}
            </NavLink>
          ),
        )}
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
      <Seo title="Admin" description="ANZ Agricrop admin dashboard." path={location.pathname} noindex />

      <aside className="hidden w-64 flex-col border-r border-forest/10 bg-white md:flex">{sidebarContent}</aside>

      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex md:hidden">
          <div className="absolute inset-0 bg-forest/40" aria-hidden="true" onClick={() => setMobileOpen(false)} />
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
          <span className="text-sm text-forest/70">{user?.email}</span>
        </header>

        <main className="flex-1 px-4 py-6 md:px-8 md:py-8">
          <Suspense fallback={<p className="text-forest/70">Loading…</p>}>
            <Outlet />
          </Suspense>
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
