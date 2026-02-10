'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createModule } from '@/app/actions/modules'
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
import { FolderPlus, Loader2 } from 'lucide-react'

export function ModuleActions({ courseId }: { courseId: string }) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: '',
    description: '',
  })

  async function handleCreateModule(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!formData.title.trim()) {
      setError('Module title is required.')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await createModule(courseId, {
        title: formData.title.trim(),
        description: formData.description.trim() || undefined,
      })

      if (result.error) {
        setError(result.error)
        setIsSubmitting(false)
        return
      }

      setFormData({ title: '', description: '' })
      setOpen(false)
      setIsSubmitting(false)
      router.refresh()
    } catch {
      setError('An unexpected error occurred.')
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FolderPlus className="mr-1.5 h-4 w-4" />
          Create Module
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create New Module</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleCreateModule} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="module-title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="module-title"
              placeholder="e.g., Unit 1: Introduction to Algebra"
              value={formData.title}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, title: e.target.value }))
              }
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="module-description">Description</Label>
            <Textarea
              id="module-description"
              placeholder="Brief overview of this module..."
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
                'Create Module'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
