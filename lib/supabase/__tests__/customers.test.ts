import { createCustomer, getCustomerById, searchCustomers } from '../customers'
import { createClient } from '../server'
import { customerRegistrationSchema } from '@/lib/validations/customer'

jest.mock('../server')
jest.mock('@/lib/validations/customer')

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>

describe('createCustomer', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should create a customer successfully', async () => {
    const mockData = {
      name: 'John Doe',
      phone: '1234567890',
      email: 'john@example.com',
      aadhar_number: '123456789012',
    }

    const mockCustomer = {
      id: 'customer-id',
      mgp_id: 'MGP000001',
      ...mockData,
      total_points_earned: 0,
      available_points: 0,
      total_points_redeemed: 0,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const mockFrom = jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn()
        .mockResolvedValueOnce({ data: null, error: null }) // phone check
        .mockResolvedValueOnce({ data: null, error: null }) // aadhar check
        .mockResolvedValueOnce({ data: mockCustomer, error: null }), // insert
      insert: jest.fn().mockReturnThis(),
    }))

    const mockSupabase = {
      from: mockFrom,
    }

    mockCreateClient.mockResolvedValue(mockSupabase as any)
    ;(customerRegistrationSchema.parse as jest.Mock).mockReturnValue(mockData)

    const result = await createCustomer(mockData as any)

    expect(result).toEqual(mockCustomer)
    expect(mockFrom).toHaveBeenCalledWith('customers')
  })

  it('should throw error when phone number already exists', async () => {
    const mockData = {
      name: 'John Doe',
      phone: '1234567890',
      email: 'john@example.com',
      aadhar_number: '123456789012',
    }

    const mockFrom = jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: { id: 'existing-id' },
        error: null,
      }),
    }))

    const mockSupabase = {
      from: mockFrom,
    }

    mockCreateClient.mockResolvedValue(mockSupabase as any)
    ;(customerRegistrationSchema.parse as jest.Mock).mockReturnValue(mockData)

    await expect(createCustomer(mockData as any)).rejects.toThrow(
      'Phone number already registered'
    )
  })

  it('should throw error when Aadhar number already exists', async () => {
    const mockData = {
      name: 'John Doe',
      phone: '1234567890',
      email: 'john@example.com',
      aadhar_number: '123456789012',
    }

    const mockFrom = jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn()
        .mockResolvedValueOnce({ data: null, error: null }) // phone check
        .mockResolvedValueOnce({ data: { id: 'existing-id' }, error: null }), // aadhar check
    }))

    const mockSupabase = {
      from: mockFrom,
    }

    mockCreateClient.mockResolvedValue(mockSupabase as any)
    ;(customerRegistrationSchema.parse as jest.Mock).mockReturnValue(mockData)

    await expect(createCustomer(mockData as any)).rejects.toThrow(
      'Aadhar number already registered'
    )
  })

  it('should throw error when passport number already exists', async () => {
    const mockData = {
      name: 'John Doe',
      phone: '1234567890',
      email: 'john@example.com',
      passport_number: 'A1234567',
    }

    const mockFrom = jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn()
        .mockResolvedValueOnce({ data: null, error: null }) // phone check
        .mockResolvedValueOnce({ data: { id: 'existing-id' }, error: null }), // passport check
    }))

    const mockSupabase = {
      from: mockFrom,
    }

    mockCreateClient.mockResolvedValue(mockSupabase as any)
    ;(customerRegistrationSchema.parse as jest.Mock).mockReturnValue(mockData)

    await expect(createCustomer(mockData as any)).rejects.toThrow(
      'Passport number already registered'
    )
  })
})

describe('getCustomerById', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should return customer when found', async () => {
    const mockCustomer = {
      id: 'customer-id',
      mgp_id: 'MGP000001',
      name: 'John Doe',
      phone: '1234567890',
      email: 'john@example.com',
      aadhar_number: '123456789012',
      passport_number: null,
      total_points_earned: 100,
      available_points: 50,
      total_points_redeemed: 50,
      status: 'active',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }

    const mockFrom = jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: mockCustomer,
        error: null,
      }),
    }))

    const mockSupabase = {
      from: mockFrom,
    }

    mockCreateClient.mockResolvedValue(mockSupabase as any)

    const result = await getCustomerById('customer-id')

    expect(result).toEqual(mockCustomer)
  })

  it('should return null when customer not found', async () => {
    const mockFrom = jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      single: jest.fn().mockResolvedValue({
        data: null,
        error: { message: 'Not found' },
      }),
    }))

    const mockSupabase = {
      from: mockFrom,
    }

    mockCreateClient.mockResolvedValue(mockSupabase as any)

    const result = await getCustomerById('non-existent-id')

    expect(result).toBeNull()
  })
})

describe('searchCustomers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should search by phone number (exact match)', async () => {
    const mockCustomers = [
      {
        id: 'customer-id',
        mgp_id: 'MGP000001',
        name: 'John Doe',
        phone: '1234567890',
        available_points: 100,
      },
    ]

    const mockFrom = jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({
        data: mockCustomers,
        error: null,
      }),
    }))

    const mockSupabase = {
      from: mockFrom,
    }

    mockCreateClient.mockResolvedValue(mockSupabase as any)

    const result = await searchCustomers('1234567890')

    expect(result).toEqual(mockCustomers)
    expect(mockFrom).toHaveBeenCalledWith('customers')
  })

  it('should search by MGP ID (exact match)', async () => {
    const mockCustomers = [
      {
        id: 'customer-id',
        mgp_id: 'MGP000001',
        name: 'John Doe',
        phone: '1234567890',
        available_points: 100,
      },
    ]

    const mockFrom = jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      eq: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({
        data: mockCustomers,
        error: null,
      }),
    }))

    const mockSupabase = {
      from: mockFrom,
    }

    mockCreateClient.mockResolvedValue(mockSupabase as any)

    const result = await searchCustomers('MGP000001')

    expect(result).toEqual(mockCustomers)
  })

  it('should search by name (partial match)', async () => {
    const mockCustomers = [
      {
        id: 'customer-id',
        mgp_id: 'MGP000001',
        name: 'John Doe',
        phone: '1234567890',
        available_points: 100,
      },
    ]

    const mockFrom = jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      ilike: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({
        data: mockCustomers,
        error: null,
      }),
    }))

    const mockSupabase = {
      from: mockFrom,
    }

    mockCreateClient.mockResolvedValue(mockSupabase as any)

    const result = await searchCustomers('John')

    expect(result).toEqual(mockCustomers)
  })

  it('should return empty array when no results found', async () => {
    const mockFrom = jest.fn(() => ({
      select: jest.fn().mockReturnThis(),
      ilike: jest.fn().mockReturnThis(),
      limit: jest.fn().mockResolvedValue({
        data: [],
        error: null,
      }),
    }))

    const mockSupabase = {
      from: mockFrom,
    }

    mockCreateClient.mockResolvedValue(mockSupabase as any)

    const result = await searchCustomers('NonExistent')

    expect(result).toEqual([])
  })
})

