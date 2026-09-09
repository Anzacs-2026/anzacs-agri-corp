import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Hero from '@/components/Hero'
import { HERO_CATEGORIES, HERO_SUBTYPES } from '@/features/pages/types'

jest.mock('@/features/photos/services/photoService', () => ({
  photoService: { getPublicUrl: jest.fn(() => 'https://example.com/photo.jpg') },
}))

jest.mock('@/features/pages', () => jest.requireActual('@/features/pages/types'))

const product = {
  id: '1',
  name: 'Bottle Gourd F1 Julia',
  slug: 'bottle-gourd-f1-julia',
  category: 'Gourds & Melons',
  short_description: 'Tender flesh, high yielding.',
  primary_photo: null,
}

const renderHero = (variant: string) =>
  render(
    <MemoryRouter>
      <Hero
        variant={variant}
        eyebrow="Seeds for life"
        title="ANZ Agri Crop Sciences"
        subtitle="Trusted hybrid seeds."
        ctaLabel="Explore products"
        ctaTo="/products"
        products={[product]}
        stats={[{ label: 'Varieties', value: '24+' }]}
      />
    </MemoryRouter>,
  )

describe('Hero', () => {
  it.each(HERO_CATEGORIES.flatMap((category) => HERO_SUBTYPES[category].map((subtype) => [category, subtype])))(
    'renders %s:%s without crashing',
    (category, subtype) => {
      renderHero(`${category}:${subtype}`)
      expect(screen.getByRole('heading', { name: 'ANZ Agri Crop Sciences' })).toBeInTheDocument()
    },
  )

  it('falls back gracefully for a garbage/legacy variant value', () => {
    renderHero('mockup')
    expect(screen.getByRole('heading', { name: 'ANZ Agri Crop Sciences' })).toBeInTheDocument()
  })

  it('hides the CTA for the text-only minimal sub-type', () => {
    renderHero('minimal:text-only')
    expect(screen.queryByRole('link', { name: 'Explore products' })).not.toBeInTheDocument()
  })

  it('shows the CTA for the centered minimal sub-type', () => {
    renderHero('minimal:centered')
    expect(screen.getByRole('link', { name: 'Explore products' })).toBeInTheDocument()
  })
})
