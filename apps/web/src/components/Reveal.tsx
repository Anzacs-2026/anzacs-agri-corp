import type { ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { useInView } from '@/hooks/useInView'

export type RevealVariant = 'up' | 'down' | 'left' | 'right' | 'fade' | 'scale'

interface RevealProps {
  children: ReactNode
  className?: string
  delay?: number
  variant?: RevealVariant
}

const HIDDEN: Record<RevealVariant, string> = {
  up: 'opacity-0 translate-y-8',
  down: 'opacity-0 -translate-y-8',
  left: 'opacity-0 -translate-x-8',
  right: 'opacity-0 translate-x-8',
  fade: 'opacity-0',
  scale: 'opacity-0 scale-95',
}

const SHOWN: Record<RevealVariant, string> = {
  up: 'opacity-100 translate-y-0',
  down: 'opacity-100 translate-y-0',
  left: 'opacity-100 translate-x-0',
  right: 'opacity-100 translate-x-0',
  fade: 'opacity-100',
  scale: 'opacity-100 scale-100',
}

// Animates a section into place the first time it scrolls into view — the
// direction/style varies per section via `variant` so a long page doesn't
// feel like the same fade repeated forever. Skips the motion for
// prefers-reduced-motion via the motion-safe: variant (no JS check needed).
const Reveal = ({ children, className, delay = 0, variant = 'up' }: RevealProps) => {
  const { ref, inView } = useInView<HTMLDivElement>()

  return (
    <div
      ref={ref}
      className={cn(
        'motion-safe:transition-all motion-safe:duration-700 motion-safe:ease-out',
        inView ? SHOWN[variant] : HIDDEN[variant],
        className,
      )}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </div>
  )
}

export default Reveal
