import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { MemoryRouter } from 'react-router-dom'
import ProductGrid from '@/features/products/components/ProductGrid'
import { useProducts } from '@/features/products/hooks/useProducts'

jest.mock('@/features/products/hooks/useProducts', () => ({
  useProducts: jest.fn(),
}))

const mockUseProducts = useProducts as jest.Mock

const products = [
  { id: '1', name: 'Hybrid Maize Seed', slug: 'hybrid-maize', category: 'Seeds', short_description: 'High yield maize' },
  { id: '2', name: 'NPK Fertilizer', slug: 'npk-fertilizer', category: 'Fertilizer', short_description: 'Balanced nutrients' },
  { id: '3', name: 'Tomato Seed', slug: 'tomato-seed', category: 'Seeds', short_description: 'Disease resistant' },
]

const renderGrid = () =>
  render(
    <MemoryRouter>
      <ProductGrid />
    </MemoryRouter>,
  )

describe('ProductGrid', () => {
  beforeEach(() => {
    mockUseProducts.mockReturnValue({ data: products, isLoading: false })
  })

  it('renders all products by default', () => {
    renderGrid()
    expect(screen.getByText('Hybrid Maize Seed')).toBeInTheDocument()
    expect(screen.getByText('NPK Fertilizer')).toBeInTheDocument()
    expect(screen.getByText('Tomato Seed')).toBeInTheDocument()
  })

  it('filters by search text', async () => {
    const user = userEvent.setup()
    renderGrid()

    await user.type(screen.getByPlaceholderText(/search/i), 'maize')

    expect(screen.getByText('Hybrid Maize Seed')).toBeInTheDocument()
    expect(screen.queryByText('NPK Fertilizer')).not.toBeInTheDocument()
  })

  it('filters by category', async () => {
    const user = userEvent.setup()
    renderGrid()

    await user.selectOptions(screen.getByLabelText(/category/i), 'Fertilizer')

    expect(screen.getByText('NPK Fertilizer')).toBeInTheDocument()
    expect(screen.queryByText('Hybrid Maize Seed')).not.toBeInTheDocument()
  })
})
