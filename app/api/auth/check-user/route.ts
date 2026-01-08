import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  try {
    const supabase = await createClient()
    
    // Get the authenticated user
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return NextResponse.json(
        { exists: false, error: 'Not authenticated' },
        { status: 401 }
      )
    }
    
    // Check if user exists in users table
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('id, is_active')
      .eq('email', user.email)
      .single()
    
    if (userError || !userData) {
      return NextResponse.json({ exists: false })
    }
    
    if (!userData.is_active) {
      return NextResponse.json({ exists: false, inactive: true })
    }
    
    return NextResponse.json({ exists: true })
  } catch (error: any) {
    return NextResponse.json(
      { exists: false, error: error.message },
      { status: 500 }
    )
  }
}

