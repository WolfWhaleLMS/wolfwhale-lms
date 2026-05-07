import { NextRequest } from 'next/server'
import { submitAssignment } from '@/lib/lms/mutations'
import { lmsMutationErrorCode, lmsRedirect } from '@/lib/lms/route-helpers'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  try {
    await submitAssignment(await createClient(), {
      assignmentId: formData.get('assignmentId'),
      content: formData.get('content'),
    })

    return lmsRedirect(request, '/student', { saved: 'submission' })
  } catch (error) {
    return lmsRedirect(request, '/student', { error: lmsMutationErrorCode(error) })
  }
}
