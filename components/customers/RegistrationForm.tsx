'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { customerRegistrationSchema, type CustomerRegistrationInput } from '@/lib/validations/customer'
import Input from '@/components/ui/Input'
import Button from '@/components/ui/Button'
import Card, { CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { UserPlus, Loader2, CheckCircle2 } from 'lucide-react'

export default function RegistrationForm() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formData, setFormData] = useState<CustomerRegistrationInput>({
    name: '',
    phone: '',
    email: '',
    aadhar_number: '',
    passport_number: '',
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    
    // Clear error for this field
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
    
    // Format phone number (only digits)
    if (name === 'phone') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 10)
      setFormData((prev) => ({ ...prev, [name]: digitsOnly }))
      return
    }
    
    // Format Aadhar (only digits, max 12)
    if (name === 'aadhar_number') {
      const digitsOnly = value.replace(/\D/g, '').slice(0, 12)
      setFormData((prev) => ({ ...prev, [name]: digitsOnly }))
      return
    }
    
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    try {
      // Validate form
      const validated = customerRegistrationSchema.parse(formData)

      // Submit to API
      const response = await fetch('/api/customers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(validated),
      })

      const result = await response.json()

      if (!response.ok) {
        if (result.error) {
          // Handle field-specific errors
          if (result.field) {
            setErrors({ [result.field]: result.error })
          } else {
            toast.error(result.error || 'Failed to register customer')
          }
        } else {
          toast.error('Failed to register customer')
        }
        return
      }

      toast.success(`Customer registered successfully! MGP ID: ${result.data.mgp_id}`, {
        icon: <CheckCircle2 className="h-5 w-5" />,
        duration: 5000,
      })
      
      // Navigate to customer profile
      router.push(`/customers/${result.data.id}`)
    } catch (error: any) {
      if (error.name === 'ZodError') {
        const fieldErrors: Record<string, string> = {}
        error.errors.forEach((err: any) => {
          const field = err.path[0]
          fieldErrors[field] = err.message
        })
        setErrors(fieldErrors)
        toast.error('Please fix the errors in the form')
      } else {
        toast.error(error.message || 'Failed to register customer')
      }
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
            <UserPlus className="h-5 w-5 text-primary" aria-hidden="true" />
          </div>
          <div>
            <CardTitle>Register New Customer</CardTitle>
            <CardDescription>
              Add a new customer to the loyalty program. All fields marked with * are required.
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 sm:p-6">
        <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
            <div className="md:col-span-2">
              <Input
                label="Full Name"
                name="name"
                id="name"
                required
                value={formData.name}
                onChange={handleChange}
                placeholder="Enter customer full name"
                error={errors.name}
                disabled={loading}
                autoFocus
              />
            </div>

            <Input
              label="Phone Number"
              name="phone"
              id="phone"
              type="tel"
              required
              value={formData.phone}
              onChange={handleChange}
              maxLength={10}
              placeholder="10-digit phone number"
              error={errors.phone}
              helperText="Must be 10 digits"
              disabled={loading}
            />

            <Input
              label="Email Address"
              name="email"
              id="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="customer@example.com"
              error={errors.email}
              disabled={loading}
            />

            <Input
              label="Aadhar Number"
              name="aadhar_number"
              id="aadhar_number"
              type="text"
              value={formData.aadhar_number}
              onChange={handleChange}
              maxLength={12}
              placeholder="12-digit Aadhar number"
              error={errors.aadhar_number}
              helperText="Optional - 12 digits"
              disabled={loading}
            />

            <Input
              label="Passport Number"
              name="passport_number"
              id="passport_number"
              type="text"
              value={formData.passport_number}
              onChange={handleChange}
              placeholder="Passport number"
              error={errors.passport_number}
              helperText="Optional - Provide if Aadhar not available"
              disabled={loading}
            />
          </div>

          <div className="bg-muted/50 rounded-lg p-4">
            <p className="text-sm text-muted-foreground">
              <strong>Note:</strong> At least one identification document (Aadhar or Passport) is recommended for verification purposes, though not mandatory.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 min-h-11"
              isLoading={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                  Registering...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" aria-hidden="true" />
                  Register Customer
                </>
              )}
            </Button>
            <Button
              type="button"
              onClick={() => router.back()}
              variant="outline"
              disabled={loading}
              className="flex-1 min-h-11"
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  )
}
