import { NextRequest } from 'next/server'
import { createCourse } from '@/lib/lms/mutations'
import { enforceLmsMutationRateLimit, lmsMutationErrorCode, lmsRedirect } from '@/lib/lms/route-helpers'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  try {
    await enforceLmsMutationRateLimit(request, 'courses', { limit: 20, window: '10 m' })
    await createCourse(await createClient(), {
      name: formData.get('name'),
      subject: formData.get('subject'),
      gradeLevel: formData.get('gradeLevel'),
      description: formData.get('description'),
    })

    return lmsRedirect(request, '/admin', { saved: 'course' })
  } catch (error) {
    return lmsRedirect(request, '/admin', { error: lmsMutationErrorCode(error) })
  }
}
