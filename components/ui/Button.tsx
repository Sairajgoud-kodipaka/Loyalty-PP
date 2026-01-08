import React from 'react'
import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link'
  size?: 'default' | 'sm' | 'lg' | 'icon'
  isLoading?: boolean
  children: React.ReactNode
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', isLoading, disabled, children, ...props }, ref) => {
    const baseStyles = 'inline-flex items-center justify-center rounded-md font-medium transition-smooth focus-ring disabled:pointer-events-none disabled:opacity-50'
    
    const variants = {
      default: 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm',
      destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm',
      outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
      secondary: 'bg-secondary text-secondary-foreground hover:bg-secondary/80',
      ghost: 'hover:bg-accent hover:text-accent-foreground',
      link: 'text-primary underline-offset-4 hover:underline',
    }
    
    const sizes = {
      default: 'h-10 px-4 py-2',
      sm: 'h-9 rounded-md px-3',
      lg: 'h-11 rounded-md px-8',
      icon: 'h-10 w-10',
    }

    const Comp = (props.asChild && typeof children === 'object' && children !== null && 'type' in children) 
      ? React.cloneElement(children as React.ReactElement, {
          className: cn(baseStyles, variants[variant], sizes[size], className),
          disabled: disabled || isLoading,
          ...props,
        })
      : 'button'

    if (props.asChild && typeof children === 'object' && children !== null) {
      return React.cloneElement(children as React.ReactElement, {
        className: cn(baseStyles, variants[variant], sizes[size], className),
        disabled: disabled || isLoading,
        ...props,
      })
    }

    return (
      <button
        className={cn(baseStyles, variants[variant], sizes[size], className)}
        ref={ref}
        disabled={disabled || isLoading}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />}
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button

