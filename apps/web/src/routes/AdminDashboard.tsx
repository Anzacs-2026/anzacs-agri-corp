import { Link } from 'react-router-dom'
import { Package, FileText, Mail, Quote } from 'lucide-react'
import { useAdminProducts } from '@/features/products'
import { useAdminEnquiries } from '@/features/enquiries'

const AdminDashboard = () => {
  const { data: products } = useAdminProducts()
  const { data: enquiries } = useAdminEnquiries()
  const newEnquiries = enquiries?.filter((e) => e.status === 'new').length ?? 0

  const stats = [
    { label: 'Products', value: products?.length ?? 0, to: '/admin/products', icon: Package },
    { label: 'New enquiries', value: newEnquiries, to: '/admin/enquiries', icon: Mail },
  ]

  const quickLinks = [
    { label: 'Manage products', to: '/admin/products', icon: Package },
    { label: 'Edit page content', to: '/admin/pages/home', icon: FileText },
    { label: 'View enquiries', to: '/admin/enquiries', icon: Mail },
    { label: 'Manage testimonials', to: '/admin/testimonials', icon: Quote },
  ]

  return (
    <div className="mx-auto max-w-4xl">
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {stats.map(({ label, value, to, icon: Icon }) => (
          <Link
            key={label}
            to={to}
            className="flex items-center gap-4 rounded-xl border border-forest/10 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="rounded-lg bg-leaf/15 p-3 text-forest">
              <Icon size={22} />
            </div>
            <div>
              <div className="text-2xl font-semibold text-forest">{value}</div>
              <div className="text-sm text-forest/70">{label}</div>
            </div>
          </Link>
        ))}
      </div>

      <h2 className="mb-3 text-sm font-medium uppercase tracking-wide text-forest/70">Quick links</h2>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {quickLinks.map(({ label, to, icon: Icon }) => (
          <Link
            key={label}
            to={to}
            className="flex items-center gap-3 rounded-lg border border-forest/10 bg-white px-4 py-3 text-sm font-medium text-forest transition-colors hover:bg-forest/5"
          >
            <Icon size={18} className="text-forest/70" />
            {label}
          </Link>
        ))}
      </div>
    </div>
  )
}

export default AdminDashboard
