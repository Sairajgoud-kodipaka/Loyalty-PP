import React from 'react'
import { cn } from '@/lib/utils/cn'

export interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string
}

const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('animate-shimmer rounded-md bg-muted', className)}
        {...props}
      />
    )
  }
)

Skeleton.displayName = 'Skeleton'

export default Skeleton

