import { NextRequest } from 'next/server'
import { createAssignment } from '@/lib/lms/mutations'
import { lmsMutationErrorCode, lmsRedirect } from '@/lib/lms/route-helpers'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  try {
    await createAssignment(await createClient(), {
      courseId: formData.get('courseId'),
      title: formData.get('title'),
      instructions: formData.get('instructions'),
      dueDate: formData.get('dueDate'),
      maxPoints: formData.get('maxPoints'),
      category: formData.get('category'),
    })

    return lmsRedirect(request, '/teacher', { saved: 'assignment' })
  } catch (error) {
    return lmsRedirect(request, '/teacher', { error: lmsMutationErrorCode(error) })
  }
}
