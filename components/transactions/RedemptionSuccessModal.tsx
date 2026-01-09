'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { X, CheckCircle2, Gift } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import PrintButton from '@/components/receipts/PrintButton'
import TransactionReceipt from '@/components/receipts/TransactionReceipt'

interface RedemptionSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  transaction: {
    transaction_id?: string
    transactionId?: string
    points_redeemed?: number
    discount?: number
    final_bill?: number
    finalBill?: number
    new_points_earned?: number
    newPointsEarned?: number
    activation_date?: string
    activationDate?: string
    expiry_date?: string
    expiryDate?: string
  }
  customer: {
    name: string
    mgp_id: string
    id?: string
    phone?: string
    email?: string | null
  }
  billAmount: number
  invoiceNumber?: string | null
  availableBalance?: number
}

export default function RedemptionSuccessModal({
  isOpen,
  onClose,
  transaction,
  customer,
  billAmount,
  invoiceNumber,
  availableBalance,
}: RedemptionSuccessModalProps) {
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleViewProfile = () => {
    onClose()
    if (customer.id) {
      router.push(`/customers/${customer.id}`)
    } else {
      router.push(`/customers/search?q=${customer.mgp_id}`)
    }
  }

  if (!isOpen) return null

  // Normalize transaction data
  const discount = transaction.discount || 0
  const finalBill = transaction.final_bill || transaction.finalBill || billAmount
  const newPointsEarned = transaction.new_points_earned || transaction.newPointsEarned || 0
  const pointsRedeemed = transaction.points_redeemed || 0

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <Card className="w-full max-w-2xl max-h-[90vh] overflow-y-auto print:max-w-none print:shadow-none print:border-none">
        <CardHeader className="print:hidden">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-success/10 flex items-center justify-center">
                <CheckCircle2 className="h-5 w-5 text-success" />
              </div>
              <div>
                <CardTitle>Redemption Successful!</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Points redeemed successfully
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Customer Info */}
          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground mb-1">Customer</p>
            <p className="font-semibold text-lg">{customer.name}</p>
            <Badge variant="outline" className="mt-1 font-mono">
              {customer.mgp_id}
            </Badge>
          </div>

          {/* Savings Highlight */}
          <div className="bg-success/10 border border-success/20 rounded-lg p-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-2">You Saved</p>
              <p className="text-4xl font-bold text-success">
                ₹{discount.toLocaleString('en-IN')}
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Using {pointsRedeemed} points
              </p>
            </div>
          </div>

          {/* Transaction Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Transaction Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Original Bill</p>
                <p className="font-semibold text-lg">₹{billAmount.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Final Bill</p>
                <p className="font-semibold text-lg text-primary">
                  ₹{finalBill.toLocaleString('en-IN')}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Points Used</p>
                <p className="font-semibold text-lg">{pointsRedeemed} pts</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">New Points Earned</p>
                <p className="font-semibold text-lg text-success">
                  {newPointsEarned} pts
                </p>
              </div>
              {invoiceNumber && (
                <div className="col-span-2">
                  <p className="text-muted-foreground mb-1">Invoice Number</p>
                  <p className="font-semibold">{invoiceNumber}</p>
                </div>
              )}
              {transaction.transaction_id && (
                <div className="col-span-2">
                  <p className="text-muted-foreground mb-1">Transaction ID</p>
                  <p className="font-mono text-xs">{transaction.transaction_id}</p>
                </div>
              )}
              <div className="col-span-2">
                <p className="text-muted-foreground mb-1">Date</p>
                <p>{format(new Date(), 'MMM d, yyyy h:mm a')}</p>
              </div>
            </div>
          </div>

          {/* New Balance */}
          {availableBalance !== undefined && (
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
              <h4 className="font-semibold mb-3 flex items-center gap-2">
                <Gift className="h-4 w-4 text-primary" />
                New Balance
              </h4>
              <div className="flex justify-between items-center">
                <span className="text-muted-foreground">Available Points:</span>
                <span className="text-2xl font-bold text-primary">
                  ₹{availableBalance.toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          )}

          {/* Receipt Preview (hidden on screen, shown on print) */}
          <div className="hidden print:block receipt-container">
            <TransactionReceipt
              transaction={transaction}
              customer={customer}
              billAmount={billAmount}
              invoiceNumber={invoiceNumber}
              transactionType="REDEMPTION"
              availableBalance={availableBalance}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t print:hidden">
            <PrintButton className="flex-1" />
            <Button
              onClick={handleViewProfile}
              className="flex-1"
            >
              View Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

