import { QueryClientProvider } from '@tanstack/react-query'
import { Outlet } from 'react-router-dom'
import { queryClient } from '@/lib/queryClient'
import { AuthProvider } from '@/features/auth'
import Header from '@/components/Header'
import Footer from '@/components/Footer'

const Layout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="flex min-h-screen flex-col bg-cream">
          <Header />
          <main className="flex-1">
            <Outlet />
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default Layout
