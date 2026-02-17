import { NextResponse } from 'next/server'
import { createAdminClient } from '@/lib/supabase/admin'

/**
 * Vercel Cron Job: Publishes scheduled posts that are due.
 * Runs daily at 9:00 AM UTC (configured in vercel.json).
 *
 * Security: Protected by CRON_SECRET — Vercel sends this header automatically
 * for cron jobs, and we reject requests without it.
 */
export async function GET(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET

  if (!cronSecret || authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const admin = createAdminClient()
  const now = new Date().toISOString()

  try {
    // Find all pending posts that are due
    const { data: duePosts, error: fetchError } = await admin
      .from('scheduled_posts')
      .select('*')
      .eq('status', 'pending')
      .lte('scheduled_for', now)
      .order('scheduled_for', { ascending: true })
      .limit(50)

    if (fetchError) {
      console.error('[cron/publish-posts] Error fetching due posts:', fetchError)
      return NextResponse.json({ error: 'Failed to fetch posts' }, { status: 500 })
    }

    if (!duePosts || duePosts.length === 0) {
      return NextResponse.json({ published: 0, message: 'No posts due' })
    }

    let publishedCount = 0

    for (const post of duePosts) {
      try {
        // Create the announcement
        const { data: announcement, error: insertError } = await admin
          .from('announcements')
          .insert({
            tenant_id: post.tenant_id,
            created_by: post.created_by,
            title: post.title,
            content: post.content,
            is_pinned: false,
          })
          .select('id')
          .single()

        if (insertError) {
          console.error(`[cron/publish-posts] Failed to publish post ${post.id}:`, insertError)
          continue
        }

        // Mark as published
        await admin
          .from('scheduled_posts')
          .update({
            status: 'published',
            published_at: now,
            announcement_id: announcement.id,
            updated_at: now,
          })
          .eq('id', post.id)

        // Handle recurring posts: schedule the next occurrence
        if (post.is_recurring && post.recurrence_rule) {
          const nextDate = getNextOccurrence(post.scheduled_for, post.recurrence_rule)
          if (nextDate) {
            await admin.from('scheduled_posts').insert({
              tenant_id: post.tenant_id,
              created_by: post.created_by,
              title: post.title,
              content: post.content,
              category: post.category,
              scheduled_for: nextDate.toISOString(),
              status: 'pending',
              is_recurring: true,
              recurrence_rule: post.recurrence_rule,
            })
          }
        }

        publishedCount++
      } catch (err) {
        console.error(`[cron/publish-posts] Error processing post ${post.id}:`, err)
      }
    }

    return NextResponse.json({
      published: publishedCount,
      total_due: duePosts.length,
      message: `Published ${publishedCount} of ${duePosts.length} due posts`,
    })
  } catch (err) {
    console.error('[cron/publish-posts] Unexpected error:', err)
    return NextResponse.json({ error: 'Internal error' }, { status: 500 })
  }
}

function getNextOccurrence(currentDate: string, rule: string): Date | null {
  const date = new Date(currentDate)

  switch (rule) {
    case 'daily':
      date.setDate(date.getDate() + 1)
      return date
    case 'weekly':
      date.setDate(date.getDate() + 7)
      return date
    case 'biweekly':
      date.setDate(date.getDate() + 14)
      return date
    case 'monthly':
      date.setMonth(date.getMonth() + 1)
      return date
    default:
      return null
  }
}
