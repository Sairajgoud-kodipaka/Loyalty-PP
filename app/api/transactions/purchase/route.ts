import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { addPurchase } from '@/lib/supabase/transactions'
import { z } from 'zod'

const purchaseSchema = z.object({
  customer_id: z.string().uuid(),
  bill_amount: z.number().min(50, 'Minimum bill amount is ₹50'),
  invoice_number: z.string().optional().nullable(),
})

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    
    const body = await request.json()
    const validated = purchaseSchema.parse(body)
    
    const result = await addPurchase(
      validated.customer_id,
      validated.bill_amount,
      validated.invoice_number || null,
      user.id
    )
    
    return NextResponse.json({
      success: true,
      data: result,
      message: 'Purchase recorded successfully',
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
        error: error.message || 'Failed to record purchase',
      },
      { status: 500 }
    )
  }
}

