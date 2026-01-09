import { requireAuth } from '@/lib/auth'
import PurchaseForm from '@/components/transactions/PurchaseForm'

export default async function PurchasePage() {
  await requireAuth()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">New Purchase</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <PurchaseForm />
        </div>
      </div>
    </div>
  )
}


