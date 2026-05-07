'use server'

import { z } from 'zod'
import { Resend } from 'resend'

const referralSchema = z.object({
  firstName: z.string().min(1).max(100),
  lastName: z.string().min(1).max(100),
  email: z.string().email(),
  phone: z.string().max(20).optional(),
  role: z.string().min(1),
  institution: z.string().max(200).optional(),
})

export type ReferralFormState = {
  success: boolean
  error?: string
}

export async function submitReferralForm(
  _prev: ReferralFormState,
  formData: FormData
): Promise<ReferralFormState> {
  const raw = {
    firstName: formData.get('firstName'),
    lastName: formData.get('lastName'),
    email: formData.get('email'),
    phone: formData.get('phone'),
    role: formData.get('role'),
    institution: formData.get('institution'),
  }

  const parsed = referralSchema.safeParse(raw)
  if (!parsed.success) {
    return { success: false, error: parsed.error.errors[0]?.message || 'Invalid form data' }
  }

  const { firstName, lastName, email, phone, role, institution } = parsed.data

  try {
    const apiKey = process.env.RESEND_API_KEY
    if (!apiKey) {
      console.log('[Referral Signup]', { firstName, lastName, email, phone, role, institution, timestamp: new Date().toISOString() })
      return { success: true }
    }

    const resend = new Resend(apiKey)
    await resend.emails.send({
      from: 'WolfWhale Referrals <onboarding@resend.dev>',
      to: 'info@wolfwhale.ca',
      replyTo: email,
      subject: `New Ambassador Signup: ${firstName} ${lastName}`,
      text: [
        `New Ambassador Program Signup`,
        ``,
        `Name: ${firstName} ${lastName}`,
        `Email: ${email}`,
        phone ? `Phone: ${phone}` : null,
        `Role: ${role}`,
        institution ? `Institution: ${institution}` : null,
        ``,
        `Submitted at ${new Date().toISOString()}`,
      ].filter(Boolean).join('\n'),
    })

    return { success: true }
  } catch (err) {
    console.error('[Referral Form Error]', err)
    return { success: false, error: 'Something went wrong. Please try again.' }
  }
}
