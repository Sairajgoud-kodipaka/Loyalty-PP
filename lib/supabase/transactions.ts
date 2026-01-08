import { createClient } from './server'

export async function addPurchase(
  customerId: string,
  billAmount: number,
  invoiceNumber: string | null,
  createdBy: string | null
) {
  const supabase = await createClient()
  
  const { data, error } = await supabase.rpc('add_purchase', {
    p_customer_id: customerId,
    p_bill_amount: billAmount,
    p_invoice_number: invoiceNumber,
    p_created_by: createdBy,
  })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

export async function redeemPoints(
  customerId: string,
  billAmount: number,
  pointsToRedeem: number,
  invoiceNumber: string | null,
  createdBy: string | null
) {
  const supabase = await createClient()
  
  const { data, error } = await supabase.rpc('redeem_points', {
    p_customer_id: customerId,
    p_bill_amount: billAmount,
    p_points_to_redeem: pointsToRedeem,
    p_invoice_number: invoiceNumber,
    p_created_by: createdBy,
  })
  
  if (error) {
    throw new Error(error.message)
  }
  
  return data
}

