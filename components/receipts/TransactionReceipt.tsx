'use client'

import { format } from 'date-fns'

interface TransactionReceiptProps {
  transaction: {
    transaction_id?: string
    transactionId?: string
    points_earned?: number
    pointsEarned?: number
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
    phone?: string
    email?: string | null
  }
  billAmount: number
  invoiceNumber?: string | null
  transactionType: 'PURCHASE' | 'REDEMPTION'
  availableBalance?: number
}

export default function TransactionReceipt({
  transaction,
  customer,
  billAmount,
  invoiceNumber,
  transactionType,
  availableBalance,
}: TransactionReceiptProps) {
  // Normalize transaction data (handle both snake_case and camelCase)
  const transactionId = transaction.transaction_id || transaction.transactionId || ''
  const pointsEarned = transaction.points_earned || transaction.pointsEarned || 0
  const pointsRedeemed = transaction.points_redeemed || 0
  const discount = transaction.discount || 0
  const finalBill = transaction.final_bill || transaction.finalBill || billAmount
  const newPointsEarned = transaction.new_points_earned || transaction.newPointsEarned || 0
  const activationDate = transaction.activation_date || transaction.activationDate
  const expiryDate = transaction.expiry_date || transaction.expiryDate

  const storeName = 'MANGATRAI PEARLS & JEWELLERS'
  const receiptTitle = transactionType === 'PURCHASE' 
    ? 'LOYALTY REWARD RECEIPT' 
    : 'LOYALTY REDEMPTION RECEIPT'

  return (
    <div className="receipt-container">
      <div className="w-[80mm] max-w-[80mm] mx-auto bg-white text-black font-mono text-xs p-4 space-y-2 print:p-4 print:m-0">
        {/* Store Header */}
        <div className="text-center border-b border-black pb-2 mb-2">
          {/* Logo */}
          <div className="flex justify-center mb-2">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/pearl-logo.png"
              alt="Mangatrai Pearls & Jewellers"
              className="h-16 w-auto object-contain"
              style={{ maxHeight: '64px' }}
            />
          </div>
          <h1 className="text-sm font-bold uppercase tracking-wide">{storeName}</h1>
          <p className="text-xs mt-1">{receiptTitle}</p>
        </div>

        {/* Customer Info */}
        <div className="space-y-1 border-b border-dashed border-gray-400 pb-2">
          <div className="flex justify-between">
            <span className="font-semibold">MGP ID:</span>
            <span className="font-bold text-sm">{customer.mgp_id}</span>
          </div>
          <div>
            <span className="font-semibold">Name:</span> {customer.name}
          </div>
          {customer.phone && (
            <div>
              <span className="font-semibold">Phone:</span> {customer.phone}
            </div>
          )}
          {customer.email && (
            <div>
              <span className="font-semibold">Email:</span> {customer.email}
            </div>
          )}
        </div>

        {/* Transaction Date */}
        <div className="text-xs border-b border-dashed border-gray-400 pb-2">
          <div>
            <span className="font-semibold">Date:</span> {format(new Date(), 'dd MMM yyyy')}
          </div>
          <div>
            <span className="font-semibold">Time:</span> {format(new Date(), 'hh:mm a')}
          </div>
          {transactionId && (
            <div className="text-xs mt-1">
              <span className="font-semibold">Txn ID:</span> {transactionId.substring(0, 8)}...
            </div>
          )}
        </div>

        {/* Transaction Details */}
        <div className="space-y-2 border-b border-dashed border-gray-400 pb-2">
          {transactionType === 'PURCHASE' ? (
            <>
              <div className="flex justify-between">
                <span>Bill Amount:</span>
                <span className="font-semibold">₹{billAmount.toLocaleString('en-IN')}</span>
              </div>
              {invoiceNumber && (
                <div className="flex justify-between text-xs">
                  <span>Invoice:</span>
                  <span>{invoiceNumber}</span>
                </div>
              )}
              <div className="border-t border-gray-300 pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">POINTS EARNED:</span>
                  <span className="text-base font-bold">{pointsEarned} pts</span>
                </div>
                <div className="text-xs text-right mt-1">
                  Worth ₹{pointsEarned.toLocaleString('en-IN')}
                </div>
              </div>
              {activationDate && (
                <div className="text-xs mt-2">
                  <div>
                    <span className="font-semibold">Available:</span>{' '}
                    {format(new Date(activationDate), 'dd MMM yyyy, hh:mm a')}
                  </div>
                  {expiryDate && (
                    <div>
                      <span className="font-semibold">Expires:</span>{' '}
                      {format(new Date(expiryDate), 'dd MMM yyyy')}
                    </div>
                  )}
                </div>
              )}
              {availableBalance !== undefined && (
                <div className="text-xs mt-2 pt-2 border-t border-gray-300">
                  <div className="flex justify-between">
                    <span className="font-semibold">Total Balance:</span>
                    <span className="font-bold">₹{availableBalance.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )}
            </>
          ) : (
            <>
              <div className="flex justify-between">
                <span>Original Bill:</span>
                <span className="font-semibold">₹{billAmount.toLocaleString('en-IN')}</span>
              </div>
              {invoiceNumber && (
                <div className="flex justify-between text-xs">
                  <span>Invoice:</span>
                  <span>{invoiceNumber}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Points Used:</span>
                <span className="font-semibold">{pointsRedeemed} pts</span>
              </div>
              <div className="flex justify-between">
                <span>Discount:</span>
                <span className="font-semibold text-green-700">- ₹{discount.toLocaleString('en-IN')}</span>
              </div>
              <div className="border-t-2 border-black pt-2 mt-2">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-sm">FINAL BILL:</span>
                  <span className="text-lg font-bold">₹{finalBill.toLocaleString('en-IN')}</span>
                </div>
              </div>
              <div className="bg-green-50 border border-green-300 p-2 mt-2 rounded">
                <div className="text-center">
                  <div className="text-xs font-semibold text-green-800">YOU SAVED</div>
                  <div className="text-base font-bold text-green-700">₹{discount.toLocaleString('en-IN')}</div>
                </div>
              </div>
              {newPointsEarned > 0 && (
                <div className="mt-2 pt-2 border-t border-gray-300">
                  <div className="flex justify-between">
                    <span className="font-semibold">New Points Earned:</span>
                    <span className="font-bold">{newPointsEarned} pts</span>
                  </div>
                  {activationDate && (
                    <div className="text-xs mt-1">
                      <span className="font-semibold">Available:</span>{' '}
                      {format(new Date(activationDate), 'dd MMM yyyy, hh:mm a')}
                    </div>
                  )}
                </div>
              )}
              {availableBalance !== undefined && (
                <div className="text-xs mt-2 pt-2 border-t border-gray-300">
                  <div className="flex justify-between">
                    <span className="font-semibold">New Balance:</span>
                    <span className="font-bold">₹{availableBalance.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer */}
        <div className="text-center text-xs pt-2 border-t border-black">
          <p className="font-semibold mb-1">Thank you for choosing us!</p>
          <p className="text-xs">We look forward to serve you again</p>
          <p className="text-xs mt-2 text-gray-600">This is a computer-generated receipt</p>
        </div>
      </div>
    </div>
  )
}

export function printReceipt() {
  window.print()
}
