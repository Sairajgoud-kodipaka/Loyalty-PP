import { requireAuth } from '@/lib/auth'
import BalanceReportClient from './BalanceReportClient'

export default async function BalanceReportPage() {
  await requireAuth()
  
  return <BalanceReportClient />
}
