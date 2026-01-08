import { requireAuth } from '@/lib/auth'
import RegistrationForm from '@/components/customers/RegistrationForm'

export default async function RegisterCustomerPage() {
  await requireAuth()
  
  return (
    <div className="container mx-auto px-4 py-8">
      <RegistrationForm />
    </div>
  )
}
