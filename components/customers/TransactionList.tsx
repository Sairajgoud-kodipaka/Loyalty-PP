'use client'

import { format } from 'date-fns'
import { ShoppingBag, Gift, ArrowRight } from 'lucide-react'
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Button from '@/components/ui/Button'
import { cn } from '@/lib/utils/cn'

interface Transaction {
  id: string
  transaction_type: string
  bill_amount: number
  points_earned: number
  points_redeemed: number
  discount_amount: number
  final_amount: number | null
  created_at: string
  invoice_number: string | null
}

interface TransactionListProps {
  transactions: Transaction[]
  onViewAll?: () => void
}

export default function TransactionList({ transactions, onViewAll }: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="p-12 text-center">
          <ShoppingBag className="w-12 h-12 text-muted-foreground mx-auto mb-4" aria-hidden="true" />
          <p className="text-muted-foreground font-medium">No transactions yet</p>
          <p className="text-sm text-muted-foreground mt-1">
            Transactions will appear here once purchases or redemptions are recorded
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Last 10 transactions for this customer</CardDescription>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border">
          {transactions.map((transaction, index) => (
            <div
              key={transaction.id}
              className={cn(
                'p-6 transition-colors hover:bg-accent/50',
                index === 0 && 'rounded-t-none'
              )}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4 flex-1 min-w-0">
                  <div
                    className={cn(
                      'h-10 w-10 rounded-lg flex items-center justify-center flex-shrink-0',
                      transaction.transaction_type === 'PURCHASE'
                        ? 'bg-success/10 text-success'
                        : 'bg-warning/10 text-warning'
                    )}
                  >
                    {transaction.transaction_type === 'PURCHASE' ? (
                      <ShoppingBag className="w-5 h-5" aria-hidden="true" />
                    ) : (
                      <Gift className="w-5 h-5" aria-hidden="true" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge
                        variant={transaction.transaction_type === 'PURCHASE' ? 'success' : 'warning'}
                      >
                        {transaction.transaction_type === 'PURCHASE' ? 'Purchase' : 'Redemption'}
                      </Badge>
                      {transaction.invoice_number && (
                        <span className="text-xs text-muted-foreground">
                          Invoice: {transaction.invoice_number}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(transaction.created_at), 'MMM d, yyyy h:mm a')}
                    </p>
                    {transaction.bill_amount > 0 && (
                      <p className="text-sm font-medium text-foreground mt-1">
                        Bill: ₹{Number(transaction.bill_amount).toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  {transaction.transaction_type === 'PURCHASE' ? (
                    <div>
                      <div className="text-lg font-bold text-success">
                        +{transaction.points_earned.toLocaleString()} pts
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="text-lg font-bold text-destructive">
                        -{transaction.points_redeemed.toLocaleString()} pts
                      </div>
                      {transaction.discount_amount > 0 && (
                        <div className="text-sm text-muted-foreground mt-1">
                          Saved ₹{transaction.discount_amount.toLocaleString()}
                        </div>
                      )}
                      {transaction.final_amount !== null && (
                        <div className="text-xs text-muted-foreground mt-1">
                          Final: ₹{transaction.final_amount.toLocaleString()}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        {onViewAll && (
          <div className="p-4 border-t border-border text-center">
            <Button
              onClick={onViewAll}
              variant="ghost"
              className="mx-auto"
            >
              View All Transactions
              <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
