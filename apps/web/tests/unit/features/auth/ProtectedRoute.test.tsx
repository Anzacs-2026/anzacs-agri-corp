import { render, screen } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import ProtectedRoute from '@/features/auth/components/ProtectedRoute'
import { useAuth } from '@/features/auth/hooks/useAuth'

jest.mock('@/lib/supabase', () => ({
  supabase: {
    auth: {
      signInWithPassword: jest.fn(),
      signOut: jest.fn(),
      getSession: jest.fn(),
      onAuthStateChange: jest.fn(),
    },
  },
}))

jest.mock('@/features/auth/hooks/useAuth')

const mockUseAuth = useAuth as jest.Mock

const renderAtAdmin = () =>
  render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route path="/admin/login" element={<div>Login Page</div>} />
        <Route element={<ProtectedRoute />}>
          <Route path="/admin" element={<div>Dashboard Content</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )

describe('ProtectedRoute', () => {
  it('renders nothing while auth state is loading', () => {
    mockUseAuth.mockReturnValue({ session: null, user: null, loading: true })

    const { container } = renderAtAdmin()

    expect(container).toBeEmptyDOMElement()
  })

  it('redirects to /admin/login when there is no session', () => {
    mockUseAuth.mockReturnValue({ session: null, user: null, loading: false })

    renderAtAdmin()

    expect(screen.getByText('Login Page')).toBeInTheDocument()
  })

  it('renders the protected content when a session exists', () => {
    mockUseAuth.mockReturnValue({ session: { user: {} }, user: {}, loading: false })

    renderAtAdmin()

    expect(screen.getByText('Dashboard Content')).toBeInTheDocument()
  })
})
