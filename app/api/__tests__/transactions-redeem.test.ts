import { POST } from '../transactions/redeem/route'
import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { redeemPoints } from '@/lib/supabase/transactions'

jest.mock('@/lib/auth')
jest.mock('@/lib/supabase/transactions')

const mockRequireAuth = requireAuth as jest.MockedFunction<typeof requireAuth>
const mockRedeemPoints = redeemPoints as jest.MockedFunction<typeof redeemPoints>

describe('POST /api/transactions/redeem', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should redeem points successfully', async () => {
    const mockUser = {
      id: 'user-id',
      email: 'staff@example.com',
      full_name: 'Staff User',
      role: 'staff' as const,
      is_active: true,
    }

    const mockResult = {
      transaction_id: 'txn-id',
      points_redeemed: 500,
      discount_amount: 500,
      final_bill: 9500,
      new_points_earned: 190,
      new_balance: 1000,
    }

    mockRequireAuth.mockResolvedValue(mockUser)
    mockRedeemPoints.mockResolvedValue(mockResult as any)

    const request = new NextRequest('http://localhost:3000/api/transactions/redeem', {
      method: 'POST',
      body: JSON.stringify({
        customer_id: 'customer-id',
        bill_amount: 10000,
        points_to_redeem: 500,
        invoice_number: 'INV-002',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.data).toEqual(mockResult)
    expect(data.message).toBe('Points redeemed successfully')
    expect(mockRedeemPoints).toHaveBeenCalledWith(
      'customer-id',
      10000,
      500,
      'INV-002',
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
      points_redeemed: 500,
      discount_amount: 500,
      final_bill: 9500,
      new_points_earned: 190,
      new_balance: 1000,
    }

    mockRequireAuth.mockResolvedValue(mockUser)
    mockRedeemPoints.mockResolvedValue(mockResult as any)

    const request = new NextRequest('http://localhost:3000/api/transactions/redeem', {
      method: 'POST',
      body: JSON.stringify({
        customer_id: 'customer-id',
        bill_amount: 10000,
        points_to_redeem: 500,
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(mockRedeemPoints).toHaveBeenCalledWith(
      'customer-id',
      10000,
      500,
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

    const request = new NextRequest('http://localhost:3000/api/transactions/redeem', {
      method: 'POST',
      body: JSON.stringify({
        customer_id: 'customer-id',
        bill_amount: 10000,
        points_to_redeem: 0, // Must be at least 1
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Validation error')
  })

  it('should return 500 for insufficient points error', async () => {
    const mockUser = {
      id: 'user-id',
      email: 'staff@example.com',
      full_name: 'Staff User',
      role: 'staff' as const,
      is_active: true,
    }

    mockRequireAuth.mockResolvedValue(mockUser)
    mockRedeemPoints.mockRejectedValue(new Error('Insufficient points'))

    const request = new NextRequest('http://localhost:3000/api/transactions/redeem', {
      method: 'POST',
      body: JSON.stringify({
        customer_id: 'customer-id',
        bill_amount: 10000,
        points_to_redeem: 5000,
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Insufficient points')
  })
})

