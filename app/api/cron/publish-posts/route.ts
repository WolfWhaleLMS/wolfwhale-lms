import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

interface ScheduledPost {
  id: string
  tenant_id: string
  created_by: string | null
  title: string
  content: string
}

function jsonResponse(body: Record<string, unknown>, status = 200) {
  return NextResponse.json(body, {
    status,
    headers: {
      'Cache-Control': 'no-store',
    },
  })
}

export async function GET(request: NextRequest) {
  const cronSecret = process.env.CRON_SECRET
  const authHeader = request.headers.get('authorization')

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return jsonResponse({ ok: false, error: 'Unauthorized' }, 401)
  }

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !serviceRoleKey) {
    return jsonResponse({ ok: false, error: 'Supabase admin environment is not configured' }, 503)
  }

  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })

  const now = new Date().toISOString()
  const { data: duePosts, error: selectError } = await supabase
    .from('scheduled_posts')
    .select('id, tenant_id, created_by, title, content')
    .eq('status', 'pending')
    .lte('scheduled_for', now)
    .order('scheduled_for', { ascending: true })
    .limit(50)

  if (selectError) {
    return jsonResponse({ ok: false, error: selectError.message }, 500)
  }

  const results = []

  for (const post of (duePosts ?? []) as ScheduledPost[]) {
    if (!post.created_by) {
      results.push({ id: post.id, ok: false, error: 'Scheduled post has no author' })
      continue
    }

    const { data: announcement, error: insertError } = await supabase
      .from('announcements')
      .insert({
        tenant_id: post.tenant_id,
        course_id: null,
        title: post.title,
        content: post.content,
        created_by: post.created_by,
        status: 'published',
        published_at: now,
      })
      .select('id')
      .single()

    if (insertError) {
      results.push({ id: post.id, ok: false, error: insertError.message })
      continue
    }

    const { error: updateError } = await supabase
      .from('scheduled_posts')
      .update({
        status: 'published',
        published_at: now,
        announcement_id: announcement.id,
      })
      .eq('id', post.id)
      .eq('status', 'pending')

    results.push({
      id: post.id,
      ok: !updateError,
      announcementId: announcement.id,
      error: updateError?.message,
    })
  }

  const failed = results.filter((result) => !result.ok)

  return jsonResponse(
    {
      ok: failed.length === 0,
      checkedAt: now,
      due: duePosts?.length ?? 0,
      published: results.length - failed.length,
      failed: failed.length,
      results,
    },
    failed.length > 0 ? 207 : 200
  )
}
