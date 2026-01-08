import { POST } from '../transactions/purchase/route'
import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { addPurchase } from '@/lib/supabase/transactions'

jest.mock('@/lib/auth')
jest.mock('@/lib/supabase/transactions')

const mockRequireAuth = requireAuth as jest.MockedFunction<typeof requireAuth>
const mockAddPurchase = addPurchase as jest.MockedFunction<typeof addPurchase>

describe('POST /api/transactions/purchase', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should record purchase successfully', async () => {
    const mockUser = {
      id: 'user-id',
      email: 'staff@example.com',
      full_name: 'Staff User',
      role: 'staff' as const,
      is_active: true,
    }

    const mockResult = {
      transaction_id: 'txn-id',
      points_earned: 200,
      activation_date: new Date().toISOString(),
      expiry_date: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString(),
    }

    mockRequireAuth.mockResolvedValue(mockUser)
    mockAddPurchase.mockResolvedValue(mockResult as any)

    const request = new NextRequest('http://localhost:3000/api/transactions/purchase', {
      method: 'POST',
      body: JSON.stringify({
        customer_id: 'customer-id',
        bill_amount: 10000,
        invoice_number: 'INV-001',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toEqual(mockResult)
    expect(data.message).toBe('Purchase recorded successfully')
    expect(mockAddPurchase).toHaveBeenCalledWith(
      'customer-id',
      10000,
      'INV-001',
      'user-id'
    )
  })

  it('should handle null invoice number', async () => {
    const mockUser = {
      id: 'user-id',
      email: 'staff@example.com',
      full_name: 'Staff User',
      role: 'staff' as const,
      is_active: true,
    }

    const mockResult = {
      transaction_id: 'txn-id',
      points_earned: 200,
      activation_date: new Date().toISOString(),
      expiry_date: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString(),
    }

    mockRequireAuth.mockResolvedValue(mockUser)
    mockAddPurchase.mockResolvedValue(mockResult as any)

    const request = new NextRequest('http://localhost:3000/api/transactions/purchase', {
      method: 'POST',
      body: JSON.stringify({
        customer_id: 'customer-id',
        bill_amount: 10000,
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(mockAddPurchase).toHaveBeenCalledWith(
      'customer-id',
      10000,
      null,
      'user-id'
    )
  })

  it('should return 400 for validation errors', async () => {
    const mockUser = {
      id: 'user-id',
      email: 'staff@example.com',
      full_name: 'Staff User',
      role: 'staff' as const,
      is_active: true,
    }

    mockRequireAuth.mockResolvedValue(mockUser)

    const request = new NextRequest('http://localhost:3000/api/transactions/purchase', {
      method: 'POST',
      body: JSON.stringify({
        customer_id: 'customer-id',
        bill_amount: 25, // Less than minimum 50
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Validation error')
  })

  it('should return 500 for database errors', async () => {
    const mockUser = {
      id: 'user-id',
      email: 'staff@example.com',
      full_name: 'Staff User',
      role: 'staff' as const,
      is_active: true,
    }

    mockRequireAuth.mockResolvedValue(mockUser)
    mockAddPurchase.mockRejectedValue(new Error('Database error'))

    const request = new NextRequest('http://localhost:3000/api/transactions/purchase', {
      method: 'POST',
      body: JSON.stringify({
        customer_id: 'customer-id',
        bill_amount: 10000,
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Database error')
  })
})

