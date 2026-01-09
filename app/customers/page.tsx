import { requireAuth } from '@/lib/auth'
import CustomersDatabaseClient from './CustomersDatabaseClient'

export default async function CustomersPage() {
  await requireAuth()
  
  return <CustomersDatabaseClient />
}

