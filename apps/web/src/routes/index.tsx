import type { RouteRecord } from 'vite-react-ssg'
import Layout from './Layout'
import Home from './Home'
import About from './About'
import Contact from './Contact'
import Products from './Products'
import ProductDetail from './ProductDetail'
import AdminLogin from './AdminLogin'
import AdminDashboard from './AdminDashboard'
import AdminProducts from './AdminProducts'
import AdminProductForm from './AdminProductForm'
import NotFound from './NotFound'
import { ProtectedRoute } from '@/features/auth'

export const routes: RouteRecord[] = [
  {
    path: '/',
    Component: Layout,
    children: [
      { index: true, Component: Home, entry: 'src/routes/Home.tsx' },
      { path: 'about', Component: About, entry: 'src/routes/About.tsx' },
      { path: 'contact', Component: Contact, entry: 'src/routes/Contact.tsx' },
      { path: 'products', Component: Products, entry: 'src/routes/Products.tsx' },
      { path: 'products/:slug', Component: ProductDetail, entry: 'src/routes/ProductDetail.tsx' },
      { path: 'admin/login', Component: AdminLogin, entry: 'src/routes/AdminLogin.tsx' },
      {
        path: 'admin',
        Component: ProtectedRoute,
        children: [
          { index: true, Component: AdminDashboard, entry: 'src/routes/AdminDashboard.tsx' },
          { path: 'products', Component: AdminProducts, entry: 'src/routes/AdminProducts.tsx' },
          { path: 'products/new', Component: AdminProductForm, entry: 'src/routes/AdminProductForm.tsx' },
          { path: 'products/:id/edit', Component: AdminProductForm, entry: 'src/routes/AdminProductForm.tsx' },
        ],
      },
      { path: '*', Component: NotFound, entry: 'src/routes/NotFound.tsx' },
    ],
  },
]
