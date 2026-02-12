'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { createLesson } from '@/app/actions/lessons'
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
import { Plus, Loader2, FolderOpen } from 'lucide-react'

interface Module {
  id: string
  title: string
}

interface LessonActionsProps {
  courseId: string
  modules?: Module[]
  defaultModuleId?: string
  /** Hide the trigger button (used when opened externally) */
  externalOpen?: boolean
  onExternalOpenChange?: (open: boolean) => void
}

export function LessonActions({
  courseId,
  modules = [],
  defaultModuleId,
  externalOpen,
  onExternalOpenChange,
}: LessonActionsProps) {
  const router = useRouter()
  const [internalOpen, setInternalOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Use external control if provided, otherwise internal
  const open = externalOpen !== undefined ? externalOpen : internalOpen
  const setOpen = onExternalOpenChange || setInternalOpen

  const initialModuleId = defaultModuleId || (modules.length > 0 ? modules[0].id : '')

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    duration_minutes: '',
    module_id: initialModuleId,
  })

  // Update module_id when defaultModuleId changes (e.g., opening from a specific module)
  useEffect(() => {
    if (defaultModuleId) {
      setFormData((prev) => ({ ...prev, module_id: defaultModuleId }))
    }
  }, [defaultModuleId])

  function resetForm() {
    setFormData({
      title: '',
      description: '',
      duration_minutes: '',
      module_id: defaultModuleId || (modules.length > 0 ? modules[0].id : ''),
    })
    setError(null)
  }

  async function handleCreateLesson(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!formData.title.trim()) {
      setError('Lesson title is required.')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await createLesson(courseId, {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
        duration_minutes: formData.duration_minutes
          ? parseInt(formData.duration_minutes, 10)
          : undefined,
        module_id: formData.module_id || undefined,
      })

      if (result.error) {
        setError(result.error)
        setIsSubmitting(false)
        return
      }

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
    <Dialog
      open={open}
      onOpenChange={(v) => {
        setOpen(v)
        if (!v) resetForm()
      }}
    >
      {/* Only render trigger if not externally controlled */}
      {externalOpen === undefined && (
        <DialogTrigger asChild>
          <Button className="whale-gradient text-white" size="sm">
            <Plus className="mr-1.5 h-4 w-4" />
            Add Lesson
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Lesson</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateLesson} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Module selector — shown when modules exist */}
          {modules.length > 0 && (
            <div className="space-y-2">
              <Label htmlFor="lesson-module">
                <span className="flex items-center gap-1.5">
                  <FolderOpen className="h-3.5 w-3.5" />
                  Module
                </span>
              </Label>
              <select
                id="lesson-module"
                value={formData.module_id}
                onChange={(e) =>
                  setFormData((prev) => ({
                    ...prev,
                    module_id: e.target.value,
                  }))
                }
                className="w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
                disabled={isSubmitting}
              >
                <option value="">No module (uncategorized)</option>
                {modules.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.title}
                  </option>
                ))}
              </select>
              {formData.module_id && (
                <p className="text-xs text-muted-foreground">
                  This lesson will be added inside the selected module.
                </p>
              )}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="lesson-title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="lesson-title"
              placeholder="e.g., Introduction to Fractions"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              disabled={isSubmitting}
              autoFocus
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="lesson-description">Description</Label>
            <Textarea
              id="lesson-description"
              placeholder="Brief overview of this lesson..."
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

          <div className="space-y-2">
            <Label htmlFor="lesson-duration">
              Estimated Duration (minutes)
            </Label>
            <Input
              id="lesson-duration"
              type="number"
              min="1"
              max="300"
              placeholder="e.g., 45"
              value={formData.duration_minutes}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  duration_minutes: e.target.value,
                }))
              }
              disabled={isSubmitting}
            />
          </div>

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
                'Create Lesson'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
