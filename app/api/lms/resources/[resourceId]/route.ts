import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

type RouteContext = {
  params: Promise<{ resourceId: string }>
}

function notFound() {
  return NextResponse.json({ error: 'resource_not_found' }, { status: 404 })
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { resourceId } = await context.params
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: 'auth_required' }, { status: 401 })
  }

  const { data: resource, error } = await supabase
    .from('lesson_attachments')
    .select('id,file_path')
    .eq('id', resourceId)
    .single()

  if (error || !resource?.file_path) {
    return notFound()
  }

  const { data: signed, error: signedError } = await supabase.storage
    .from('course-materials')
    .createSignedUrl(String(resource.file_path), 300)

  if (signedError || !signed?.signedUrl) {
    return NextResponse.json({ error: 'resource_signing_failed' }, { status: 502 })
  }

  return NextResponse.redirect(signed.signedUrl, { status: 302 })
}
