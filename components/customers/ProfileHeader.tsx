'use client'

import { User, Phone, Mail, Calendar, ArrowLeft } from 'lucide-react'
import { format } from 'date-fns'
import { useRouter } from 'next/navigation'
import Card, { CardContent } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

interface ProfileHeaderProps {
  customer: {
    mgp_id: string
    name: string
    phone: string
    email: string | null
    created_at: string
  }
}

export default function ProfileHeader({ customer }: ProfileHeaderProps) {
  const router = useRouter()

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => router.back()}
                className="flex-shrink-0"
                aria-label="Go back"
              >
                <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              </Button>
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                <User className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <h1 className="text-3xl font-bold text-foreground truncate">{customer.name}</h1>
                <Badge variant="outline" className="mt-1 font-mono text-sm">
                  {customer.mgp_id}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <Phone className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Phone</p>
                  <p className="font-medium text-foreground">{customer.phone}</p>
                </div>
              </div>
              
              {customer.email && (
                <div className="flex items-center gap-3 text-muted-foreground">
                  <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                    <Mail className="h-4 w-4" aria-hidden="true" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">Email</p>
                    <p className="font-medium text-foreground truncate">{customer.email}</p>
                  </div>
                </div>
              )}
              
              <div className="flex items-center gap-3 text-muted-foreground">
                <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                  <Calendar className="h-4 w-4" aria-hidden="true" />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground mb-0.5">Member Since</p>
                  <p className="font-medium text-foreground">
                    {format(new Date(customer.created_at), 'MMM d, yyyy')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
