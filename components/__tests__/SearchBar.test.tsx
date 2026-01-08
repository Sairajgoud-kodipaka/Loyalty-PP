import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import SearchBar from '../customers/SearchBar'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'

jest.mock('next/navigation')
jest.mock('sonner')

const mockPush = jest.fn()

beforeEach(() => {
  jest.clearAllMocks()
  ;(useRouter as jest.Mock).mockReturnValue({
    push: mockPush,
  })
  ;(toast.error as jest.Mock) = jest.fn()
  
  global.fetch = jest.fn()
  
  jest.useFakeTimers()
})

afterEach(() => {
  jest.runOnlyPendingTimers()
  jest.useRealTimers()
})

describe('SearchBar', () => {
  it('should render search input', () => {
    render(<SearchBar />)
    
    expect(screen.getByPlaceholderText(/search by phone/i)).toBeInTheDocument()
  })

  it('should render register button', () => {
    render(<SearchBar />)
    
    expect(screen.getByRole('button', { name: /register/i })).toBeInTheDocument()
  })

  it('should not search for queries shorter than 2 characters', async () => {
    const user = userEvent.setup({ delay: null })
    render(<SearchBar />)
    
    const input = screen.getByPlaceholderText(/search by phone/i)
    await user.type(input, 'J')
    
    jest.advanceTimersByTime(500)
    
    expect(global.fetch).not.toHaveBeenCalled()
  })

  it('should debounce search requests', async () => {
    const user = userEvent.setup({ delay: null })
    const mockResponse = {
      success: true,
      data: [],
    }
    
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    })
    
    render(<SearchBar />)
    
    const input = screen.getByPlaceholderText(/search by phone/i)
    await user.type(input, 'John')
    
    // Should not call immediately
    expect(global.fetch).not.toHaveBeenCalled()
    
    // Should call after debounce delay
    jest.advanceTimersByTime(300)
    
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalled()
    })
  })

  it('should display search results', async () => {
    const user = userEvent.setup({ delay: null })
    const mockResults = [
      {
        id: 'customer-1',
        mgp_id: 'MGP000001',
        name: 'John Doe',
        phone: '1234567890',
        available_points: 100,
      },
      {
        id: 'customer-2',
        mgp_id: 'MGP000002',
        name: 'Jane Smith',
        phone: '0987654321',
        available_points: 200,
      },
    ]
    
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockResults,
      }),
    })
    
    render(<SearchBar />)
    
    const input = screen.getByPlaceholderText(/search by phone/i)
    await user.type(input, 'John')
    
    jest.advanceTimersByTime(300)
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
      expect(screen.getByText('Jane Smith')).toBeInTheDocument()
    })
  })

  it('should navigate to customer profile on selection', async () => {
    const user = userEvent.setup({ delay: null })
    const mockResults = [
      {
        id: 'customer-1',
        mgp_id: 'MGP000001',
        name: 'John Doe',
        phone: '1234567890',
        available_points: 100,
      },
    ]
    
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        data: mockResults,
      }),
    })
    
    render(<SearchBar />)
    
    const input = screen.getByPlaceholderText(/search by phone/i)
    await user.type(input, 'John')
    
    jest.advanceTimersByTime(300)
    
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument()
    })
    
    await user.click(screen.getByText('John Doe'))
    
    expect(mockPush).toHaveBeenCalledWith('/customers/customer-1')
  })

  it('should show loading state during search', async () => {
    const user = userEvent.setup({ delay: null })
    
    ;(global.fetch as jest.Mock).mockImplementation(
      () => new Promise(resolve => setTimeout(() => resolve({
        ok: true,
        json: async () => ({ success: true, data: [] }),
      }), 100))
    )
    
    render(<SearchBar />)
    
    const input = screen.getByPlaceholderText(/search by phone/i)
    await user.type(input, 'John')
    
    jest.advanceTimersByTime(300)
    
    await waitFor(() => {
      expect(screen.getByText(/searching/i)).toBeInTheDocument()
    })
  })

  it('should show error message on search failure', async () => {
    const user = userEvent.setup({ delay: null })
    
    ;(global.fetch as jest.Mock).mockRejectedValueOnce(new Error('Network error'))
    
    render(<SearchBar />)
    
    const input = screen.getByPlaceholderText(/search by phone/i)
    await user.type(input, 'John')
    
    jest.advanceTimersByTime(300)
    
    await waitFor(() => {
      expect(toast.error).toHaveBeenCalledWith('Search failed')
    })
  })
})

