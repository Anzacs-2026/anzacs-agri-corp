import { forwardRef, type InputHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export type InputProps = InputHTMLAttributes<HTMLInputElement>

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  return (
    <input
      ref={ref}
      className={cn(
        'rounded border border-forest/20 bg-cream px-3 py-2 text-forest placeholder:text-forest/40 focus:border-forest/50 focus:outline-none',
        className,
      )}
      {...props}
    />
  )
})

Input.displayName = 'Input'
