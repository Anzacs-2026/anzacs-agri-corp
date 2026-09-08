import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import AdminPages from '@/routes/AdminPages'
import { usePageContent, useUpsertPageContent } from '@/features/pages'

jest.mock('@/features/pages', () => ({
  usePageContent: jest.fn(),
  useUpsertPageContent: jest.fn(),
  SECTION_KEYS: {
    home: ['hero_title', 'hero_subtitle', 'intro'],
    about: ['body'],
    contact: ['intro'],
  },
  getSectionText: (
    sections: { section_key: string; content: { text: string } }[] | undefined,
    key: string,
    fallback: string,
  ) => sections?.find((s) => s.section_key === key)?.content.text ?? fallback,
}))

const mockUsePageContent = usePageContent as jest.Mock
const mockUseUpsertPageContent = useUpsertPageContent as jest.Mock

describe('AdminPages', () => {
  const mutate = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUsePageContent.mockReturnValue({ data: [] })
    mockUseUpsertPageContent.mockReturnValue({ mutate, isPending: false })
  })

  it('renders a textarea for each section of the selected page', () => {
    render(<AdminPages />)
    expect(screen.getByLabelText('hero_title')).toBeInTheDocument()
    expect(screen.getByLabelText('hero_subtitle')).toBeInTheDocument()
    expect(screen.getByLabelText('intro')).toBeInTheDocument()
  })

  it('saves a section with its edited text', async () => {
    const user = userEvent.setup()
    render(<AdminPages />)

    await user.type(screen.getByLabelText('hero_title'), 'New headline')
    await user.click(screen.getAllByRole('button', { name: /save/i })[0])

    expect(mutate).toHaveBeenCalledWith({ sectionKey: 'hero_title', content: { text: 'New headline' } })
  })

  it('switches sections when a different page is selected', async () => {
    const user = userEvent.setup()
    render(<AdminPages />)

    await user.selectOptions(screen.getByLabelText(/page/i), 'about')

    expect(screen.getByLabelText('body')).toBeInTheDocument()
    expect(screen.queryByLabelText('hero_title')).not.toBeInTheDocument()
  })
})
