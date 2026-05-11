import { NextRequest } from 'next/server'
import { resendSchoolInvitation } from '@/lib/lms/invitations'
import { enforceLmsMutationRateLimit, lmsMutationErrorCode, lmsRedirect } from '@/lib/lms/route-helpers'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const userId = String(formData.get('userId') ?? 'blank-user')

  try {
    await enforceLmsMutationRateLimit(request, 'invite-resend', {
      limit: 20,
      window: '10 m',
      keyParts: [userId],
    })
    await resendSchoolInvitation(await createClient(), {
      userId: formData.get('userId'),
    })

    return lmsRedirect(request, '/admin', { saved: 'invite-resend' })
  } catch (error) {
    return lmsRedirect(request, '/admin', { error: lmsMutationErrorCode(error) })
  }
}
