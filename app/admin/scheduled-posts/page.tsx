import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'
import { getScheduledPosts } from '@/app/actions/scheduled-posts'
import { ScheduledPostsClient } from './ScheduledPostsClient'

export default async function ScheduledPostsPage() {
  let posts: Awaited<ReturnType<typeof getScheduledPosts>> = []
  let error = false

  try {
    posts = await getScheduledPosts()
  } catch {
    error = true
  }

  return (
    <div className="space-y-4 sm:space-y-8 overflow-x-hidden max-w-full">
      <Link
        href="/admin/dashboard"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="min-w-0">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Scheduled Posts
        </h1>
        <p className="mt-1 text-sm sm:text-base text-muted-foreground">
          Automatically publish announcements about LMS features and Indigenous Education.
        </p>
      </div>

      {error ? (
        <div className="ocean-card rounded-2xl p-8 text-center">
          <p className="text-muted-foreground">Unable to load scheduled posts. Please try again.</p>
        </div>
      ) : (
        <ScheduledPostsClient initialPosts={posts} />
      )}
    </div>
  )
}
