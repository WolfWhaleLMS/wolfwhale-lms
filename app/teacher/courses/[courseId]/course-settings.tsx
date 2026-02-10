'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { updateCourse, deleteCourse, generateClassCode } from '@/app/actions/courses'
import { SUBJECTS, GRADE_LEVELS, SEMESTERS } from '@/lib/config/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog'
import {
  Loader2,
  Save,
  Trash2,
  RefreshCw,
  Archive,
  Eye,
  EyeOff,
  AlertTriangle,
  Copy,
  Check,
} from 'lucide-react'
import { toast } from 'sonner'

interface CourseData {
  id: string
  name: string
  description: string | null
  subject: string | null
  grade_level: string | null
  semester: string | null
  status: string
  max_students: number | null
  created_at: string
}

interface ClassCodeData {
  code: string
  use_count: number
  max_uses: number | null
  expires_at: string | null
  is_active: boolean
}

export function CourseSettings({
  course,
  classCode,
}: {
  course: CourseData
  classCode: ClassCodeData | null
}) {
  const router = useRouter()
  const [saving, setSaving] = useState(false)
  const [deleting, setDeleting] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [generatingCode, setGeneratingCode] = useState(false)
  const [codeCopied, setCodeCopied] = useState(false)

  const [formData, setFormData] = useState({
    name: course.name,
    description: course.description || '',
    subject: course.subject || '',
    grade_level: course.grade_level || '',
    semester: course.semester || '',
    status: course.status,
  })

  async function handleSave() {
    if (!formData.name.trim()) {
      toast.error('Course name is required')
      return
    }

    setSaving(true)
    const result = await updateCourse(course.id, {
      name: formData.name.trim(),
      description: formData.description.trim() || undefined,
      subject: formData.subject || undefined,
      grade_level: formData.grade_level || undefined,
      semester: formData.semester || undefined,
      status: formData.status,
    })

    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Course updated!')
      router.refresh()
    }
    setSaving(false)
  }

  async function handleDelete() {
    setDeleting(true)
    const result = await deleteCourse(course.id)
    if (result.error) {
      toast.error(result.error)
      setDeleting(false)
    } else {
      toast.success('Course archived')
      router.push('/teacher/courses')
    }
  }

  async function handleGenerateCode() {
    setGeneratingCode(true)
    const result = await generateClassCode(course.id)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success(`New class code: ${result.code}`)
      router.refresh()
    }
    setGeneratingCode(false)
  }

  async function copyCode(code: string) {
    await navigator.clipboard.writeText(code)
    setCodeCopied(true)
    toast.success('Code copied!')
    setTimeout(() => setCodeCopied(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Edit Course Details */}
      <div className="ocean-card rounded-2xl p-6 space-y-5">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-foreground">
            Course Details
          </h2>
          <Button
            onClick={handleSave}
            disabled={saving}
            className="whale-gradient text-white"
            size="sm"
          >
            {saving ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="mr-1.5 h-4 w-4" />
                Save Changes
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">
              Course Name <span className="text-red-500">*</span>
            </Label>
            <Input
              id="edit-name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-description">Description</Label>
            <Textarea
              id="edit-description"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              rows={4}
              placeholder="What will students learn?"
            />
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="space-y-2">
              <Label>Subject</Label>
              <Select
                value={formData.subject}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, subject: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select subject" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Grade Level</Label>
              <Select
                value={formData.grade_level}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, grade_level: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select grade" />
                </SelectTrigger>
                <SelectContent>
                  {GRADE_LEVELS.map((grade) => (
                    <SelectItem key={grade} value={grade}>
                      {grade === 'K' ? 'Kindergarten' : `Grade ${grade}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Semester</Label>
              <Select
                value={formData.semester}
                onValueChange={(value) =>
                  setFormData((prev) => ({ ...prev, semester: value }))
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent>
                  {SEMESTERS.map((semester) => (
                    <SelectItem key={semester} value={semester}>
                      {semester}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {/* Course Status */}
      <div className="ocean-card rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          Course Status
        </h2>
        <div className="flex flex-wrap gap-3">
          <Button
            variant={formData.status === 'active' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setFormData((prev) => ({ ...prev, status: 'active' }))
              toast.info('Click "Save Changes" to apply')
            }}
            className={
              formData.status === 'active' ? 'bg-green-600 hover:bg-green-700' : ''
            }
          >
            <Eye className="mr-1.5 h-4 w-4" />
            Active
          </Button>
          <Button
            variant={formData.status === 'draft' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setFormData((prev) => ({ ...prev, status: 'draft' }))
              toast.info('Click "Save Changes" to apply')
            }}
            className={
              formData.status === 'draft'
                ? 'bg-amber-600 hover:bg-amber-700'
                : ''
            }
          >
            <EyeOff className="mr-1.5 h-4 w-4" />
            Draft
          </Button>
          <Button
            variant={formData.status === 'archived' ? 'default' : 'outline'}
            size="sm"
            onClick={() => {
              setFormData((prev) => ({ ...prev, status: 'archived' }))
              toast.info('Click "Save Changes" to apply')
            }}
            className={
              formData.status === 'archived'
                ? 'bg-gray-600 hover:bg-gray-700'
                : ''
            }
          >
            <Archive className="mr-1.5 h-4 w-4" />
            Archived
          </Button>
        </div>
        <p className="text-xs text-muted-foreground">
          {formData.status === 'active' &&
            'Students can see and access this course.'}
          {formData.status === 'draft' &&
            'Course is hidden from students. Only you can see it.'}
          {formData.status === 'archived' &&
            'Course is archived and read-only. Students can view past work but cannot submit new assignments.'}
        </p>
      </div>

      {/* Class Code Management */}
      <div className="ocean-card rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          Class Code
        </h2>
        {classCode ? (
          <div className="flex items-center gap-4 flex-wrap">
            <div className="rounded-xl border border-border bg-muted/30 px-5 py-3 text-center">
              <code className="text-2xl font-bold tracking-wider text-primary">
                {classCode.code}
              </code>
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyCode(classCode.code)}
              >
                {codeCopied ? (
                  <>
                    <Check className="mr-1.5 h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-1.5 h-4 w-4" />
                    Copy Code
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleGenerateCode}
                disabled={generatingCode}
              >
                {generatingCode ? (
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                ) : (
                  <RefreshCw className="mr-1.5 h-4 w-4" />
                )}
                New Code
              </Button>
            </div>
            <p className="text-xs text-muted-foreground w-full">
              Used {classCode.use_count} time
              {classCode.use_count !== 1 ? 's' : ''}
              {classCode.max_uses
                ? ` (max ${classCode.max_uses})`
                : ''}
            </p>
          </div>
        ) : (
          <div>
            <p className="text-sm text-muted-foreground mb-3">
              No active class code. Generate one for students to join.
            </p>
            <Button
              variant="outline"
              size="sm"
              onClick={handleGenerateCode}
              disabled={generatingCode}
            >
              {generatingCode ? (
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="mr-1.5 h-4 w-4" />
              )}
              Generate Class Code
            </Button>
          </div>
        )}
      </div>

      {/* Course Info (read-only) */}
      <div className="ocean-card rounded-2xl p-6 space-y-3">
        <h2 className="text-lg font-semibold text-foreground">
          Course Info
        </h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-muted-foreground">Created:</span>{' '}
            <span className="text-foreground">
              {new Date(course.created_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>
          <div>
            <span className="text-muted-foreground">Course ID:</span>{' '}
            <code className="text-xs text-foreground bg-muted px-1.5 py-0.5 rounded">
              {course.id}
            </code>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="rounded-2xl border border-red-200 bg-red-50/50 p-6 space-y-4 dark:border-red-900/50 dark:bg-red-950/20">
        <h2 className="text-lg font-semibold text-red-700 dark:text-red-400">
          Danger Zone
        </h2>
        <p className="text-sm text-red-600 dark:text-red-400/80">
          Archiving a course hides it from students. This action can be
          reversed by changing the status back to Active.
        </p>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowDeleteDialog(true)}
          className="border-red-300 text-red-700 hover:bg-red-100 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-950/50"
        >
          <Trash2 className="mr-1.5 h-4 w-4" />
          Archive Course
        </Button>
      </div>

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              Archive Course
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to archive &ldquo;{course.name}&rdquo;? Students
            will no longer be able to access course content or submit
            assignments. You can reactivate it later.
          </p>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={deleting}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={deleting}
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Archiving...
                </>
              ) : (
                'Archive Course'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
