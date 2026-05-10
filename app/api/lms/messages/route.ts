import { NextRequest } from 'next/server'
import { sendCourseMessage } from '@/lib/lms/mutations'
import { enforceLmsMutationRateLimit, lmsMutationErrorCode, lmsRedirect } from '@/lib/lms/route-helpers'
import { createClient } from '@/lib/supabase/server'

const allowedReturnPaths = new Set(['/student/messages', '/guardian', '/teacher', '/admin'])

function safeMessageReturnPath(value: FormDataEntryValue | null) {
  const path = typeof value === 'string' ? value : ''

  return allowedReturnPaths.has(path) ? path : '/student/messages'
}

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const returnTo = safeMessageReturnPath(formData.get('returnTo'))

  try {
    await enforceLmsMutationRateLimit(request, 'messages', {
      limit: 20,
      window: '1 m',
      keyParts: [String(formData.get('courseId') ?? '')],
    })
    await sendCourseMessage(await createClient(), {
      courseId: formData.get('courseId'),
      recipientId: formData.get('recipientId'),
      subject: formData.get('subject'),
      content: formData.get('content'),
    })

    return lmsRedirect(request, returnTo, { saved: 'message' })
  } catch (error) {
    return lmsRedirect(request, returnTo, { error: lmsMutationErrorCode(error) })
  }
}
