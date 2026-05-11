import { NextRequest } from 'next/server'
import { updateSchoolMembershipStatus } from '@/lib/lms/invitations'
import { enforceLmsMutationRateLimit, lmsMutationErrorCode, lmsRedirect } from '@/lib/lms/route-helpers'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  try {
    await enforceLmsMutationRateLimit(request, 'membership-status', { limit: 40, window: '10 m' })
    await updateSchoolMembershipStatus(await createClient(), {
      userId: formData.get('userId'),
      status: formData.get('status'),
    })

    return lmsRedirect(request, '/admin', { saved: 'membership-status' })
  } catch (error) {
    return lmsRedirect(request, '/admin', { error: lmsMutationErrorCode(error) })
  }
}
