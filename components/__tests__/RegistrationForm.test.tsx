import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import RegistrationForm from '../customers/RegistrationForm'
import { useRouter } from 'next/navigation'
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
  ;(toast.success as jest.Mock) = jest.fn()
  ;(toast.error as jest.Mock) = jest.fn()
  
  global.fetch = jest.fn()
})

describe('RegistrationForm', () => {
  it('should render all form fields', () => {
    render(<RegistrationForm />)
    
    expect(screen.getByLabelText(/full name/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/phone number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/aadhar number/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/passport number/i)).toBeInTheDocument()
  })

  it('should format phone number input (digits only, max 10)', async () => {
    const user = userEvent.setup()
    render(<RegistrationForm />)
    
    const phoneInput = screen.getByLabelText(/phone number/i)
    await user.type(phoneInput, '12345abc67890')
    
    expect(phoneInput).toHaveValue('1234567890')
  })

  it('should format Aadhar number input (digits only, max 12)', async () => {
    const user = userEvent.setup()
    render(<RegistrationForm />)
    
    const aadharInput = screen.getByLabelText(/aadhar number/i)
    await user.type(aadharInput, '1234567890123456')
    
    expect(aadharInput).toHaveValue('123456789012')
  })

  it('should submit form with valid data', async () => {
    const user = userEvent.setup()
    const mockResponse = {
      success: true,
      data: {
        id: 'customer-id',
        mgp_id: 'MGP000001',
        name: 'John Doe',
        phone: '1234567890',
      },
    }
    
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })
    
    render(<RegistrationForm />)
    
    await user.type(screen.getByLabelText(/full name/i), 'John Doe')
    await user.type(screen.getByLabelText(/phone number/i), '1234567890')
    await user.type(screen.getByLabelText(/aadhar number/i), '123456789012')
    
    await user.click(screen.getByRole('button', { name: /register customer/i }))
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'John Doe',
          phone: '1234567890',
          email: '',
          aadhar_number: '123456789012',
          passport_number: '',
        }),
      })
    })
  })

  it('should navigate to customer profile on success', async () => {
    const user = userEvent.setup()
    const mockResponse = {
      success: true,
      data: {
        id: 'customer-id',
        mgp_id: 'MGP000001',
      },
    }
    
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })
    
    render(<RegistrationForm />)
    
    await user.type(screen.getByLabelText(/full name/i), 'John Doe')
    await user.type(screen.getByLabelText(/phone number/i), '1234567890')
    await user.type(screen.getByLabelText(/aadhar number/i), '123456789012')
    
    await user.click(screen.getByRole('button', { name: /register customer/i }))
    
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('/customers/customer-id')
    })
  })

  it('should show error toast on API error', async () => {
    const user = userEvent.setup()
    
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      json: async () => ({
        success: false,
        error: 'Phone number already registered',
      }),
    })
    
    render(<RegistrationForm />)
    
    await user.type(screen.getByLabelText(/full name/i), 'John Doe')
    await user.type(screen.getByLabelText(/phone number/i), '1234567890')
    await user.type(screen.getByLabelText(/aadhar number/i), '123456789012')
    
    await user.click(screen.getByRole('button', { name: /register customer/i }))
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Phone number already registered')
    })
  })

  it('should handle cancel button', async () => {
    const user = userEvent.setup()
    render(<RegistrationForm />)
    
    await user.click(screen.getByRole('button', { name: /cancel/i }))
    
    expect(mockBack).toHaveBeenCalled()
  })
})

