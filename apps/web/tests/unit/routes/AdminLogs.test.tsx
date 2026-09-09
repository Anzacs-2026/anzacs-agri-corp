import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminLogs from '@/routes/AdminLogs'
import { useAdminLogs } from '@/features/logs/hooks/useLogs'

jest.mock('@/features/logs/hooks/useLogs', () => ({
  useAdminLogs: jest.fn(),
}))

jest.mock('@/lib/supabase', () => ({
  supabase: { from: jest.fn() },
}))

const mockUseAdminLogs = useAdminLogs as jest.Mock

describe('AdminLogs', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('shows a loading state', () => {
    mockUseAdminLogs.mockReturnValue({ data: undefined, isLoading: true })
    render(<AdminLogs />)
    expect(screen.getByText('Loading…')).toBeInTheDocument()
  })

  it('shows an empty state when there are no logs', () => {
    mockUseAdminLogs.mockReturnValue({ data: [], isLoading: false })
    render(<AdminLogs />)
    expect(screen.getByText('No logs yet.')).toBeInTheDocument()
  })

  it('renders each log row with a tight, fixed-padding wrapper (not flex/justify-between)', () => {
    mockUseAdminLogs.mockReturnValue({
      data: [
        { id: '1', error_message: 'First error', stack: null, context: null, user_id: null, created_at: '2026-01-01T00:00:00Z' },
        { id: '2', error_message: 'Second error', stack: 'at foo()', context: { path: '/x' }, user_id: 'u1', created_at: '2026-01-02T00:00:00Z' },
      ],
      isLoading: false,
    })
    const { container } = render(<AdminLogs />)

    expect(screen.getByText('First error')).toBeInTheDocument()
    expect(screen.getByText('Second error')).toBeInTheDocument()

    const wrapper = container.querySelector('.divide-y')
    expect(wrapper).toBeInTheDocument()
    expect(wrapper?.className).not.toMatch(/justify-between/)
    wrapper?.querySelectorAll(':scope > div').forEach((row) => {
      expect(row.className).toMatch(/px-4 py-3/)
    })
  })

  it('expands stack/context details for a row that has them', async () => {
    const user = userEvent.setup()
    mockUseAdminLogs.mockReturnValue({
      data: [{ id: '2', error_message: 'Second error', stack: 'at foo()', context: { path: '/x' }, user_id: 'u1', created_at: '2026-01-02T00:00:00Z' }],
      isLoading: false,
    })
    render(<AdminLogs />)

    await user.click(screen.getByText('Details'))
    expect(screen.getByText('at foo()')).toBeInTheDocument()
  })

  it('shows a Load more button when the row count hits the page size', () => {
    const data = Array.from({ length: 50 }, (_, i) => ({
      id: String(i),
      error_message: `Error ${i}`,
      stack: null,
      context: null,
      user_id: null,
      created_at: '2026-01-01T00:00:00Z',
    }))
    mockUseAdminLogs.mockReturnValue({ data, isLoading: false })
    render(<AdminLogs />)

    expect(screen.getByRole('button', { name: 'Load more' })).toBeInTheDocument()
  })
})
