import { NextRequest } from 'next/server'
import { createCalendarEvent } from '@/lib/lms/calendar-events'
import { enforceLmsMutationRateLimit, lmsMutationErrorCode, lmsRedirect } from '@/lib/lms/route-helpers'
import { createClient } from '@/lib/supabase/server'

function returnPath(value: FormDataEntryValue | null) {
  return value === '/admin' || value === '/teacher' ? value : '/teacher'
}

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const returnTo = returnPath(formData.get('returnTo'))

  try {
    await enforceLmsMutationRateLimit(request, 'calendar-event', { limit: 30, window: '10 m' })
    await createCalendarEvent(await createClient(), {
      courseId: formData.get('courseId'),
      title: formData.get('title'),
      description: formData.get('description'),
      startsAt: formData.get('startsAt'),
      endsAt: formData.get('endsAt'),
    })

    return lmsRedirect(request, returnTo, { saved: 'calendar-event' })
  } catch (error) {
    return lmsRedirect(request, returnTo, { error: lmsMutationErrorCode(error) })
  }
}
