import { forwardRef, type LabelHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>

// jsx-a11y/label-has-associated-control false positive: this is a generic
// wrapper — every call site wraps a real form control, the linter can't
// see through that.
export const Label = forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => {
  return <label ref={ref} className={cn('flex flex-col gap-1 text-sm font-medium text-forest', className)} {...props} />
})

Label.displayName = 'Label'
