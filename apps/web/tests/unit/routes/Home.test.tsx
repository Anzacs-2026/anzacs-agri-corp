import { render, screen } from '@testing-library/react'
import Home from '@/routes/Home'
import { usePageContent } from '@/features/pages'

jest.mock('@/features/pages', () => ({
  usePageContent: jest.fn(),
  getSectionText: (
    sections: { section_key: string; content: { text: string } }[] | undefined,
    key: string,
    fallback: string,
  ) => sections?.find((s) => s.section_key === key)?.content.text ?? fallback,
}))

const mockUsePageContent = usePageContent as jest.Mock

describe('Home', () => {
  it('renders placeholder copy when no page_content exists yet', () => {
    mockUsePageContent.mockReturnValue({ data: [] })

    render(<Home />)

    expect(screen.getByText('ANZ Agricrop Sciences')).toBeInTheDocument()
  })

  it('renders real content once page_content is set', () => {
    mockUsePageContent.mockReturnValue({
      data: [{ section_key: 'hero_title', content: { text: 'Grow More, Worry Less' } }],
    })

    render(<Home />)

    expect(screen.getByText('Grow More, Worry Less')).toBeInTheDocument()
  })
})
