import { NextRequest } from 'next/server'
import { updateSchoolMembershipRole } from '@/lib/lms/invitations'
import { enforceLmsMutationRateLimit, lmsMutationErrorCode, lmsRedirect } from '@/lib/lms/route-helpers'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  try {
    await enforceLmsMutationRateLimit(request, 'membership-role', { limit: 30, window: '10 m' })
    await updateSchoolMembershipRole(await createClient(), {
      userId: formData.get('userId'),
      role: formData.get('role'),
    })

    return lmsRedirect(request, '/admin', { saved: 'membership-role' })
  } catch (error) {
    return lmsRedirect(request, '/admin', { error: lmsMutationErrorCode(error) })
  }
}
