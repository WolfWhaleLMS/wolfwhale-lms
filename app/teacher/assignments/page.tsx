import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  ArrowLeft,
  ClipboardList,
  Calendar,
  Award,
  FileText,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Info,
} from 'lucide-react'

export default async function TeacherAllAssignmentsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  if (!tenantId) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground">No school context found.</p>
      </div>
    )
  }

  // Fetch all teacher's courses
  const { data: courses } = await supabase
    .from('courses')
    .select('id, name, subject')
    .eq('tenant_id', tenantId)
    .eq('created_by', user.id)
    .neq('status', 'archived')
    .order('name')

  const courseList = courses || []
  const courseIds = courseList.map((c) => c.id)
  const courseMap = new Map(courseList.map((c) => [c.id, c.name]))

  // Fetch all assignments for those courses with submission counts
  let assignments: any[] = []

  if (courseIds.length > 0) {
    const { data: assignmentData } = await supabase
      .from('assignments')
      .select(`
        id,
        title,
        course_id,
        type,
        due_date,
        max_points,
        status,
        created_at,
        submissions:submissions(count)
      `)
      .eq('tenant_id', tenantId)
      .in('course_id', courseIds)
      .order('due_date', { ascending: false, nullsFirst: false })

    assignments = (assignmentData || []).map((a) => ({
      ...a,
      courseName: courseMap.get(a.course_id) || 'Unknown Course',
      submissionCount: a.submissions?.[0]?.count ?? 0,
    }))
  }

  // Determine assignment display status
  function getAssignmentStatus(assignment: any) {
    if (assignment.status === 'draft') return 'draft'
    if (!assignment.due_date) return 'published'
    const now = new Date()
    const due = new Date(assignment.due_date)
    if (due < now) return 'past_due'
    // Due within 3 days
    const threeDays = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000)
    if (due <= threeDays) return 'due_soon'
    return 'published'
  }

  function statusBadge(status: string) {
    switch (status) {
      case 'draft':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
      case 'past_due':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      case 'due_soon':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      case 'published':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  function statusLabel(status: string) {
    switch (status) {
      case 'draft':
        return 'Draft'
      case 'past_due':
        return 'Past Due'
      case 'due_soon':
        return 'Due Soon'
      case 'published':
        return 'Active'
      default:
        return status
    }
  }

  function typeBadge(type: string) {
    switch (type) {
      case 'homework':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'quiz':
        return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400'
      case 'test':
      case 'exam':
        return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      case 'project':
        return 'bg-teal-100 text-teal-700 dark:bg-teal-900/30 dark:text-teal-400'
      case 'essay':
        return 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-400'
      default:
        return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300'
    }
  }

  function formatDate(dateStr: string | null) {
    if (!dateStr) return 'No due date'
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  return (
    <div className="space-y-8">
      {/* Back Link */}
      <Link
        href="/teacher/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            All Assignments
          </h1>
          <p className="mt-1 text-muted-foreground">
            View assignments across all your courses.
          </p>
        </div>
      </div>

      {/* Hint */}
      <div className="flex items-start gap-3 rounded-xl border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-950/20">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-blue-600 dark:text-blue-400" />
        <p className="text-sm text-blue-700 dark:text-blue-300">
          To create a new assignment, navigate to a specific course and use the
          Assignments tab.
        </p>
      </div>

      {/* Summary Stats */}
      {assignments.length > 0 && (
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="ocean-card rounded-2xl p-4 text-center">
            <ClipboardList className="mx-auto mb-1 h-5 w-5 text-primary" />
            <p className="text-2xl font-bold text-primary">{assignments.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">Total Assignments</p>
          </div>
          <div className="ocean-card rounded-2xl p-4 text-center">
            <CheckCircle2 className="mx-auto mb-1 h-5 w-5 text-green-500" />
            <p className="text-2xl font-bold text-green-600 dark:text-green-400">
              {assignments.filter((a) => getAssignmentStatus(a) === 'published').length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Active</p>
          </div>
          <div className="ocean-card rounded-2xl p-4 text-center">
            <AlertTriangle className="mx-auto mb-1 h-5 w-5 text-amber-500" />
            <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
              {assignments.filter((a) => getAssignmentStatus(a) === 'due_soon').length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Due Soon</p>
          </div>
          <div className="ocean-card rounded-2xl p-4 text-center">
            <Clock className="mx-auto mb-1 h-5 w-5 text-red-500" />
            <p className="text-2xl font-bold text-red-600 dark:text-red-400">
              {assignments.filter((a) => getAssignmentStatus(a) === 'past_due').length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Past Due</p>
          </div>
        </div>
      )}

      {/* Assignment List */}
      {assignments.length === 0 ? (
        <div className="ocean-card flex flex-col items-center justify-center rounded-2xl py-20 text-center">
          <ClipboardList className="mb-4 h-16 w-16 text-muted-foreground/40" />
          <h3 className="text-lg font-semibold text-foreground">
            No assignments yet
          </h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Create assignments from within your courses. They will appear here
            for a cross-course overview.
          </p>
          <Link
            href="/teacher/courses"
            className="whale-gradient mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
          >
            Go to Courses
          </Link>
        </div>
      ) : (
        <div className="ocean-card overflow-hidden rounded-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Assignment
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Course
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Type
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Due Date
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                    Points
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-muted-foreground">
                    Submissions
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {assignments.map((assignment) => {
                  const displayStatus = getAssignmentStatus(assignment)
                  return (
                    <tr
                      key={assignment.id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="px-4 py-3">
                        <Link
                          href={`/teacher/courses/${assignment.course_id}/assignments/${assignment.id}/submissions`}
                          className="font-medium text-foreground hover:text-primary transition-colors"
                        >
                          {assignment.title}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <Link
                          href={`/teacher/courses/${assignment.course_id}`}
                          className="text-muted-foreground hover:text-foreground transition-colors"
                        >
                          {assignment.courseName}
                        </Link>
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${typeBadge(assignment.type)}`}
                        >
                          {assignment.type || 'general'}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <Calendar className="h-3.5 w-3.5" />
                          <span className="text-xs">
                            {formatDate(assignment.due_date)}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <Award className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="font-medium text-foreground">
                            {assignment.max_points ?? 0}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                          <span className="font-medium text-foreground">
                            {assignment.submissionCount}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadge(displayStatus)}`}
                        >
                          {statusLabel(displayStatus)}
                        </span>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>

          {/* Summary footer */}
          <div className="border-t border-border bg-muted/30 px-4 py-3">
            <p className="text-sm text-muted-foreground">
              {assignments.length} assignment{assignments.length !== 1 ? 's' : ''} across{' '}
              {courseList.length} course{courseList.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
