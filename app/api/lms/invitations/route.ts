import { NextRequest } from 'next/server'
import { inviteUserToSchool } from '@/lib/lms/invitations'
import { enforceLmsMutationRateLimit, lmsMutationErrorCode, lmsRedirect } from '@/lib/lms/route-helpers'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  try {
    await enforceLmsMutationRateLimit(request, 'direct-invite', {
      limit: 12,
      window: '10 m',
      keyParts: [String(formData.get('email') ?? 'blank-email').toLowerCase()],
    })
    const result = await inviteUserToSchool(await createClient(), {
      email: formData.get('email'),
      firstName: formData.get('firstName'),
      lastName: formData.get('lastName'),
      role: formData.get('role'),
      gradeLevel: formData.get('gradeLevel'),
    })

    return lmsRedirect(request, '/admin', { saved: 'invite', role: result.role })
  } catch (error) {
    return lmsRedirect(request, '/admin', { error: lmsMutationErrorCode(error) })
  }
}
