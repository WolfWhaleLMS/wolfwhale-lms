import { NextRequest } from 'next/server'
import { createRubric } from '@/lib/lms/mutations'
import { enforceLmsMutationRateLimit, lmsMutationErrorCode, lmsRedirect } from '@/lib/lms/route-helpers'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  try {
    await enforceLmsMutationRateLimit(request, 'rubrics')
    await createRubric(await createClient(), {
      assignmentId: formData.get('assignmentId'),
      name: formData.get('name'),
      description: formData.get('description'),
      criteria: formData.get('criteria'),
    })

    return lmsRedirect(request, '/teacher', { saved: 'rubric' })
  } catch (error) {
    return lmsRedirect(request, '/teacher', { error: lmsMutationErrorCode(error) })
  }
}
