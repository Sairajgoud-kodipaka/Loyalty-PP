import LoginForm from '@/components/auth/LoginForm'
import Image from 'next/image'

export default async function LoginPage() {
  // Let middleware handle redirects - don't check auth here to avoid redirect loops
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 via-background to-slate-100 p-4">
      <div className="w-full max-w-lg space-y-8 animate-fade-in">
        {/* Brand Header */}
        <div className="text-center space-y-4">
          {/* Logo/Brand Icon */}
          <div className="flex justify-center">
            <div className="relative h-24 w-auto flex items-center justify-center">
              <Image
                src="/pearl-logo.png"
                alt="Mangatrai Pearls & Jewellers"
                width={200}
                height={120}
                priority
                className="h-auto w-auto max-h-24 object-contain"
                style={{ width: 'auto', height: 'auto' }}
              />
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
        
        {/* Login Form */}
        <LoginForm />
        
        {/* Footer Note */}
        <p className="text-center text-sm text-muted-foreground">
          Staff access only. Contact administrator for account setup.
        </p>
      </div>
    </div>
  )
}
