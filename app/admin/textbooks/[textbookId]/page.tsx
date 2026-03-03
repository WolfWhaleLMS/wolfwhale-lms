'use client'

import { useEffect, useState, use } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import {
  ArrowLeft,
  BookOpen,
  Layers,
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  Save,
  Clock,
  X,
  ChevronDown,
  ChevronRight,
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  getTextbook,
  updateTextbook,
  createUnit,
  createChapter,
  deleteChapter,
} from '@/app/actions/textbooks'
import type {
  Textbook,
  TextbookUnit,
  TextbookChapter,
  TextbookSubject,
  ReplacedTextbook,
  TextbookWithChapters,
} from '@/lib/types/textbook'

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

export default function AdminTextbookDetailPage({
  params,
}: {
  params: Promise<{ textbookId: string }>
}) {
  const { textbookId } = use(params)
  const router = useRouter()

  const [textbook, setTextbook] = useState<TextbookWithChapters | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Metadata editor state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [subject, setSubject] = useState<TextbookSubject>('math')
  const [gradeLevel, setGradeLevel] = useState('')
  const [province, setProvince] = useState('')
  const [framework, setFramework] = useState('')
  const [skCourseName, setSkCourseName] = useState('')
  const [curriculumUrl, setCurriculumUrl] = useState('')
  const [coverImageUrl, setCoverImageUrl] = useState('')

  // Replaces textbooks state
  const [replacesTextbooks, setReplacesTextbooks] = useState<ReplacedTextbook[]>([])

  // Unit creation
  const [showCreateUnit, setShowCreateUnit] = useState(false)
  const [newUnitTitle, setNewUnitTitle] = useState('')
  const [newUnitNumber, setNewUnitNumber] = useState(1)
  const [newUnitDescription, setNewUnitDescription] = useState('')
  const [creatingUnit, setCreatingUnit] = useState(false)

  // Chapter creation
  const [showCreateChapter, setShowCreateChapter] = useState<string | null>(null)
  const [newChapterTitle, setNewChapterTitle] = useState('')
  const [newChapterNumber, setNewChapterNumber] = useState(1)
  const [creatingChapter, setCreatingChapter] = useState(false)

  // Collapsible units
  const [expandedUnits, setExpandedUnits] = useState<Set<string>>(new Set())

  const loadTextbook = async () => {
    try {
      const data = await getTextbook(textbookId)
      setTextbook(data as TextbookWithChapters)
      setTitle(data.title)
      setDescription(data.description || '')
      setSubject(data.subject)
      setGradeLevel(data.grade_level)
      setProvince(data.province)
      setFramework(data.curriculum_framework)
      setSkCourseName(data.sk_course_name || '')
      setCurriculumUrl(data.curriculum_url || '')
      setCoverImageUrl(data.cover_image_url || '')
      setReplacesTextbooks(data.replaces_textbooks || [])
      // Expand all units by default
      const unitIds = new Set<string>((data.units || []).map((u: any) => u.id))
      setExpandedUnits(unitIds)
      // Set next unit number
      const maxUnit = Math.max(0, ...(data.units || []).map((u: any) => u.unit_number))
      setNewUnitNumber(maxUnit + 1)
    } catch (err) {
      console.error('Error loading textbook:', err)
      toast.error('Failed to load textbook')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    loadTextbook()
  }, [textbookId])

  const handleSaveMetadata = async () => {
    if (!title.trim()) {
      toast.error('Title is required')
      return
    }
    setSaving(true)
    try {
      await updateTextbook(textbookId, {
        title,
        slug: slugify(title),
        description: description || null,
        subject,
        grade_level: gradeLevel,
        province,
        curriculum_framework: framework,
        sk_course_name: skCourseName || null,
        curriculum_url: curriculumUrl || null,
        cover_image_url: coverImageUrl || null,
        replaces_textbooks: replacesTextbooks,
      })
      toast.success('Textbook updated!')
      await loadTextbook()
    } catch (err: any) {
      toast.error(err.message || 'Failed to update textbook')
    } finally {
      setSaving(false)
    }
  }

  const handleTogglePublish = async () => {
    if (!textbook) return
    try {
      await updateTextbook(textbookId, { is_published: !textbook.is_published })
      toast.success(textbook.is_published ? 'Textbook unpublished' : 'Textbook published')
      await loadTextbook()
    } catch (err) {
      toast.error('Failed to update publish status')
    }
  }

  const handleCreateUnit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newUnitTitle.trim()) return
    setCreatingUnit(true)
    try {
      await createUnit(textbookId, {
        title: newUnitTitle,
        unit_number: newUnitNumber,
        description: newUnitDescription || undefined,
      })
      toast.success('Unit created!')
      setNewUnitTitle('')
      setNewUnitDescription('')
      setShowCreateUnit(false)
      await loadTextbook()
    } catch (err: any) {
      toast.error(err.message || 'Failed to create unit')
    } finally {
      setCreatingUnit(false)
    }
  }

  const handleCreateChapter = async (e: React.FormEvent, unitId: string | null) => {
    e.preventDefault()
    if (!newChapterTitle.trim()) return
    setCreatingChapter(true)
    try {
      const result = await createChapter(textbookId, {
        title: newChapterTitle,
        slug: slugify(newChapterTitle),
        chapter_number: newChapterNumber,
        unit_id: unitId && unitId !== 'unassigned' ? unitId : undefined,
      })
      toast.success('Chapter created!')
      setNewChapterTitle('')
      setShowCreateChapter(null)
      router.push(`/admin/textbooks/${textbookId}/chapters/${result.id}/edit`)
    } catch (err: any) {
      toast.error(err.message || 'Failed to create chapter')
    } finally {
      setCreatingChapter(false)
    }
  }

  const handleDeleteChapter = async (chapterId: string) => {
    if (!confirm('Delete this chapter? This cannot be undone.')) return
    try {
      await deleteChapter(chapterId, textbookId)
      toast.success('Chapter deleted')
      await loadTextbook()
    } catch (err) {
      toast.error('Failed to delete chapter')
    }
  }

  // Replaces textbooks management
  const addReplacedTextbook = () => {
    setReplacesTextbooks([...replacesTextbooks, { title: '', publisher: '', price: 0, lineage: '' }])
  }

  const updateReplacedTextbook = (index: number, field: keyof ReplacedTextbook, value: string | number) => {
    const updated = [...replacesTextbooks]
    updated[index] = { ...updated[index], [field]: value }
    setReplacesTextbooks(updated)
  }

  const removeReplacedTextbook = (index: number) => {
    setReplacesTextbooks(replacesTextbooks.filter((_, i) => i !== index))
  }

  const toggleUnit = (unitId: string) => {
    const next = new Set(expandedUnits)
    if (next.has(unitId)) {
      next.delete(unitId)
    } else {
      next.add(unitId)
    }
    setExpandedUnits(next)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading textbook...</p>
        </div>
      </div>
    )
  }

  if (!textbook) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Textbook not found</h1>
          <Link href="/admin/textbooks">
            <Button>Back to Textbooks</Button>
          </Link>
        </div>
      </div>
    )
  }

  const totalChapters = textbook.units.reduce((sum, u) => sum + u.chapters.length, 0)
  const totalMinutes = textbook.units.reduce(
    (sum, u) => sum + u.chapters.reduce((s, ch) => s + (ch.estimated_minutes || 0), 0),
    0
  )

  const statusColor = (published: boolean) =>
    published
      ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      : 'bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-400'

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <Link
        href="/admin/textbooks"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Textbooks
      </Link>

      {/* Header */}
      <div className="ocean-card rounded-2xl p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-foreground">{textbook.title}</h1>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(textbook.is_published)}`}
              >
                {textbook.is_published ? 'published' : 'draft'}
              </span>
            </div>
            {textbook.description && (
              <p className="text-muted-foreground mb-3">{textbook.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              <span className="rounded-md bg-muted px-2 py-1">
                {textbook.subject.charAt(0).toUpperCase() + textbook.subject.slice(1)}
              </span>
              <span className="rounded-md bg-muted px-2 py-1">
                Grade {textbook.grade_level}
              </span>
              <span className="rounded-md bg-muted px-2 py-1">{textbook.province}</span>
            </div>
          </div>
          <Button
            variant={textbook.is_published ? 'outline' : 'default'}
            onClick={handleTogglePublish}
            className="gap-2"
          >
            {textbook.is_published ? (
              <>
                <EyeOff className="h-4 w-4" />
                Unpublish
              </>
            ) : (
              <>
                <Eye className="h-4 w-4" />
                Publish
              </>
            )}
          </Button>
        </div>

        {/* Stats Row */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl bg-muted/50 p-4 text-center">
            <Layers className="mx-auto mb-1 h-5 w-5 text-muted-foreground" />
            <p className="text-2xl font-bold text-foreground">{textbook.units.length}</p>
            <p className="text-xs text-muted-foreground">Units</p>
          </div>
          <div className="rounded-xl bg-muted/50 p-4 text-center">
            <BookOpen className="mx-auto mb-1 h-5 w-5 text-muted-foreground" />
            <p className="text-2xl font-bold text-foreground">{totalChapters}</p>
            <p className="text-xs text-muted-foreground">Chapters</p>
          </div>
          <div className="rounded-xl bg-muted/50 p-4 text-center">
            <Clock className="mx-auto mb-1 h-5 w-5 text-muted-foreground" />
            <p className="text-2xl font-bold text-foreground">{totalMinutes}</p>
            <p className="text-xs text-muted-foreground">Total Minutes</p>
          </div>
          <div className="rounded-xl bg-muted/50 p-4 text-center">
            <BookOpen className="mx-auto mb-1 h-5 w-5 text-muted-foreground" />
            <p className="text-2xl font-bold text-foreground">{textbook.outcomes.length}</p>
            <p className="text-xs text-muted-foreground">Outcomes</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="chapters" className="space-y-6">
        <TabsList>
          <TabsTrigger value="chapters">
            Chapters ({totalChapters})
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
          <TabsTrigger value="replaces">Replaces ({replacesTextbooks.length})</TabsTrigger>
        </TabsList>

        {/* --- Chapters Tab --- */}
        <TabsContent value="chapters">
          <div className="space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <h2 className="text-lg font-semibold text-foreground">Units & Chapters</h2>
              <Button
                onClick={() => setShowCreateUnit(!showCreateUnit)}
                variant="outline"
                className="gap-2"
              >
                <Plus className="h-4 w-4" />
                Add Unit
              </Button>
            </div>

            {/* Create Unit Form */}
            {showCreateUnit && (
              <form onSubmit={handleCreateUnit} className="ocean-card rounded-2xl p-6 space-y-4">
                <h3 className="font-semibold">New Unit</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Unit Title</Label>
                    <Input
                      value={newUnitTitle}
                      onChange={(e) => setNewUnitTitle(e.target.value)}
                      placeholder="e.g. Numbers and Operations"
                      className="mt-1"
                      required
                    />
                  </div>
                  <div>
                    <Label>Unit Number</Label>
                    <Input
                      type="number"
                      value={newUnitNumber}
                      onChange={(e) => setNewUnitNumber(Number(e.target.value))}
                      min={1}
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label>Description (optional)</Label>
                  <Textarea
                    value={newUnitDescription}
                    onChange={(e) => setNewUnitDescription(e.target.value)}
                    placeholder="Brief description..."
                    className="mt-1"
                    rows={2}
                  />
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={creatingUnit}>
                    {creatingUnit ? 'Creating...' : 'Create Unit'}
                  </Button>
                  <Button type="button" variant="outline" onClick={() => setShowCreateUnit(false)}>
                    Cancel
                  </Button>
                </div>
              </form>
            )}

            {/* Unit List */}
            {textbook.units.length === 0 ? (
              <div className="ocean-card rounded-2xl py-16 text-center">
                <Layers className="mx-auto mb-3 h-12 w-12 text-muted-foreground/40" />
                <h3 className="text-lg font-semibold">No units yet</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                  Create your first unit to start organizing chapters.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {textbook.units.map((unit) => (
                  <div key={unit.id} className="ocean-card rounded-2xl overflow-hidden">
                    {/* Unit Header */}
                    <button
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/30 transition-colors"
                      onClick={() => toggleUnit(unit.id)}
                    >
                      <div className="flex items-center gap-3">
                        {expandedUnits.has(unit.id) ? (
                          <ChevronDown className="h-5 w-5 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="h-5 w-5 text-muted-foreground" />
                        )}
                        <div>
                          <h3 className="font-semibold text-foreground">
                            {unit.id === 'unassigned' ? unit.title : `Unit ${unit.unit_number}: ${unit.title}`}
                          </h3>
                          {unit.description && (
                            <p className="text-sm text-muted-foreground mt-0.5">{unit.description}</p>
                          )}
                        </div>
                      </div>
                      <Badge variant="secondary">{unit.chapters.length} chapters</Badge>
                    </button>

                    {/* Chapters */}
                    {expandedUnits.has(unit.id) && (
                      <div className="border-t border-border">
                        {unit.chapters.length === 0 ? (
                          <div className="px-5 py-6 text-center text-sm text-muted-foreground">
                            No chapters in this unit yet.
                          </div>
                        ) : (
                          <div className="divide-y divide-border">
                            {unit.chapters.map((chapter) => (
                              <div
                                key={chapter.id}
                                className="flex items-center justify-between px-5 py-3 hover:bg-muted/20 transition-colors"
                              >
                                <div className="flex items-center gap-3 flex-1 min-w-0">
                                  <span className="text-xs text-muted-foreground font-mono w-8">
                                    {chapter.chapter_number}.
                                  </span>
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-foreground truncate">
                                      {chapter.title}
                                    </p>
                                    <div className="flex items-center gap-2 mt-0.5">
                                      <span
                                        className={`inline-flex items-center rounded-full px-1.5 py-0.5 text-[10px] font-medium ${statusColor(chapter.is_published)}`}
                                      >
                                        {chapter.is_published ? 'published' : 'draft'}
                                      </span>
                                      {chapter.estimated_minutes && (
                                        <span className="text-xs text-muted-foreground">
                                          {chapter.estimated_minutes} min
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-1 ml-4 shrink-0">
                                  <Link href={`/admin/textbooks/${textbookId}/chapters/${chapter.id}/edit`}>
                                    <Button variant="ghost" size="sm" className="h-8 gap-1.5">
                                      <Pencil className="h-3.5 w-3.5" />
                                      Edit
                                    </Button>
                                  </Link>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => handleDeleteChapter(chapter.id)}
                                    className="h-8 text-destructive hover:text-destructive"
                                  >
                                    <Trash2 className="h-3.5 w-3.5" />
                                  </Button>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}

                        {/* Add Chapter */}
                        {showCreateChapter === unit.id ? (
                          <form
                            onSubmit={(e) => handleCreateChapter(e, unit.id === 'unassigned' ? null : unit.id)}
                            className="p-5 border-t border-border bg-muted/20 space-y-3"
                          >
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                              <div className="md:col-span-2">
                                <Input
                                  value={newChapterTitle}
                                  onChange={(e) => setNewChapterTitle(e.target.value)}
                                  placeholder="Chapter title..."
                                  required
                                />
                              </div>
                              <div>
                                <Input
                                  type="number"
                                  value={newChapterNumber}
                                  onChange={(e) => setNewChapterNumber(Number(e.target.value))}
                                  min={1}
                                  placeholder="Chapter #"
                                />
                              </div>
                            </div>
                            <div className="flex gap-2">
                              <Button type="submit" size="sm" disabled={creatingChapter}>
                                {creatingChapter ? 'Creating...' : 'Create Chapter'}
                              </Button>
                              <Button
                                type="button"
                                variant="outline"
                                size="sm"
                                onClick={() => setShowCreateChapter(null)}
                              >
                                Cancel
                              </Button>
                            </div>
                          </form>
                        ) : (
                          <div className="p-3 border-t border-border">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="w-full gap-2"
                              onClick={() => {
                                const maxChapter = Math.max(0, ...unit.chapters.map((c) => c.chapter_number))
                                setNewChapterNumber(maxChapter + 1)
                                setNewChapterTitle('')
                                setShowCreateChapter(unit.id)
                              }}
                            >
                              <Plus className="h-4 w-4" />
                              Add Chapter
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* --- Settings Tab --- */}
        <TabsContent value="settings">
          <div className="ocean-card rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Textbook Settings</h2>
              <Button onClick={handleSaveMetadata} disabled={saving} className="gap-2">
                <Save className="h-4 w-4" />
                {saving ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>Title</Label>
                <Input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Subject</Label>
                <Select value={subject} onValueChange={(v) => setSubject(v as TextbookSubject)}>
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
                  value={gradeLevel}
                  onChange={(e) => setGradeLevel(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Province</Label>
                <Input
                  value={province}
                  onChange={(e) => setProvince(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Curriculum Framework</Label>
                <Input
                  value={framework}
                  onChange={(e) => setFramework(e.target.value)}
                  className="mt-1"
                />
              </div>
              <div>
                <Label>SK Course Name (optional)</Label>
                <Input
                  value={skCourseName}
                  onChange={(e) => setSkCourseName(e.target.value)}
                  className="mt-1"
                  placeholder="e.g. Foundations of Mathematics 10"
                />
              </div>
              <div>
                <Label>Curriculum URL (optional)</Label>
                <Input
                  value={curriculumUrl}
                  onChange={(e) => setCurriculumUrl(e.target.value)}
                  className="mt-1"
                  placeholder="https://..."
                />
              </div>
              <div>
                <Label>Cover Image URL (optional)</Label>
                <Input
                  value={coverImageUrl}
                  onChange={(e) => setCoverImageUrl(e.target.value)}
                  className="mt-1"
                  placeholder="https://..."
                />
              </div>
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="mt-1"
                rows={3}
                placeholder="Detailed description of the textbook..."
              />
            </div>

            {coverImageUrl && (
              <div className="rounded-lg border border-border p-2">
                <img
                  src={coverImageUrl}
                  alt="Cover preview"
                  className="max-h-48 mx-auto rounded"
                />
              </div>
            )}
          </div>
        </TabsContent>

        {/* --- Replaces Tab --- */}
        <TabsContent value="replaces">
          <div className="ocean-card rounded-2xl p-6 space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold">Legacy Textbooks Replaced</h2>
                <p className="text-sm text-muted-foreground mt-1">
                  Track which physical textbooks this digital textbook replaces.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" onClick={addReplacedTextbook} className="gap-2">
                  <Plus className="h-4 w-4" />
                  Add
                </Button>
                <Button onClick={handleSaveMetadata} disabled={saving} className="gap-2">
                  <Save className="h-4 w-4" />
                  {saving ? 'Saving...' : 'Save'}
                </Button>
              </div>
            </div>

            {replacesTextbooks.length === 0 ? (
              <div className="py-8 text-center text-sm text-muted-foreground">
                No legacy textbooks listed. Click &quot;Add&quot; to track textbooks this replaces.
              </div>
            ) : (
              <div className="space-y-4">
                {replacesTextbooks.map((rt, index) => (
                  <div key={index} className="rounded-xl border border-border p-4 space-y-3">
                    <div className="flex items-start justify-between">
                      <span className="text-sm font-medium text-muted-foreground">
                        Legacy Textbook #{index + 1}
                      </span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeReplacedTextbook(index)}
                        className="text-destructive hover:text-destructive h-7"
                      >
                        <X className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label className="text-xs">Title</Label>
                        <Input
                          value={rt.title}
                          onChange={(e) => updateReplacedTextbook(index, 'title', e.target.value)}
                          placeholder="Textbook title..."
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Publisher</Label>
                        <Input
                          value={rt.publisher}
                          onChange={(e) => updateReplacedTextbook(index, 'publisher', e.target.value)}
                          placeholder="Publisher name..."
                          className="mt-1"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Price ($)</Label>
                        <Input
                          type="number"
                          value={rt.price}
                          onChange={(e) => updateReplacedTextbook(index, 'price', Number(e.target.value))}
                          className="mt-1"
                          step="0.01"
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Lineage/Edition</Label>
                        <Input
                          value={rt.lineage}
                          onChange={(e) => updateReplacedTextbook(index, 'lineage', e.target.value)}
                          placeholder="e.g. 3rd Edition, 2019"
                          className="mt-1"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
