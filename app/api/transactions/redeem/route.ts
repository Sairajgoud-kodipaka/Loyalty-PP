import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { redeemPoints } from '@/lib/supabase/transactions'
import { z } from 'zod'

const redeemSchema = z.object({
  customer_id: z.string().uuid(),
  bill_amount: z.number().min(0),
  points_to_redeem: z.number().min(1, 'Must redeem at least 1 point'),
  invoice_number: z.string().optional().nullable(),
})

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    
    const body = await request.json()
    const validated = redeemSchema.parse(body)
    
    const result = await redeemPoints(
      validated.customer_id,
      validated.bill_amount,
      validated.points_to_redeem,
      validated.invoice_number || null,
      user.id
    )
    
    return NextResponse.json({
      success: true,
      data: result,
      message: 'Points redeemed successfully',
    })
  } catch (error: any) {
    if (error.name === 'ZodError') {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation error',
          details: error.errors,
        },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to redeem points',
      },
      { status: 500 }
    )
  }
}


