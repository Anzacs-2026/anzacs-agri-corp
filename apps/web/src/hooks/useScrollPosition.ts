import { useEffect, useState } from 'react'

// SSG-safe: effects never run during vite-react-ssg's renderToString pass,
// so the initial/hydration value is always `false`.
export const useScrollPosition = (threshold: number): boolean => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > threshold)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [threshold])

  return scrolled
}
