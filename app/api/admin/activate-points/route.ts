import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth()
    
    // In production, you might want to restrict this to admin users only
    // For now, any authenticated user can trigger it (useful for testing)
    
    const supabase = await createClient()
    
    // Call the activation function
    const { data, error } = await supabase.rpc('activate_pending_points')
    
    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message || 'Failed to activate points',
        },
        { status: 500 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: `Activated ${data || 0} pending point entries`,
      activatedCount: data || 0,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to activate points',
      },
      { status: 500 }
    )
  }
}

