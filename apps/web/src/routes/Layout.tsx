import { QueryClientProvider } from '@tanstack/react-query'
import { Outlet } from 'react-router-dom'
import { queryClient } from '@/lib/queryClient'
import { AuthProvider } from '@/features/auth'

const Layout = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <div className="flex min-h-screen flex-col bg-cream">
          <header className="bg-forest px-4 py-4 text-cream">
            <span className="font-serif text-xl">ANZ Agricrop</span>
          </header>
          <main className="flex-1">
            <Outlet />
          </main>
          <footer className="bg-forest px-4 py-6 text-cream/80">
            <p className="text-sm">Seeds for life. Placeholder footer — Phase 2 wires nav and contact details.</p>
          </footer>
        </div>
      </AuthProvider>
    </QueryClientProvider>
  )
}

export default Layout
