import { lazy } from 'react'
import type { RouteRecord } from 'vite-react-ssg'
import Layout from './Layout'
import PublicLayout from './PublicLayout'
import AdminLayout from './AdminLayout'
import Home from './Home'
import About from './About'
import Contact from './Contact'
import Products from './Products'
import ProductDetail from './ProductDetail'
import AdminLogin from './AdminLogin'
import NotFound from './NotFound'

// Lazy-loaded: never reached during SSG (AdminLayout redirects to /admin/login
// before rendering its <Outlet/> when there's no session, which is always the
// case at build time), and never needed by a public visitor at runtime either.
const AdminDashboard = lazy(() => import('./AdminDashboard'))
const AdminProducts = lazy(() => import('./AdminProducts'))
const AdminProductForm = lazy(() => import('./AdminProductForm'))
const AdminPages = lazy(() => import('./AdminPages'))
const AdminEnquiries = lazy(() => import('./AdminEnquiries'))
const AdminTestimonials = lazy(() => import('./AdminTestimonials'))
const AdminLogs = lazy(() => import('./AdminLogs'))
const AdminSettings = lazy(() => import('./AdminSettings'))

export const routes: RouteRecord[] = [
  {
    path: '/',
    Component: Layout,
    children: [
      {
        Component: PublicLayout,
        children: [
          { index: true, Component: Home, entry: 'src/routes/Home.tsx' },
          { path: 'about', Component: About, entry: 'src/routes/About.tsx' },
          { path: 'contact', Component: Contact, entry: 'src/routes/Contact.tsx' },
          { path: 'products', Component: Products, entry: 'src/routes/Products.tsx' },
          { path: 'products/:slug', Component: ProductDetail, entry: 'src/routes/ProductDetail.tsx' },
          { path: '*', Component: NotFound, entry: 'src/routes/NotFound.tsx' },
        ],
      },
      { path: 'admin/login', Component: AdminLogin, entry: 'src/routes/AdminLogin.tsx' },
      {
        path: 'admin',
        Component: AdminLayout,
        children: [
          { index: true, Component: AdminDashboard, entry: 'src/routes/AdminDashboard.tsx' },
          { path: 'products', Component: AdminProducts, entry: 'src/routes/AdminProducts.tsx' },
          { path: 'products/new', Component: AdminProductForm, entry: 'src/routes/AdminProductForm.tsx' },
          { path: 'products/:id/edit', Component: AdminProductForm, entry: 'src/routes/AdminProductForm.tsx' },
          { path: 'pages/:page', Component: AdminPages, entry: 'src/routes/AdminPages.tsx' },
          { path: 'enquiries', Component: AdminEnquiries, entry: 'src/routes/AdminEnquiries.tsx' },
          { path: 'testimonials', Component: AdminTestimonials, entry: 'src/routes/AdminTestimonials.tsx' },
          { path: 'settings', Component: AdminSettings, entry: 'src/routes/AdminSettings.tsx' },
          { path: 'logs', Component: AdminLogs, entry: 'src/routes/AdminLogs.tsx' },
        ],
      },
    ],
  },
]
