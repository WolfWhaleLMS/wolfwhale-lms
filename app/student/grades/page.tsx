'use client'

import { useEffect, useState } from 'react'
import { getStudentGrades } from '@/app/actions/grades'
import { ASSIGNMENT_TYPES } from '@/lib/config/constants'

interface CourseGrade {
  courseId: string
  courseTitle: string
  totalScore: number
  totalMaxScore: number
  percentage: number
  letterGrade: string
  grades: unknown[]
}

interface GradeEntry {
  id: string
  score: number
  max_score: number
  letter_grade: string
  feedback: string | null
  graded_at: string
  courseTitle: string
  assignmentTitle: string
  assignmentType: string
}

function gradeColorClass(percentage: number): string {
  if (percentage >= 90) return 'text-green-600 dark:text-green-400'
  if (percentage >= 80) return 'text-blue-600 dark:text-blue-400'
  if (percentage >= 70) return 'text-amber-600 dark:text-amber-400'
  if (percentage >= 60) return 'text-orange-600 dark:text-orange-400'
  return 'text-red-600 dark:text-red-400'
}

function gradeBarColor(percentage: number): string {
  if (percentage >= 90) return 'bg-green-500'
  if (percentage >= 80) return 'bg-blue-500'
  if (percentage >= 70) return 'bg-amber-500'
  if (percentage >= 60) return 'bg-orange-500'
  return 'bg-red-500'
}

function TypeBadge({ type }: { type: string }) {
  const typeConfig = ASSIGNMENT_TYPES.find((t) => t.value === type)
  return (
    <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
      {typeConfig?.label || type}
    </span>
  )
}

export default function StudentGradesPage() {
  const [courseGrades, setCourseGrades] = useState<CourseGrade[]>([])
  const [recentGrades, setRecentGrades] = useState<GradeEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [expandedCourse, setExpandedCourse] = useState<string | null>(null)

  useEffect(() => {
    loadGrades()
  }, [])

  async function loadGrades() {
    setLoading(true)
    const result = await getStudentGrades()
    if (result.error) {
      setError(result.error)
    } else {
      setCourseGrades((result.courseGrades as CourseGrade[]) || [])
      setRecentGrades((result.data as GradeEntry[]) || [])
    }
    setLoading(false)
  }

  // Calculate overall GPA
  const overallPercentage =
    courseGrades.length > 0
      ? courseGrades.reduce((sum, c) => sum + c.percentage, 0) / courseGrades.length
      : 0

  if (loading) {
    return (
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Grades</h1>
          <p className="mt-1 text-muted-foreground">Loading your grades...</p>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="ocean-card animate-pulse rounded-2xl p-6">
              <div className="h-6 w-48 rounded bg-muted" />
              <div className="mt-4 h-3 w-full rounded bg-muted" />
            </div>
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">My Grades</h1>
        <p className="mt-1 text-muted-foreground">
          View your grades and performance across all courses.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Overall Summary */}
      {courseGrades.length > 0 && (
        <div className="ocean-card rounded-2xl p-6">
          <h2 className="text-lg font-semibold text-foreground">Overall Performance</h2>
          <div className="mt-4 flex items-center gap-8">
            <div className="text-center">
              <p className={`text-5xl font-bold ${gradeColorClass(overallPercentage)}`}>
                {Math.round(overallPercentage)}%
              </p>
              <p className="mt-1 text-sm text-muted-foreground">Average</p>
            </div>
            <div className="flex-1">
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{courseGrades.length}</p>
                  <p className="text-xs text-muted-foreground">Courses</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-foreground">{recentGrades.length}</p>
                  <p className="text-xs text-muted-foreground">Graded</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                    {recentGrades.filter((g) => (g.score / g.max_score) * 100 >= 90).length}
                  </p>
                  <p className="text-xs text-muted-foreground">A Grades</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-primary">
                    {recentGrades.length > 0
                      ? Math.round(
                          recentGrades.reduce((s, g) => s + g.score, 0) /
                            recentGrades.reduce((s, g) => s + g.max_score, 0) * 100
                        )
                      : 0}%
                  </p>
                  <p className="text-xs text-muted-foreground">Total Score</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Course Grades */}
      {courseGrades.length === 0 ? (
        <div className="ocean-card flex flex-col items-center justify-center rounded-2xl py-16 text-center">
          <div className="mb-3 text-5xl opacity-40">📊</div>
          <p className="text-lg font-medium text-foreground">No grades yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Your grades will appear here once your teachers have graded your work.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Course Grades</h2>
          {courseGrades.map((course) => (
            <div key={course.courseId} className="ocean-card overflow-hidden rounded-2xl">
              <button
                onClick={() =>
                  setExpandedCourse(
                    expandedCourse === course.courseId ? null : course.courseId
                  )
                }
                className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-muted/30"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-foreground">{course.courseTitle}</h3>
                  <div className="mt-2 flex items-center gap-3">
                    <div className="flex-1">
                      <div className="h-2.5 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className={`h-full rounded-full transition-all duration-500 ${gradeBarColor(course.percentage)}`}
                          style={{ width: `${Math.min(course.percentage, 100)}%` }}
                        />
                      </div>
                    </div>
                    <span className="text-sm text-muted-foreground">
                      {course.percentage}%
                    </span>
                  </div>
                </div>
                <div className="ml-6 flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                    <span className={`text-lg font-bold ${gradeColorClass(course.percentage)}`}>
                      {course.letterGrade}
                    </span>
                  </div>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-5 w-5 text-muted-foreground transition-transform ${
                      expandedCourse === course.courseId ? 'rotate-180' : ''
                    }`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </div>
              </button>

              {/* Expanded: Grade breakdown */}
              {expandedCourse === course.courseId && (
                <div className="border-t border-border">
                  <div className="divide-y divide-border">
                    {recentGrades
                      .filter((g) => g.courseTitle === course.courseTitle)
                      .map((grade) => {
                        const pct = grade.max_score > 0 ? (grade.score / grade.max_score) * 100 : 0
                        return (
                          <div
                            key={grade.id}
                            className="flex items-center justify-between px-5 py-3"
                          >
                            <div className="flex items-center gap-3">
                              <TypeBadge type={grade.assignmentType} />
                              <div>
                                <p className="text-sm font-medium text-foreground">
                                  {grade.assignmentTitle}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                  Graded{' '}
                                  {new Date(grade.graded_at).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                  })}
                                </p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className={`font-medium ${gradeColorClass(pct)}`}>
                                {grade.score}/{grade.max_score}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {Math.round(pct)}% - {grade.letter_grade}
                              </p>
                            </div>
                          </div>
                        )
                      })}
                  </div>

                  {/* Category summary */}
                  <div className="border-t border-border bg-muted/20 px-5 py-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="font-medium text-foreground">Course Total</span>
                      <span className={`font-bold ${gradeColorClass(course.percentage)}`}>
                        {course.totalScore}/{course.totalMaxScore} ({course.percentage}%)
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Recent Grades */}
      {recentGrades.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold text-foreground">Recent Grades</h2>
          <div className="ocean-card overflow-hidden rounded-2xl">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Assignment
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Course
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    Score
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    Grade
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    Date
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {recentGrades.slice(0, 20).map((grade) => {
                  const pct =
                    grade.max_score > 0 ? (grade.score / grade.max_score) * 100 : 0
                  return (
                    <tr key={grade.id} className="transition-colors hover:bg-muted/20">
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <TypeBadge type={grade.assignmentType} />
                          <span className="font-medium text-foreground">
                            {grade.assignmentTitle}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {grade.courseTitle}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-medium ${gradeColorClass(pct)}`}>
                          {grade.score}/{grade.max_score}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <span className={`font-bold ${gradeColorClass(pct)}`}>
                          {grade.letter_grade}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-right text-muted-foreground">
                        {new Date(grade.graded_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  )
}
