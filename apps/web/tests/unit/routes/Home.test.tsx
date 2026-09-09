import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Home from '@/routes/Home'
import { usePageContent } from '@/features/pages'
import { useProducts } from '@/features/products'
import { useShownTestimonials } from '@/features/testimonials'
import { useSiteSettings } from '@/hooks/useSiteSettings'

jest.mock('@/features/pages', () => {
  const actualTypes = jest.requireActual('@/features/pages/types')
  const actualHeroSlides = jest.requireActual('@/features/pages/heroSlides')
  return {
    isHeroStyle: actualTypes.isHeroStyle,
    isStatsStyle: actualTypes.isStatsStyle,
    parseHeroSlides: actualHeroSlides.parseHeroSlides,
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

    expect(screen.getByRole('heading', { name: 'Sowing Potential. Harvesting Progress.' })).toBeInTheDocument()
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

    expect(screen.getByRole('heading', { name: 'Grow More, Worry Less' })).toBeInTheDocument()
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

  it('shows features and stats sections by default', () => {
    mockUsePageContent.mockReturnValue({ data: [] })

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )

    expect(screen.getByText('Why choose ANZ Agri Crop Sciences')).toBeInTheDocument()
    expect(screen.getByText('ANZ by the numbers')).toBeInTheDocument()
  })

  it('shows a working multi-slide hero carousel by default', () => {
    mockUsePageContent.mockReturnValue({ data: [] })

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )

    expect(screen.getByRole('heading', { name: 'Sowing Potential. Harvesting Progress.' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Built for Every Growing Season', hidden: true })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'From Our Fields to Yours', hidden: true })).toBeInTheDocument()
    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByText('3')).toBeInTheDocument()
  })

  it('renders stats as a plain section by default', () => {
    mockUsePageContent.mockReturnValue({ data: [] })

    const { container } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )

    expect(container.querySelector('.-mt-20')).not.toBeInTheDocument()
    expect(screen.getByText('ANZ by the numbers')).toBeInTheDocument()
  })

  it('renders stats as a floating card when stats_style is overlap', () => {
    mockUsePageContent.mockReturnValue({
      data: [{ section_key: 'stats_style', content: { text: 'overlap' } }],
    })

    const { container } = render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )

    expect(container.querySelector('.-mt-20')).toBeInTheDocument()
    expect(screen.getByText('ANZ by the numbers')).toBeInTheDocument()
  })

  it('hides features and stats sections when disabled', () => {
    mockUsePageContent.mockReturnValue({
      data: [
        { section_key: 'features_enabled', content: { text: 'false' } },
        { section_key: 'stats_enabled', content: { text: 'false' } },
      ],
    })

    render(
      <MemoryRouter>
        <Home />
      </MemoryRouter>,
    )

    expect(screen.queryByText('Why choose ANZ Agri Crop Sciences')).not.toBeInTheDocument()
    expect(screen.queryByText('ANZ by the numbers')).not.toBeInTheDocument()
  })
})
