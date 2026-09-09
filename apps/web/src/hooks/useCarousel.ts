import { useEffect, useRef, useState } from 'react'

interface UseCarouselOptions {
  length: number
  intervalMs?: number
  autoplay?: boolean
}

interface UseCarouselResult {
  index: number
  setIndex: (i: number) => void
  next: () => void
  prev: () => void
  pause: () => void
  resume: () => void
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    ? window.matchMedia('(prefers-reduced-motion: reduce)').matches
    : false

export const useCarousel = ({ length, intervalMs = 5500, autoplay = true }: UseCarouselOptions): UseCarouselResult => {
  const [index, setIndexState] = useState(0)
  const [paused, setPaused] = useState(false)
  const reducedMotion = useRef(prefersReducedMotion())

  // If `length` shrinks (e.g. admin removes a slide) below the current
  // index, clamp what's displayed without a setState-in-effect — the next
  // explicit setIndex/autoplay tick self-corrects the underlying state.
  const displayIndex = index >= length ? 0 : index

  useEffect(() => {
    if (paused || !autoplay || reducedMotion.current || length <= 1) return
    const id = window.setInterval(() => {
      setIndexState((i) => (i + 1) % length)
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [paused, autoplay, length, intervalMs])

  const setIndex = (i: number) => setIndexState(((i % length) + length) % length)
  const next = () => setIndex(displayIndex + 1)
  const prev = () => setIndex(displayIndex - 1)

  return { index: displayIndex, setIndex, next, prev, pause: () => setPaused(true), resume: () => setPaused(false) }
}
