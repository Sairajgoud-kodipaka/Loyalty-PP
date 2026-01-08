import { POST } from '../customers/route'
import { NextRequest } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { createCustomer } from '@/lib/supabase/customers'

jest.mock('@/lib/auth')
jest.mock('@/lib/supabase/customers')

const mockRequireAuth = requireAuth as jest.MockedFunction<typeof requireAuth>
const mockCreateCustomer = createCustomer as jest.MockedFunction<typeof createCustomer>

describe('POST /api/customers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create customer successfully', async () => {
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
      aadhar_number: '123456789012',
      passport_number: null,
      total_points_earned: 0,
      available_points: 0,
      total_points_redeemed: 0,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    mockRequireAuth.mockResolvedValue(mockUser)
    mockCreateCustomer.mockResolvedValue(mockCustomer as any)

    const request = new NextRequest('http://localhost:3000/api/customers', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        phone: '1234567890',
        email: 'john@example.com',
        aadhar_number: '123456789012',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(201)
    expect(data.success).toBe(true)
    expect(data.data).toEqual(mockCustomer)
    expect(data.message).toBe('Customer registered successfully')
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

    const request = new NextRequest('http://localhost:3000/api/customers', {
      method: 'POST',
      body: JSON.stringify({
        name: 'J', // Too short
        phone: '123', // Invalid phone
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(400)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Validation error')
    expect(data.details).toBeDefined()
  })

  it('should return 500 for duplicate phone error', async () => {
    const mockUser = {
      id: 'user-id',
      email: 'staff@example.com',
      full_name: 'Staff User',
      role: 'staff' as const,
      is_active: true,
    }

    mockRequireAuth.mockResolvedValue(mockUser)
    mockCreateCustomer.mockRejectedValue(new Error('Phone number already registered'))

    const request = new NextRequest('http://localhost:3000/api/customers', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        phone: '1234567890',
        email: 'john@example.com',
        aadhar_number: '123456789012',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Phone number already registered')
  })

  it('should require authentication', async () => {
    mockRequireAuth.mockRejectedValue(new Error('Unauthorized'))

    const request = new NextRequest('http://localhost:3000/api/customers', {
      method: 'POST',
      body: JSON.stringify({
        name: 'John Doe',
        phone: '1234567890',
        aadhar_number: '123456789012',
      }),
    })

    await expect(POST(request)).rejects.toThrow()
  })
})

