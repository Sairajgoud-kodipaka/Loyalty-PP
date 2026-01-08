import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Checks if an authenticated user exists in the users table and is active
 * @param supabase - Supabase client instance
 * @param email - User's email address
 * @returns Object with userData and error, or null if user doesn't exist
 */
async function checkUserExists(
  supabase: ReturnType<typeof createServerClient>,
  email: string
) {
  const { data: userData, error: userError } = await supabase
    .from('users')
    .select('id, is_active')
    .eq('email', email)
    .maybeSingle()

  // If there's an error or no user data, treat as user not found
  if (userError || !userData) {
    return null
  }

  return userData
}

/**
 * Creates a redirect response to the specified pathname
 */
function createRedirect(request: NextRequest, pathname: string) {
  const url = request.nextUrl.clone()
  url.pathname = pathname
  return NextResponse.redirect(url)
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  // Initialize Supabase client with cookie handling
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet: Array<{ name: string; value: string; options?: any }>) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value)
          })
          response = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // Get authenticated user from Supabase Auth
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // Skip middleware for API routes (they handle their own auth)
  if (pathname.startsWith('/api/')) {
    return response
  }

  // Public routes that don't require authentication
  const publicRoutes = ['/login', '/register']
  const isPublicRoute = publicRoutes.includes(pathname)

  // Handle login/register pages
  if (isPublicRoute) {
    // If user is authenticated and exists in users table, redirect to dashboard
    if (authUser) {
      const userData = await checkUserExists(supabase, authUser.email!)
      if (userData?.is_active) {
        return createRedirect(request, '/dashboard')
      }
    }
    // Allow access to login/register pages
    return response
  }

  // Protect all other routes - require authentication
  if (!authUser) {
    return createRedirect(request, '/login')
  }

  // Verify user exists in users table and is active
  const userData = await checkUserExists(supabase, authUser.email!)
  if (!userData?.is_active) {
    return createRedirect(request, '/login')
  }

  // User is authenticated and active, allow access
  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}

