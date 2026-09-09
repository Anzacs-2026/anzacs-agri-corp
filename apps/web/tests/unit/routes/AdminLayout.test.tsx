import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import AdminLayout from '@/routes/AdminLayout'
import { authService, useAuth } from '@/features/auth'

jest.mock('@/features/auth', () => ({
  useAuth: jest.fn(),
  authService: { signOut: jest.fn() },
}))

const mockNavigate = jest.fn()
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const mockUseAuth = useAuth as jest.Mock

describe('AdminLayout', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    mockUseAuth.mockReturnValue({ session: { user: {} }, user: { email: 'owner@anzacs.in' }, loading: false })
  })

  it('redirects to login when logged out', () => {
    mockUseAuth.mockReturnValue({ session: null, user: null, loading: false })

    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AdminLayout />
      </MemoryRouter>,
    )

    expect(screen.queryByRole('link', { name: /dashboard/i })).not.toBeInTheDocument()
  })

  it('renders sidebar links to every admin section', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AdminLayout />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: /dashboard/i })).toHaveAttribute('href', '/admin')
    expect(screen.getByRole('link', { name: 'Products' })).toHaveAttribute('href', '/admin/products')
    expect(screen.getByText('Pages')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/admin/pages/home')
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/admin/pages/about')
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/admin/pages/contact')
    expect(screen.getByRole('link', { name: 'Products Page' })).toHaveAttribute('href', '/admin/pages/products')
    expect(screen.getByRole('link', { name: /enquiries/i })).toHaveAttribute('href', '/admin/enquiries')
  })

  it('shows the signed-in user email', () => {
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AdminLayout />
      </MemoryRouter>,
    )

    expect(screen.getByText('owner@anzacs.in')).toBeInTheDocument()
  })

  it('signs out and navigates to the login page', async () => {
    const user = userEvent.setup()
    render(
      <MemoryRouter initialEntries={['/admin']}>
        <AdminLayout />
      </MemoryRouter>,
    )

    await user.click(screen.getByRole('button', { name: /sign out/i }))

    expect(authService.signOut).toHaveBeenCalled()
    expect(mockNavigate).toHaveBeenCalledWith('/admin/login')
  })
})
