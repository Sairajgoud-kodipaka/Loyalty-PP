import { requireAuth } from '@/lib/auth'
import RedemptionForm from '@/components/transactions/RedemptionForm'

export default async function RedeemPage() {
  await requireAuth()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Redeem Points</h1>
        <div className="bg-white rounded-lg shadow p-6">
          <RedemptionForm />
        </div>
      </div>
    </div>
  )
}


