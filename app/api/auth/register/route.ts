import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

// This route uses the service role key to create users
// The service role key should NEVER be exposed to the client
// It's only used server-side in API routes

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, password, fullName, role, phone } = body

    // Validate input
    if (!email || !password || !fullName || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    if (!['staff', 'manager', 'admin'].includes(role)) {
      return NextResponse.json(
        { error: 'Invalid role' },
        { status: 400 }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      )
    }

    // Get service role key from environment
    // IMPORTANT: This should be in .env.local and NEVER exposed to client
    // DO NOT use NEXT_PUBLIC_ prefix - that would expose it to the client!
    const serviceRoleKey = process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY || 
                          process.env.SUPABASE_SERVICE_ROLE_KEY ||
                          process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY // Fallback for migration

    if (!serviceRoleKey) {
      console.error('Service role key not found. Checked:')
      console.error('- NEXT_SUPABASE_SERVICE_ROLE_KEY:', !!process.env.NEXT_SUPABASE_SERVICE_ROLE_KEY)
      console.error('- SUPABASE_SERVICE_ROLE_KEY:', !!process.env.SUPABASE_SERVICE_ROLE_KEY)
      console.error('- NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY:', !!process.env.NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY)
      return NextResponse.json(
        { error: 'Server configuration error: Service role key not found. Please check your .env file.' },
        { status: 500 }
      )
    }

    // Create Supabase client with service role (bypasses RLS)
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      serviceRoleKey,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    // Step 1: Create user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email (for staff registration)
    })

    if (authError) {
      if (authError.message.includes('already registered')) {
        return NextResponse.json(
          { error: 'User already exists' },
          { status: 409 }
        )
      }
      return NextResponse.json(
        { error: authError.message || 'Failed to create user in Auth' },
        { status: 400 }
      )
    }

    if (!authData.user) {
      return NextResponse.json(
        { error: 'Failed to create user' },
        { status: 500 }
      )
    }

    // Step 2: Create corresponding record in users table
    console.log('Creating user record in users table with ID:', authData.user.id)
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .insert({
        id: authData.user.id, // Use the same ID from auth.users
        email: authData.user.email!,
        password_hash: null, // Password is managed by Supabase Auth, not stored in users table
        full_name: fullName,
        role: role,
        phone: phone || null,
        is_active: true,
      })
      .select()
      .single()

    if (userError) {
      console.error('Failed to insert user into users table:', userError)
      console.error('Error details:', JSON.stringify(userError, null, 2))
      
      // If users table insert fails, try to clean up the auth user
      try {
        await supabaseAdmin.auth.admin.deleteUser(authData.user.id)
        console.log('Cleaned up auth user after failed insert')
      } catch (cleanupError) {
        console.error('Failed to cleanup auth user:', cleanupError)
      }
      
      return NextResponse.json(
        { 
          error: `Failed to create user record: ${userError.message}`,
          details: userError.details || null,
          hint: userError.hint || null,
        },
        { status: 500 }
      )
    }

    console.log('Successfully created user record:', userData.id)

    return NextResponse.json(
      {
        success: true,
        message: 'User created successfully',
        user: {
          id: userData.id,
          email: userData.email,
          full_name: userData.full_name,
          role: userData.role,
        },
      },
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Registration error:', error)
    return NextResponse.json(
      { error: error.message || 'An unexpected error occurred' },
      { status: 500 }
    )
  }
}

