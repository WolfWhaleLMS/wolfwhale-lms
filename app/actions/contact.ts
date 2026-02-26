'use server'

import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
  email: z.string().email('Please enter a valid email address'),
  school: z.string().max(200).optional(),
  role: z.string().optional(),
  message: z.string().min(1, 'Message is required').max(2000),
})

export type ContactFormState = {
  success: boolean
  error?: string
}

export async function submitContactForm(
  _prev: ContactFormState,
  formData: FormData
): Promise<ContactFormState> {
  const raw = {
    name: formData.get('name'),
    email: formData.get('email'),
    school: formData.get('school'),
    role: formData.get('role'),
    message: formData.get('message'),
  }

  const parsed = contactSchema.safeParse(raw)

  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message || 'Invalid form data' }
  }

  try {
    // TODO: Wire up to Supabase or email service (Resend, etc.)
    // For now, log the submission server-side
    console.log('[Contact Form Submission]', {
      ...parsed.data,
      timestamp: new Date().toISOString(),
    })

    return { success: true }
  } catch {
    return { success: false, error: 'Something went wrong. Please try again or email us directly.' }
  }
}
