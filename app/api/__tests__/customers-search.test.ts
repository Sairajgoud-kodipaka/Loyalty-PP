import { GET } from '../customers/search/route'
import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { searchCustomers } from '@/lib/supabase/customers'

jest.mock('@/lib/auth')
jest.mock('@/lib/supabase/customers')

const mockRequireAuth = requireAuth as jest.MockedFunction<typeof requireAuth>
const mockSearchCustomers = searchCustomers as jest.MockedFunction<typeof searchCustomers>

describe('GET /api/customers/search', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return search results', async () => {
    const mockUser = {
      id: 'user-id',
      email: 'staff@example.com',
      full_name: 'Staff User',
      role: 'staff' as const,
      is_active: true,
    }

    const mockResults = [
      {
        id: 'customer-id',
        mgp_id: 'MGP000001',
        name: 'John Doe',
        phone: '1234567890',
        available_points: 100,
      },
    ]

    mockRequireAuth.mockResolvedValue(mockUser)
    mockSearchCustomers.mockResolvedValue(mockResults as any)

    const request = new NextRequest('http://localhost:3000/api/customers/search?q=John')

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toEqual(mockResults)
    expect(mockSearchCustomers).toHaveBeenCalledWith('John')
  })

  it('should return empty array for short queries', async () => {
    const mockUser = {
      id: 'user-id',
      email: 'staff@example.com',
      full_name: 'Staff User',
      role: 'staff' as const,
      is_active: true,
    }

    mockRequireAuth.mockResolvedValue(mockUser)

    const request = new NextRequest('http://localhost:3000/api/customers/search?q=J')

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toEqual([])
    expect(mockSearchCustomers).not.toHaveBeenCalled()
  })

  it('should return empty array when no query provided', async () => {
    const mockUser = {
      id: 'user-id',
      email: 'staff@example.com',
      full_name: 'Staff User',
      role: 'staff' as const,
      is_active: true,
    }

    mockRequireAuth.mockResolvedValue(mockUser)

    const request = new NextRequest('http://localhost:3000/api/customers/search')

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toEqual([])
  })

  it('should handle search errors', async () => {
    const mockUser = {
      id: 'user-id',
      email: 'staff@example.com',
      full_name: 'Staff User',
      role: 'staff' as const,
      is_active: true,
    }

    mockRequireAuth.mockResolvedValue(mockUser)
    mockSearchCustomers.mockRejectedValue(new Error('Database error'))

    const request = new NextRequest('http://localhost:3000/api/customers/search?q=John')

    const response = await GET(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Database error')
  })
})


