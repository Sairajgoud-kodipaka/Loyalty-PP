'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { format } from 'date-fns'
import { ShoppingBag, Gift } from 'lucide-react'
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import Link from 'next/link'
import DateFilter from '@/components/reports/DateFilter'
import { DateFilterType } from '@/lib/utils/dateFilters'
import ExportButton from '@/components/reports/ExportButton'
import { getDateRange, formatDateRange } from '@/lib/utils/dateFilters'
import { exportToCSV } from '@/lib/utils/csvExport'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function TransactionHistoryClient() {
  const [filter, setFilter] = useState<DateFilterType>('today')
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()
  
  useEffect(() => {
    loadTransactions()
  }, [filter])
  
  async function loadTransactions() {
    setLoading(true)
    setError(null)
    
    try {
      const { start, end } = getDateRange(filter)
      
      const { data, error: fetchError } = await supabase
        .from('transactions')
        .select(`
          *,
          customers!inner(mgp_id, name)
        `)
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())
        .order('created_at', { ascending: false })
      
      if (fetchError) {
        setError(fetchError.message)
      } else {
        setTransactions(data || [])
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load transactions')
    } finally {
      setLoading(false)
    }
  }
  
  function handleExport() {
    const exportData = transactions.map(t => ({
      'Date': format(new Date(t.created_at), 'MMM d, yyyy h:mm a'),
      'Customer Name': t.customers.name,
      'MGP ID': t.customers.mgp_id,
      'Type': t.transaction_type === 'PURCHASE' ? 'Purchase' : 'Redemption',
      'Bill Amount': `₹${Number(t.bill_amount || 0).toLocaleString()}`,
      'Final Amount': t.final_amount ? `₹${Number(t.final_amount).toLocaleString()}` : '',
      'Points Earned': t.points_earned || 0,
      'Points Redeemed': t.points_redeemed || 0,
      'Discount Amount': t.discount_amount ? `₹${Number(t.discount_amount).toLocaleString()}` : '',
      'Invoice Number': t.invoice_number || '',
      'Status': t.status || '',
      'Notes': t.notes || '',
    }))
    
    const filename = `transactions_${filter}_${format(new Date(), 'yyyy-MM-dd')}`
    exportToCSV(exportData, filename)
  }
  
  return (
    <div className="container mx-auto px-4 py-8 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">Transaction History</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              View all purchase and redemption transactions • {formatDateRange(filter)}
            </p>
          </div>
        </div>
        
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>All Transactions</CardTitle>
                <CardDescription>Complete history of all transactions in the system</CardDescription>
              </div>
              <div className="flex items-center gap-3">
                <DateFilter value={filter} onChange={setFilter} />
                <ExportButton 
                  onClick={handleExport} 
                  disabled={loading || transactions.length === 0}
                />
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="p-12 text-center">
                <LoadingSpinner text="Loading transactions..." />
              </div>
            ) : error ? (
              <div className="p-6 text-center text-destructive">
                <p>Failed to load transactions: {error}</p>
              </div>
            ) : transactions && transactions.length > 0 ? (
              <>
                {/* Mobile Card View */}
                <div className="md:hidden space-y-3">
                  {transactions.map((transaction: any) => (
                    <Link
                      key={transaction.id}
                      href={`/customers/${transaction.customer_id}`}
                      className="block p-4 rounded-lg border border-border bg-card hover:bg-accent/50 transition-colors"
                    >
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge
                              variant={transaction.transaction_type === 'PURCHASE' ? 'success' : 'warning'}
                              className="shrink-0"
                            >
                              {transaction.transaction_type === 'PURCHASE' ? (
                                <ShoppingBag className="w-3 h-3 mr-1" aria-hidden="true" />
                              ) : (
                                <Gift className="w-3 h-3 mr-1" aria-hidden="true" />
                              )}
                              {transaction.transaction_type === 'PURCHASE' ? 'Purchase' : 'Redemption'}
                            </Badge>
                            <Badge
                              variant={
                                transaction.status === 'active' ? 'success' :
                                transaction.status === 'pending' ? 'warning' :
                                'secondary'
                              }
                              className="shrink-0"
                            >
                              {transaction.status || 'active'}
                            </Badge>
                          </div>
                          <div className="text-sm font-medium text-foreground mb-1">
                            {transaction.customers.name}
                          </div>
                          <div className="text-xs text-muted-foreground font-mono mb-2">
                            {transaction.customers.mgp_id}
                          </div>
                          <div className="text-xs text-muted-foreground">
                            {format(new Date(transaction.created_at), 'MMM d, yyyy h:mm a')}
                          </div>
                        </div>
                        <div className="text-right ml-3 shrink-0">
                          <div className="text-base font-semibold text-foreground mb-1">
                            ₹{Number(transaction.bill_amount || 0).toLocaleString()}
                          </div>
                          {transaction.transaction_type === 'PURCHASE' ? (
                            <div className="text-sm font-semibold text-success">
                              +{transaction.points_earned || 0} pts
                            </div>
                          ) : (
                            <div className="text-sm font-semibold text-destructive">
                              -{transaction.points_redeemed || 0} pts
                            </div>
                          )}
                          {transaction.final_amount !== null && transaction.final_amount !== transaction.bill_amount && (
                            <div className="text-xs text-muted-foreground mt-1">
                              Final: ₹{Number(transaction.final_amount).toLocaleString()}
                            </div>
                          )}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Date
                        </th>
                        <th className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Customer
                        </th>
                        <th className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Type
                        </th>
                        <th className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Amount
                        </th>
                        <th className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Points
                        </th>
                        <th className="px-4 py-3 sm:px-6 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {transactions.map((transaction: any) => (
                        <tr key={transaction.id} className="hover:bg-accent/50 transition-colors">
                          <td className="px-4 py-3 sm:px-6 whitespace-nowrap text-sm text-foreground">
                            {format(new Date(transaction.created_at), 'MMM d, yyyy h:mm a')}
                          </td>
                          <td className="px-4 py-3 sm:px-6 whitespace-nowrap">
                            <Link
                              href={`/customers/${transaction.customer_id}`}
                              className="hover:underline"
                            >
                              <div className="text-sm font-medium text-foreground">{transaction.customers.name}</div>
                              <div className="text-xs text-muted-foreground font-mono">{transaction.customers.mgp_id}</div>
                            </Link>
                          </td>
                          <td className="px-4 py-3 sm:px-6 whitespace-nowrap">
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
                          <td className="px-4 py-3 sm:px-6 whitespace-nowrap text-sm text-foreground">
                            ₹{Number(transaction.bill_amount || 0).toLocaleString()}
                            {transaction.final_amount !== null && transaction.final_amount !== transaction.bill_amount && (
                              <div className="text-xs text-muted-foreground">
                                Final: ₹{Number(transaction.final_amount).toLocaleString()}
                              </div>
                            )}
                          </td>
                          <td className="px-4 py-3 sm:px-6 whitespace-nowrap">
                            {transaction.transaction_type === 'PURCHASE' ? (
                              <span className="text-sm font-semibold text-success">
                                +{transaction.points_earned || 0}
                              </span>
                            ) : (
                              <span className="text-sm font-semibold text-destructive">
                                -{transaction.points_redeemed || 0}
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 sm:px-6 whitespace-nowrap">
                            <Badge
                              variant={
                                transaction.status === 'active' ? 'success' :
                                transaction.status === 'pending' ? 'warning' :
                                'secondary'
                              }
                            >
                              {transaction.status || 'active'}
                            </Badge>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            ) : (
              <div className="p-12 text-center text-muted-foreground">
                <p className="font-medium mb-1">No transactions found</p>
                <p className="text-sm">No transactions found for the selected period</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


