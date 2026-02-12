'use client'

import { useEffect, useState } from 'react'
import { getStudentGrades } from '@/app/actions/grades'
import { ASSIGNMENT_TYPES } from '@/lib/config/constants'
import { TrendingUp, TrendingDown, Minus, Award, BarChart3 } from 'lucide-react'

interface CourseGrade {
  courseId: string
  courseTitle: string
  totalPointsEarned: number
  totalPercentage: number
  percentage: number
  letterGrade: string
  grades: unknown[]
}

interface GradeEntry {
  id: string
  points_earned: number
  percentage: number
  letter_grade: string
  feedback: string | null
  graded_at: string
  courseTitle: string
  assignmentTitle: string
  assignmentType: string
}

function gradeColorClass(percentage: number): string {
  if (percentage >= 90) return 'text-[#059669] dark:text-[#34D399]'
  if (percentage >= 80) return 'text-[#0284C7] dark:text-[#7DD3FC]'
  if (percentage >= 70) return 'text-[#D97706] dark:text-[#FBBF24]'
  if (percentage >= 60) return 'text-[#D97706] dark:text-[#FBBF24]'
  return 'text-red-600 dark:text-red-400'
}

function gradeBarColor(percentage: number): string {
  if (percentage >= 90) return 'bg-[#059669]'
  if (percentage >= 80) return 'bg-[#0284C7]'
  if (percentage >= 70) return 'bg-[#D97706]'
  if (percentage >= 60) return 'bg-[#D97706]'
  return 'bg-red-500'
}

function TypeBadge({ type }: { type: string }) {
  const typeConfig = ASSIGNMENT_TYPES.find((t) => t.value === type)
  return (
    <span className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-sm font-medium text-muted-foreground">
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

  // Calculate GPA on 4.0 scale
  const gpa = courseGrades.length > 0
    ? courseGrades.reduce((sum, c) => {
        const letterToGPA: Record<string, number> = {
          'A+': 4.0, 'A': 4.0, 'A-': 3.7,
          'B+': 3.3, 'B': 3.0, 'B-': 2.7,
          'C+': 2.3, 'C': 2.0, 'C-': 1.7,
          'D+': 1.3, 'D': 1.0, 'D-': 0.7,
          'F': 0.0
        }
        return sum + (letterToGPA[c.letterGrade] || 0)
      }, 0) / courseGrades.length
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
      {/* Visual Header with Whale Gradient */}
      <div className="whale-gradient rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <BarChart3 className="h-8 w-8" />
          <h1 className="text-3xl font-bold tracking-tight">My Grades</h1>
        </div>
        <p className="text-white/90">
          View your grades and performance across all courses.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-base text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Overall Summary with Circular GPA Gauge */}
      {courseGrades.length > 0 && (
        <div className="ocean-card rounded-2xl p-6">
          <div className="mb-4 flex items-center gap-2">
            <Award className="h-6 w-6 text-primary" />
            <h2 className="text-xl font-semibold text-foreground">Overall Performance</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-2">
            {/* Circular GPA Gauge */}
            <div className="flex items-center justify-center">
              <div className="relative h-48 w-48">
                {/* Background Circle */}
                <svg className="h-48 w-48 -rotate-90 transform">
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    className="text-muted"
                  />
                  {/* Progress Circle */}
                  <circle
                    cx="96"
                    cy="96"
                    r="80"
                    stroke="currentColor"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${(gpa / 4.0) * 502.4} 502.4`}
                    className={`transition-all duration-1000 ${
                      gpa >= 3.5 ? 'text-[#059669]' :
                      gpa >= 3.0 ? 'text-[#0284C7]' :
                      gpa >= 2.5 ? 'text-[#D97706]' :
                      gpa >= 2.0 ? 'text-[#D97706]' :
                      'text-red-500'
                    }`}
                    strokeLinecap="round"
                  />
                </svg>
                {/* Center Text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <p className={`text-5xl font-bold ${
                    gpa >= 3.5 ? 'text-[#059669] dark:text-[#34D399]' :
                    gpa >= 3.0 ? 'text-[#0284C7] dark:text-[#7DD3FC]' :
                    gpa >= 2.5 ? 'text-[#D97706] dark:text-[#FBBF24]' :
                    gpa >= 2.0 ? 'text-[#D97706] dark:text-[#FBBF24]' :
                    'text-red-600 dark:text-red-400'
                  }`}>
                    {gpa.toFixed(2)}
                  </p>
                  <p className="text-base font-medium text-muted-foreground">GPA</p>
                  <p className="text-sm text-muted-foreground">out of 4.0</p>
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="flex flex-col justify-center">
              <div className="grid grid-cols-2 gap-4">
                <div className="rounded-xl bg-gradient-to-br from-primary/10 to-primary/5 p-4 text-center">
                  <p className="text-3xl font-bold text-foreground">{courseGrades.length}</p>
                  <p className="text-sm font-medium text-muted-foreground">Courses</p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-[#00BFFF]/10 to-[#00BFFF]/5 p-4 text-center">
                  <p className="text-3xl font-bold text-foreground">{recentGrades.length}</p>
                  <p className="text-sm font-medium text-muted-foreground">Graded</p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-[#059669]/10 to-[#059669]/5 p-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <p className="text-3xl font-bold text-[#059669] dark:text-[#34D399]">
                      {recentGrades.filter((g) => (g.points_earned / g.percentage) * 100 >= 90).length}
                    </p>
                    <span className="text-xl">🏆</span>
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">A Grades</p>
                </div>
                <div className="rounded-xl bg-gradient-to-br from-[#00BFFF]/10 to-[#00BFFF]/5 p-4 text-center">
                  <p className={`text-3xl font-bold ${gradeColorClass(Math.round(overallPercentage))}`}>
                    {Math.round(overallPercentage)}%
                  </p>
                  <p className="text-sm font-medium text-muted-foreground">Average</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Course Grades */}
      {courseGrades.length === 0 ? (
        <div className="ocean-card relative overflow-hidden rounded-2xl py-16 text-center">
          <div className="blob-teal absolute right-1/4 top-0 h-56 w-56 opacity-20" />
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="mb-4 text-6xl">📊</div>
            <p className="text-2xl font-bold text-foreground">No grades yet</p>
            <p className="mt-2 text-base text-muted-foreground">
              Your grades will appear here once your teachers have graded your work.
            </p>
            <p className="mt-4 text-xl">Keep learning! 🚀</p>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Course Grades</h2>
          {courseGrades.map((course, index) => {
            // Calculate trend (simplified - comparing to previous grade)
            const previousPercentage = index > 0 ? courseGrades[index - 1].percentage : course.percentage
            const trend = course.percentage > previousPercentage ? 'up' :
                         course.percentage < previousPercentage ? 'down' : 'stable'

            return (
              <div key={course.courseId} className={`ocean-card overflow-hidden rounded-2xl transition-all hover:scale-[1.01] ${
                course.percentage >= 90 ? 'ring-2 ring-[#059669]/30' :
                course.percentage >= 80 ? 'ring-2 ring-[#0284C7]/30' :
                course.percentage >= 70 ? 'ring-2 ring-[#D97706]/30' :
                'ring-2 ring-red-500/30'
              }`}>
                <button
                  onClick={() =>
                    setExpandedCourse(
                      expandedCourse === course.courseId ? null : course.courseId
                    )
                  }
                  className="flex w-full items-center justify-between p-5 text-left transition-colors hover:bg-muted/30"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-foreground">{course.courseTitle}</h3>
                      {trend === 'up' && <TrendingUp className="h-4 w-4 text-[#059669] dark:text-[#34D399]" />}
                      {trend === 'down' && <TrendingDown className="h-4 w-4 text-red-500" />}
                      {trend === 'stable' && <Minus className="h-4 w-4 text-gray-500" />}
                    </div>
                    <div className="mt-3 flex items-center gap-3">
                      <div className="flex-1">
                        <div className="h-3 w-full overflow-hidden rounded-full bg-muted shadow-inner">
                          <div
                            className={`h-full rounded-full transition-all duration-500 shadow-md ${gradeBarColor(course.percentage)}`}
                            style={{ width: `${Math.min(course.percentage, 100)}%` }}
                          />
                        </div>
                      </div>
                      <span className={`text-base font-bold ${gradeColorClass(course.percentage)}`}>
                        {course.percentage}%
                      </span>
                    </div>
                  </div>
                  <div className="ml-6 flex items-center gap-3">
                    <div className={`flex h-16 w-16 items-center justify-center rounded-full shadow-lg ${
                      course.percentage >= 90 ? 'bg-gradient-to-br from-[#059669]/20 to-[#059669]/10' :
                      course.percentage >= 80 ? 'bg-gradient-to-br from-[#0284C7]/20 to-[#0284C7]/10' :
                      course.percentage >= 70 ? 'bg-gradient-to-br from-[#D97706]/20 to-[#D97706]/10' :
                      'bg-gradient-to-br from-red-500/20 to-red-500/10'
                    }`}>
                      <span className={`text-3xl font-bold ${gradeColorClass(course.percentage)}`}>
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
                          const pct = grade.percentage > 0 ? (grade.points_earned / grade.percentage) * 100 : 0
                          return (
                            <div
                              key={grade.id}
                              className="flex items-center justify-between px-5 py-3"
                            >
                              <div className="flex items-center gap-3">
                                <TypeBadge type={grade.assignmentType} />
                                <div>
                                  <p className="text-base font-medium text-foreground">
                                    {grade.assignmentTitle}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
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
                                  {grade.points_earned}/{grade.percentage}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {Math.round(pct)}% - {grade.letter_grade}
                                </p>
                              </div>
                            </div>
                          )
                        })}
                    </div>

                    {/* Category summary */}
                    <div className="border-t border-border bg-muted/20 px-5 py-3">
                      <div className="flex items-center justify-between text-base">
                        <span className="font-medium text-foreground">Course Total</span>
                        <span className={`font-bold ${gradeColorClass(course.percentage)}`}>
                          {course.totalPointsEarned}/{course.totalPercentage} ({course.percentage}%)
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}

      {/* Recent Grades */}
      {recentGrades.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-foreground">Recent Grades</h2>
          <div className="ocean-card overflow-hidden rounded-2xl">
            <table className="w-full text-base">
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
                    grade.percentage > 0 ? (grade.points_earned / grade.percentage) * 100 : 0
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
                          {grade.points_earned}/{grade.percentage}
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
