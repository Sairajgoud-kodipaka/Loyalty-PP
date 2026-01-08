import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { searchCustomers } from '@/lib/supabase/customers'

export async function GET(request: NextRequest) {
  try {
    await requireAuth()
    
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get('q') || ''
    
    if (!query || query.length < 2) {
      return NextResponse.json({
        success: true,
        data: [],
      })
    }
    
    const results = await searchCustomers(query)
    
    return NextResponse.json({
      success: true,
      data: results,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Search failed',
      },
      { status: 500 }
    )
  }
}

