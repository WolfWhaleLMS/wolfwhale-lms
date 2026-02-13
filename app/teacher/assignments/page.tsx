import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  ArrowLeft,
  ClipboardList,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Info,
} from 'lucide-react'
import AssignmentsListClient from './AssignmentsListClient'

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

  // Enrich assignments with display status for client component
  const enrichedAssignments = assignments.map((a) => ({
    id: a.id,
    title: a.title,
    course_id: a.course_id,
    type: a.type,
    due_date: a.due_date,
    max_points: a.max_points,
    status: a.status,
    created_at: a.created_at,
    courseName: a.courseName,
    submissionCount: a.submissionCount,
    displayStatus: getAssignmentStatus(a),
  }))

  const courseInfoList = courseList.map((c) => ({ id: c.id, name: c.name }))

  return (
    <div className="space-y-4 sm:space-y-8 overflow-x-hidden max-w-full">
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
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            All Assignments
          </h1>
          <p className="mt-1 text-muted-foreground">
            View assignments across all your courses.
          </p>
        </div>
      </div>

      {/* Hint */}
      <div className="flex items-start gap-3 rounded-xl border border-[#00BFFF]/20 bg-[#00BFFF]/5 p-4 dark:border-[#00BFFF]/20 dark:bg-[#00BFFF]/5">
        <Info className="mt-0.5 h-5 w-5 shrink-0 text-[#00BFFF] dark:text-[#00BFFF]" />
        <p className="text-sm text-[#00BFFF] dark:text-[#00BFFF]">
          To create a new assignment, navigate to a specific course and use the
          Assignments tab.
        </p>
      </div>

      {/* Summary Stats */}
      {enrichedAssignments.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-4">
          <div className="ocean-card rounded-2xl p-3 sm:p-4 text-center">
            <ClipboardList className="mx-auto mb-1 h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <p className="text-xl sm:text-2xl font-bold text-primary">{enrichedAssignments.length}</p>
            <p className="mt-1 text-xs text-muted-foreground">Total</p>
          </div>
          <div className="ocean-card rounded-2xl p-3 sm:p-4 text-center">
            <CheckCircle2 className="mx-auto mb-1 h-4 w-4 sm:h-5 sm:w-5 text-[#059669]" />
            <p className="text-xl sm:text-2xl font-bold text-[#059669] dark:text-[#059669]">
              {enrichedAssignments.filter((a) => a.displayStatus === 'published').length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Active</p>
          </div>
          <div className="ocean-card rounded-2xl p-3 sm:p-4 text-center">
            <AlertTriangle className="mx-auto mb-1 h-4 w-4 sm:h-5 sm:w-5 text-[#D97706]" />
            <p className="text-xl sm:text-2xl font-bold text-[#D97706] dark:text-[#D97706]">
              {enrichedAssignments.filter((a) => a.displayStatus === 'due_soon').length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Due Soon</p>
          </div>
          <div className="ocean-card rounded-2xl p-3 sm:p-4 text-center">
            <Clock className="mx-auto mb-1 h-4 w-4 sm:h-5 sm:w-5 text-red-500" />
            <p className="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400">
              {enrichedAssignments.filter((a) => a.displayStatus === 'past_due').length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Past Due</p>
          </div>
        </div>
      )}

      {/* Assignment List — Client Component with grouped/flat toggle */}
      <AssignmentsListClient
        assignments={enrichedAssignments}
        courses={courseInfoList}
      />
    </div>
  )
}
