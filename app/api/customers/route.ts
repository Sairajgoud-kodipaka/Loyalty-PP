import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { createCustomer } from '@/lib/supabase/customers'
import { customerRegistrationSchema } from '@/lib/validations/customer'

export async function POST(request: NextRequest) {
  try {
    // Require authentication
    await requireAuth()
    
    const body = await request.json()
    
    // Validate input
    const validated = customerRegistrationSchema.parse(body)
    
    // Create customer
    const customer = await createCustomer(validated)
    
    return NextResponse.json(
      {
        success: true,
        data: customer,
        message: 'Customer registered successfully',
      },
      { status: 201 }
    )
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
        error: error.message || 'Failed to register customer',
      },
      { status: 500 }
    )
  }
}

