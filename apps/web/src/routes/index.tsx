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
import AdminDashboard from './AdminDashboard'
import AdminProducts from './AdminProducts'
import AdminProductForm from './AdminProductForm'
import AdminPages from './AdminPages'
import AdminPhotos from './AdminPhotos'
import AdminEnquiries from './AdminEnquiries'
import NotFound from './NotFound'

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
          { path: 'pages', Component: AdminPages, entry: 'src/routes/AdminPages.tsx' },
          { path: 'photos', Component: AdminPhotos, entry: 'src/routes/AdminPhotos.tsx' },
          { path: 'enquiries', Component: AdminEnquiries, entry: 'src/routes/AdminEnquiries.tsx' },
        ],
      },
    ],
  },
]
