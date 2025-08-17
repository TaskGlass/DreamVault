import { z } from 'zod'

// Dream validation schema
export const dreamSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title must be less than 200 characters").trim(),
  description: z.string().min(1, "Description is required").max(5000, "Description must be less than 5000 characters").trim(),
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format"),
  mood: z.string().max(50).optional(),
  symbols: z.array(z.string().max(100)).max(20).optional(),
  lucidity: z.boolean().optional()
})

// Horoscope validation schema
export const horoscopeSchema = z.object({
  zodiacSign: z.enum([
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ], { errorMap: () => ({ message: "Invalid zodiac sign" }) }),
  forceRefresh: z.boolean().optional(),
  firstName: z.string().max(50, "First name must be less than 50 characters").optional()
})

// Affirmation validation schema
export const affirmationSchema = z.object({
  zodiac: z.enum([
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ], { errorMap: () => ({ message: "Invalid zodiac sign" }) })
})

// Moon phase validation schema
export const moonPhaseSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date must be in YYYY-MM-DD format")
})

// Chat message validation schema
export const chatMessageSchema = z.object({
  messages: z.array(z.object({
    role: z.enum(['user', 'assistant', 'system']),
    content: z.string().min(1).max(4000)
  })).min(1).max(50)
})

// Subscription validation schema
export const subscriptionSchema = z.object({
  email: z.string().email("Invalid email address").max(255),
  plan: z.string().min(1, "Plan is required"),
  billingCycle: z.enum(['monthly', 'yearly']).default('monthly'),
  returnUrl: z.string().url("Invalid return URL").optional()
})

// Profile validation schema
export const profileSchema = z.object({
  first_name: z.string().max(100, "First name must be less than 100 characters").optional(),
  last_name: z.string().max(100, "Last name must be less than 100 characters").optional(),
  birthday: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Birthday must be in YYYY-MM-DD format").optional(),
  zodiac: z.enum([
    'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo', 
    'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces'
  ]).optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  notifications: z.boolean().optional(),
  dream_reminders: z.boolean().optional(),
  weekly_reports: z.boolean().optional()
})

// Utility function to validate and sanitize input
export function validateInput<T>(schema: z.ZodSchema<T>, data: unknown): { success: true; data: T } | { success: false; errors: string[] } {
  try {
    const validatedData = schema.parse(data)
    return { success: true, data: validatedData }
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors = error.errors.map(err => `${err.path.join('.')}: ${err.message}`)
      return { success: false, errors }
    }
    return { success: false, errors: ['Validation failed'] }
  }
}
