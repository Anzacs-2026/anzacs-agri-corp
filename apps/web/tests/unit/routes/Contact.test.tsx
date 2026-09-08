import { render, screen } from '@testing-library/react'
import Contact from '@/routes/Contact'
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

describe('Contact', () => {
  it('renders placeholder copy when no page_content exists yet', () => {
    mockUsePageContent.mockReturnValue({ data: [] })
    render(<Contact />)
    expect(screen.getByText(/Phase 5 wires the enquiry form/)).toBeInTheDocument()
  })

  it('renders real content once page_content is set', () => {
    mockUsePageContent.mockReturnValue({ data: [{ section_key: 'intro', content: { text: 'Reach out any time.' } }] })
    render(<Contact />)
    expect(screen.getByText('Reach out any time.')).toBeInTheDocument()
  })
})
