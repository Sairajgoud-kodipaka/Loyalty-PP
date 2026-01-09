import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export default async function TransactionReportPage() {
  await requireAuth()
  const supabase = await createClient()
  
  // Get transaction summary
  const { data: transactions } = await supabase
    .from('transactions')
    .select('transaction_type, bill_amount, points_earned, points_redeemed, discount_amount')
  
  const totalTransactions = transactions?.length || 0
  const totalPurchases = transactions?.filter(t => t.transaction_type === 'PURCHASE').length || 0
  const totalRedemptions = transactions?.filter(t => t.transaction_type === 'REDEMPTION').length || 0
  const totalRevenue = transactions?.reduce((sum, t) => sum + Number(t.bill_amount || 0), 0) || 0
  const totalPointsIssued = transactions?.reduce((sum, t) => sum + Number(t.points_earned || 0), 0) || 0
  const totalPointsRedeemed = transactions?.reduce((sum, t) => sum + Number(t.points_redeemed || 0), 0) || 0
  const totalDiscounts = transactions?.reduce((sum, t) => sum + Number(t.discount_amount || 0), 0) || 0
  const avgTransaction = totalTransactions > 0 ? totalRevenue / totalTransactions : 0
  const redemptionRate = totalPointsIssued > 0 ? (totalPointsRedeemed / totalPointsIssued) * 100 : 0
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Transaction Summary Report</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Transactions</div>
            <div className="text-3xl font-bold text-gray-900">{totalTransactions}</div>
            <div className="text-sm text-gray-500 mt-2">
              {totalPurchases} purchases, {totalRedemptions} redemptions
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Total Revenue</div>
            <div className="text-3xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</div>
            <div className="text-sm text-gray-500 mt-2">
              Avg: ₹{avgTransaction.toLocaleString()}
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-sm text-gray-600 mb-1">Points Activity</div>
            <div className="text-2xl font-bold text-gray-900">{totalPointsIssued}</div>
            <div className="text-sm text-gray-500 mt-2">
              Issued: {totalPointsIssued} | Redeemed: {totalPointsRedeemed}
            </div>
            <div className="text-sm text-green-600 mt-2">
              Redemption Rate: {redemptionRate.toFixed(1)}%
            </div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Key Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <div className="text-sm text-gray-600">Total Discounts Given</div>
              <div className="text-2xl font-bold text-green-600">₹{totalDiscounts.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-sm text-gray-600">Average Transaction Value</div>
              <div className="text-2xl font-bold text-gray-900">₹{avgTransaction.toLocaleString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}


