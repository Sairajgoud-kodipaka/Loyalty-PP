import { render, screen } from '@testing-library/react'
import PointBalance from '../customers/PointBalance'

describe('PointBalance', () => {
  const mockPoints = {
    available: 500,
    pending: 100,
    expiringSoon: 50,
    totalEarned: 1000,
    totalRedeemed: 400,
  }

  it('should render available points prominently', () => {
    render(<PointBalance points={mockPoints} />)
    
    expect(screen.getByText('Available Points')).toBeInTheDocument()
    expect(screen.getByText('500')).toBeInTheDocument()
    expect(screen.getByText('Worth ₹500 discount')).toBeInTheDocument()
  })

  it('should render pending points', () => {
    render(<PointBalance points={mockPoints} />)
    
    expect(screen.getByText('Pending')).toBeInTheDocument()
    expect(screen.getByText('100')).toBeInTheDocument()
    expect(screen.getByText('Activating in 24 hours')).toBeInTheDocument()
  })

  it('should render expiring soon points when greater than 0', () => {
    render(<PointBalance points={mockPoints} />)
    
    expect(screen.getByText('Expiring Soon')).toBeInTheDocument()
    expect(screen.getByText('50')).toBeInTheDocument()
    expect(screen.getByText('Within 30 days')).toBeInTheDocument()
  })

  it('should not render expiring soon when 0', () => {
    const pointsWithoutExpiring = {
      ...mockPoints,
      expiringSoon: 0,
    }
    
    render(<PointBalance points={pointsWithoutExpiring} />)
    
    expect(screen.queryByText('Expiring Soon')).not.toBeInTheDocument()
  })

  it('should render total earned points', () => {
    render(<PointBalance points={mockPoints} />)
    
    expect(screen.getByText('Total Earned')).toBeInTheDocument()
    expect(screen.getByText('1000')).toBeInTheDocument()
    expect(screen.getByText('Lifetime points')).toBeInTheDocument()
  })

  it('should render total redeemed points', () => {
    render(<PointBalance points={mockPoints} />)
    
    expect(screen.getByText('Total Redeemed')).toBeInTheDocument()
    expect(screen.getByText('400')).toBeInTheDocument()
    expect(screen.getByText('Lifetime redeemed')).toBeInTheDocument()
  })

  it('should handle zero values', () => {
    const zeroPoints = {
      available: 0,
      pending: 0,
      expiringSoon: 0,
      totalEarned: 0,
      totalRedeemed: 0,
    }
    
    render(<PointBalance points={zeroPoints} />)
    
    expect(screen.getByText('0')).toBeInTheDocument()
    expect(screen.queryByText('Expiring Soon')).not.toBeInTheDocument()
  })
})


