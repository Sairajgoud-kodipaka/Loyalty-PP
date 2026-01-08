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
      className="bg-white rounded-lg shadow p-6 cursor-pointer hover:shadow-lg transition-shadow"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <User className="w-5 h-5 text-gray-400" />
            <h3 className="text-lg font-semibold text-gray-900">{customer.name}</h3>
          </div>
          <div className="text-sm text-gray-600 mb-1">
            <span className="font-mono font-semibold text-blue-600">{customer.mgp_id}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <div className="flex items-center gap-1">
              <Phone className="w-4 h-4" />
              {customer.phone}
            </div>
            {customer.email && (
              <div className="flex items-center gap-1">
                <Mail className="w-4 h-4" />
                {customer.email}
              </div>
            )}
          </div>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-blue-600">{customer.available_points}</div>
          <div className="text-xs text-gray-500">points</div>
        </div>
      </div>
    </div>
  )
}

