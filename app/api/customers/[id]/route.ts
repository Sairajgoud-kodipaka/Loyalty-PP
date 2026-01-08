import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getCustomerById } from '@/lib/supabase/customers'
import { createClient } from '@/lib/supabase/server'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await requireAuth()
    
    const customer = await getCustomerById(params.id)
    
    if (!customer) {
      return NextResponse.json(
        { success: false, error: 'Customer not found' },
        { status: 404 }
      )
    }
    
    const supabase = await createClient()
    
    // Get point balance details
    const { data: pointLedger } = await supabase
      .from('point_ledger')
      .select('points, type, is_active, is_expired, expiry_date, activation_date')
      .eq('customer_id', params.id)
    
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
    const { data: transactions } = await supabase
      .from('transactions')
      .select('*')
      .eq('customer_id', params.id)
      .order('created_at', { ascending: false })
      .limit(10)
    
    return NextResponse.json({
      success: true,
      data: {
        customer,
        points: {
          available: availablePoints,
          pending: pendingPoints,
          expiringSoon,
          totalEarned: customer.total_points_earned,
          totalRedeemed: customer.total_points_redeemed,
        },
        recentTransactions: transactions || [],
      },
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch customer',
      },
      { status: 500 }
    )
  }
}

