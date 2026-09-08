import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Header from '@/components/Header'
import { useAuth } from '@/features/auth'

jest.mock('@/features/auth', () => ({
  useAuth: jest.fn(),
  authService: { signOut: jest.fn() },
}))

const mockUseAuth = useAuth as jest.Mock

describe('Header', () => {
  it('renders the wordmark and public nav links', () => {
    mockUseAuth.mockReturnValue({ session: null, user: null, loading: false })

    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    )

    expect(screen.getByText('ANZ Agricrop')).toBeInTheDocument()

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Products' })).toHaveAttribute('href', '/products')
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about')
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact')
  })

  it('hides admin links and sign out on public routes even when logged in', () => {
    mockUseAuth.mockReturnValue({ session: { user: {} }, user: {}, loading: false })

    render(
      <MemoryRouter initialEntries={['/products']}>
        <Header />
      </MemoryRouter>,
    )

    expect(screen.queryByRole('link', { name: 'Pages' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /sign out/i })).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
  })

  it('shows admin links and sign out on admin routes when logged in', () => {
    mockUseAuth.mockReturnValue({ session: { user: {} }, user: {}, loading: false })

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Header />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Pages' })).toHaveAttribute('href', '/admin/pages')
    expect(screen.getByRole('link', { name: 'Photos' })).toHaveAttribute('href', '/admin/photos')
    expect(screen.getByRole('button', { name: /sign out/i })).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: 'Home' })).not.toBeInTheDocument()
  })

  it('hides admin links on admin routes when logged out', () => {
    mockUseAuth.mockReturnValue({ session: null, user: null, loading: false })

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <Header />
      </MemoryRouter>,
    )

    expect(screen.queryByRole('link', { name: 'Pages' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /sign out/i })).not.toBeInTheDocument()
  })
})
