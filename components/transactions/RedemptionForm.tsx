'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { Gift, Calculator, Coins, ArrowLeft, Loader2, AlertTriangle } from 'lucide-react'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { cn } from '@/lib/utils/cn'

export default function RedemptionForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const customerId = searchParams.get('customerId')
  
  const [loading, setLoading] = useState(false)
  const [fetchingCustomer, setFetchingCustomer] = useState(true)
  const [customer, setCustomer] = useState<any>(null)
  const [availablePoints, setAvailablePoints] = useState(0)
  const [billAmount, setBillAmount] = useState('')
  const [pointsToRedeem, setPointsToRedeem] = useState('')
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [discount, setDiscount] = useState(0)
  const [finalBill, setFinalBill] = useState(0)
  const [newPoints, setNewPoints] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (customerId) {
      fetch(`/api/customers/${customerId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setCustomer(data.data.customer)
            setAvailablePoints(data.data.points.available)
          } else {
            toast.error('Failed to load customer')
            router.push('/customers/search')
          }
        })
        .catch(() => {
          toast.error('Failed to load customer')
          router.push('/customers/search')
        })
        .finally(() => setFetchingCustomer(false))
    } else {
      setFetchingCustomer(false)
    }
  }, [customerId, router])

  useEffect(() => {
    const points = parseInt(pointsToRedeem) || 0
    const bill = parseFloat(billAmount) || 0
    
    if (points > 0 && points <= availablePoints && bill > 0) {
      setDiscount(points)
      setFinalBill(Math.max(bill - points, 0))
      setNewPoints(Math.floor((Math.max(bill - points, 0)) / 50))
    } else {
      setDiscount(0)
      setFinalBill(bill)
      setNewPoints(Math.floor(bill / 50))
    }
    
    // Clear errors when values change
    if (errors.pointsToRedeem && points <= availablePoints && points > 0) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.pointsToRedeem
        return newErrors
      })
    }
  }, [billAmount, pointsToRedeem, availablePoints, errors])

  const handleUseMaximum = () => {
    const bill = parseFloat(billAmount) || 0
    const maxPoints = Math.min(availablePoints, Math.floor(bill))
    setPointsToRedeem(maxPoints.toString())
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!customerId) {
      toast.error('Customer not selected')
      router.push('/customers/search')
      return
    }
    
    const points = parseInt(pointsToRedeem)
    const bill = parseFloat(billAmount)
    
    if (isNaN(bill) || bill <= 0) {
      setErrors({ billAmount: 'Bill amount is required' })
      return
    }
    
    if (isNaN(points) || points < 1) {
      setErrors({ pointsToRedeem: 'Must redeem at least 1 point' })
      return
    }
    
    if (points > availablePoints) {
      setErrors({ pointsToRedeem: `Insufficient points. Available: ${availablePoints}` })
      return
    }
    
    setLoading(true)
    
    try {
      const response = await fetch('/api/transactions/redeem', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: customerId,
          bill_amount: bill,
          points_to_redeem: points,
          invoice_number: invoiceNumber || null,
        }),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to redeem points')
      }
      
      toast.success(`Points redeemed! Discount: ₹${discount}. New points earned: ${newPoints}`, {
        duration: 5000,
      })
      router.push(`/customers/${customerId}`)
    } catch (error: any) {
      toast.error(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (fetchingCustomer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-12">
              <LoadingSpinner text="Loading customer details..." />
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-destructive mb-4">Customer not found</p>
              <Button onClick={() => router.push('/customers/search')}>
                Search Customer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  const redemptionPercentage = availablePoints > 0 
    ? (parseInt(pointsToRedeem) || 0) / availablePoints * 100 
    : 0

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto space-y-6">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="mb-4"
        >
          <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-warning/10 flex items-center justify-center">
                <Gift className="h-5 w-5 text-warning" aria-hidden="true" />
              </div>
              <div>
                <CardTitle>Redeem Points</CardTitle>
                <CardDescription>Process point redemption for {customer.name}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {/* Available Points Display */}
            <Card className="bg-gradient-to-br from-primary to-primary/80 border-primary/20 mb-6">
              <CardContent className="p-6 text-primary-foreground">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-primary-foreground/80 mb-1">Available Points</p>
                    <p className="text-4xl font-bold">{availablePoints.toLocaleString()}</p>
                    <p className="text-sm text-primary-foreground/90 mt-1">
                      Worth ₹{availablePoints.toLocaleString()} discount
                    </p>
                  </div>
                  <div className="h-16 w-16 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                    <Coins className="h-8 w-8" aria-hidden="true" />
                  </div>
                </div>
              </CardContent>
            </Card>

            {availablePoints === 0 && (
              <Card className="border-warning/50 bg-warning/5 mb-6">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-5 w-5 text-warning flex-shrink-0 mt-0.5" aria-hidden="true" />
                    <div>
                      <p className="font-medium text-foreground mb-1">No Points Available</p>
                      <p className="text-sm text-muted-foreground">
                        This customer doesn't have any active points to redeem. Points become active 24 hours after earning.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Customer Info */}
            <div className="bg-muted/50 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Customer</p>
                  <p className="font-semibold text-foreground">{customer.name}</p>
                  <Badge variant="outline" className="mt-1 font-mono text-xs">
                    {customer.mgp_id}
                  </Badge>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Bill Amount (₹)"
                name="bill_amount"
                id="bill_amount"
                type="number"
                required
                min="0"
                step="0.01"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                placeholder="Enter bill amount"
                error={errors.billAmount}
                disabled={loading || availablePoints === 0}
                autoFocus
              />

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label htmlFor="points_to_redeem" className="block text-sm font-medium text-foreground">
                    Points to Redeem *
                  </label>
                  {availablePoints > 0 && billAmount && parseFloat(billAmount) > 0 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={handleUseMaximum}
                      className="text-xs"
                    >
                      Use Maximum
                    </Button>
                  )}
                </div>
                <Input
                  name="points_to_redeem"
                  id="points_to_redeem"
                  type="number"
                  required
                  min="1"
                  max={availablePoints}
                  value={pointsToRedeem}
                  onChange={(e) => setPointsToRedeem(e.target.value)}
                  placeholder="Enter points to redeem"
                  error={errors.pointsToRedeem}
                  helperText={`Maximum: ${availablePoints} points`}
                  disabled={loading || availablePoints === 0}
                />
                {redemptionPercentage > 50 && (
                  <p className="mt-1 text-sm text-warning flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" aria-hidden="true" />
                    Redeeming more than 50% of available balance
                  </p>
                )}
              </div>

              {/* Calculation Preview */}
              {billAmount && pointsToRedeem && parseInt(pointsToRedeem) > 0 && (
                <Card className="bg-muted/50 border-border">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-4">
                      <Calculator className="h-5 w-5 text-primary" aria-hidden="true" />
                      <h3 className="font-semibold text-foreground">Calculation Summary</h3>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Original Bill:</span>
                        <span className="font-medium">₹{parseFloat(billAmount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-muted-foreground">Discount ({pointsToRedeem} pts):</span>
                        <span className="font-semibold text-success">- ₹{discount.toLocaleString()}</span>
                      </div>
                      <div className="border-t border-border pt-3">
                        <div className="flex justify-between items-center mb-2">
                          <span className="font-semibold text-foreground">Final Bill:</span>
                          <span className="text-2xl font-bold text-primary">₹{finalBill.toLocaleString()}</span>
                        </div>
                        {finalBill > 0 && (
                          <div className="flex justify-between items-center text-sm">
                            <span className="text-muted-foreground">New Points Earned:</span>
                            <span className="font-medium text-success">{newPoints} pts</span>
                          </div>
                        )}
                        {finalBill === 0 && (
                          <p className="text-xs text-muted-foreground mt-2">
                            Bill fully covered by points!
                          </p>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              <Input
                label="Invoice Number (Optional)"
                name="invoice_number"
                id="invoice_number"
                type="text"
                value={invoiceNumber}
                onChange={(e) => setInvoiceNumber(e.target.value)}
                placeholder="Enter invoice number"
                disabled={loading}
              />

              <div className="flex gap-4 pt-4">
                <Button
                  type="submit"
                  disabled={loading || availablePoints === 0 || !billAmount || !pointsToRedeem || parseInt(pointsToRedeem) < 1}
                  className="flex-1"
                  isLoading={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <Gift className="mr-2 h-4 w-4" aria-hidden="true" />
                      Confirm Redemption
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  onClick={() => router.back()}
                  variant="outline"
                  disabled={loading}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
