import { forwardRef, type TextareaHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement>

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, ...props }, ref) => {
  return (
    <textarea
      ref={ref}
      className={cn(
        'rounded border border-forest/20 bg-cream px-3 py-2 text-forest placeholder:text-forest/40 focus:border-forest/50 focus:outline-none',
        className,
      )}
      {...props}
    />
  )
})

Textarea.displayName = 'Textarea'
