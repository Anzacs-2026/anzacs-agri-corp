import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import About from '@/routes/About'
import { usePageContent } from '@/features/pages'

jest.mock('@/features/pages', () => {
  const actual = jest.requireActual('@/features/pages/types')
  return {
    isHeroStyle: actual.isHeroStyle,
    usePageContent: jest.fn(),
    getSectionText: (
      sections: { section_key: string; content: { text: string } }[] | undefined,
      key: string,
      fallback: string,
    ) => sections?.find((s) => s.section_key === key)?.content.text ?? fallback,
  }
})

jest.mock('@/features/photos/services/photoService', () => ({
  photoService: { getPublicUrl: jest.fn(() => 'https://example.com/photo.jpg') },
}))

const mockUsePageContent = usePageContent as jest.Mock

describe('About', () => {
  it('renders the default company profile copy when no page_content exists yet', () => {
    mockUsePageContent.mockReturnValue({ data: [] })
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>,
    )

    expect(screen.getByText(/integrated agricultural enterprise/i)).toBeInTheDocument()
    expect(screen.getByText('Who We Are')).toBeInTheDocument()
    expect(screen.getByText('Core Capabilities')).toBeInTheDocument()
    expect(screen.getByText('Why ANZ')).toBeInTheDocument()
  })

  it('renders real content once page_content overrides a section', () => {
    mockUsePageContent.mockReturnValue({
      data: [{ section_key: 'who_we_are', content: { text: 'Our custom story goes here.' } }],
    })
    render(
      <MemoryRouter>
        <About />
      </MemoryRouter>,
    )

    expect(screen.getByText('Our custom story goes here.')).toBeInTheDocument()
  })
})
