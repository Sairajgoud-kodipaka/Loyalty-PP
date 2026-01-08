'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { ShoppingBag, Calculator, Calendar, Coins, ArrowLeft, Loader2 } from 'lucide-react'
import { format, addHours, addYears } from 'date-fns'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import LoadingSpinner from '@/components/ui/LoadingSpinner'
import { cn } from '@/lib/utils/cn'

export default function PurchaseForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const customerId = searchParams.get('customerId')
  
  const [loading, setLoading] = useState(false)
  const [fetchingCustomer, setFetchingCustomer] = useState(true)
  const [customer, setCustomer] = useState<any>(null)
  const [billAmount, setBillAmount] = useState('')
  const [invoiceNumber, setInvoiceNumber] = useState('')
  const [pointsEarned, setPointsEarned] = useState(0)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (customerId) {
      fetch(`/api/customers/${customerId}`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setCustomer(data.data.customer)
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
    const amount = parseFloat(billAmount) || 0
    if (amount >= 50) {
      setPointsEarned(Math.floor(amount / 50))
    } else {
      setPointsEarned(0)
    }
    
    // Clear error when amount changes
    if (errors.billAmount && amount >= 50) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors.billAmount
        return newErrors
      })
    }
  }, [billAmount, errors])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!customerId) {
      toast.error('Customer not selected')
      router.push('/customers/search')
      return
    }
    
    const amount = parseFloat(billAmount)
    if (isNaN(amount) || amount < 50) {
      setErrors({ billAmount: 'Minimum bill amount is ₹50' })
      return
    }
    
    setLoading(true)
    
    try {
      const response = await fetch('/api/transactions/purchase', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customer_id: customerId,
          bill_amount: amount,
          invoice_number: invoiceNumber || null,
        }),
      })
      
      const result = await response.json()
      
      if (!response.ok) {
        throw new Error(result.error || 'Failed to record purchase')
      }
      
      toast.success(`Purchase recorded! ${pointsEarned} points earned.`, {
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

  const activationDate = addHours(new Date(), 24)
  const expiryDate = addYears(activationDate, 2)

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
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <ShoppingBag className="h-5 w-5 text-success" aria-hidden="true" />
              </div>
              <div>
                <CardTitle>New Purchase</CardTitle>
                <CardDescription>Record a purchase transaction for {customer.name}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
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
                {customer.available_points > 0 && (
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground mb-1">Available Points</p>
                    <p className="text-2xl font-bold text-primary">{customer.available_points}</p>
                  </div>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <Input
                label="Bill Amount (₹)"
                name="bill_amount"
                id="bill_amount"
                type="number"
                required
                min="50"
                step="0.01"
                value={billAmount}
                onChange={(e) => setBillAmount(e.target.value)}
                placeholder="Enter bill amount"
                error={errors.billAmount}
                helperText="Minimum amount: ₹50"
                disabled={loading}
                autoFocus
              />

              {/* Points Calculation Preview */}
              {billAmount && parseFloat(billAmount) >= 50 && (
                <Card className="bg-success/5 border-success/20">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <Calculator className="h-5 w-5 text-success" aria-hidden="true" />
                      <h3 className="font-semibold text-foreground">Points Calculation</h3>
                    </div>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Bill Amount:</span>
                        <span className="font-medium">₹{parseFloat(billAmount).toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Points Earned:</span>
                        <span className="font-bold text-success text-lg">{pointsEarned} pts</span>
                      </div>
                      <div className="pt-2 border-t border-border mt-2">
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" aria-hidden="true" />
                          <span>Activation: {format(activationDate, 'MMM d, yyyy h:mm a')}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
                          <Coins className="h-3 w-3" aria-hidden="true" />
                          <span>Expires: {format(expiryDate, 'MMM d, yyyy')}</span>
                        </div>
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
                  disabled={loading || !billAmount || parseFloat(billAmount) < 50}
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
                      <ShoppingBag className="mr-2 h-4 w-4" aria-hidden="true" />
                      Confirm Purchase
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
