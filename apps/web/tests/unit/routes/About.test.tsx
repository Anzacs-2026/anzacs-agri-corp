import { render, screen } from '@testing-library/react'
import About from '@/routes/About'
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

describe('About', () => {
  it('renders placeholder copy when no page_content exists yet', () => {
    mockUsePageContent.mockReturnValue({ data: [] })
    render(<About />)
    expect(screen.getByText(/Phase 4 wires page_content/)).toBeInTheDocument()
  })

  it('renders real content once page_content is set', () => {
    mockUsePageContent.mockReturnValue({ data: [{ section_key: 'body', content: { text: 'Our story since 1998.' } }] })
    render(<About />)
    expect(screen.getByText('Our story since 1998.')).toBeInTheDocument()
  })
})
