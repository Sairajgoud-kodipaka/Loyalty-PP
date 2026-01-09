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
    <div className={cn('flex flex-col sm:flex-row items-start sm:items-center gap-2', className)}>
      <div className="flex items-center gap-2 text-xs sm:text-sm text-muted-foreground shrink-0">
        <Calendar className="h-3.5 w-3.5 sm:h-4 sm:w-4" aria-hidden="true" />
        <span>Filter:</span>
      </div>
      <div className="flex items-center gap-1.5 sm:gap-2 flex-wrap">
        {filterOptions.map((option) => (
          <Button
            key={option.value}
            variant={value === option.value ? 'default' : 'outline'}
            size="sm"
            onClick={() => onChange(option.value)}
            className="text-xs sm:text-sm min-h-8 sm:min-h-9 px-2.5 sm:px-3 touch-manipulation"
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  )
}


