import { NextRequest } from 'next/server'
import { submitAssignment } from '@/lib/lms/mutations'
import { enforceLmsMutationRateLimit, lmsMutationErrorCode, lmsRedirect } from '@/lib/lms/route-helpers'
import { createAdminClient, hasSupabaseAdminEnv } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  try {
    await enforceLmsMutationRateLimit(request, 'submissions')
    await submitAssignment(
      await createClient(),
      {
        assignmentId: formData.get('assignmentId'),
        content: formData.get('content'),
        file: formData.get('file'),
      },
      {
        storageClient: hasSupabaseAdminEnv() ? createAdminClient() : undefined,
      }
    )

    return lmsRedirect(request, '/student', { saved: 'submission' })
  } catch (error) {
    return lmsRedirect(request, '/student', { error: lmsMutationErrorCode(error) })
  }
}
