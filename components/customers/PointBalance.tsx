'use client'

import { Coins, Clock, AlertTriangle, TrendingUp, TrendingDown } from 'lucide-react'
import Card, { CardContent } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'

interface PointBalanceProps {
  points: {
    available: number
    pending: number
    expiringSoon: number
    totalEarned: number
    totalRedeemed: number
  }
}

export default function PointBalance({ points }: PointBalanceProps) {
  return (
    <div className="space-y-6">
      {/* Available Points - Large Card */}
      <Card className="bg-gradient-to-br from-primary to-primary/80 border-primary/20">
        <CardContent className="p-8 text-primary-foreground">
          <div className="flex items-center justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-3 mb-4">
                <div className="h-12 w-12 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                  <Coins className="h-6 w-6" aria-hidden="true" />
                </div>
                <div>
                  <h2 className="text-lg font-semibold">Available Points</h2>
                  <p className="text-sm text-primary-foreground/80">Ready to redeem</p>
                </div>
              </div>
              <div className="text-5xl font-bold">{points.available.toLocaleString()}</div>
              <div className="text-primary-foreground/90 mt-2">
                Worth <span className="font-semibold">₹{points.available.toLocaleString()}</span> discount
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Other Point Stats - Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Clock className="h-5 w-5 text-warning" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Pending Points</h3>
                <p className="text-xs text-muted-foreground">Activating in 24 hours</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-warning mt-2">{points.pending.toLocaleString()}</div>
          </CardContent>
        </Card>

        {points.expiringSoon > 0 && (
          <Card hover className="border-warning/50 bg-warning/5">
            <CardContent className="p-6">
              <div className="flex items-center gap-3 mb-3">
                <div className="h-10 w-10 rounded-lg bg-warning/20 flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-warning" aria-hidden="true" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Expiring Soon</h3>
                  <p className="text-xs text-muted-foreground">Within 30 days</p>
                </div>
              </div>
              <div className="text-3xl font-bold text-warning mt-2">{points.expiringSoon.toLocaleString()}</div>
            </CardContent>
          </Card>
        )}

        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <TrendingUp className="h-5 w-5 text-success" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Total Earned</h3>
                <p className="text-xs text-muted-foreground">Lifetime points</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-success mt-2">{points.totalEarned.toLocaleString()}</div>
          </CardContent>
        </Card>

        <Card hover>
          <CardContent className="p-6">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Total Redeemed</h3>
                <p className="text-xs text-muted-foreground">Lifetime redeemed</p>
              </div>
            </div>
            <div className="text-3xl font-bold text-foreground mt-2">{points.totalRedeemed.toLocaleString()}</div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
