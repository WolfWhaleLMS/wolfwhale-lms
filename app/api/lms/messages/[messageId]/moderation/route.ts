import { NextRequest } from 'next/server'
import { moderateCourseMessage } from '@/lib/lms/mutations'
import { enforceLmsMutationRateLimit, lmsMutationErrorCode, lmsRedirect } from '@/lib/lms/route-helpers'
import { createClient } from '@/lib/supabase/server'

type RouteContext = {
  params: Promise<{ messageId: string }>
}

const allowedReturnPaths = new Set(['/admin', '/teacher'])

function safeMessageModerationReturnPath(value: FormDataEntryValue | null) {
  const path = typeof value === 'string' ? value : ''

  return allowedReturnPaths.has(path) ? path : '/teacher'
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { messageId } = await context.params
  const formData = await request.formData()
  const returnTo = safeMessageModerationReturnPath(formData.get('returnTo'))

  try {
    await enforceLmsMutationRateLimit(request, 'messages-moderation', {
      limit: 30,
      window: '10 m',
      keyParts: [messageId],
    })
    await moderateCourseMessage(await createClient(), {
      messageId,
      moderationStatus: formData.get('moderationStatus'),
      moderationNote: formData.get('moderationNote'),
    })

    return lmsRedirect(request, returnTo, { saved: 'message-moderation' })
  } catch (error) {
    return lmsRedirect(request, returnTo, { error: lmsMutationErrorCode(error) })
  }
}
