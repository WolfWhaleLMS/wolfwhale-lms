import { NextRequest } from 'next/server'
import { enrollStudent } from '@/lib/lms/mutations'
import { enforceLmsMutationRateLimit, lmsMutationErrorCode, lmsRedirect } from '@/lib/lms/route-helpers'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  try {
    await enforceLmsMutationRateLimit(request, 'enrollments', { limit: 30, window: '10 m' })
    await enrollStudent(await createClient(), {
      courseId: formData.get('courseId'),
      studentId: formData.get('studentId'),
      teacherId: formData.get('teacherId'),
      notifyStudent: formData.get('notifyStudent'),
    })

    return lmsRedirect(request, '/admin', { saved: 'enrollment' })
  } catch (error) {
    return lmsRedirect(request, '/admin', { error: lmsMutationErrorCode(error) })
  }
}
