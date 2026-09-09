import { render, screen, act } from '@testing-library/react'
import Reveal from '@/components/Reveal'

describe('Reveal', () => {
  const originalIO = window.IntersectionObserver

  afterEach(() => {
    window.IntersectionObserver = originalIO
  })

  it('renders children immediately when IntersectionObserver is unavailable', () => {
    // @ts-expect-error -- simulate an environment without IntersectionObserver
    delete window.IntersectionObserver

    render(<Reveal>Hello</Reveal>)

    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('starts hidden and reveals once the observed element intersects', () => {
    let trigger: (entry: { isIntersecting: boolean }) => void = () => {}
    class MockIntersectionObserver {
      constructor(callback: (entries: { isIntersecting: boolean }[]) => void) {
        trigger = (entry) => callback([entry])
      }
      observe() {}
      disconnect() {}
    }
    // @ts-expect-error -- minimal mock, not implementing the full IntersectionObserver interface
    window.IntersectionObserver = MockIntersectionObserver

    const { container } = render(<Reveal>Hello</Reveal>)

    expect(container.firstChild).toHaveClass('opacity-0')

    act(() => trigger({ isIntersecting: true }))

    expect(container.firstChild).toHaveClass('opacity-100')
  })

  it('applies the variant-specific hidden/shown classes', () => {
    let trigger: (entry: { isIntersecting: boolean }) => void = () => {}
    class MockIntersectionObserver {
      constructor(callback: (entries: { isIntersecting: boolean }[]) => void) {
        trigger = (entry) => callback([entry])
      }
      observe() {}
      disconnect() {}
    }
    // @ts-expect-error -- minimal mock
    window.IntersectionObserver = MockIntersectionObserver

    const { container } = render(<Reveal variant="left">Hello</Reveal>)

    expect(container.firstChild).toHaveClass('-translate-x-8')
    act(() => trigger({ isIntersecting: true }))
    expect(container.firstChild).toHaveClass('translate-x-0')
  })
})
