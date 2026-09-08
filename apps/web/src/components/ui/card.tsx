import { forwardRef, type HTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

export const Card = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn('rounded-lg bg-cream shadow-sm', className)} {...props} />
})
Card.displayName = 'Card'

export const CardHeader = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn('p-4 pb-0', className)} {...props} />
})
CardHeader.displayName = 'CardHeader'

export const CardContent = forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>(({ className, ...props }, ref) => {
  return <div ref={ref} className={cn('p-4', className)} {...props} />
})
CardContent.displayName = 'CardContent'
