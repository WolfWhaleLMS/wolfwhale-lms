import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Clock, CheckCircle, AlertCircle, ListTodo } from 'lucide-react'
import { AssignmentsClient } from './AssignmentsClient'

interface StudentAssignment {
  id: string
  title: string
  description: string | null
  type: string
  due_date: string | null
  max_points: number
  submission_type: string
  course_id: string
  courseName: string
  submissionStatus: string
  submittedAt: string | null
  grade: {
    points_earned: number
    percentage: number
    feedback: string | null
  } | null
}

export default async function StudentAssignmentsPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  let assignments: StudentAssignment[] = []
  let error: string | null = null

  if (tenantId) {
    // Get enrolled courses
    const { data: enrollments } = await supabase
      .from('course_enrollments')
      .select('course_id, courses:courses(id, name)')
      .eq('student_id', user.id)

    if (enrollments && enrollments.length > 0) {
      const courseIds = enrollments.map((e) => e.course_id)
      const courseMap: Record<string, string> = {}
      for (const e of enrollments) {
        const course = e.courses as unknown as { id: string; name: string }
        if (course) {
          courseMap[course.id] = course.name
        }
      }

      // Get assignments for enrolled courses
      const { data: assignmentsData, error: assignmentsError } = await supabase
        .from('assignments')
        .select('*')
        .in('course_id', courseIds)
        .eq('status', 'assigned')
        .eq('tenant_id', tenantId)
        .order('due_date', { ascending: true })

      if (assignmentsError) {
        error = 'Failed to fetch assignments'
      } else if (assignmentsData && assignmentsData.length > 0) {
        const assignmentIds = assignmentsData.map((a) => a.id)

        // Fetch submissions and grades in parallel
        const [{ data: submissions }, { data: grades }] = await Promise.all([
          supabase
            .from('submissions')
            .select('assignment_id, status, submitted_at')
            .eq('student_id', user.id)
            .in('assignment_id', assignmentIds),
          supabase
            .from('grades')
            .select('assignment_id, points_earned, percentage, feedback')
            .eq('student_id', user.id)
            .in('assignment_id', assignmentIds),
        ])

        const submissionMap: Record<string, { status: string; submitted_at: string }> = {}
        const gradeMap: Record<string, { points_earned: number; percentage: number; feedback: string | null }> = {}

        if (submissions) {
          for (const s of submissions) {
            submissionMap[s.assignment_id] = {
              status: s.status,
              submitted_at: s.submitted_at,
            }
          }
        }

        if (grades) {
          for (const g of grades) {
            gradeMap[g.assignment_id] = {
              points_earned: g.points_earned,
              percentage: g.percentage,
              feedback: g.feedback,
            }
          }
        }

        assignments = assignmentsData.map((a) => {
          const submission = submissionMap[a.id]
          const grade = gradeMap[a.id]
          let displayStatus = 'pending'

          if (submission?.status === 'returned') {
            displayStatus = 'returned'
          } else if (grade) {
            displayStatus = 'graded'
          } else if (submission) {
            displayStatus = submission.status === 'submitted' ? 'submitted' : submission.status
          } else if (a.due_date && new Date(a.due_date) < new Date()) {
            displayStatus = 'overdue'
          }

          return {
            id: a.id,
            title: a.title,
            description: a.description,
            type: a.type,
            due_date: a.due_date,
            max_points: a.max_points,
            submission_type: a.submission_type,
            course_id: a.course_id,
            courseName: courseMap[a.course_id] || 'Unknown Course',
            submissionStatus: displayStatus,
            submittedAt: submission?.submitted_at || null,
            grade: grade || null,
          }
        })
      }
    }
  }

  const totalAssignments = assignments.length
  const completedCount = assignments.filter(a => a.submissionStatus === 'graded').length
  const pendingCount = assignments.filter(a => a.submissionStatus === 'pending').length
  const overdueCount = assignments.filter(a => a.submissionStatus === 'overdue').length

  return (
    <div className="space-y-8">
      {/* Visual Header with Whale Gradient */}
      <div className="whale-gradient rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <ListTodo className="h-8 w-8" />
          <h1 className="text-3xl font-bold tracking-tight">My Assignments</h1>
        </div>
        <p className="text-white/90">
          View and submit assignments across all your courses.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-base text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Enhanced Stats Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="ocean-card group rounded-2xl p-5 text-center transition-all hover:scale-105 hover:shadow-lg">
          <div className="mb-2 flex items-center justify-center">
            <ListTodo className="h-6 w-6 text-primary" />
          </div>
          <p className="text-3xl font-bold text-primary">{totalAssignments}</p>
          <p className="mt-1 text-sm font-medium text-muted-foreground">Total Assignments</p>
        </div>
        <div className="ocean-card group rounded-2xl p-5 text-center transition-all hover:scale-105 hover:shadow-lg">
          <div className="mb-2 flex items-center justify-center">
            <CheckCircle className="h-6 w-6 text-[#059669] dark:text-[#059669]" />
          </div>
          <p className="text-3xl font-bold text-[#059669] dark:text-[#059669]">{completedCount}</p>
          <p className="mt-1 text-sm font-medium text-muted-foreground">Completed</p>
        </div>
        <div className="ocean-card group rounded-2xl p-5 text-center transition-all hover:scale-105 hover:shadow-lg">
          <div className="mb-2 flex items-center justify-center">
            <Clock className="h-6 w-6 text-[#00BFFF] dark:text-[#00BFFF]" />
          </div>
          <p className="text-3xl font-bold text-[#00BFFF] dark:text-[#00BFFF]">{pendingCount}</p>
          <p className="mt-1 text-sm font-medium text-muted-foreground">Pending</p>
        </div>
        <div className={`ocean-card group rounded-2xl p-5 text-center transition-all hover:scale-105 ${
          overdueCount > 0 ? 'ring-2 ring-red-500/50 glow-animate' : ''
        }`}>
          <div className="mb-2 flex items-center justify-center">
            <AlertCircle className={`h-6 w-6 ${overdueCount > 0 ? 'text-red-600 dark:text-red-400 animate-pulse' : 'text-red-600/50 dark:text-red-400/50'}`} />
          </div>
          <p className={`text-3xl font-bold ${overdueCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-red-600/50 dark:text-red-400/50'}`}>{overdueCount}</p>
          <p className="mt-1 text-sm font-medium text-muted-foreground">Overdue</p>
        </div>
      </div>

      <AssignmentsClient assignments={assignments} />
    </div>
  )
}
