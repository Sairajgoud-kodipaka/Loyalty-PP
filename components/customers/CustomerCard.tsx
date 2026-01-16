'use client'

import { useRouter } from 'next/navigation'
import { User, Phone, Mail } from 'lucide-react'

interface CustomerCardProps {
  customer: {
    id: string
    mgp_id: string
    name: string
    phone: string
    email: string | null
    available_points: number
  }
}

export default function CustomerCard({ customer }: CustomerCardProps) {
  const router = useRouter()

  return (
    <div
      onClick={() => router.push(`/customers/${customer.id}`)}
      className="bg-card rounded-lg border border-border shadow-sm p-4 sm:p-6 cursor-pointer hover:shadow-md hover:bg-accent/50 active:bg-accent transition-all touch-manipulation"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-5 h-5 text-muted-foreground shrink-0" aria-hidden="true" />
            <h3 className="text-base sm:text-lg font-semibold text-foreground truncate">{customer.name}</h3>
          </div>
          <div className="text-xs sm:text-sm text-muted-foreground mb-2">
            <span className="font-mono font-semibold text-primary">{customer.mgp_id}</span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-xs sm:text-sm text-muted-foreground">
            <div className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" aria-hidden="true" />
              <span className="truncate">{customer.phone}</span>
            </div>
            {customer.email && (
              <div className="flex items-center gap-1.5 min-w-0">
                <Mail className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" aria-hidden="true" />
                <span className="truncate">{customer.email}</span>
              </div>
            )}
          </div>
        </div>
        <div className="text-right shrink-0 ml-2">
          <div className="text-xl sm:text-2xl font-bold text-primary">{customer.available_points}</div>
          <div className="text-xs text-muted-foreground">points</div>
        </div>
      </div>
    </div>
  )
}


