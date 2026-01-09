'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { supabase } from '@/lib/supabase/client'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { LogIn, Loader2, Eye, EyeOff, Lock } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

export default function LoginForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    setLoading(true)
    setErrors({})

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          setErrors({ password: 'Invalid email or password' })
          toast.error('Invalid email or password')
        } else {
          toast.error(error.message || 'Failed to sign in')
        }
        setLoading(false)
        return
      }

      if (data.user && data.session) {
        // Wait a moment for cookies to be set
        await new Promise(resolve => setTimeout(resolve, 200))
        
        // Verify the session is available and user exists in users table
        const { data: { user: verifiedUser } } = await supabase.auth.getUser()
        
        if (!verifiedUser) {
          toast.error('Session not established. Please try again.')
          setLoading(false)
          return
        }
        
        // Check if user exists in users table
        try {
          const checkResponse = await fetch('/api/auth/check-user')
          const checkData = await checkResponse.json()
          
          if (!checkData.exists) {
            if (checkData.inactive) {
              toast.error('Your account is inactive. Please contact your administrator.')
            } else {
              toast.error('Your account is not set up. Please contact your administrator.')
            }
            // Sign out to clear the session
            await supabase.auth.signOut()
            setLoading(false)
            return
          }
          
          toast.success('Login successful!', {
            duration: 1000,
          })
          // Use window.location to ensure a full page reload so middleware can pick up the session
          // This ensures cookies are properly set and middleware can verify the user
          window.location.href = '/dashboard'
        } catch (checkError) {
          toast.error('Failed to verify account. Please try again.')
          setLoading(false)
        }
      } else {
        toast.error('Login failed. Please try again.')
        setLoading(false)
      }
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <Card className="w-full mx-auto shadow-xl border-2">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-bold text-center">Staff Login</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} method="post" className="space-y-5" noValidate>
          <div>
            <Input
              label="Email address"
              name="email"
              id="email"
              type="email"
              required
              value={formData.email}
              onChange={handleChange}
              placeholder="staff@mangatrai.com"
              error={errors.email}
              disabled={loading}
              autoFocus
              autoComplete="email"
              className="h-11"
            />
          </div>

          <div>
            <div className="relative">
              <div className="w-full">
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Password
                  <span className="text-destructive ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    id="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    disabled={loading}
                    autoComplete="current-password"
                    className={cn(
                      'flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm',
                      'ring-offset-background placeholder:text-muted-foreground',
                      'focus-ring disabled:cursor-not-allowed disabled:opacity-50',
                      errors.password && 'border-destructive focus-visible:ring-destructive'
                    )}
                    aria-invalid={errors.password ? 'true' : 'false'}
                    suppressHydrationWarning
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded p-1"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p id="password-error" className="mt-1.5 text-sm text-destructive" role="alert">
                    {errors.password}
                  </p>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="remember"
                name="remember"
                className="h-4 w-4 rounded border-input text-primary focus:ring-primary"
              />
              <label htmlFor="remember" className="text-muted-foreground cursor-pointer">
                Remember me
              </label>
            </div>
            <Link
              href="#"
              onClick={(e) => {
                e.preventDefault()
                toast.info('Please contact your administrator to reset your password.')
              }}
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full h-11 text-base font-semibold shadow-md"
            isLoading={loading}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" aria-hidden="true" />
                Signing in...
              </>
            ) : (
              <>
                <LogIn className="mr-2 h-5 w-5" aria-hidden="true" />
                Sign in
              </>
            )}
          </Button>

          <div className="text-center text-sm">
            <Link
              href="/register"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Don&apos;t have an account? Register here
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
