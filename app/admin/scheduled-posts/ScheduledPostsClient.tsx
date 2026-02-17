'use client'

import { useState, useTransition } from 'react'
import {
  createScheduledPost,
  cancelScheduledPost,
  deleteScheduledPost,
  seedContentLibrary,
} from '@/app/actions/scheduled-posts'
import {
  Clock,
  Plus,
  Trash2,
  XCircle,
  Sparkles,
  CheckCircle2,
  Loader2,
  Filter,
} from 'lucide-react'

type Post = {
  id: string
  title: string
  content: string
  category: string
  scheduled_for: string
  published_at: string | null
  status: string
  is_recurring: boolean
  recurrence_rule: string | null
  created_at: string
  profiles?: { full_name: string } | null
}

const CATEGORY_LABELS: Record<string, string> = {
  lms_feature: 'LMS Feature',
  indigenous_education: 'Indigenous Education',
  community: 'Community',
  tip: 'Tip',
}

const CATEGORY_COLORS: Record<string, string> = {
  lms_feature: 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
  indigenous_education: 'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
  community: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300',
  tip: 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300',
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/40 dark:text-yellow-300',
  published: 'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300',
  cancelled: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
}

export function ScheduledPostsClient({ initialPosts }: { initialPosts: Post[] }) {
  const [showForm, setShowForm] = useState(false)
  const [filter, setFilter] = useState<string>('all')
  const [isPending, startTransition] = useTransition()
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  // Form state
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [category, setCategory] = useState<string>('lms_feature')
  const [scheduledFor, setScheduledFor] = useState('')
  const [isRecurring, setIsRecurring] = useState(false)
  const [recurrenceRule, setRecurrenceRule] = useState<string>('weekly')

  const filteredPosts =
    filter === 'all' ? initialPosts : initialPosts.filter((p) => p.status === filter)

  const pendingCount = initialPosts.filter((p) => p.status === 'pending').length
  const publishedCount = initialPosts.filter((p) => p.status === 'published').length

  function showMessage(type: 'success' | 'error', text: string) {
    setMessage({ type, text })
    setTimeout(() => setMessage(null), 4000)
  }

  function resetForm() {
    setTitle('')
    setContent('')
    setCategory('lms_feature')
    setScheduledFor('')
    setIsRecurring(false)
    setRecurrenceRule('weekly')
    setShowForm(false)
  }

  function handleCreate() {
    if (!title.trim() || !content.trim() || !scheduledFor) {
      showMessage('error', 'Please fill in all required fields.')
      return
    }
    startTransition(async () => {
      try {
        await createScheduledPost({
          title: title.trim(),
          content: content.trim(),
          category,
          scheduledFor: new Date(scheduledFor).toISOString(),
          isRecurring,
          recurrenceRule: isRecurring ? recurrenceRule : undefined,
        })
        showMessage('success', 'Post scheduled successfully!')
        resetForm()
      } catch (err) {
        showMessage('error', err instanceof Error ? err.message : 'Failed to create post')
      }
    })
  }

  function handleCancel(postId: string) {
    startTransition(async () => {
      try {
        await cancelScheduledPost(postId)
        showMessage('success', 'Post cancelled.')
      } catch (err) {
        showMessage('error', err instanceof Error ? err.message : 'Failed to cancel post')
      }
    })
  }

  function handleDelete(postId: string) {
    startTransition(async () => {
      try {
        await deleteScheduledPost(postId)
        showMessage('success', 'Post deleted.')
      } catch (err) {
        showMessage('error', err instanceof Error ? err.message : 'Failed to delete post')
      }
    })
  }

  function handleSeed() {
    startTransition(async () => {
      try {
        const result = await seedContentLibrary()
        showMessage('success', `Seeded ${result.count} posts from the content library!`)
      } catch (err) {
        showMessage('error', err instanceof Error ? err.message : 'Failed to seed content')
      }
    })
  }

  return (
    <div className="space-y-6">
      {/* Message Banner */}
      {message && (
        <div
          className={`rounded-xl p-3 text-sm font-medium ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800 dark:bg-green-950/40 dark:text-green-300'
              : 'bg-red-100 text-red-800 dark:bg-red-950/40 dark:text-red-300'
          }`}
        >
          {message.text}
        </div>
      )}

      {/* Stats + Actions Row */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{pendingCount} pending</span>
          </div>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CheckCircle2 className="h-4 w-4" />
            <span>{publishedCount} published</span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleSeed}
            disabled={isPending}
            className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-3 py-2 text-sm font-medium text-amber-600 hover:bg-amber-500/20 transition-colors disabled:opacity-50 dark:text-amber-400"
          >
            <Sparkles className="h-4 w-4" />
            Seed Library
          </button>
          <button
            onClick={() => setShowForm(!showForm)}
            className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
          >
            <Plus className="h-4 w-4" />
            New Post
          </button>
        </div>
      </div>

      {/* Create Form */}
      {showForm && (
        <div className="ocean-card rounded-2xl p-4 sm:p-6 space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Schedule a New Post</h2>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-foreground">Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Post title..."
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-sm font-medium text-foreground">Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write the post content..."
                rows={4}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
              />
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              >
                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                  <option key={value} value={value}>
                    {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1 block text-sm font-medium text-foreground">
                Scheduled For
              </label>
              <input
                type="datetime-local"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
                className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
            </div>

            <div className="sm:col-span-2 flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm text-foreground cursor-pointer">
                <input
                  type="checkbox"
                  checked={isRecurring}
                  onChange={(e) => setIsRecurring(e.target.checked)}
                  className="rounded border-border"
                />
                Recurring post
              </label>

              {isRecurring && (
                <select
                  value={recurrenceRule}
                  onChange={(e) => setRecurrenceRule(e.target.value)}
                  className="rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="biweekly">Biweekly</option>
                  <option value="monthly">Monthly</option>
                </select>
              )}
            </div>
          </div>

          <div className="flex gap-2 pt-2">
            <button
              onClick={handleCreate}
              disabled={isPending}
              className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />}
              Schedule Post
            </button>
            <button
              onClick={() => setShowForm(false)}
              className="rounded-lg px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-muted-foreground" />
        {['all', 'pending', 'published', 'cancelled'].map((status) => (
          <button
            key={status}
            onClick={() => setFilter(status)}
            className={`rounded-lg px-3 py-1.5 text-sm font-medium transition-colors ${
              filter === status
                ? 'bg-primary/10 text-primary'
                : 'text-muted-foreground hover:text-foreground'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Posts List */}
      {filteredPosts.length === 0 ? (
        <div className="ocean-card rounded-2xl p-8 text-center">
          <Clock className="mx-auto h-10 w-10 text-muted-foreground/50 mb-3" />
          <p className="text-muted-foreground">
            No {filter === 'all' ? '' : filter} scheduled posts yet.
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            Click &quot;Seed Library&quot; to load pre-written content or create a custom post.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredPosts.map((post) => (
            <div key={post.id} className="ocean-card rounded-2xl p-4 sm:p-5">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2 mb-2">
                    <h3 className="font-semibold text-foreground">{post.title}</h3>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        CATEGORY_COLORS[post.category] ?? 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {CATEGORY_LABELS[post.category] ?? post.category}
                    </span>
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        STATUS_COLORS[post.status] ?? 'bg-muted text-muted-foreground'
                      }`}
                    >
                      {post.status}
                    </span>
                    {post.is_recurring && post.recurrence_rule && (
                      <span className="inline-flex rounded-full bg-indigo-100 px-2 py-0.5 text-xs font-medium text-indigo-700 dark:bg-indigo-950/40 dark:text-indigo-300">
                        {post.recurrence_rule}
                      </span>
                    )}
                  </div>

                  <p className="text-sm text-muted-foreground line-clamp-2">{post.content}</p>

                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                    <span>
                      Scheduled: {new Date(post.scheduled_for).toLocaleDateString('en-CA', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </span>
                    {post.published_at && (
                      <span>
                        Published: {new Date(post.published_at).toLocaleDateString('en-CA', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                    )}
                    {post.profiles?.full_name && (
                      <span>By: {post.profiles.full_name}</span>
                    )}
                  </div>
                </div>

                {post.status === 'pending' && (
                  <div className="flex gap-1.5 shrink-0">
                    <button
                      onClick={() => handleCancel(post.id)}
                      disabled={isPending}
                      title="Cancel post"
                      className="rounded-lg p-2 text-muted-foreground hover:text-amber-600 hover:bg-amber-500/10 transition-colors disabled:opacity-50"
                    >
                      <XCircle className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(post.id)}
                      disabled={isPending}
                      title="Delete post"
                      className="rounded-lg p-2 text-muted-foreground hover:text-red-600 hover:bg-red-500/10 transition-colors disabled:opacity-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
