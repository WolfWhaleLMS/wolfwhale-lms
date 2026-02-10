'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createCourse } from '@/app/actions/courses'
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
import { ArrowLeft, Loader2 } from 'lucide-react'

export default function NewCoursePage() {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    subject: '',
    grade_level: '',
    semester: '',
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!formData.name.trim()) {
      setError('Course name is required.')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await createCourse({
        name: formData.name.trim(),
        description: formData.description.trim() || undefined,
        subject: formData.subject || undefined,
        grade_level: formData.grade_level || undefined,
        semester: formData.semester || undefined,
      })

      if (result.error) {
        setError(result.error)
        setIsSubmitting(false)
        return
      }

      if (result.success && result.courseId) {
        router.push(`/teacher/courses/${result.courseId}`)
      }
    } catch (err) {
      setError('An unexpected error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      {/* Header */}
      <div>
        <Link
          href="/teacher/courses"
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Courses
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create New Course
        </h1>
        <p className="mt-1 text-muted-foreground">
          Set up a new course for your students. You can add lessons after
          creating the course.
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="ocean-card space-y-6 rounded-2xl p-6">
        {error && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400">
            {error}
          </div>
        )}

        {/* Course Name */}
        <div className="space-y-2">
          <Label htmlFor="name">
            Course Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="name"
            placeholder="e.g., Grade 8 Mathematics"
            value={formData.name}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, name: e.target.value }))
            }
            disabled={isSubmitting}
          />
        </div>

        {/* Description */}
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            placeholder="Describe what students will learn in this course..."
            value={formData.description}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, description: e.target.value }))
            }
            rows={4}
            disabled={isSubmitting}
          />
        </div>

        {/* Subject */}
        <div className="space-y-2">
          <Label>Subject</Label>
          <Select
            value={formData.subject}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, subject: value }))
            }
            disabled={isSubmitting}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a subject" />
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

        {/* Grade Level */}
        <div className="space-y-2">
          <Label>Grade Level</Label>
          <Select
            value={formData.grade_level}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, grade_level: value }))
            }
            disabled={isSubmitting}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a grade level" />
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

        {/* Semester */}
        <div className="space-y-2">
          <Label>Semester</Label>
          <Select
            value={formData.semester}
            onValueChange={(value) =>
              setFormData((prev) => ({ ...prev, semester: value }))
            }
            disabled={isSubmitting}
          >
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select a semester" />
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

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 border-t border-border pt-6">
          <Link href="/teacher/courses">
            <Button type="button" variant="outline" disabled={isSubmitting}>
              Cancel
            </Button>
          </Link>
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
              'Create Course'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
