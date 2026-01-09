import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import PurchaseForm from '../transactions/PurchaseForm'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'

jest.mock('next/navigation')
jest.mock('sonner')

const mockPush = jest.fn()
const mockBack = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  ;(useRouter as jest.Mock).mockReturnValue({
    push: mockPush,
    back: mockBack,
  })
  ;(useSearchParams as jest.Mock).mockReturnValue({
    get: jest.fn((key: string) => key === 'customerId' ? 'customer-id' : null),
  })
  ;(toast.success as jest.Mock) = jest.fn()
  ;(toast.error as jest.Mock) = jest.fn()
  
  global.fetch = jest.fn()
})

describe('PurchaseForm', () => {
  const mockCustomer = {
    id: 'customer-id',
    mgp_id: 'MGP000001',
    name: 'John Doe',
    phone: '1234567890',
  }

  beforeEach(() => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: { customer: mockCustomer },
      }),
    })
  })

  it('should load customer data on mount', async () => {
    render(<PurchaseForm />)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/customers/customer-id')
    })
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
  })

  it('should calculate points earned based on bill amount', async () => {
    const user = userEvent.setup()
    render(<PurchaseForm />)
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
    
    const billInput = screen.getByLabelText(/bill amount/i)
    await user.type(billInput, '10000')
    
    await waitFor(() => {
      expect(screen.getByText(/200 MGP Points/i)).toBeInTheDocument()
    })
  })

  it('should not show points for amounts less than 50', async () => {
    const user = userEvent.setup()
    render(<PurchaseForm />)
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
    
    const billInput = screen.getByLabelText(/bill amount/i)
    await user.type(billInput, '25')
    
    expect(screen.queryByText(/MGP Points/i)).not.toBeInTheDocument()
  })

  it('should submit purchase successfully', async () => {
    const user = userEvent.setup()
    const mockResponse = {
      success: true,
      data: {
        transaction_id: 'txn-id',
        points_earned: 200,
      },
    }
    
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { customer: mockCustomer },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => mockResponse,
      })
    
    render(<PurchaseForm />)
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
    
    const billInput = screen.getByLabelText(/bill amount/i)
    await user.type(billInput, '10000')
    
    await user.click(screen.getByRole('button', { name: /confirm purchase/i }))
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/transactions/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: 'customer-id',
          bill_amount: 10000,
          invoice_number: null,
        }),
      })
    })
  })

  it('should navigate to customer profile on success', async () => {
    const user = userEvent.setup()
    
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { customer: mockCustomer },
        }),
      })
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { transaction_id: 'txn-id' },
        }),
      })
    
    render(<PurchaseForm />)
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
    
    const billInput = screen.getByLabelText(/bill amount/i)
    await user.type(billInput, '10000')
    
    await user.click(screen.getByRole('button', { name: /confirm purchase/i }))
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/customers/customer-id')
    })
  })

  it('should show error for invalid bill amount', async () => {
    const user = userEvent.setup()
    render(<PurchaseForm />)
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
    
    const billInput = screen.getByLabelText(/bill amount/i)
    await user.type(billInput, '25')
    
    await user.click(screen.getByRole('button', { name: /confirm purchase/i }))
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Minimum bill amount is ₹50')
    })
  })

  it('should handle API errors', async () => {
    const user = userEvent.setup()
    
    ;(global.fetch as jest.Mock)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ({
          success: true,
          data: { customer: mockCustomer },
        }),
      })
      .mockResolvedValueOnce({
        ok: false,
        json: async () => ({
          success: false,
          error: 'Database error',
        }),
      })
    
    render(<PurchaseForm />)
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
    
    const billInput = screen.getByLabelText(/bill amount/i)
    await user.type(billInput, '10000')
    
    await user.click(screen.getByRole('button', { name: /confirm purchase/i }))
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Database error')
    })
  })
})


