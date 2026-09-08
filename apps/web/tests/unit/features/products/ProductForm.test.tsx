import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProductForm from '@/features/products/components/admin/ProductForm'

describe('ProductForm', () => {
  it('renders empty fields for a new product', () => {
    render(<ProductForm onSubmit={jest.fn()} submitting={false} />)

    expect(screen.getByLabelText(/name/i)).toHaveValue('')
    expect(screen.getByLabelText(/category/i)).toHaveValue('')
  })

  it('auto-generates a slug from the name', async () => {
    const user = userEvent.setup()
    render(<ProductForm onSubmit={jest.fn()} submitting={false} />)

    await user.type(screen.getByLabelText(/^name/i), 'Hybrid Maize Seed')

    expect(screen.getByLabelText(/slug/i)).toHaveValue('hybrid-maize-seed')
  })

  it('calls onSubmit with parsed form values', async () => {
    const handleSubmit = jest.fn()
    const user = userEvent.setup()
    render(<ProductForm onSubmit={handleSubmit} submitting={false} />)

    await user.type(screen.getByLabelText(/^name/i), 'NPK Fertilizer')
    await user.type(screen.getByLabelText(/category/i), 'Fertilizer')
    await user.type(screen.getByLabelText(/traits/i), 'organic, fast-acting')
    await user.click(screen.getByRole('button', { name: /save/i }))

    expect(handleSubmit).toHaveBeenCalledWith(
      expect.objectContaining({
        name: 'NPK Fertilizer',
        category: 'Fertilizer',
        traits: ['organic', 'fast-acting'],
      }),
      null,
    )
  })

  it('pre-fills fields when editing an existing product', () => {
    render(
      <ProductForm
        onSubmit={jest.fn()}
        submitting={false}
        initialValues={{
          name: 'Bio-stimulant',
          slug: 'bio-stimulant',
          category: 'Bio-stimulant',
          short_description: 'Root growth booster',
          description: '',
          specs: {},
          traits: [],
          visible: true,
        }}
      />,
    )

    expect(screen.getByLabelText(/^name/i)).toHaveValue('Bio-stimulant')
    expect(screen.getByLabelText(/slug/i)).toHaveValue('bio-stimulant')
  })
})
