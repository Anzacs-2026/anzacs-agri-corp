import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from '@/routes/Home'
import { usePageContent } from '@/features/pages'
import { useProducts } from '@/features/products'
import { useShownTestimonials } from '@/features/testimonials'
import { useSiteSettings } from '@/hooks/useSiteSettings'

jest.mock('@/features/pages', () => {
  const actual = jest.requireActual('@/features/pages/types')
  return {
    parseHeroVariant: actual.parseHeroVariant,
    usePageContent: jest.fn(),
    getSectionText: (
      sections: { section_key: string; content: { text: string } }[] | undefined,
      key: string,
      fallback: string,
    ) => sections?.find((s) => s.section_key === key)?.content.text ?? fallback,
  }
})

jest.mock('@/features/products', () => ({
  useProducts: jest.fn(),
  ProductCard: () => null,
}))

jest.mock('@/features/testimonials', () => ({
  useShownTestimonials: jest.fn(),
  TestimonialCard: () => null,
}))

jest.mock('@/hooks/useSiteSettings', () => ({
  useSiteSettings: jest.fn(),
}))

jest.mock('@/features/photos/services/photoService', () => ({
  photoService: { getPublicUrl: jest.fn(() => 'https://example.com/photo.jpg') },
}))

const mockUsePageContent = usePageContent as jest.Mock
const mockUseProducts = useProducts as jest.Mock
const mockUseShownTestimonials = useShownTestimonials as jest.Mock
const mockUseSiteSettings = useSiteSettings as jest.Mock

describe('Home', () => {
  beforeEach(() => {
    mockUseProducts.mockReturnValue({ data: [] })
    mockUseShownTestimonials.mockReturnValue({ data: [] })
    mockUseSiteSettings.mockReturnValue({ data: { testimonials_enabled: false } })
  })

  it('renders placeholder copy when no page_content exists yet', () => {
    mockUsePageContent.mockReturnValue({ data: [] })

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )

    expect(screen.getByText('Sowing Potential. Harvesting Progress.')).toBeInTheDocument()
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

  it('hides testimonials section when the switch is off', () => {
    mockUsePageContent.mockReturnValue({ data: [] })
    mockUseSiteSettings.mockReturnValue({ data: { testimonials_enabled: false } })
    mockUseShownTestimonials.mockReturnValue({ data: [{ id: '1', customer_name: 'Jane', quote: 'Great!' }] })

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )

    expect(screen.queryByText('What growers say')).not.toBeInTheDocument()
  })

  it('shows testimonials section when the switch is on and testimonials exist', () => {
    mockUsePageContent.mockReturnValue({ data: [] })
    mockUseSiteSettings.mockReturnValue({ data: { testimonials_enabled: true } })
    mockUseShownTestimonials.mockReturnValue({ data: [{ id: '1', customer_name: 'Jane', quote: 'Great!' }] })

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )

    expect(screen.getByText('What growers say')).toBeInTheDocument()
  })
})
