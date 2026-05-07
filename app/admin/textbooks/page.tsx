'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  BookOpen,
  Plus,
  Eye,
  EyeOff,
  Trash2,
  Pencil,
  Search,
  Filter,
  Layers,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  getAdminTextbooks,
  createTextbook,
  updateTextbook,
  deleteTextbook,
} from '@/app/actions/textbooks'
import type { Textbook, TextbookSubject } from '@/lib/types/textbook'

const SUBJECTS: { value: TextbookSubject; label: string }[] = [
  { value: 'math', label: 'Math' },
  { value: 'science', label: 'Science' },
  { value: 'physics', label: 'Physics' },
  { value: 'chemistry', label: 'Chemistry' },
  { value: 'biology', label: 'Biology' },
  { value: 'ela', label: 'ELA' },
]

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
}

export default function AdminTextbooksPage() {
  const router = useRouter()
  const [textbooks, setTextbooks] = useState<Textbook[]>([])
  const [loading, setLoading] = useState(true)
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)

  // Filter state
  const [filterSubject, setFilterSubject] = useState<string>('all')
  const [filterStatus, setFilterStatus] = useState<string>('all')
  const [searchQuery, setSearchQuery] = useState('')

  // Create form state
  const [newTitle, setNewTitle] = useState('')
  const [newSubject, setNewSubject] = useState<TextbookSubject>('math')
  const [newGrade, setNewGrade] = useState('')
  const [newProvince, setNewProvince] = useState('Saskatchewan')
  const [newFramework, setNewFramework] = useState('Saskatchewan Curriculum')
  const [newDescription, setNewDescription] = useState('')

  const loadTextbooks = async () => {
    try {
      const filters: { subject?: string; status?: string } = {}
      if (filterSubject !== 'all') filters.subject = filterSubject
      if (filterStatus !== 'all') filters.status = filterStatus
      const data = await getAdminTextbooks(filters)
      setTextbooks(data as Textbook[])
    } catch (err) {
      console.error('Error loading textbooks:', err)
      toast.error('Failed to load textbooks')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTextbooks()
  }, [filterSubject, filterStatus])

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTitle.trim() || !newGrade.trim()) {
      toast.error('Title and grade level are required')
      return
    }
    setCreating(true)
    try {
      const result = await createTextbook({
        title: newTitle,
        slug: slugify(newTitle),
        subject: newSubject,
        grade_level: newGrade,
        province: newProvince,
        curriculum_framework: newFramework,
        description: newDescription || undefined,
        is_published: false,
      })
      toast.success('Textbook created!')
      setNewTitle('')
      setNewGrade('')
      setNewDescription('')
      setShowCreate(false)
      router.push(`/admin/textbooks/${result.id}`)
    } catch (err: any) {
      console.error('Error creating textbook:', err)
      toast.error(err.message || 'Failed to create textbook')
    } finally {
      setCreating(false)
    }
  }

  const handleTogglePublish = async (textbook: Textbook) => {
    try {
      await updateTextbook(textbook.id, { is_published: !textbook.is_published })
      toast.success(textbook.is_published ? 'Textbook unpublished' : 'Textbook published')
      await loadTextbooks()
    } catch (err) {
      toast.error('Failed to update textbook')
    }
  }

  const handleDelete = async (textbookId: string) => {
    if (!confirm('Delete this textbook and all its chapters? This cannot be undone.')) return
    try {
      await deleteTextbook(textbookId)
      toast.success('Textbook deleted')
      await loadTextbooks()
    } catch (err) {
      toast.error('Failed to delete textbook')
    }
  }

  const filtered = textbooks.filter((tb) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        tb.title.toLowerCase().includes(q) ||
        tb.subject.toLowerCase().includes(q) ||
        tb.grade_level.toLowerCase().includes(q)
      )
    }
    return true
  })

  const statusColor = (published: boolean) =>
    published
      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Textbook Management
          </h1>
          <p className="mt-1 text-muted-foreground">
            Create and manage digital textbooks for your school.
          </p>
        </div>
        <Button
          onClick={() => setShowCreate(!showCreate)}
          className="whale-gradient gap-2 text-white shadow-md hover:shadow-lg"
        >
          <Plus className="h-4 w-4" />
          Create Textbook
        </Button>
      </div>

      {/* Create Form */}
      {showCreate && (
        <form onSubmit={handleCreate} className="ocean-card rounded-2xl p-6 space-y-4">
          <h3 className="text-lg font-semibold">New Textbook</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Title</Label>
              <Input
                value={newTitle}
                onChange={(e) => setNewTitle(e.target.value)}
                placeholder="e.g. Foundations of Mathematics 10"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label>Subject</Label>
              <Select value={newSubject} onValueChange={(v) => setNewSubject(v as TextbookSubject)}>
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((s) => (
                    <SelectItem key={s.value} value={s.value}>
                      {s.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>Grade Level</Label>
              <Input
                value={newGrade}
                onChange={(e) => setNewGrade(e.target.value)}
                placeholder="e.g. 10"
                className="mt-1"
                required
              />
            </div>
            <div>
              <Label>Province</Label>
              <Input
                value={newProvince}
                onChange={(e) => setNewProvince(e.target.value)}
                className="mt-1"
              />
            </div>
            <div>
              <Label>Curriculum Framework</Label>
              <Input
                value={newFramework}
                onChange={(e) => setNewFramework(e.target.value)}
                className="mt-1"
              />
            </div>
          </div>
          <div>
            <Label>Description (optional)</Label>
            <Textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Brief description of the textbook..."
              className="mt-1"
              rows={2}
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" disabled={creating}>
              {creating ? 'Creating...' : 'Create Textbook'}
            </Button>
            <Button type="button" variant="outline" onClick={() => setShowCreate(false)}>
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Filters */}
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search textbooks..."
            className="pl-9"
          />
        </div>
        <Select value={filterSubject} onValueChange={setFilterSubject}>
          <SelectTrigger className="w-[140px]">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Subject" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Subjects</SelectItem>
            {SUBJECTS.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-[140px]">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="published">Published</SelectItem>
            <SelectItem value="draft">Draft</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Textbook Grid */}
      {loading ? (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-48 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="ocean-card flex flex-col items-center justify-center rounded-2xl py-20 text-center">
          <BookOpen className="mb-4 h-16 w-16 text-muted-foreground/40" />
          <h3 className="text-lg font-semibold text-foreground">No textbooks found</h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            {textbooks.length === 0
              ? 'Create your first textbook to get started.'
              : 'No textbooks match your current filters.'}
          </p>
          {textbooks.length === 0 && (
            <Button
              onClick={() => setShowCreate(true)}
              className="whale-gradient mt-6 gap-2 text-white"
            >
              <Plus className="h-4 w-4" />
              Create Your First Textbook
            </Button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((textbook) => (
            <div
              key={textbook.id}
              className="ocean-card group rounded-2xl p-6 transition-all hover:shadow-lg"
            >
              <div className="mb-3 flex items-start justify-between">
                <Link
                  href={`/admin/textbooks/${textbook.id}`}
                  className="flex-1 min-w-0"
                >
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {textbook.title}
                  </h3>
                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {textbook.subject.charAt(0).toUpperCase() + textbook.subject.slice(1)}
                    {' - Grade '}
                    {textbook.grade_level}
                  </p>
                </Link>
                <span
                  className={`ml-2 inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(textbook.is_published)}`}
                >
                  {textbook.is_published ? 'published' : 'draft'}
                </span>
              </div>

              {textbook.description && (
                <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                  {textbook.description}
                </p>
              )}

              <div className="mt-auto flex items-center gap-4 border-t border-border pt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Layers className="h-4 w-4" />
                  <span>
                    {textbook.chapter_count}{' '}
                    {textbook.chapter_count === 1 ? 'chapter' : 'chapters'}
                  </span>
                </div>
                <span className="text-xs">
                  {new Date(textbook.created_at).toLocaleDateString()}
                </span>
              </div>

              {/* Quick Actions */}
              <div className="mt-3 flex items-center gap-1 border-t border-border pt-3">
                <Link href={`/admin/textbooks/${textbook.id}`}>
                  <Button variant="ghost" size="sm" className="gap-1.5">
                    <Pencil className="h-3.5 w-3.5" />
                    Edit
                  </Button>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTogglePublish(textbook)}
                  className="gap-1.5"
                >
                  {textbook.is_published ? (
                    <>
                      <EyeOff className="h-3.5 w-3.5" />
                      Unpublish
                    </>
                  ) : (
                    <>
                      <Eye className="h-3.5 w-3.5" />
                      Publish
                    </>
                  )}
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(textbook.id)}
                  className="gap-1.5 text-destructive hover:text-destructive"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Delete
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
