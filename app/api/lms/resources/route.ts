import { NextRequest } from 'next/server'
import { createCourseResource } from '@/lib/lms/mutations'
import { lmsMutationErrorCode, lmsRedirect } from '@/lib/lms/route-helpers'
import { createAdminClient, hasSupabaseAdminEnv } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

function safeReturnPath(value: FormDataEntryValue | null) {
  return value === '/admin' ? '/admin' : '/teacher'
}

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const returnTo = safeReturnPath(formData.get('returnTo'))

  try {
    await createCourseResource(
      await createClient(),
      {
        courseId: formData.get('courseId'),
        displayName: formData.get('displayName'),
        file: formData.get('file'),
      },
      {
        storageClient: hasSupabaseAdminEnv() ? createAdminClient() : undefined,
      }
    )

    return lmsRedirect(request, returnTo, { saved: 'resource' })
  } catch (error) {
    return lmsRedirect(request, returnTo, { error: lmsMutationErrorCode(error) })
  }
}
