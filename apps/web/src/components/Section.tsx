import type { HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export interface SectionProps extends HTMLAttributes<HTMLElement> {
  background?: 'forest' | 'cream'
}

const Section = ({ background = 'cream', className, children, ...props }: SectionProps) => {
  return (
    <section className={cn(background === 'forest' ? 'bg-forest text-cream' : 'bg-cream text-forest', className)} {...props}>
      <div className="mx-auto max-w-5xl px-4 py-12">{children}</div>
    </section>
  )
}

export default Section
