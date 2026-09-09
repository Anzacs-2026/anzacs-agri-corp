import { render, screen, fireEvent } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import Header from '@/components/Header'

describe('Header', () => {
  it('renders the wordmark and public nav links', () => {
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

  it('links to the admin sign-in page', () => {
    render(
      <MemoryRouter>
        <Header />
      </MemoryRouter>,
    )

    expect(screen.getByRole('link', { name: 'Admin' })).toHaveAttribute('href', '/admin/login')
  })

  it('renders transparent/overlaid on a hero route before scrolling', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Header />
      </MemoryRouter>,
    )

    expect(screen.getByRole('banner')).toHaveClass('bg-transparent')
  })

  it('renders solid on a route with no hero', () => {
    render(
      <MemoryRouter initialEntries={['/contact']}>
        <Header />
      </MemoryRouter>,
    )

    expect(screen.getByRole('banner')).toHaveClass('bg-forest')
  })

  it('turns solid after scrolling past the threshold on a hero route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Header />
      </MemoryRouter>,
    )

    expect(screen.getByRole('banner')).toHaveClass('bg-transparent')

    Object.defineProperty(window, 'scrollY', { value: 100, configurable: true })
    fireEvent.scroll(window)

    expect(screen.getByRole('banner')).toHaveClass('bg-forest')
  })

  it('opens the mobile menu and shows nav links, forcing a solid header even on a hero route', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Header />
      </MemoryRouter>,
    )

    expect(screen.queryByRole('button', { name: /open menu/i })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))

    expect(screen.getByRole('banner')).toHaveClass('bg-forest')
    expect(screen.getAllByRole('link', { name: 'About' }).length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: /close menu/i })).toBeInTheDocument()
  })

  it('closes the mobile menu when a link is clicked', () => {
    render(
      <MemoryRouter initialEntries={['/']}>
        <Header />
      </MemoryRouter>,
    )

    fireEvent.click(screen.getByRole('button', { name: /open menu/i }))
    const mobileLinks = screen.getAllByRole('link', { name: 'Contact' })
    fireEvent.click(mobileLinks[mobileLinks.length - 1])

    expect(screen.queryByRole('button', { name: /close menu/i })).not.toBeInTheDocument()
  })
})
