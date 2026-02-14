import {
  BookOpen,
  AlertCircle,
  Calendar,
  GraduationCap,
} from 'lucide-react'
import { BackToHubButton } from '@/components/hub/BackToHubButton'
import { getChildAssignments, getChildProgress } from '@/app/actions/parent'

interface PageProps {
  params: Promise<{ studentId: string }>
}

const STATUS_CONFIG = {
  upcoming: {
    label: 'Upcoming',
    bgClass: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
    dotClass: 'bg-blue-500',
  },
  submitted: {
    label: 'Submitted',
    bgClass: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
    dotClass: 'bg-green-500',
  },
  missing: {
    label: 'Missing',
    bgClass: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400',
    dotClass: 'bg-red-500',
  },
  graded: {
    label: 'Graded',
    bgClass: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
    dotClass: 'bg-purple-500',
  },
  late: {
    label: 'Late',
    bgClass: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
    dotClass: 'bg-amber-500',
  },
} as const

export default async function ChildAssignmentsPage({ params }: PageProps) {
  const { studentId } = await params

  let assignments: Awaited<ReturnType<typeof getChildAssignments>> = []
  let progress: Awaited<ReturnType<typeof getChildProgress>> | null = null
  let error: string | null = null

  try {
    const [assignmentsData, progressData] = await Promise.all([
      getChildAssignments(studentId),
      getChildProgress(studentId),
    ])
    assignments = assignmentsData
    progress = progressData
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load assignments'
  }

  if (error) {
    return (
      <div className="space-y-6">
        <BackToHubButton role="parent" />
        <div className="ocean-card rounded-2xl p-12 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500/50" />
          <p className="mt-4 text-red-500">{error}</p>
        </div>
      </div>
    )
  }

  const studentName = progress?.student.fullName ?? 'Student'

  // Group assignments by status
  const upcoming = assignments.filter((a) => a.status === 'upcoming')
  const missing = assignments.filter((a) => a.status === 'missing')
  const submitted = assignments.filter(
    (a) => a.status === 'submitted' || a.status === 'late'
  )
  const graded = assignments.filter((a) => a.status === 'graded')

  // Status summary counts
  const statusCounts = {
    upcoming: upcoming.length,
    missing: missing.length,
    submitted: submitted.length,
    graded: graded.length,
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <BackToHubButton role="parent" />

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Assignments
        </h1>
        <p className="mt-1 text-muted-foreground">
          {studentName}&apos;s assignments across all courses.
        </p>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="ocean-card rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-blue-500">
            {statusCounts.upcoming}
          </p>
          <p className="text-sm text-muted-foreground">Upcoming</p>
        </div>
        <div className="ocean-card rounded-2xl p-4 text-center">
          <p
            className={`text-2xl font-bold ${statusCounts.missing > 0 ? 'text-red-500' : 'text-foreground'}`}
          >
            {statusCounts.missing}
          </p>
          <p className="text-sm text-muted-foreground">Missing</p>
        </div>
        <div className="ocean-card rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-green-500">
            {statusCounts.submitted}
          </p>
          <p className="text-sm text-muted-foreground">Submitted</p>
        </div>
        <div className="ocean-card rounded-2xl p-4 text-center">
          <p className="text-2xl font-bold text-purple-500">
            {statusCounts.graded}
          </p>
          <p className="text-sm text-muted-foreground">Graded</p>
        </div>
      </div>

      {/* Empty State */}
      {assignments.length === 0 && (
        <div className="ocean-card rounded-2xl p-12 text-center">
          <BookOpen className="mx-auto h-16 w-16 text-muted-foreground/30" />
          <h3 className="mt-4 text-lg font-semibold text-foreground">
            No Assignments
          </h3>
          <p className="mt-2 text-muted-foreground">
            No assignments found for this student.
          </p>
        </div>
      )}

      {/* Missing / Past Due Section */}
      {missing.length > 0 && (
        <div className="ocean-card rounded-2xl overflow-hidden">
          <div className="border-b border-red-200 bg-red-50 p-6 dark:border-red-900 dark:bg-red-950/20">
            <div className="flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <h2 className="text-lg font-semibold text-red-700 dark:text-red-400">
                Past Due ({missing.length})
              </h2>
            </div>
          </div>
          <div className="divide-y divide-border">
            {missing.map((assignment) => (
              <AssignmentRow key={assignment.id} assignment={assignment} />
            ))}
          </div>
        </div>
      )}

      {/* Upcoming Section */}
      {upcoming.length > 0 && (
        <div className="ocean-card rounded-2xl overflow-hidden">
          <div className="border-b border-border p-6">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-blue-500" />
              <h2 className="text-lg font-semibold text-foreground">
                Upcoming ({upcoming.length})
              </h2>
            </div>
          </div>
          <div className="divide-y divide-border">
            {upcoming.map((assignment) => (
              <AssignmentRow key={assignment.id} assignment={assignment} />
            ))}
          </div>
        </div>
      )}

      {/* Submitted Section */}
      {submitted.length > 0 && (
        <div className="ocean-card rounded-2xl overflow-hidden">
          <div className="border-b border-border p-6">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-green-500" />
              <h2 className="text-lg font-semibold text-foreground">
                Submitted ({submitted.length})
              </h2>
            </div>
          </div>
          <div className="divide-y divide-border">
            {submitted.map((assignment) => (
              <AssignmentRow key={assignment.id} assignment={assignment} />
            ))}
          </div>
        </div>
      )}

      {/* Graded Section */}
      {graded.length > 0 && (
        <div className="ocean-card rounded-2xl overflow-hidden">
          <div className="border-b border-border p-6">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-purple-500" />
              <h2 className="text-lg font-semibold text-foreground">
                Graded ({graded.length})
              </h2>
            </div>
          </div>
          <div className="divide-y divide-border">
            {graded.map((assignment) => (
              <AssignmentRow key={assignment.id} assignment={assignment} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

function AssignmentRow({
  assignment,
}: {
  assignment: Awaited<ReturnType<typeof getChildAssignments>>[number]
}) {
  const config = STATUS_CONFIG[assignment.status]
  const dueDate = new Date(assignment.dueDate)
  const now = new Date()
  const daysUntilDue = Math.ceil(
    (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
  )

  return (
    <div className="flex items-center gap-4 p-5 hover:bg-muted/20 transition-colors">
      {/* Status Dot */}
      <div className={`h-3 w-3 rounded-full shrink-0 ${config.dotClass}`} />

      {/* Assignment Info */}
      <div className="flex-1 min-w-0">
        <p className="font-medium text-foreground truncate">
          {assignment.title}
        </p>
        <div className="mt-1 flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>{assignment.courseName}</span>
          {assignment.category && (
            <>
              <span className="text-muted-foreground/40">|</span>
              <span className="capitalize">{assignment.category}</span>
            </>
          )}
          {assignment.type && (
            <>
              <span className="text-muted-foreground/40">|</span>
              <span className="capitalize">{assignment.type}</span>
            </>
          )}
        </div>
      </div>

      {/* Due Date */}
      <div className="hidden shrink-0 text-right sm:block">
        <p className="text-sm text-muted-foreground">
          {dueDate.toLocaleDateString(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          })}
        </p>
        {assignment.status === 'upcoming' && daysUntilDue >= 0 && (
          <p
            className={`text-xs ${
              daysUntilDue <= 1
                ? 'text-red-500'
                : daysUntilDue <= 3
                  ? 'text-amber-500'
                  : 'text-muted-foreground'
            }`}
          >
            {daysUntilDue === 0
              ? 'Due today'
              : daysUntilDue === 1
                ? 'Due tomorrow'
                : `${daysUntilDue} days left`}
          </p>
        )}
        {assignment.status === 'missing' && (
          <p className="text-xs text-red-500">
            {Math.abs(daysUntilDue)} day{Math.abs(daysUntilDue) !== 1 ? 's' : ''}{' '}
            overdue
          </p>
        )}
      </div>

      {/* Grade or Status Badge */}
      <div className="shrink-0">
        {assignment.grade ? (
          <span
            className={`rounded-full px-3 py-1 text-sm font-bold ${
              Number(assignment.grade.percentage) >= 90
                ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                : Number(assignment.grade.percentage) >= 80
                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                  : Number(assignment.grade.percentage) >= 70
                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                    : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
            }`}
          >
            {assignment.grade.percentage}%
          </span>
        ) : (
          <span
            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${config.bgClass}`}
          >
            {config.label}
          </span>
        )}
      </div>
    </div>
  )
}
