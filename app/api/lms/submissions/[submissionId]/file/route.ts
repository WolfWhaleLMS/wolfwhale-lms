import { NextRequest, NextResponse } from 'next/server'
import { getSubmissionBucket } from '@/lib/lms/resource-storage'
import { createAdminClient, hasSupabaseAdminEnv } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

type RouteContext = {
  params: Promise<{ submissionId: string }>
}

function notFound() {
  return NextResponse.json({ error: 'submission_file_not_found' }, { status: 404 })
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { submissionId } = await context.params
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: 'auth_required' }, { status: 401 })
  }

  const { data: submission, error } = await supabase
    .from('submissions')
    .select('id,file_path,file_name')
    .eq('id', submissionId)
    .single()

  if (error || !submission?.file_path) {
    return notFound()
  }

  const storageClient = hasSupabaseAdminEnv() ? createAdminClient() : supabase
  const { data: signed, error: signedError } = await storageClient.storage
    .from(getSubmissionBucket())
    .createSignedUrl(String(submission.file_path), 300, {
      download: submission.file_name ? String(submission.file_name) : true,
    })

  if (signedError || !signed?.signedUrl) {
    return NextResponse.json({ error: 'submission_file_signing_failed' }, { status: 502 })
  }

  return NextResponse.redirect(signed.signedUrl, { status: 302 })
}
