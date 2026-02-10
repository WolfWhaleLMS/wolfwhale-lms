'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { deleteAssignment } from '@/app/actions/assignments'
import { ASSIGNMENT_TYPES } from '@/lib/config/constants'
import { Button } from '@/components/ui/button'
import {
  ClipboardList,
  Eye,
  Trash2,
  Calendar,
  Award,
  Users,
  FileText,
  ExternalLink,
  Paperclip,
} from 'lucide-react'
import { toast } from 'sonner'

interface Assignment {
  id: string
  title: string
  type: string
  due_date: string | null
  max_points: number
  status: string
  submission_type: string
  created_at: string
  submissionCount: number
  averageScore: number | null
  gradedCount: number
  attachments?: string | unknown[] | null
}

function getAttachmentCount(attachments: Assignment['attachments']): number {
  if (!attachments) return 0
  try {
    if (typeof attachments === 'string') {
      const parsed = JSON.parse(attachments)
      return Array.isArray(parsed) ? parsed.length : 0
    }
    if (Array.isArray(attachments)) {
      return attachments.length
    }
  } catch {
    // Ignore parse errors
  }
  return 0
}

function TypeBadge({ type }: { type: string }) {
  const typeConfig = ASSIGNMENT_TYPES.find((t) => t.value === type)
  const label = typeConfig?.label || type

  const colorMap: Record<string, string> = {
    homework:
      'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300',
    quiz: 'bg-purple-100 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300',
    project:
      'bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-300',
    exam: 'bg-red-100 text-red-700 dark:bg-red-950/40 dark:text-red-300',
    discussion:
      'bg-amber-100 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300',
    presentation:
      'bg-pink-100 text-pink-700 dark:bg-pink-950/40 dark:text-pink-300',
    other:
      'bg-gray-100 text-gray-700 dark:bg-gray-950/40 dark:text-gray-300',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colorMap[type] || colorMap.other}`}
    >
      {label}
    </span>
  )
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return 'No due date'
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function isPastDue(dateStr: string | null) {
  if (!dateStr) return false
  return new Date(dateStr) < new Date()
}

export function AssignmentList({
  courseId,
  assignments: initialAssignments,
}: {
  courseId: string
  assignments: Assignment[]
}) {
  const router = useRouter()
  const [assignments, setAssignments] = useState(initialAssignments)
  const [deleting, setDeleting] = useState<string | null>(null)

  async function handleDelete(assignmentId: string) {
    if (
      !confirm(
        'Are you sure you want to delete this assignment? This will also delete all submissions and grades.'
      )
    ) {
      return
    }
    setDeleting(assignmentId)
    const result = await deleteAssignment(assignmentId)
    if (result.error) {
      toast.error(result.error)
    } else {
      setAssignments((prev) => prev.filter((a) => a.id !== assignmentId))
      toast.success('Assignment deleted')
      router.refresh()
    }
    setDeleting(null)
  }

  if (assignments.length === 0) {
    return (
      <div className="ocean-card flex flex-col items-center justify-center rounded-2xl py-16 text-center">
        <ClipboardList className="mb-3 h-12 w-12 text-muted-foreground/40" />
        <h3 className="text-lg font-semibold text-foreground">
          No assignments yet
        </h3>
        <p className="mt-1 max-w-sm text-sm text-muted-foreground">
          Create your first assignment using the buttons above. Use &quot;Add
          Assignment&quot; for quick creation or &quot;Quiz/Test Builder&quot;
          for interactive quizzes.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {assignments.map((assignment) => (
        <div
          key={assignment.id}
          className="ocean-card rounded-xl p-4 transition-shadow hover:shadow-md"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="font-semibold text-foreground truncate">
                  {assignment.title}
                </h3>
                <TypeBadge type={assignment.type} />
                {assignment.status === 'draft' && (
                  <span className="inline-flex items-center rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-400">
                    Draft
                  </span>
                )}
                {getAttachmentCount(assignment.attachments) > 0 && (
                  <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-2 py-0.5 text-xs font-medium text-blue-600 dark:bg-blue-950/40 dark:text-blue-300">
                    <Paperclip className="h-3 w-3" />
                    {getAttachmentCount(assignment.attachments)}
                  </span>
                )}
              </div>

              <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                <span
                  className={`flex items-center gap-1 ${isPastDue(assignment.due_date) ? 'text-red-500' : ''}`}
                >
                  <Calendar className="h-3.5 w-3.5" />
                  {formatDate(assignment.due_date)}
                </span>
                <span className="flex items-center gap-1">
                  <Award className="h-3.5 w-3.5" />
                  {assignment.max_points} pts
                </span>
                <span className="flex items-center gap-1">
                  <Users className="h-3.5 w-3.5" />
                  {assignment.submissionCount} submission
                  {assignment.submissionCount !== 1 ? 's' : ''}
                </span>
                {assignment.averageScore !== null && (
                  <span className="flex items-center gap-1">
                    <FileText className="h-3.5 w-3.5" />
                    Avg: {assignment.averageScore}%
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <Link
                href={`/teacher/courses/${courseId}/assignments/${assignment.id}/submissions`}
              >
                <Button variant="outline" size="sm" className="gap-1.5">
                  <Eye className="h-3.5 w-3.5" />
                  Submissions
                </Button>
              </Link>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(assignment.id)}
                disabled={deleting === assignment.id}
                className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          </div>
        </div>
      ))}

      <div className="pt-2">
        <Link href={`/teacher/courses/${courseId}/assignments`}>
          <Button variant="ghost" size="sm" className="gap-1.5 text-muted-foreground">
            <ExternalLink className="h-3.5 w-3.5" />
            View All in Full Page
          </Button>
        </Link>
      </div>
    </div>
  )
}
