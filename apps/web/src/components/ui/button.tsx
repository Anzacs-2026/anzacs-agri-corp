import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded font-sans font-medium transition-all duration-200 ease-out hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-md hover:animate-shake active:translate-y-0 active:scale-95 active:shadow-none active:animate-none disabled:opacity-50 disabled:pointer-events-none disabled:hover:translate-y-0 disabled:hover:scale-100 disabled:hover:shadow-none disabled:hover:animate-none',
  {
    variants: {
      variant: {
        primary: 'bg-forest text-cream hover:opacity-90',
        secondary: 'bg-cream text-forest border border-forest/20 hover:opacity-90',
        outline: 'bg-transparent text-forest border border-gold hover:bg-gold/10',
      },
      size: {
        default: 'px-4 py-2 text-base',
        sm: 'px-3 py-1.5 text-sm',
      },
    },
    defaultVariants: {
      variant: 'primary',
      size: 'default',
    },
  },
)

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(({ className, variant, size, ...props }, ref) => {
  return <button ref={ref} className={cn(buttonVariants({ variant, size }), className)} {...props} />
})

Button.displayName = 'Button'
