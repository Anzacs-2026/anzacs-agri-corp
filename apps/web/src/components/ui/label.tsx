import { forwardRef, type LabelHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export type LabelProps = LabelHTMLAttributes<HTMLLabelElement>

export const Label = forwardRef<HTMLLabelElement, LabelProps>(({ className, ...props }, ref) => {
  return <label ref={ref} className={cn('flex flex-col gap-1 text-sm font-medium text-forest', className)} {...props} />
})

Label.displayName = 'Label'
