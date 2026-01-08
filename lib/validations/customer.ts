import { z } from 'zod'

export const customerRegistrationSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters')
    .max(255, 'Name must be less than 255 characters'),
  phone: z.string()
    .regex(/^[0-9]{10}$/, 'Phone number must be exactly 10 digits'),
  email: z.string()
    .email('Invalid email address')
    .optional()
    .or(z.literal('')),
  aadhar_number: z.string()
    .regex(/^[0-9]{12}$/, 'Aadhar number must be exactly 12 digits')
    .optional()
    .or(z.literal('')),
  passport_number: z.string()
    .min(1, 'Passport number is required if Aadhar is not provided')
    .max(20, 'Passport number must be less than 20 characters')
    .optional()
    .or(z.literal('')),
}).refine(
  (data) => data.aadhar_number || data.passport_number,
  {
    message: 'Either Aadhar number or Passport number must be provided',
    path: ['aadhar_number'],
  }
)

export type CustomerRegistrationInput = z.infer<typeof customerRegistrationSchema>

