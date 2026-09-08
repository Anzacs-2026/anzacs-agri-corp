import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import LoginForm from '@/features/auth/components/LoginForm'
import { authService } from '@/features/auth/services/authService'

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

jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => mockNavigate,
}))

const mockNavigate = jest.fn()

describe('LoginForm', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders email and password fields', () => {
    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    )

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
  })

  it('navigates to /admin on successful sign in', async () => {
    jest.spyOn(authService, 'signIn').mockResolvedValue({ error: null } as never)
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText(/email/i), 'owner@anzacs.in')
    await user.type(screen.getByLabelText(/password/i), 'correct-password')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/admin'))
  })

  it('shows an error message when sign in fails', async () => {
    jest.spyOn(authService, 'signIn').mockResolvedValue({ error: { message: 'Invalid credentials' } } as never)
    const user = userEvent.setup()

    render(
      <MemoryRouter>
        <LoginForm />
      </MemoryRouter>,
    )

    await user.type(screen.getByLabelText(/email/i), 'owner@anzacs.in')
    await user.type(screen.getByLabelText(/password/i), 'wrong-password')
    await user.click(screen.getByRole('button', { name: /sign in/i }))

    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid credentials')
    expect(mockNavigate).not.toHaveBeenCalled()
  })
})
