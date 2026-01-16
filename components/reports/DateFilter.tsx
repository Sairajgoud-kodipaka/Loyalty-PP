'use client'

import { DateFilterType } from '@/lib/utils/dateFilters'
import Button from '@/components/ui/Button'
import { Calendar } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface DateFilterProps {
  value: DateFilterType
  onChange: (filter: DateFilterType) => void
  className?: string
}

const filterOptions: { value: DateFilterType; label: string }[] = [
  { value: 'today', label: 'Today' },
  { value: 'yesterday', label: 'Yesterday' },
  { value: 'week', label: 'This Week' },
  { value: 'month', label: 'This Month' },
]

export default function DateFilter({ value, onChange, className }: DateFilterProps) {
  return (
    <div className={cn('w-full', className)}>
      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground mb-2 sm:mb-0 sm:inline-flex sm:mr-3">
        <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4 shrink-0" aria-hidden="true" />
        <span className="font-medium">Filter:</span>
      </div>
      <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 sm:gap-2">
        {filterOptions.map((option) => (
          <Button
            key={option.value}
            variant={value === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(option.value)}
            className="text-xs sm:text-sm min-h-9 sm:min-h-9 px-3 sm:px-3 touch-manipulation w-full sm:w-auto"
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  )
}


