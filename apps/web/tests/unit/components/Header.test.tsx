import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Header from '@/components/Header'

describe('Header', () => {
  it('renders the wordmark and nav links', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    )

    expect(screen.getByText('ANZ Agricrop')).toBeInTheDocument()

    expect(screen.getByRole('link', { name: 'Home' })).toHaveAttribute('href', '/')
    expect(screen.getByRole('link', { name: 'Products' })).toHaveAttribute('href', '/products')
    expect(screen.getByRole('link', { name: 'About' })).toHaveAttribute('href', '/about')
    expect(screen.getByRole('link', { name: 'Contact' })).toHaveAttribute('href', '/contact')
  })
})
