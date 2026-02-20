'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import {
  Megaphone,
  Pin,
  Plus,
  ArrowLeft,
  Trash2,
  Globe,
  BookOpen,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createAnnouncement, deleteAnnouncement, togglePinAnnouncement } from '@/app/actions/announcements'
import { useRouter } from 'next/navigation'

interface Announcement {
  id: string
  title: string
  content: string
  course_id: string | null
  is_pinned: boolean
  created_at: string
  published_at: string
  profiles: { full_name: string | null; avatar_url: string | null } | null
}

interface Course {
  id: string
  name: string
}

export default function AnnouncementsClient({
  initialAnnouncements,
  courses,
  canCreate,
  role,
}: {
  initialAnnouncements: Announcement[]
  courses: Course[]
  canCreate: boolean
  role: string
}) {
  const router = useRouter()
  const [announcements, setAnnouncements] = useState(initialAnnouncements)
  const [showForm, setShowForm] = useState(false)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [courseId, setCourseId] = useState('')
  const [pinned, setPinned] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [filter, setFilter] = useState<'all' | 'pinned' | 'school' | 'course'>('all')

  // Memoize filtered announcements so they only recompute when the
  // announcements array or the active filter changes.
  const filtered = useMemo(
    () =>
      announcements.filter((a) => {
        if (filter === 'pinned') return a.is_pinned
        if (filter === 'school') return !a.course_id
        if (filter === 'course') return !!a.course_id
        return true
      }),
    [announcements, filter]
  )

  const handleCreate = async () => {
    if (!title.trim() || !content.trim()) return
    setSubmitting(true)
    try {
      await createAnnouncement({
        title: title.trim(),
        content: content.trim(),
        courseId: courseId || undefined,
        pinned,
      })
      setTitle('')
      setContent('')
      setCourseId('')
      setPinned(false)
      setShowForm(false)
      router.refresh()
    } catch (err) {
      console.error('Failed to create announcement:', err)
    } finally {
      setSubmitting(false)
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteAnnouncement(id)
      setAnnouncements((prev) => prev.filter((a) => a.id !== id))
    } catch (err) {
      console.error('Failed to delete:', err)
    }
  }

  const handleTogglePin = async (id: string, currentPinned: boolean) => {
    try {
      await togglePinAnnouncement(id, !currentPinned)
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === id ? { ...a, is_pinned: !currentPinned } : a))
      )
    } catch (err) {
      console.error('Failed to toggle pin:', err)
    }
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    })

  return (
    <div className="mx-auto max-w-4xl space-y-6 px-2 sm:px-4">
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Announcements</h1>
          <p className="mt-1 text-muted-foreground">
            School-wide and course announcements from teachers and administrators.
          </p>
        </div>
        {canCreate && (
          <Button onClick={() => setShowForm(!showForm)}>
            <Plus className="mr-1.5 size-4" />
            New Announcement
          </Button>
        )}
      </div>

      {/* Create Form */}
      {showForm && canCreate && (
        <div className="ocean-card rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-semibold text-foreground">Create Announcement</h3>
          <input
            type="text"
            placeholder="Announcement title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
          <textarea
            placeholder="Write your announcement..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={4}
            className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
          />
          <div className="flex flex-wrap items-center gap-4">
            <select
              value={courseId}
              onChange={(e) => setCourseId(e.target.value)}
              className="rounded-xl border border-border bg-background px-3 py-2 text-sm focus:border-primary focus:outline-none"
            >
              <option value="">School-wide</option>
              {courses.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={pinned}
                onChange={(e) => setPinned(e.target.checked)}
                className="rounded"
              />
              Pin announcement
            </label>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleCreate} disabled={submitting || !title.trim() || !content.trim()}>
              {submitting ? 'Publishing...' : 'Publish'}
            </Button>
            <Button variant="outline" onClick={() => setShowForm(false)}>
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Filters */}
      <div className="flex flex-wrap gap-2">
        {(['all', 'pinned', 'school', 'course'] as const).map((f) => (
          <Button
            key={f}
            variant={filter === f ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter(f)}
          >
            {f === 'all' ? 'All' : f === 'pinned' ? 'Pinned' : f === 'school' ? 'School-wide' : 'Course'}
          </Button>
        ))}
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {filtered.length === 0 ? (
          <div className="ocean-card flex flex-col items-center justify-center rounded-2xl py-16 text-center">
            <Megaphone className="mb-3 size-12 text-muted-foreground/30" />
            <p className="text-lg font-medium text-foreground">No announcements</p>
            <p className="mt-1 text-sm text-muted-foreground">
              {filter !== 'all'
                ? 'Try a different filter.'
                : 'Announcements from your school will appear here.'}
            </p>
          </div>
        ) : (
          filtered.map((a) => {
            const courseName = a.course_id
              ? courses.find((c) => c.id === a.course_id)?.name
              : null

            return (
              <div
                key={a.id}
                className={`ocean-card rounded-2xl p-5 transition-all ${
                  a.is_pinned ? 'border-l-4 border-l-amber-500' : ''
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      {a.is_pinned && (
                        <Pin className="size-4 text-amber-500 fill-amber-500" />
                      )}
                      <h3 className="text-base font-semibold text-foreground">
                        {a.title}
                      </h3>
                    </div>
                    <div className="mt-2 text-sm text-foreground/80 whitespace-pre-wrap">
                      {a.content}
                    </div>
                    <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                      <span>{a.profiles?.full_name ?? 'Staff'}</span>
                      <span>{formatDate(a.published_at || a.created_at)}</span>
                      {courseName ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 dark:bg-blue-950/50 px-2 py-0.5 text-blue-700 dark:text-blue-300 font-medium">
                          <BookOpen className="size-3" />
                          {courseName}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 rounded-full bg-green-100 dark:bg-green-950/50 px-2 py-0.5 text-green-700 dark:text-green-300 font-medium">
                          <Globe className="size-3" />
                          School-wide
                        </span>
                      )}
                    </div>
                  </div>
                  {canCreate && (
                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        onClick={() => handleTogglePin(a.id, a.is_pinned)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                        title={a.is_pinned ? 'Unpin' : 'Pin'}
                      >
                        <Pin className={`size-4 ${a.is_pinned ? 'text-amber-500 fill-amber-500' : ''}`} />
                      </button>
                      <button
                        onClick={() => handleDelete(a.id)}
                        className="rounded-lg p-1.5 text-muted-foreground hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-950/50 transition-colors"
                        title="Delete"
                      >
                        <Trash2 className="size-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
