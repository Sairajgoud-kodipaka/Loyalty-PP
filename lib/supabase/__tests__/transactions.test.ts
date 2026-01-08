import { addPurchase, redeemPoints } from '../transactions'
import { createClient } from '../server'

jest.mock('../server')

const mockCreateClient = createClient as jest.MockedFunction<typeof createClient>

describe('addPurchase', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should add purchase successfully', async () => {
    const mockResult = {
      transaction_id: 'txn-id',
      points_earned: 200,
      activation_date: new Date().toISOString(),
      expiry_date: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString(),
    }

    const mockRpc = jest.fn().mockResolvedValue({
      data: mockResult,
      error: null,
    })

    const mockSupabase = {
      rpc: mockRpc,
    }

    mockCreateClient.mockResolvedValue(mockSupabase as any)

    const result = await addPurchase(
      'customer-id',
      10000,
      'INV-001',
      'user-id'
    )

    expect(result).toEqual(mockResult)
    expect(mockRpc).toHaveBeenCalledWith('add_purchase', {
      p_customer_id: 'customer-id',
      p_bill_amount: 10000,
      p_invoice_number: 'INV-001',
      p_created_by: 'user-id',
    })
  })

  it('should handle null invoice number', async () => {
    const mockResult = {
      transaction_id: 'txn-id',
      points_earned: 200,
      activation_date: new Date().toISOString(),
      expiry_date: new Date(Date.now() + 2 * 365 * 24 * 60 * 60 * 1000).toISOString(),
    }

    const mockRpc = jest.fn().mockResolvedValue({
      data: mockResult,
      error: null,
    })

    const mockSupabase = {
      rpc: mockRpc,
    }

    mockCreateClient.mockResolvedValue(mockSupabase as any)

    await addPurchase('customer-id', 10000, null, 'user-id')

    expect(mockRpc).toHaveBeenCalledWith('add_purchase', {
      p_customer_id: 'customer-id',
      p_bill_amount: 10000,
      p_invoice_number: null,
      p_created_by: 'user-id',
    })
  })

  it('should throw error when RPC call fails', async () => {
    const mockRpc = jest.fn().mockResolvedValue({
      data: null,
      error: { message: 'Database error' },
    })

    const mockSupabase = {
      rpc: mockRpc,
    }

    mockCreateClient.mockResolvedValue(mockSupabase as any)

    await expect(
      addPurchase('customer-id', 10000, 'INV-001', 'user-id')
    ).rejects.toThrow('Database error')
  })
})

describe('redeemPoints', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('should redeem points successfully', async () => {
    const mockResult = {
      transaction_id: 'txn-id',
      points_redeemed: 500,
      discount_amount: 500,
      final_bill: 9500,
      new_points_earned: 190,
      new_balance: 1000,
    }

    const mockRpc = jest.fn().mockResolvedValue({
      data: mockResult,
      error: null,
    })

    const mockSupabase = {
      rpc: mockRpc,
    }

    mockCreateClient.mockResolvedValue(mockSupabase as any)

    const result = await redeemPoints(
      'customer-id',
      10000,
      500,
      'INV-002',
      'user-id'
    )

    expect(result).toEqual(mockResult)
    expect(mockRpc).toHaveBeenCalledWith('redeem_points', {
      p_customer_id: 'customer-id',
      p_bill_amount: 10000,
      p_points_to_redeem: 500,
      p_invoice_number: 'INV-002',
      p_created_by: 'user-id',
    })
  })

  it('should handle null invoice number', async () => {
    const mockResult = {
      transaction_id: 'txn-id',
      points_redeemed: 500,
      discount_amount: 500,
      final_bill: 9500,
      new_points_earned: 190,
      new_balance: 1000,
    }

    const mockRpc = jest.fn().mockResolvedValue({
      data: mockResult,
      error: null,
    })

    const mockSupabase = {
      rpc: mockRpc,
    }

    mockCreateClient.mockResolvedValue(mockSupabase as any)

    await redeemPoints('customer-id', 10000, 500, null, 'user-id')

    expect(mockRpc).toHaveBeenCalledWith('redeem_points', {
      p_customer_id: 'customer-id',
      p_bill_amount: 10000,
      p_points_to_redeem: 500,
      p_invoice_number: null,
      p_created_by: 'user-id',
    })
  })

  it('should throw error when RPC call fails', async () => {
    const mockRpc = jest.fn().mockResolvedValue({
      data: null,
      error: { message: 'Insufficient points' },
    })

    const mockSupabase = {
      rpc: mockRpc,
    }

    mockCreateClient.mockResolvedValue(mockSupabase as any)

    await expect(
      redeemPoints('customer-id', 10000, 5000, 'INV-002', 'user-id')
    ).rejects.toThrow('Insufficient points')
  })
})

