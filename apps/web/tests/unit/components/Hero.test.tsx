import { render, screen, act, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Hero, { type HeroSlide } from '@/components/Hero'
import { HERO_STYLES } from '@/features/pages/types'

jest.mock('@/features/photos/services/photoService', () => ({
  photoService: { getPublicUrl: jest.fn(() => 'https://example.com/photo.jpg') },
}))

jest.mock('@/features/pages', () => jest.requireActual('@/features/pages/types'))

const baseSlide = (overrides: Partial<HeroSlide> = {}): HeroSlide => ({
  imageUrl: null,
  eyebrow: 'Seeds for life',
  title: 'ANZ Agri Crop Sciences',
  subtitle: 'Trusted hybrid seeds.',
  ctaLabel: 'Explore products',
  ctaTo: '/products',
  ...overrides,
})

const renderHero = (variant: string, slides: HeroSlide[], parallax?: boolean) =>
  render(
    <MemoryRouter>
      <Hero variant={variant} slides={slides} parallax={parallax} />
    </MemoryRouter>,
  )

describe('Hero', () => {
  it.each(HERO_STYLES)('renders %s without crashing', (style) => {
    renderHero(style, [baseSlide()])
    expect(screen.getByRole('heading', { name: 'ANZ Agri Crop Sciences' })).toBeInTheDocument()
  })

  it('falls back gracefully for a garbage/legacy variant value', () => {
    renderHero('mockup:floating-ui', [baseSlide()])
    expect(screen.getByRole('heading', { name: 'ANZ Agri Crop Sciences' })).toBeInTheDocument()
  })

  it('renders nothing when there are no slides', () => {
    const { container } = renderHero('banner-left', [])
    expect(container).toBeEmptyDOMElement()
  })

  it('shows the CTA when a label and link are given', () => {
    renderHero('banner-left', [baseSlide()])
    expect(screen.getByRole('link', { name: 'Explore products' })).toBeInTheDocument()
  })

  it('renders the background photo when a slide has an imageUrl', () => {
    const { container } = renderHero('banner-center', [baseSlide({ imageUrl: 'https://example.com/hero.jpg' })])
    expect(container.querySelector('img')).toHaveAttribute('src', 'https://example.com/hero.jpg')
  })

  it('renders a fixed-attachment background instead of an img when parallax is on', () => {
    const { container } = renderHero('banner-center', [baseSlide({ imageUrl: 'https://example.com/hero.jpg' })], true)
    expect(container.querySelector('img')).not.toBeInTheDocument()
    const bg = container.querySelector('.bg-fixed')
    expect(bg).toHaveStyle({ backgroundImage: 'url(https://example.com/hero.jpg)' })
  })

  it('ignores parallax when there is no photo', () => {
    const { container } = renderHero('banner-center', [baseSlide({ imageUrl: null })], true)
    expect(container.querySelector('.bg-fixed')).not.toBeInTheDocument()
  })

  it('renders numbered, labeled navigation with multiple slides and advances on autoplay', () => {
    jest.useFakeTimers()
    renderHero('banner-left', [
      baseSlide({ title: 'Slide One' }),
      baseSlide({ title: 'Slide Two' }),
    ])

    expect(screen.getByText('1')).toBeInTheDocument()
    expect(screen.getByText('2')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '1 Slide One' })).toHaveAttribute('aria-current', 'true')

    act(() => {
      jest.advanceTimersByTime(5500)
    })

    expect(screen.getByRole('button', { name: '2 Slide Two' })).toHaveAttribute('aria-current', 'true')
    jest.useRealTimers()
  })

  it('jumps slides when a numbered nav item is clicked', () => {
    renderHero('banner-left', [
      baseSlide({ title: 'Slide One' }),
      baseSlide({ title: 'Slide Two' }),
    ])

    fireEvent.click(screen.getByRole('button', { name: '2 Slide Two' }))

    expect(screen.getByRole('button', { name: '2 Slide Two' })).toHaveAttribute('aria-current', 'true')
  })

  it('shows no navigation bar for a single slide', () => {
    renderHero('banner-left', [baseSlide()])
    expect(screen.queryByRole('button', { name: /^1 /i })).not.toBeInTheDocument()
  })
})
