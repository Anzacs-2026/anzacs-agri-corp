import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from '@/routes/Home'
import { usePageContent } from '@/features/pages'
import { useProducts } from '@/features/products'

jest.mock('@/features/pages', () => ({
  usePageContent: jest.fn(),
  getSectionText: (
    sections: { section_key: string; content: { text: string } }[] | undefined,
    key: string,
    fallback: string,
  ) => sections?.find((s) => s.section_key === key)?.content.text ?? fallback,
}))

jest.mock('@/features/products', () => ({
  useProducts: jest.fn(),
  ProductCard: () => null,
}))

const mockUsePageContent = usePageContent as jest.Mock
const mockUseProducts = useProducts as jest.Mock

describe('Home', () => {
  beforeEach(() => {
    mockUseProducts.mockReturnValue({ data: [] })
  })

  it('renders placeholder copy when no page_content exists yet', () => {
    mockUsePageContent.mockReturnValue({ data: [] })

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )

    expect(screen.getByText('ANZ Agri Crop Sciences')).toBeInTheDocument()
  })

  it('renders real content once page_content is set', () => {
    mockUsePageContent.mockReturnValue({
      data: [{ section_key: 'hero_title', content: { text: 'Grow More, Worry Less' } }],
    })

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )

    expect(screen.getByText('Grow More, Worry Less')).toBeInTheDocument()
  })
})
