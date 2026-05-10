import { NextRequest } from 'next/server'
import { linkGuardianToStudent } from '@/lib/lms/guardian-links'
import { enforceLmsMutationRateLimit, lmsMutationErrorCode, lmsRedirect } from '@/lib/lms/route-helpers'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  try {
    await enforceLmsMutationRateLimit(request, 'guardian-link', { limit: 20, window: '10 m' })
    await linkGuardianToStudent(await createClient(), {
      studentId: formData.get('studentId'),
      guardianId: formData.get('guardianId'),
      relationship: formData.get('relationship'),
    })

    return lmsRedirect(request, '/admin', { saved: 'guardian-link' })
  } catch (error) {
    return lmsRedirect(request, '/admin', { error: lmsMutationErrorCode(error) })
  }
}
