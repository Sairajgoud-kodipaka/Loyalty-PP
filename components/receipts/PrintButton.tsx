'use client'

import { Printer } from 'lucide-react'
import Button from '@/components/ui/Button'
import { printReceipt } from './TransactionReceipt'

interface PrintButtonProps {
  className?: string
}

export default function PrintButton({
  className,
}: PrintButtonProps) {
  const handlePrint = () => {
    // Trigger print - the receipt should already be in the DOM with print:block class
    // (rendered in the modal)
    printReceipt()
  }

  return (
    <Button
      onClick={handlePrint}
      variant="outline"
      className={className}
    >
      <Printer className="mr-2 h-4 w-4" />
      Print Receipt
    </Button>
  )
}

