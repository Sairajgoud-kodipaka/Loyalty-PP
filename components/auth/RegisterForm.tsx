'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card, { CardContent, CardHeader, CardTitle } from '@/components/ui/Card'
import { UserPlus, Loader2, Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils/cn'

export default function RegisterForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    fullName: '',
    role: 'staff' as 'staff' | 'manager' | 'admin',
    phone: '',
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
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

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match'
    }

    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setErrors({})

    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          fullName: formData.fullName,
          role: formData.role,
          phone: formData.phone || undefined,
        }),
      })

      // Check if response is JSON
      const contentType = response.headers.get('content-type')
      let data
      
      if (contentType && contentType.includes('application/json')) {
        data = await response.json()
      } else {
        // If not JSON, it's likely an HTML error page
        const text = await response.text()
        console.error('Non-JSON response:', text.substring(0, 200))
        toast.error('Server error: Received invalid response. Please check the server logs.')
        setLoading(false)
        return
      }

      if (!response.ok) {
        if (data.error === 'User already exists') {
          setErrors({ email: 'This email is already registered' })
          toast.error('User already exists')
        } else {
          toast.error(data.error || 'Failed to create user')
        }
        setLoading(false)
        return
      }

      toast.success('User created successfully!', {
        duration: 2000,
      })

      // Redirect to login after a brief delay
      setTimeout(() => {
        router.push('/login')
      }, 1500)
    } catch (error: any) {
      toast.error(error.message || 'An unexpected error occurred')
      setLoading(false)
    }
  }

  return (
    <Card className="w-full mx-auto shadow-xl border-2">
      <CardHeader className="space-y-1 pb-6">
        <CardTitle className="text-2xl font-bold text-center">Register Staff User</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} method="post" className="space-y-5" noValidate>
          <div>
            <Input
              label="Full Name"
              name="fullName"
              id="fullName"
              type="text"
              required
              value={formData.fullName}
              onChange={handleChange}
              placeholder="John Doe"
              error={errors.fullName}
              disabled={loading}
              autoFocus
            />
          </div>

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
              autoComplete="email"
            />
          </div>

          <div>
            <Input
              label="Phone (Optional)"
              name="phone"
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={handleChange}
              placeholder="+91 9876543210"
              error={errors.phone}
              disabled={loading}
            />
          </div>

          <div>
            <label
              htmlFor="role"
              className="block text-sm font-medium text-foreground mb-1.5"
            >
              Role
              <span className="text-destructive ml-1">*</span>
            </label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              disabled={loading}
              className={cn(
                'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
                'ring-offset-background placeholder:text-muted-foreground',
                'focus-ring disabled:cursor-not-allowed disabled:opacity-50',
                errors.role && 'border-destructive focus-visible:ring-destructive'
              )}
            >
              <option value="staff">Staff</option>
              <option value="manager">Manager</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && (
              <p className="mt-1.5 text-sm text-destructive" role="alert">
                {errors.role}
              </p>
            )}
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
                    placeholder="Enter password (min 6 characters)"
                    disabled={loading}
                    autoComplete="new-password"
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

          <div>
            <div className="relative">
              <div className="w-full">
                <label
                  htmlFor="confirmPassword"
                  className="block text-sm font-medium text-foreground mb-1.5"
                >
                  Confirm Password
                  <span className="text-destructive ml-1">*</span>
                </label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    id="confirmPassword"
                    name="confirmPassword"
                    required
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    placeholder="Confirm password"
                    disabled={loading}
                    autoComplete="new-password"
                    className={cn(
                      'flex h-11 w-full rounded-md border border-input bg-background px-3 py-2 pr-10 text-sm',
                      'ring-offset-background placeholder:text-muted-foreground',
                      'focus-ring disabled:cursor-not-allowed disabled:opacity-50',
                      errors.confirmPassword && 'border-destructive focus-visible:ring-destructive'
                    )}
                    aria-invalid={errors.confirmPassword ? 'true' : 'false'}
                    suppressHydrationWarning
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-primary rounded p-1"
                    aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                    tabIndex={-1}
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" aria-hidden="true" />
                    ) : (
                      <Eye className="h-4 w-4" aria-hidden="true" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p id="confirmPassword-error" className="mt-1.5 text-sm text-destructive" role="alert">
                    {errors.confirmPassword}
                  </p>
                )}
              </div>
            </div>
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
                Creating user...
              </>
            ) : (
              <>
                <UserPlus className="mr-2 h-5 w-5" aria-hidden="true" />
                Create User
              </>
            )}
          </Button>

          <div className="text-center text-sm">
            <Link
              href="/login"
              className="text-primary hover:text-primary/80 font-medium transition-colors"
            >
              Already have an account? Sign in
            </Link>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}

