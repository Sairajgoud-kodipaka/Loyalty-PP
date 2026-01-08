'use client'

import { useRouter } from 'next/navigation'
import { ShoppingBag, Gift } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card, { CardContent } from '@/components/ui/Card'

interface QuickActionsProps {
  customerId: string
}

export default function QuickActions({ customerId }: QuickActionsProps) {
  const router = useRouter()

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={() => router.push(`/transactions/purchase?customerId=${customerId}`)}
            className="flex-1 h-auto py-4"
            size="lg"
          >
            <ShoppingBag className="w-5 h-5 mr-2" aria-hidden="true" />
            New Purchase
          </Button>
          <Button
            onClick={() => router.push(`/transactions/redeem?customerId=${customerId}`)}
            variant="outline"
            className="flex-1 h-auto py-4"
            size="lg"
          >
            <Gift className="w-5 h-5 mr-2" aria-hidden="true" />
            Redeem Points
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
