import { render, screen, act, fireEvent } from '@testing-library/react'
import Carousel from '@/components/Carousel'

describe('Carousel', () => {
  it('renders nothing for an empty item list', () => {
    const { container } = render(<Carousel items={[]} ariaLabel="Empty" renderItem={(item) => <div>{String(item)}</div>} />)
    expect(container).toBeEmptyDOMElement()
  })

  it('renders the single item directly without dots when there is only one', () => {
    render(<Carousel items={['only']} ariaLabel="Single" renderItem={(item) => <div>{item}</div>} />)
    expect(screen.getByText('only')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /go to slide/i })).not.toBeInTheDocument()
  })

  it('renders all items and dot navigation for multiple items', () => {
    render(
      <Carousel items={['a', 'b', 'c']} ariaLabel="Multi" renderItem={(item) => <div>Slide {item}</div>} />,
    )
    expect(screen.getByText('Slide a')).toBeInTheDocument()
    expect(screen.getByText('Slide b')).toBeInTheDocument()
    expect(screen.getByText('Slide c')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /go to slide/i })).toHaveLength(3)
  })

  it('advances the active slide on autoplay', () => {
    jest.useFakeTimers()
    render(
      <Carousel items={['a', 'b']} ariaLabel="Autoplay" intervalMs={1000} renderItem={(item) => <div>Slide {item}</div>} />,
    )

    expect(screen.getByRole('button', { name: 'Go to slide 1' })).toHaveAttribute('aria-current', 'true')

    act(() => {
      jest.advanceTimersByTime(1000)
    })

    expect(screen.getByRole('button', { name: 'Go to slide 2' })).toHaveAttribute('aria-current', 'true')
    jest.useRealTimers()
  })

  it('jumps to a slide when its dot is clicked', () => {
    render(
      <Carousel items={['a', 'b', 'c']} ariaLabel="Dots" renderItem={(item) => <div>Slide {item}</div>} />,
    )

    fireEvent.click(screen.getByRole('button', { name: 'Go to slide 3' }))

    expect(screen.getByRole('button', { name: 'Go to slide 3' })).toHaveAttribute('aria-current', 'true')
  })
})
