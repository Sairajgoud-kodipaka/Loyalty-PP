'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import Card, { CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import DateFilter from '@/components/reports/DateFilter'
import ExportButton from '@/components/reports/ExportButton'
import { DateFilterType } from '@/lib/utils/dateFilters'
import { getDateRange, formatDateRange } from '@/lib/utils/dateFilters'
import { exportToCSV } from '@/lib/utils/csvExport'
import LoadingSpinner from '@/components/ui/LoadingSpinner'

export default function TransactionReportClient() {
  const [filter, setFilter] = useState<DateFilterType>('today')
  const [summary, setSummary] = useState<any>(null)
  const [transactions, setTransactions] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  const supabase = createClient()
  
  useEffect(() => {
    loadData()
  }, [filter])
  
  async function loadData() {
    setLoading(true)
    setError(null)
    
    try {
      const { start, end } = getDateRange(filter)
      
      const { data: transactionData, error: fetchError } = await supabase
        .from('transactions')
        .select('transaction_type, bill_amount, points_earned, points_redeemed, discount_amount, created_at')
        .gte('created_at', start.toISOString())
        .lte('created_at', end.toISOString())
      
      if (fetchError) {
        setError(fetchError.message)
      } else {
        const txs = transactionData || []
        setTransactions(txs)
        
        // Calculate summary
        const totalTransactions = txs.length
        const totalPurchases = txs.filter(t => t.transaction_type === 'PURCHASE').length
        const totalRedemptions = txs.filter(t => t.transaction_type === 'REDEMPTION').length
        const totalRevenue = txs.reduce((sum, t) => sum + Number(t.bill_amount || 0), 0)
        const totalPointsIssued = txs.reduce((sum, t) => sum + Number(t.points_earned || 0), 0)
        const totalPointsRedeemed = txs.reduce((sum, t) => sum + Number(t.points_redeemed || 0), 0)
        const totalDiscounts = txs.reduce((sum, t) => sum + Number(t.discount_amount || 0), 0)
        const avgTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0
        const redemptionRate = totalPointsIssued > 0 ? (totalPointsRedeemed / totalPointsIssued) * 100 : 0
        
        setSummary({
          totalTransactions,
          totalPurchases,
          totalRedemptions,
          totalRevenue,
          totalPointsIssued,
          totalPointsRedeemed,
          totalDiscounts,
          avgTransaction,
          redemptionRate,
        })
      }
    } catch (err: any) {
      setError(err.message || 'Failed to load transaction data')
    } finally {
      setLoading(false)
    }
  }
  
  function handleExport() {
    // Export detailed transaction data
    const exportData = transactions.map(t => ({
      'Date': new Date(t.created_at).toLocaleString(),
      'Type': t.transaction_type === 'PURCHASE' ? 'Purchase' : 'Redemption',
      'Bill Amount': `₹${Number(t.bill_amount || 0).toLocaleString()}`,
      'Points Earned': t.points_earned || 0,
      'Points Redeemed': t.points_redeemed || 0,
      'Discount Amount': t.discount_amount ? `₹${Number(t.discount_amount).toLocaleString()}` : '',
    }))
    
    // Add summary row at the end
    if (summary) {
      exportData.push({
        'Date': 'SUMMARY',
        'Type': '',
        'Bill Amount': `₹${summary.totalRevenue.toLocaleString()}`,
        'Points Earned': summary.totalPointsIssued,
        'Points Redeemed': summary.totalPointsRedeemed,
        'Discount Amount': `₹${summary.totalDiscounts.toLocaleString()}`,
      })
    }
    
    const filename = `transaction_report_${filter}_${new Date().toISOString().split('T')[0]}`
    exportToCSV(exportData, filename)
  }
  
  return (
    <div className="container mx-auto px-4 py-8 pb-24 lg:pb-8">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight">Transaction Summary Report</h1>
            <p className="text-sm sm:text-base text-muted-foreground mt-2">
              Transaction analytics and metrics • {formatDateRange(filter)}
            </p>
          </div>
        </div>
        
        {loading ? (
          <div className="p-12 text-center">
            <LoadingSpinner text="Loading transaction data..." />
          </div>
        ) : error ? (
          <Card>
            <CardContent className="p-6 text-center text-destructive">
              <p>Failed to load data: {error}</p>
            </CardContent>
          </Card>
        ) : summary ? (
          <>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Summary Metrics</CardTitle>
                    <CardDescription>Key performance indicators for the selected period</CardDescription>
                  </div>
                  <div className="flex items-center gap-3">
                    <DateFilter value={filter} onChange={setFilter} />
                    <ExportButton 
                      onClick={handleExport} 
                      disabled={transactions.length === 0}
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-muted/50 rounded-lg p-6">
                    <div className="text-sm text-muted-foreground mb-1">Total Transactions</div>
                    <div className="text-3xl font-bold text-foreground">{summary.totalTransactions}</div>
                    <div className="text-sm text-muted-foreground mt-2">
                      {summary.totalPurchases} purchases, {summary.totalRedemptions} redemptions
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-6">
                    <div className="text-sm text-muted-foreground mb-1">Total Revenue</div>
                    <div className="text-3xl font-bold text-foreground">₹{summary.totalRevenue.toLocaleString()}</div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Avg: ₹{summary.avgTransaction.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                    </div>
                  </div>
                  
                  <div className="bg-muted/50 rounded-lg p-6">
                    <div className="text-sm text-muted-foreground mb-1">Points Activity</div>
                    <div className="text-2xl font-bold text-foreground">{summary.totalPointsIssued}</div>
                    <div className="text-sm text-muted-foreground mt-2">
                      Issued: {summary.totalPointsIssued} | Redeemed: {summary.totalPointsRedeemed}
                    </div>
                    <div className="text-sm text-success mt-2">
                      Redemption Rate: {summary.redemptionRate.toFixed(1)}%
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Additional Metrics</CardTitle>
                <CardDescription>Detailed breakdown of transaction data</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Total Discounts Given</div>
                    <div className="text-2xl font-bold text-success">₹{summary.totalDiscounts.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Average Transaction Value</div>
                    <div className="text-2xl font-bold text-foreground">₹{summary.avgTransaction.toLocaleString(undefined, { maximumFractionDigits: 0 })}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </>
        ) : (
          <Card>
            <CardContent className="p-12 text-center text-muted-foreground">
              <p className="font-medium mb-1">No transaction data found</p>
              <p className="text-sm">No transactions found for the selected period</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}


