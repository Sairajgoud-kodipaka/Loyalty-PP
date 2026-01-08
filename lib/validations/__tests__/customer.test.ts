import { customerRegistrationSchema } from '../customer'

describe('customerRegistrationSchema', () => {
  describe('name validation', () => {
    it('should accept valid names', () => {
      const valid = {
        name: 'John Doe',
        phone: '1234567890',
        aadhar_number: '123456789012',
      }
      expect(() => customerRegistrationSchema.parse(valid)).not.toThrow()
    })

    it('should reject names shorter than 2 characters', () => {
      const invalid = {
        name: 'J',
        phone: '1234567890',
        aadhar_number: '123456789012',
      }
      expect(() => customerRegistrationSchema.parse(invalid)).toThrow()
    })

    it('should reject names longer than 255 characters', () => {
      const invalid = {
        name: 'A'.repeat(256),
        phone: '1234567890',
        aadhar_number: '123456789012',
      }
      expect(() => customerRegistrationSchema.parse(invalid)).toThrow()
    })
  })

  describe('phone validation', () => {
    it('should accept valid 10-digit phone numbers', () => {
      const valid = {
        name: 'John Doe',
        phone: '1234567890',
        aadhar_number: '123456789012',
      }
      expect(() => customerRegistrationSchema.parse(valid)).not.toThrow()
    })

    it('should reject phone numbers with less than 10 digits', () => {
      const invalid = {
        name: 'John Doe',
        phone: '123456789',
        aadhar_number: '123456789012',
      }
      expect(() => customerRegistrationSchema.parse(invalid)).toThrow()
    })

    it('should reject phone numbers with more than 10 digits', () => {
      const invalid = {
        name: 'John Doe',
        phone: '12345678901',
        aadhar_number: '123456789012',
      }
      expect(() => customerRegistrationSchema.parse(invalid)).toThrow()
    })

    it('should reject phone numbers with non-numeric characters', () => {
      const invalid = {
        name: 'John Doe',
        phone: '123456789a',
        aadhar_number: '123456789012',
      }
      expect(() => customerRegistrationSchema.parse(invalid)).toThrow()
    })
  })

  describe('email validation', () => {
    it('should accept valid email addresses', () => {
      const valid = {
        name: 'John Doe',
        phone: '1234567890',
        email: 'john@example.com',
        aadhar_number: '123456789012',
      }
      expect(() => customerRegistrationSchema.parse(valid)).not.toThrow()
    })

    it('should accept empty string for email', () => {
      const valid = {
        name: 'John Doe',
        phone: '1234567890',
        email: '',
        aadhar_number: '123456789012',
      }
      expect(() => customerRegistrationSchema.parse(valid)).not.toThrow()
    })

    it('should accept undefined for email', () => {
      const valid = {
        name: 'John Doe',
        phone: '1234567890',
        aadhar_number: '123456789012',
      }
      expect(() => customerRegistrationSchema.parse(valid)).not.toThrow()
    })

    it('should reject invalid email addresses', () => {
      const invalid = {
        name: 'John Doe',
        phone: '1234567890',
        email: 'invalid-email',
        aadhar_number: '123456789012',
      }
      expect(() => customerRegistrationSchema.parse(invalid)).toThrow()
    })
  })

  describe('aadhar_number validation', () => {
    it('should accept valid 12-digit Aadhar numbers', () => {
      const valid = {
        name: 'John Doe',
        phone: '1234567890',
        aadhar_number: '123456789012',
      }
      expect(() => customerRegistrationSchema.parse(valid)).not.toThrow()
    })

    it('should accept empty string for Aadhar', () => {
      const valid = {
        name: 'John Doe',
        phone: '1234567890',
        aadhar_number: '',
        passport_number: 'A1234567',
      }
      expect(() => customerRegistrationSchema.parse(valid)).not.toThrow()
    })

    it('should reject Aadhar numbers with less than 12 digits', () => {
      const invalid = {
        name: 'John Doe',
        phone: '1234567890',
        aadhar_number: '12345678901',
        passport_number: 'A1234567',
      }
      expect(() => customerRegistrationSchema.parse(invalid)).toThrow()
    })

    it('should reject Aadhar numbers with non-numeric characters', () => {
      const invalid = {
        name: 'John Doe',
        phone: '1234567890',
        aadhar_number: '12345678901a',
        passport_number: 'A1234567',
      }
      expect(() => customerRegistrationSchema.parse(invalid)).toThrow()
    })
  })

  describe('passport_number validation', () => {
    it('should accept valid passport numbers', () => {
      const valid = {
        name: 'John Doe',
        phone: '1234567890',
        passport_number: 'A1234567',
      }
      expect(() => customerRegistrationSchema.parse(valid)).not.toThrow()
    })

    it('should accept empty string for passport', () => {
      const valid = {
        name: 'John Doe',
        phone: '1234567890',
        passport_number: '',
        aadhar_number: '123456789012',
      }
      expect(() => customerRegistrationSchema.parse(valid)).not.toThrow()
    })

    it('should reject passport numbers longer than 20 characters', () => {
      const invalid = {
        name: 'John Doe',
        phone: '1234567890',
        passport_number: 'A'.repeat(21),
        aadhar_number: '123456789012',
      }
      expect(() => customerRegistrationSchema.parse(invalid)).toThrow()
    })
  })

  describe('aadhar or passport requirement', () => {
    it('should require at least one of Aadhar or Passport', () => {
      const invalid = {
        name: 'John Doe',
        phone: '1234567890',
      }
      expect(() => customerRegistrationSchema.parse(invalid)).toThrow()
    })

    it('should accept only Aadhar', () => {
      const valid = {
        name: 'John Doe',
        phone: '1234567890',
        aadhar_number: '123456789012',
      }
      expect(() => customerRegistrationSchema.parse(valid)).not.toThrow()
    })

    it('should accept only Passport', () => {
      const valid = {
        name: 'John Doe',
        phone: '1234567890',
        passport_number: 'A1234567',
      }
      expect(() => customerRegistrationSchema.parse(valid)).not.toThrow()
    })

    it('should accept both Aadhar and Passport', () => {
      const valid = {
        name: 'John Doe',
        phone: '1234567890',
        aadhar_number: '123456789012',
        passport_number: 'A1234567',
      }
      expect(() => customerRegistrationSchema.parse(valid)).not.toThrow()
    })
  })
})

