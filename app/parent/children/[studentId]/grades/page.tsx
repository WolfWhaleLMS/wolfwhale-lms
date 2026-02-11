import Link from 'next/link'
import {
  ArrowLeft,
  GraduationCap,
  BookOpen,
  TrendingUp,
  AlertCircle,
  ChevronRight,
} from 'lucide-react'
import { getChildGrades, getChildProgress } from '@/app/actions/parent'

interface PageProps {
  params: Promise<{ studentId: string }>
}

function GradeColorClass(percentage: number | null): string {
  if (percentage == null) return 'text-muted-foreground'
  if (percentage >= 90) return 'text-green-600 dark:text-green-400'
  if (percentage >= 80) return 'text-blue-600 dark:text-blue-400'
  if (percentage >= 70) return 'text-amber-600 dark:text-amber-400'
  return 'text-red-600 dark:text-red-400'
}

function GradeBgClass(percentage: number | null): string {
  if (percentage == null) return 'bg-muted'
  if (percentage >= 90)
    return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
  if (percentage >= 80)
    return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
  if (percentage >= 70)
    return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
  return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
}

export default async function ChildGradesPage({ params }: PageProps) {
  const { studentId } = await params

  let courseGrades: Awaited<ReturnType<typeof getChildGrades>> = []
  let progress: Awaited<ReturnType<typeof getChildProgress>> | null = null
  let error: string | null = null

  try {
    const [gradesData, progressData] = await Promise.all([
      getChildGrades(studentId),
      getChildProgress(studentId),
    ])
    courseGrades = gradesData
    progress = progressData
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load grades'
  }

  if (error) {
    return (
      <div className="space-y-6">
        <Link
          href={`/parent/children/${studentId}`}
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Student
        </Link>
        <div className="ocean-card rounded-2xl p-12 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500/50" />
          <p className="mt-4 text-red-500">{error}</p>
        </div>
      </div>
    )
  }

  const studentName = progress?.student.fullName ?? 'Student'

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link
        href={`/parent/children/${studentId}`}
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to {studentName}
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Grades
          </h1>
          <p className="mt-1 text-muted-foreground">
            {studentName}&apos;s grade breakdown by course.
          </p>
        </div>
        {progress?.academics.overallGPA != null && (
          <div className="ocean-card rounded-2xl px-6 py-4 text-center">
            <p className="text-sm text-muted-foreground">Overall Average</p>
            <p
              className={`text-3xl font-bold ${GradeColorClass(progress.academics.overallGPA)}`}
            >
              {progress.academics.overallGPA}%
            </p>
            {progress.academics.overallLetterGrade && (
              <p className="text-sm text-muted-foreground">
                ({progress.academics.overallLetterGrade})
              </p>
            )}
          </div>
        )}
      </div>

      {/* Empty State */}
      {courseGrades.length === 0 && (
        <div className="ocean-card rounded-2xl p-12 text-center">
          <GraduationCap className="mx-auto h-16 w-16 text-muted-foreground/30" />
          <h3 className="mt-4 text-lg font-semibold text-foreground">
            No Grades Yet
          </h3>
          <p className="mt-2 text-muted-foreground">
            Grades will appear here once assignments are graded.
          </p>
        </div>
      )}

      {/* Grades by Course */}
      {courseGrades.map((course) => (
        <div key={course.courseId} className="ocean-card rounded-2xl overflow-hidden">
          {/* Course Header */}
          <div className="border-b border-border p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-3">
                <BookOpen className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-semibold text-foreground">
                  {course.courseName}
                </h2>
              </div>
              <div className="flex items-center gap-4">
                {course.averagePercentage != null && (
                  <span
                    className={`rounded-full px-4 py-1.5 text-sm font-bold ${GradeBgClass(course.averagePercentage)}`}
                  >
                    {course.averagePercentage}%{' '}
                    {course.letterGrade && `(${course.letterGrade})`}
                  </span>
                )}
              </div>
            </div>

            {/* Category Breakdown */}
            {course.categoryBreakdown.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-3">
                {course.categoryBreakdown.map((cat) => (
                  <div
                    key={cat.name}
                    className="flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-1.5"
                  >
                    <span className="text-sm font-medium text-foreground">
                      {cat.name}
                    </span>
                    <span
                      className={`text-sm font-semibold ${GradeColorClass(cat.average)}`}
                    >
                      {cat.average != null ? `${cat.average}%` : '--'}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      ({cat.count} items)
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Individual Grades Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/30">
                  <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                    Assignment
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Category
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Type
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    Score
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    Percentage
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    Grade
                  </th>
                  <th className="px-6 py-3 text-right font-medium text-muted-foreground">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody>
                {course.grades.map((grade) => (
                  <tr
                    key={grade.id}
                    className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                  >
                    <td className="px-6 py-3">
                      <p className="font-medium text-foreground">
                        {grade.assignmentTitle}
                      </p>
                      {grade.feedback && (
                        <p className="mt-1 text-xs text-muted-foreground line-clamp-1">
                          {grade.feedback}
                        </p>
                      )}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground capitalize">
                      {grade.category}
                    </td>
                    <td className="px-4 py-3 text-muted-foreground capitalize">
                      {grade.type ?? '--'}
                    </td>
                    <td className="px-4 py-3 text-right text-foreground">
                      {grade.isExcused ? (
                        <span className="text-muted-foreground italic">
                          Excused
                        </span>
                      ) : (
                        <>
                          {grade.pointsEarned ?? '--'}/{grade.maxPoints ?? '--'}
                        </>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {grade.isExcused ? (
                        <span className="text-muted-foreground">--</span>
                      ) : (
                        <span
                          className={`font-semibold ${GradeColorClass(Number(grade.percentage))}`}
                        >
                          {grade.percentage != null
                            ? `${grade.percentage}%`
                            : '--'}
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {grade.letterGrade ? (
                        <span
                          className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-bold ${GradeBgClass(Number(grade.percentage))}`}
                        >
                          {grade.letterGrade}
                        </span>
                      ) : (
                        <span className="text-muted-foreground">--</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-right text-muted-foreground">
                      {grade.gradedAt
                        ? new Date(grade.gradedAt).toLocaleDateString()
                        : '--'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}
    </div>
  )
}
