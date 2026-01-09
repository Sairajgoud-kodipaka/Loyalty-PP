'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { X, CheckCircle2, ShoppingBag } from 'lucide-react'
import Button from '@/components/ui/Button'
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import Badge from '@/components/ui/Badge'
import PrintButton from '@/components/receipts/PrintButton'
import TransactionReceipt from '@/components/receipts/TransactionReceipt'

interface PurchaseSuccessModalProps {
  isOpen: boolean
  onClose: () => void
  transaction: {
    transaction_id: string
    points_earned: number
    activation_date: string
    expiry_date: string
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

export default function PurchaseSuccessModal({
  isOpen,
  onClose,
  transaction,
  customer,
  billAmount,
  invoiceNumber,
  availableBalance,
}: PurchaseSuccessModalProps) {
  const router = useRouter()

  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
    }
    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])


  const handleNewPurchase = () => {
    onClose()
    router.push(`/transactions/purchase?customerId=${customer.mgp_id}`)
  }

  const handleViewProfile = () => {
    onClose()
    if (customer.id) {
      router.push(`/customers/${customer.id}`)
    } else {
      // Fallback to search if ID not available
      router.push(`/customers/search?q=${customer.mgp_id}`)
    }
  }

  if (!isOpen) return null

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
                <CardTitle>Purchase Successful!</CardTitle>
                <p className="text-sm text-muted-foreground mt-1">
                  Transaction recorded successfully
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

          {/* Transaction Details */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Transaction Details</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-muted-foreground mb-1">Bill Amount</p>
                <p className="font-semibold text-lg">₹{billAmount.toLocaleString('en-IN')}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Points Earned</p>
                <p className="font-semibold text-lg text-success">
                  {transaction.points_earned} pts
                </p>
              </div>
              {invoiceNumber && (
                <div className="col-span-2">
                  <p className="text-muted-foreground mb-1">Invoice Number</p>
                  <p className="font-semibold">{invoiceNumber}</p>
                </div>
              )}
              <div>
                <p className="text-muted-foreground mb-1">Transaction ID</p>
                <p className="font-mono text-xs">{transaction.transaction_id}</p>
              </div>
              <div>
                <p className="text-muted-foreground mb-1">Date</p>
                <p>{format(new Date(), 'MMM d, yyyy h:mm a')}</p>
              </div>
            </div>
          </div>

          {/* Points Lifecycle */}
          <div className="bg-success/5 border border-success/20 rounded-lg p-4">
            <h4 className="font-semibold mb-3 flex items-center gap-2">
              <ShoppingBag className="h-4 w-4 text-success" />
              Points Information
            </h4>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Activation:</span>
                <span className="font-medium">
                  {format(new Date(transaction.activation_date), 'MMM d, yyyy h:mm a')}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Expires:</span>
                <span className="font-medium">
                  {format(new Date(transaction.expiry_date), 'MMM d, yyyy')}
                </span>
              </div>
            </div>
          </div>

          {/* Receipt Preview (hidden on screen, shown on print) */}
          <div className="hidden print:block receipt-container">
            <TransactionReceipt
              transaction={transaction}
              customer={customer}
              billAmount={billAmount}
              invoiceNumber={invoiceNumber}
              transactionType="PURCHASE"
              availableBalance={availableBalance}
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t print:hidden">
            <PrintButton className="flex-1" />
            <Button
              onClick={handleNewPurchase}
              variant="outline"
              className="flex-1"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              New Purchase
            </Button>
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

