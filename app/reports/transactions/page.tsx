import { requireAuth } from '@/lib/auth'
import TransactionReportClient from './TransactionReportClient'

export default async function TransactionReportPage() {
  await requireAuth()
  
  return <TransactionReportClient />
}
