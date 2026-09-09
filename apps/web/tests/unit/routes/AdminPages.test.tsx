import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import AdminPages from '@/routes/AdminPages'
import { usePageContent, useUpsertPageContent } from '@/features/pages'

jest.mock('@/features/pages', () => ({
  usePageContent: jest.fn(),
  useUpsertPageContent: jest.fn(),
  HERO_VARIANTS: ['split', 'mockup', 'minimal'],
  SECTION_KEYS: {
    home: ['hero_variant', 'hero_title', 'hero_subtitle', 'intro'],
    about: ['body'],
    contact: ['intro'],
  },
  getSectionText: (
    sections: { section_key: string; content: { text: string } }[] | undefined,
    key: string,
    fallback: string,
  ) => sections?.find((s) => s.section_key === key)?.content.text ?? fallback,
}))

jest.mock('@/features/photos/services/photoService', () => ({
  photoService: { getPublicUrl: jest.fn(() => 'https://example.com/photo.jpg') },
}))

jest.mock('@/features/photos/hooks/usePhotos', () => ({
  useUploadPhoto: jest.fn(() => ({ mutateAsync: jest.fn(), isPending: false })),
}))

const mockUsePageContent = usePageContent as jest.Mock
const mockUseUpsertPageContent = useUpsertPageContent as jest.Mock

const renderAt = (page: string) =>
  render(
    <MemoryRouter initialEntries={[`/${page}`]}>
      <Routes>
        <Route path="/:page" element={<AdminPages />} />
      </Routes>
    </MemoryRouter>,
  )

describe('AdminPages', () => {
  const mutate = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
    mockUsePageContent.mockReturnValue({ data: [] })
    mockUseUpsertPageContent.mockReturnValue({ mutate, isPending: false })
  })

  it('renders a humanized field for each section of the selected page', () => {
    renderAt('home')
    expect(screen.getByLabelText('Hero Title')).toBeInTheDocument()
    expect(screen.getByLabelText('Hero Subtitle')).toBeInTheDocument()
    expect(screen.getByLabelText('Introduction')).toBeInTheDocument()
  })

  it('saves a section with its edited text', async () => {
    const user = userEvent.setup()
    renderAt('home')

    await user.type(screen.getByLabelText('Hero Title'), 'New headline')
    await user.click(screen.getAllByRole('button', { name: /save/i })[0])

    expect(mutate).toHaveBeenCalledWith({ sectionKey: 'hero_title', content: { text: 'New headline' } })
  })

  it('saves the hero style immediately on select, without a Save button', async () => {
    const user = userEvent.setup()
    renderAt('home')

    await user.selectOptions(screen.getByLabelText('Hero Style'), 'mockup')

    expect(mutate).toHaveBeenCalledWith({ sectionKey: 'hero_variant', content: { text: 'mockup' } })
  })

  it('renders a different page section set based on the route', () => {
    renderAt('about')

    expect(screen.getByLabelText('Page Body')).toBeInTheDocument()
    expect(screen.queryByLabelText('Hero Title')).not.toBeInTheDocument()
  })
})
