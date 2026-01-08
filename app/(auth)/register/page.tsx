import RegisterForm from '@/components/auth/RegisterForm'
import { Gem } from 'lucide-react'

export default async function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-background to-slate-100 p-4">
      <div className="w-full max-w-lg space-y-8 animate-fade-in">
        {/* Brand Header */}
        <div className="text-center space-y-4">
          {/* Logo/Brand Icon */}
          <div className="flex justify-center">
            <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center shadow-lg">
              <Gem className="h-10 w-10 text-white" aria-hidden="true" />
            </div>
          </div>
          
          {/* Brand Name */}
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Mangatrai Pearls
            </h1>
            <h2 className="text-2xl font-semibold text-primary">
              Loyalty Program
            </h2>
          </div>
        </div>
        
        {/* Registration Form */}
        <RegisterForm />
        
        {/* Footer Note */}
        <p className="text-center text-sm text-muted-foreground">
          Staff registration. Only authorized personnel can create accounts.
        </p>
      </div>
    </div>
  )
}

