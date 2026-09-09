import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Hero from '@/components/Hero'
import { HERO_STYLES } from '@/features/pages/types'

jest.mock('@/features/photos/services/photoService', () => ({
  photoService: { getPublicUrl: jest.fn(() => 'https://example.com/photo.jpg') },
}))

jest.mock('@/features/pages', () => jest.requireActual('@/features/pages/types'))

const renderHero = (variant: string, imageUrl?: string | null) =>
  render(
    <MemoryRouter>
      <Hero
        variant={variant}
        eyebrow="Seeds for life"
        title="ANZ Agri Crop Sciences"
        subtitle="Trusted hybrid seeds."
        ctaLabel="Explore products"
        ctaTo="/products"
        imageUrl={imageUrl}
      />
    </MemoryRouter>,
  )

describe('Hero', () => {
  it.each(HERO_STYLES)('renders %s without crashing', (style) => {
    renderHero(style)
    expect(screen.getByRole('heading', { name: 'ANZ Agri Crop Sciences' })).toBeInTheDocument()
  })

  it('falls back gracefully for a garbage/legacy variant value', () => {
    renderHero('mockup:floating-ui')
    expect(screen.getByRole('heading', { name: 'ANZ Agri Crop Sciences' })).toBeInTheDocument()
  })

  it('shows the CTA when a label and link are given', () => {
    renderHero('banner-left')
    expect(screen.getByRole('link', { name: 'Explore products' })).toBeInTheDocument()
  })

  it('renders the background photo when an imageUrl is given', () => {
    const { container } = renderHero('banner-center', 'https://example.com/hero.jpg')
    expect(container.querySelector('img')).toHaveAttribute('src', 'https://example.com/hero.jpg')
  })
})
