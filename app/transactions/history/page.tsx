import { requireAuth } from '@/lib/auth'
import TransactionHistoryClient from './TransactionHistoryClient'

export default async function TransactionHistoryPage() {
  await requireAuth()
  
  return <TransactionHistoryClient />
}
