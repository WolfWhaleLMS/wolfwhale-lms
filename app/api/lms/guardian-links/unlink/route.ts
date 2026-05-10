import { NextRequest } from 'next/server'
import { unlinkGuardianFromStudent } from '@/lib/lms/guardian-links'
import { enforceLmsMutationRateLimit, lmsMutationErrorCode, lmsRedirect } from '@/lib/lms/route-helpers'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  try {
    await enforceLmsMutationRateLimit(request, 'guardian-unlink', { limit: 20, window: '10 m' })
    await unlinkGuardianFromStudent(await createClient(), {
      studentId: formData.get('studentId'),
      guardianId: formData.get('guardianId'),
    })

    return lmsRedirect(request, '/admin', { saved: 'guardian-unlink' })
  } catch (error) {
    return lmsRedirect(request, '/admin', { error: lmsMutationErrorCode(error) })
  }
}
