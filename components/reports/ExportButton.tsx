'use client'

import Button from '@/components/ui/Button'
import { Download } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

interface ExportButtonProps {
  onClick: () => void
  disabled?: boolean
  className?: string
  label?: string
}

export default function ExportButton({ 
  onClick, 
  disabled = false, 
  className,
  label = 'Export CSV'
}: ExportButtonProps) {
  return (
    <Button
      variant="outline"
      onClick={onClick}
      disabled={disabled}
      className={cn('min-h-9 touch-manipulation', className)}
      size="sm"
    >
      <Download className="h-4 w-4 mr-1.5 sm:mr-2 shrink-0" aria-hidden="true" />
      <span className="text-xs sm:text-sm">{label}</span>
    </Button>
  )
}

