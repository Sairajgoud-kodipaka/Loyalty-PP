import { GET } from '../customers/[id]/route'
import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getCustomerById } from '@/lib/supabase/customers'
import { createClient } from '@/lib/supabase/server'

jest.mock('@/lib/auth')
jest.mock('@/lib/supabase/customers')
jest.mock('@/lib/supabase/server')

const mockRequireAuth = requireAuth as jest.MockedFunction<typeof requireAuth>
const mockGetCustomerById = getCustomerById as jest.MockedFunction<typeof getCustomerById>
const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>

describe('GET /api/customers/[id]', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return customer with point details', async () => {
    const mockUser = {
      id: 'user-id',
      email: 'staff@example.com',
      full_name: 'Staff User',
      role: 'staff' as const,
      is_active: true,
    }

    const mockCustomer = {
      id: 'customer-id',
      mgp_id: 'MGP000001',
      name: 'John Doe',
      phone: '1234567890',
      email: 'john@example.com',
      total_points_earned: 500,
      available_points: 300,
      total_points_redeemed: 200,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const mockPointLedger = [
      {
        points: 200,
        type: 'EARNED',
        is_active: true,
        is_expired: false,
        expiry_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
        activation_date: new Date().toISOString(),
      },
      {
        points: 100,
        type: 'EARNED',
        is_active: false,
        is_expired: false,
        expiry_date: null,
        activation_date: null,
      },
    ]

    const mockTransactions = [
      {
        id: 'txn-1',
        customer_id: 'customer-id',
        type: 'PURCHASE',
        amount: 10000,
        points: 200,
        created_at: new Date().toISOString(),
      },
    ]

    const mockFrom = jest.fn((table: string) => {
      if (table === 'point_ledger') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockResolvedValue({
            data: mockPointLedger,
            error: null,
          }),
        }
      }
      if (table === 'transactions') {
        return {
          select: jest.fn().mockReturnThis(),
          eq: jest.fn().mockReturnThis(),
          order: jest.fn().mockReturnThis(),
          limit: jest.fn().mockResolvedValue({
            data: mockTransactions,
            error: null,
          }),
        }
      }
      return {}
    })

    const mockSupabase = {
      from: mockFrom,
    }

    mockRequireAuth.mockResolvedValue(mockUser)
    mockGetCustomerById.mockResolvedValue(mockCustomer as any)
    mockCreateClient.mockResolvedValue(mockSupabase as any)

    const request = new NextRequest('http://localhost:3000/api/customers/customer-id')
    const response = await GET(request, { params: { id: 'customer-id' } })
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data.customer).toEqual(mockCustomer)
    expect(data.data.points.available).toBe(200)
    expect(data.data.points.pending).toBe(100)
    expect(data.data.recentTransactions).toEqual(mockTransactions)
  })

  it('should return 404 when customer not found', async () => {
    const mockUser = {
      id: 'user-id',
      email: 'staff@example.com',
      full_name: 'Staff User',
      role: 'staff' as const,
      is_active: true,
    }

    mockRequireAuth.mockResolvedValue(mockUser)
    mockGetCustomerById.mockResolvedValue(null)

    const request = new NextRequest('http://localhost:3000/api/customers/non-existent')
    const response = await GET(request, { params: { id: 'non-existent' } })
    const data = await response.json()

    expect(response.status).toBe(404)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Customer not found')
  })

  it('should handle errors', async () => {
    const mockUser = {
      id: 'user-id',
      email: 'staff@example.com',
      full_name: 'Staff User',
      role: 'staff' as const,
      is_active: true,
    }

    mockRequireAuth.mockResolvedValue(mockUser)
    mockGetCustomerById.mockRejectedValue(new Error('Database error'))

    const request = new NextRequest('http://localhost:3000/api/customers/customer-id')
    const response = await GET(request, { params: { id: 'customer-id' } })
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Database error')
  })
})


