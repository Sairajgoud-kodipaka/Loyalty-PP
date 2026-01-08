import { calculatePoints } from '../points'

describe('calculatePoints', () => {
  it('should calculate points correctly for exact multiples of 50', () => {
    expect(calculatePoints(50)).toBe(1)
    expect(calculatePoints(100)).toBe(2)
    expect(calculatePoints(500)).toBe(10)
    expect(calculatePoints(1000)).toBe(20)
  })

  it('should floor points for amounts not divisible by 50', () => {
    expect(calculatePoints(49)).toBe(0)
    expect(calculatePoints(99)).toBe(1)
    expect(calculatePoints(149)).toBe(2)
    expect(calculatePoints(249)).toBe(4)
  })

  it('should handle minimum bill amount (50)', () => {
    expect(calculatePoints(50)).toBe(1)
    expect(calculatePoints(49)).toBe(0)
  })

  it('should handle large amounts', () => {
    expect(calculatePoints(10000)).toBe(200)
    expect(calculatePoints(50000)).toBe(1000)
    expect(calculatePoints(100000)).toBe(2000)
  })

  it('should handle decimal amounts by flooring', () => {
    expect(calculatePoints(50.99)).toBe(1)
    expect(calculatePoints(99.99)).toBe(1)
    expect(calculatePoints(149.50)).toBe(2)
  })

  it('should return 0 for amounts less than 50', () => {
    expect(calculatePoints(0)).toBe(0)
    expect(calculatePoints(1)).toBe(0)
    expect(calculatePoints(25)).toBe(0)
    expect(calculatePoints(49.99)).toBe(0)
  })
})

