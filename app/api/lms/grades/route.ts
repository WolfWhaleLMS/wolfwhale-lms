import { NextRequest } from 'next/server'
import { gradeSubmission } from '@/lib/lms/mutations'
import { lmsMutationErrorCode, lmsRedirect } from '@/lib/lms/route-helpers'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  try {
    await gradeSubmission(await createClient(), {
      submissionId: formData.get('submissionId'),
      pointsEarned: formData.get('pointsEarned'),
      feedback: formData.get('feedback'),
    })

    return lmsRedirect(request, '/teacher', { saved: 'grade' })
  } catch (error) {
    return lmsRedirect(request, '/teacher', { error: lmsMutationErrorCode(error) })
  }
}
