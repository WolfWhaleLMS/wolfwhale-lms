'use server'

import { z } from 'zod'
import { Resend } from 'resend'

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

  const { name, email, school, role, message } = parsed.data

  try {
    const apiKey = process.env.RESEND_API_KEY

    if (!apiKey) {
      console.error('[Contact Form] RESEND_API_KEY not set')
      // Still log submission so it's not lost
      console.log('[Contact Form Submission]', { name, email, school, role, message, timestamp: new Date().toISOString() })
      return { success: true }
    }

    const resend = new Resend(apiKey)

    await resend.emails.send({
      from: 'WolfWhale Contact Form <onboarding@resend.dev>',
      to: 'info@wolfwhale.ca',
      replyTo: email,
      subject: `New inquiry from ${name}${school ? ` — ${school}` : ''}`,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        school ? `School: ${school}` : null,
        role ? `Role: ${role}` : null,
        '',
        'Message:',
        message,
        '',
        `Sent from wolfwhale.ca contact form at ${new Date().toISOString()}`,
      ].filter(Boolean).join('\n'),
    })

    return { success: true }
  } catch (err) {
    console.error('[Contact Form Error]', err)
    return { success: false, error: 'Something went wrong. Please try again or email us directly.' }
  }
}
