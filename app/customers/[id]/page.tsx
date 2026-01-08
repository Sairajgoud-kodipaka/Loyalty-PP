import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'
import ProfileHeader from '@/components/customers/ProfileHeader'
import PointBalance from '@/components/customers/PointBalance'
import TransactionList from '@/components/customers/TransactionList'
import QuickActions from '@/components/customers/QuickActions'
import { getCustomerById } from '@/lib/supabase/customers'
import { notFound } from 'next/navigation'
import Card, { CardContent } from '@/components/ui/Card'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { Suspense } from 'react'

async function CustomerData({ 
  customerId, 
  customer 
}: { 
  customerId: string
  customer: { total_points_earned: number; total_points_redeemed: number }
}) {
  const supabase = await createClient()
  
  // Get point balance details
  const { data: pointLedger, error: ledgerError } = await supabase
    .from('point_ledger')
    .select('points, type, is_active, is_expired, expiry_date, activation_date')
    .eq('customer_id', customerId)
  
  if (ledgerError) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-destructive">Failed to load point balance</p>
        </CardContent>
      </Card>
    )
  }
  
  const availablePoints = pointLedger
    ?.filter(p => p.type === 'EARNED' && p.is_active && !p.is_expired)
    .reduce((sum, p) => sum + Number(p.points), 0) || 0
  
  const pendingPoints = pointLedger
    ?.filter(p => p.type === 'EARNED' && !p.is_active && !p.is_expired)
    .reduce((sum, p) => sum + Number(p.points), 0) || 0
  
  const thirtyDaysFromNow = new Date()
  thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30)
  
  const expiringSoon = pointLedger
    ?.filter(p => 
      p.type === 'EARNED' && 
      p.is_active && 
      !p.is_expired &&
      p.expiry_date &&
      new Date(p.expiry_date) <= thirtyDaysFromNow
    )
    .reduce((sum, p) => sum + Number(p.points), 0) || 0
  
  // Get recent transactions
  const { data: transactions, error: transactionsError } = await supabase
    .from('transactions')
    .select('*')
    .eq('customer_id', customerId)
    .order('created_at', { ascending: false })
    .limit(10)
  
  if (transactionsError) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-destructive">Failed to load transactions</p>
        </CardContent>
      </Card>
    )
  }
  
  return (
    <>
      <PointBalance
        points={{
          available: availablePoints,
          pending: pendingPoints,
          expiringSoon,
          totalEarned: customer.total_points_earned,
          totalRedeemed: customer.total_points_redeemed,
        }}
      />
      <TransactionList transactions={transactions || []} />
    </>
  )
}

export default async function CustomerProfilePage({
  params,
}: {
  params: { id: string }
}) {
  await requireAuth()
  
  const customer = await getCustomerById(params.id)
  
  if (!customer) {
    notFound()
  }
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-5xl mx-auto space-y-6">
        <ProfileHeader customer={customer} />
        <QuickActions customerId={customer.id} />
        
        <Suspense fallback={
          <Card>
            <CardContent className="p-12">
              <LoadingSpinner text="Loading customer data..." />
            </CardContent>
          </Card>
        }>
          <CustomerData customerId={params.id} customer={customer} />
        </Suspense>
      </div>
    </div>
  )
}
