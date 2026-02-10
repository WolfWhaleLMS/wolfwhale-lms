import Link from 'next/link'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { Megaphone, Pin, ChevronRight } from 'lucide-react'

export async function AnnouncementBanner() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')
  if (!tenantId) return null

  const { data: announcements } = await supabase
    .from('announcements')
    .select('id, title, content, is_pinned, published_at, profiles:created_by(full_name)')
    .eq('tenant_id', tenantId)
    .eq('status', 'published')
    .eq('is_pinned', true)
    .order('published_at', { ascending: false })
    .limit(3)

  if (!announcements || announcements.length === 0) return null

  return (
    <div className="space-y-3">
      {announcements.map((a) => (
        <Link
          key={a.id}
          href="/announcements"
          className="group flex items-start gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 transition-all hover:border-amber-300 hover:shadow-sm dark:border-amber-800/50 dark:bg-amber-950/20 dark:hover:border-amber-700"
        >
          <div className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-amber-200 dark:bg-amber-800/50">
            <Megaphone className="size-4 text-amber-700 dark:text-amber-300" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <Pin className="size-3 text-amber-600 dark:text-amber-400 fill-current" />
              <h4 className="text-sm font-semibold text-amber-900 dark:text-amber-200 truncate">
                {a.title}
              </h4>
            </div>
            <p className="mt-0.5 text-sm text-amber-800/80 dark:text-amber-300/70 line-clamp-1">
              {a.content}
            </p>
            <p className="mt-1 text-xs text-amber-600/70 dark:text-amber-400/60">
              {(a.profiles as any)?.full_name ?? 'Staff'} &middot;{' '}
              {new Date(a.published_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </p>
          </div>
          <ChevronRight className="mt-1 size-4 shrink-0 text-amber-400 transition-transform group-hover:translate-x-0.5" />
        </Link>
      ))}
    </div>
  )
}
