import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import { format } from 'date-fns'
import { ShoppingBag, Gift } from 'lucide-react'
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'

export default async function TransactionHistoryPage() {
  await requireAuth()
  const supabase = await createClient()
  
  const { data: transactions, error } = await supabase
    .from('transactions')
    .select(`
      *,
      customers!inner(mgp_id, name)
    `)
    .order('created_at', { ascending: false })
    .limit(100)
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Transaction History</h1>
          <p className="text-muted-foreground mt-2">
            View all purchase and redemption transactions
          </p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>All Transactions</CardTitle>
            <CardDescription>Complete history of all transactions in the system</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {error ? (
              <div className="p-6 text-center text-destructive">
                <p>Failed to load transactions</p>
              </div>
            ) : transactions && transactions.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Customer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Type
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Points
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {transactions.map((transaction: any) => (
                      <tr key={transaction.id} className="hover:bg-accent/50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          {format(new Date(transaction.created_at), 'MMM d, yyyy h:mm a')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Link
                            href={`/customers/${transaction.customer_id}`}
                            className="hover:underline"
                          >
                            <div className="text-sm font-medium text-foreground">{transaction.customers.name}</div>
                            <div className="text-xs text-muted-foreground font-mono">{transaction.customers.mgp_id}</div>
                          </Link>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant={transaction.transaction_type === 'PURCHASE' ? 'success' : 'warning'}
                            className="flex items-center gap-1 w-fit"
                          >
                            {transaction.transaction_type === 'PURCHASE' ? (
                              <ShoppingBag className="w-3 h-3" aria-hidden="true" />
                            ) : (
                              <Gift className="w-3 h-3" aria-hidden="true" />
                            )}
                            {transaction.transaction_type === 'PURCHASE' ? 'Purchase' : 'Redemption'}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">
                          ₹{Number(transaction.bill_amount).toLocaleString()}
                          {transaction.final_amount !== null && transaction.final_amount !== transaction.bill_amount && (
                            <div className="text-xs text-muted-foreground">
                              Final: ₹{Number(transaction.final_amount).toLocaleString()}
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {transaction.transaction_type === 'PURCHASE' ? (
                            <span className="text-sm font-semibold text-success">
                              +{transaction.points_earned}
                            </span>
                          ) : (
                            <span className="text-sm font-semibold text-destructive">
                              -{transaction.points_redeemed}
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge
                            variant={
                              transaction.status === 'active' ? 'success' :
                              transaction.status === 'pending' ? 'warning' :
                              'secondary'
                            }
                          >
                            {transaction.status}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="p-12 text-center text-muted-foreground">
                <p className="font-medium mb-1">No transactions found</p>
                <p className="text-sm">Transactions will appear here once you start recording purchases and redemptions</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
