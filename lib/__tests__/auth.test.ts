import { getCurrentUser, requireAuth, signOut } from '../auth'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

jest.mock('@/lib/supabase/server')
jest.mock('next/navigation', () => ({
  redirect: jest.fn(),
}))

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>

describe('getCurrentUser', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return null when user is not authenticated', async () => {
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: null },
          error: { message: 'Not authenticated' },
        }),
      },
      from: jest.fn(),
    }
    mockCreateClient.mockResolvedValue(mockSupabase as any)

    const result = await getCurrentUser()
    expect(result).toBeNull()
  })

  it('should return null when user data fetch fails', async () => {
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { email: 'test@example.com' } },
          error: null,
        }),
      },
      from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: null,
          error: { message: 'User not found' },
        }),
      })),
    }
    mockCreateClient.mockResolvedValue(mockSupabase as any)

    const result = await getCurrentUser()
    expect(result).toBeNull()
  })

  it('should return null when user is inactive', async () => {
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { email: 'test@example.com' } },
          error: null,
        }),
      },
      from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: {
            id: 'user-id',
            email: 'test@example.com',
            full_name: 'Test User',
            role: 'staff',
            is_active: false,
          },
          error: null,
        }),
      })),
    }
    mockCreateClient.mockResolvedValue(mockSupabase as any)

    const result = await getCurrentUser()
    expect(result).toBeNull()
  })

  it('should return user when authenticated and active', async () => {
    const mockUser = {
      id: 'user-id',
      email: 'test@example.com',
      full_name: 'Test User',
      role: 'staff',
      is_active: true,
    }

    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { email: 'test@example.com' } },
          error: null,
        }),
      },
      from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockUser,
          error: null,
        }),
      })),
    }
    mockCreateClient.mockResolvedValue(mockSupabase as any)

    const result = await getCurrentUser()
    expect(result).toEqual(mockUser)
  })
})

describe('requireAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should redirect to login when user is not authenticated', async () => {
    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: null },
          error: { message: 'Not authenticated' },
        }),
      },
      from: jest.fn(),
    }
    mockCreateClient.mockResolvedValue(mockSupabase as any)

    await requireAuth()
    expect(redirect).toHaveBeenCalledWith('/login')
  })

  it('should return user when authenticated without role requirement', async () => {
    const mockUser = {
      id: 'user-id',
      email: 'test@example.com',
      full_name: 'Test User',
      role: 'staff' as const,
      is_active: true,
    }

    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { email: 'test@example.com' } },
          error: null,
        }),
      },
      from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockUser,
          error: null,
        }),
      })),
    }
    mockCreateClient.mockResolvedValue(mockSupabase as any)

    const result = await requireAuth()
    expect(result).toEqual(mockUser)
    expect(redirect).not.toHaveBeenCalled()
  })

  it('should allow staff to access staff-only routes', async () => {
    const mockUser = {
      id: 'user-id',
      email: 'test@example.com',
      full_name: 'Test User',
      role: 'staff' as const,
      is_active: true,
    }

    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { email: 'test@example.com' } },
          error: null,
        }),
      },
      from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockUser,
          error: null,
        }),
      })),
    }
    mockCreateClient.mockResolvedValue(mockSupabase as any)

    const result = await requireAuth('staff')
    expect(result).toEqual(mockUser)
    expect(redirect).not.toHaveBeenCalled()
  })

  it('should redirect staff when accessing manager-only routes', async () => {
    const mockUser = {
      id: 'user-id',
      email: 'test@example.com',
      full_name: 'Test User',
      role: 'staff' as const,
      is_active: true,
    }

    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { email: 'test@example.com' } },
          error: null,
        }),
      },
      from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockUser,
          error: null,
        }),
      })),
    }
    mockCreateClient.mockResolvedValue(mockSupabase as any)

    await requireAuth('manager')
    expect(redirect).toHaveBeenCalledWith('/dashboard')
  })

  it('should allow manager to access manager routes', async () => {
    const mockUser = {
      id: 'user-id',
      email: 'test@example.com',
      full_name: 'Test User',
      role: 'manager' as const,
      is_active: true,
    }

    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { email: 'test@example.com' } },
          error: null,
        }),
      },
      from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockUser,
          error: null,
        }),
      })),
    }
    mockCreateClient.mockResolvedValue(mockSupabase as any)

    const result = await requireAuth('manager')
    expect(result).toEqual(mockUser)
    expect(redirect).not.toHaveBeenCalled()
  })

  it('should allow admin to access any route', async () => {
    const mockUser = {
      id: 'user-id',
      email: 'test@example.com',
      full_name: 'Test User',
      role: 'admin' as const,
      is_active: true,
    }

    const mockSupabase = {
      auth: {
        getUser: jest.fn().mockResolvedValue({
          data: { user: { email: 'test@example.com' } },
          error: null,
        }),
      },
      from: jest.fn(() => ({
        select: jest.fn().mockReturnThis(),
        eq: jest.fn().mockReturnThis(),
        single: jest.fn().mockResolvedValue({
          data: mockUser,
          error: null,
        }),
      })),
    }
    mockCreateClient.mockResolvedValue(mockSupabase as any)

    const result = await requireAuth('admin')
    expect(result).toEqual(mockUser)
    expect(redirect).not.toHaveBeenCalled()
  })
})

describe('signOut', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should sign out and redirect to login', async () => {
    const mockSignOut = jest.fn().mockResolvedValue({ error: null })
    const mockSupabase = {
      auth: {
        signOut: mockSignOut,
      },
    }
    mockCreateClient.mockResolvedValue(mockSupabase as any)

    await signOut()
    expect(mockSignOut).toHaveBeenCalled()
    expect(redirect).toHaveBeenCalledWith('/login')
  })
})


