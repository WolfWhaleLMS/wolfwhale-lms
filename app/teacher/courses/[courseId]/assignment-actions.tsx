'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createAssignment } from '@/app/actions/assignments'
import { ASSIGNMENT_TYPES, SUBMISSION_TYPES } from '@/lib/config/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { Plus, Loader2, Wand2, Link2, X, FolderOpen, BookOpen } from 'lucide-react'
import { toast } from 'sonner'

type QuickLink = {
  id: string
  url: string
  title: string
}

interface ModuleOption {
  id: string
  title: string
}

interface LessonOption {
  id: string
  title: string
  module_id: string | null
}

interface AssignmentActionsProps {
  courseId: string
  modules?: ModuleOption[]
  lessons?: LessonOption[]
}

export function AssignmentActions({ courseId, modules = [], lessons = [] }: AssignmentActionsProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [quickLinks, setQuickLinks] = useState<QuickLink[]>([])
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    type: 'homework',
    dueDate: '',
    pointsPossible: '100',
    submissionType: 'text',
    latePolicy: true,
    moduleId: '',
    lessonId: '',
  })

  // Filter lessons based on selected module
  const filteredLessons = useMemo(() => {
    if (!formData.moduleId) return lessons
    return lessons.filter((l) => l.module_id === formData.moduleId)
  }, [lessons, formData.moduleId])

  function resetForm() {
    setFormData({
      title: '',
      description: '',
      type: 'homework',
      dueDate: '',
      pointsPossible: '100',
      submissionType: 'text',
      latePolicy: true,
      moduleId: '',
      lessonId: '',
    })
    setQuickLinks([])
    setError(null)
  }

  function addQuickLink() {
    if (quickLinks.length >= 3) return
    setQuickLinks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), url: '', title: '' },
    ])
  }

  function updateQuickLink(id: string, field: 'url' | 'title', value: string) {
    setQuickLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    )
  }

  function removeQuickLink(id: string) {
    setQuickLinks((prev) => prev.filter((l) => l.id !== id))
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!formData.title.trim()) {
      setError('Assignment title is required.')
      return
    }

    const points = parseInt(formData.pointsPossible, 10)
    if (isNaN(points) || points < 0) {
      setError('Points must be a positive number.')
      return
    }

    setIsSubmitting(true)

    try {
      const validLinks = quickLinks
        .filter((l) => l.url.trim())
        .map((l) => ({ url: l.url.trim(), title: l.title.trim() || l.url.trim() }))

      const result = await createAssignment({
        courseId,
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        type: formData.type,
        dueDate: formData.dueDate || undefined,
        pointsPossible: points,
        submissionType: formData.submissionType,
        latePolicy: formData.latePolicy,
        links: validLinks.length > 0 ? validLinks : undefined,
        moduleId: formData.moduleId || undefined,
        lessonId: formData.lessonId || undefined,
      })

      if (result.error) {
        setError(result.error)
        setIsSubmitting(false)
        return
      }

      toast.success('Assignment created!')
      resetForm()
      setOpen(false)
      setIsSubmitting(false)
      router.refresh()
    } catch {
      setError('An unexpected error occurred.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="flex items-center gap-2">
      <Link href={`/teacher/courses/${courseId}/assignments/new`}>
        <Button variant="outline" size="sm" className="gap-1.5">
          <Wand2 className="h-4 w-4" />
          Quiz/Test Builder
        </Button>
      </Link>

      <Dialog
        open={open}
        onOpenChange={(v) => {
          setOpen(v)
          if (!v) resetForm()
        }}
      >
        <DialogTrigger asChild>
          <Button className="whale-gradient text-white" size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            Add Assignment
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Assignment</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleCreate} className="space-y-4">
            {error && (
              <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400">
                {error}
              </div>
            )}

            {/* Attach to Module / Lesson — shown when modules or lessons exist */}
            {(modules.length > 0 || lessons.length > 0) && (
              <div className="rounded-lg border border-border bg-muted/20 p-3 space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Attach to
                </p>
                <div className="grid grid-cols-2 gap-3">
                  {modules.length > 0 && (
                    <div className="space-y-1.5">
                      <Label htmlFor="assignment-module" className="text-xs">
                        <span className="flex items-center gap-1">
                          <FolderOpen className="h-3 w-3" />
                          Module
                        </span>
                      </Label>
                      <select
                        id="assignment-module"
                        value={formData.moduleId}
                        onChange={(e) => {
                          const newModuleId = e.target.value
                          setFormData((prev) => ({
                            ...prev,
                            moduleId: newModuleId,
                            // Reset lesson if switching modules
                            lessonId: '',
                          }))
                        }}
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        disabled={isSubmitting}
                      >
                        <option value="">None</option>
                        {modules.map((m) => (
                          <option key={m.id} value={m.id}>
                            {m.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                  {filteredLessons.length > 0 && (
                    <div className="space-y-1.5">
                      <Label htmlFor="assignment-lesson" className="text-xs">
                        <span className="flex items-center gap-1">
                          <BookOpen className="h-3 w-3" />
                          Lesson
                        </span>
                      </Label>
                      <select
                        id="assignment-lesson"
                        value={formData.lessonId}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            lessonId: e.target.value,
                          }))
                        }
                        className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                        disabled={isSubmitting}
                      >
                        <option value="">None</option>
                        {filteredLessons.map((l) => (
                          <option key={l.id} value={l.id}>
                            {l.title}
                          </option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="assignment-title">
                Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="assignment-title"
                placeholder="e.g., Chapter 3 Homework"
                value={formData.title}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, title: e.target.value }))
                }
                disabled={isSubmitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="assignment-description">Description</Label>
              <Textarea
                id="assignment-description"
                placeholder="Instructions for students..."
                value={formData.description}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={3}
                disabled={isSubmitting}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignment-type">Type</Label>
                <select
                  id="assignment-type"
                  value={formData.type}
                  onChange={(e) =>
                    setFormData((prev) => ({ ...prev, type: e.target.value }))
                  }
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  disabled={isSubmitting}
                >
                  {ASSIGNMENT_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignment-submission-type">
                  Submission Type
                </Label>
                <select
                  id="assignment-submission-type"
                  value={formData.submissionType}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      submissionType: e.target.value,
                    }))
                  }
                  className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                  disabled={isSubmitting}
                >
                  {SUBMISSION_TYPES.map((t) => (
                    <option key={t.value} value={t.value}>
                      {t.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="assignment-due">Due Date</Label>
                <Input
                  id="assignment-due"
                  type="datetime-local"
                  value={formData.dueDate}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      dueDate: e.target.value,
                    }))
                  }
                  disabled={isSubmitting}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="assignment-points">Points</Label>
                <Input
                  id="assignment-points"
                  type="number"
                  min="0"
                  value={formData.pointsPossible}
                  onChange={(e) =>
                    setFormData((prev) => ({
                      ...prev,
                      pointsPossible: e.target.value,
                    }))
                  }
                  disabled={isSubmitting}
                />
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                role="switch"
                aria-checked={formData.latePolicy}
                onClick={() =>
                  setFormData((prev) => ({
                    ...prev,
                    latePolicy: !prev.latePolicy,
                  }))
                }
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                  formData.latePolicy ? 'bg-primary' : 'bg-muted'
                }`}
                disabled={isSubmitting}
              >
                <span
                  className={`pointer-events-none inline-block h-4 w-4 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                    formData.latePolicy ? 'translate-x-4' : 'translate-x-0'
                  }`}
                />
              </button>
              <span className="text-sm text-muted-foreground">
                Accept late submissions
              </span>
            </div>

            {/* Reference Links */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label className="text-sm">Reference Links</Label>
                {quickLinks.length < 3 && (
                  <button
                    type="button"
                    onClick={addQuickLink}
                    className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 font-medium"
                    disabled={isSubmitting}
                  >
                    <Link2 className="h-3.5 w-3.5" />
                    Add Link
                  </button>
                )}
              </div>
              {quickLinks.length > 0 && (
                <div className="space-y-2">
                  {quickLinks.map((link) => (
                    <div key={link.id} className="flex items-start gap-2">
                      <div className="flex-1 space-y-1.5">
                        <Input
                          type="url"
                          value={link.url}
                          onChange={(e) => updateQuickLink(link.id, 'url', e.target.value)}
                          placeholder="https://..."
                          className="text-sm"
                          disabled={isSubmitting}
                        />
                        <Input
                          type="text"
                          value={link.title}
                          onChange={(e) => updateQuickLink(link.id, 'title', e.target.value)}
                          placeholder="Title (optional)"
                          className="text-sm"
                          disabled={isSubmitting}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={() => removeQuickLink(link.id)}
                        className="mt-1.5 text-red-500 hover:text-red-600"
                        disabled={isSubmitting}
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {(formData.type === 'quiz' || formData.type === 'exam') && (
              <div className="rounded-lg border border-[#FFAA00]/20 bg-[#FFAA00]/5 px-4 py-3 text-sm text-[#D97706] dark:border-[#FFAA00]/20 dark:bg-[#FFAA00]/10 dark:text-[#D97706]">
                For quiz/exam question building, use the{' '}
                <Link
                  href={`/teacher/courses/${courseId}/assignments/new`}
                  className="font-medium underline"
                >
                  Quiz/Test Builder
                </Link>{' '}
                for a full-featured question editor.
              </div>
            )}

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                className="whale-gradient text-white"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  'Create Assignment'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  )
}
