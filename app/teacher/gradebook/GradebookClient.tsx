'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { getGradebook } from '@/app/actions/grades'
import { getLetterGrade } from '@/lib/config/constants'
import { ArrowLeft } from 'lucide-react'
import { ExportButton } from '@/components/reports/ExportButton'

interface Course {
  id: string
  name: string
}

interface Assignment {
  id: string
  title: string
  type: string
  max_points: number
  due_date: string | null
}

interface Student {
  id: string
  name: string
}

interface GradeCell {
  pointsEarned: number
  percentage: number
  letterGrade: string
}

interface GradebookData {
  course: Course
  assignments: Assignment[]
  students: Student[]
  grades: Record<string, Record<string, GradeCell>>
  studentOveralls: Record<string, { percentage: number; letterGrade: string }>
}

function gradeColorClass(percentage: number): string {
  if (percentage >= 90) return 'text-[#059669] dark:text-[#059669]'
  if (percentage >= 80) return 'text-[#00BFFF] dark:text-[#00BFFF]'
  if (percentage >= 70) return 'text-[#D97706] dark:text-[#D97706]'
  if (percentage >= 60) return 'text-[#FFD700] dark:text-[#FFD700]'
  return 'text-red-600 dark:text-red-400'
}

interface GradebookClientProps {
  courses: Course[]
  initialGradebook: GradebookData | null
  initialError: string | null
}

export default function GradebookClient({
  courses,
  initialGradebook,
  initialError,
}: GradebookClientProps) {
  const [courseId, setCourseId] = useState(courses[0]?.id ?? '')
  const [gradebook, setGradebook] = useState<GradebookData | null>(initialGradebook)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(initialError)

  // When the user selects a different course, fetch new gradebook data
  useEffect(() => {
    // Skip if this is the initial course (data already provided via props)
    if (!courseId || courseId === courses[0]?.id) return
    loadGradebook(courseId)
  }, [courseId]) // eslint-disable-line react-hooks/exhaustive-deps

  async function loadGradebook(cId: string) {
    setLoading(true)
    setError(null)
    const result = await getGradebook(cId)
    if (result.error) {
      setError(result.error)
      setGradebook(null)
    } else {
      setGradebook(result.data as GradebookData)
    }
    setLoading(false)
  }

  return (
    <div className="space-y-4 sm:space-y-8 overflow-x-hidden max-w-full">
      {/* Back Button */}
      <Link
        href="/teacher/dashboard"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Gradebook</h1>
          <p className="mt-1 text-sm sm:text-base text-muted-foreground">
            View and manage grades for all students across assignments.
          </p>
        </div>
        {courseId && (
          <ExportButton
            pdfUrl={`/api/reports/teacher/${courseId}/pdf`}
            csvUrl={`/api/reports/teacher/${courseId}/csv`}
          />
        )}
      </div>

      {/* Course Selector */}
      <div className="ocean-card rounded-2xl p-3 sm:p-4">
        <label htmlFor="course-select" className="block text-sm font-medium text-foreground">
          Select Course
        </label>
        <select
          id="course-select"
          value={courseId}
          onChange={(e) => {
            setCourseId(e.target.value)
            if (e.target.value !== courses[0]?.id) {
              // Will trigger useEffect to load new data
            } else {
              // Reset to initial data
              setGradebook(initialGradebook)
              setError(initialError)
            }
          }}
          className="mt-1.5 w-full max-w-md rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
        >
          {courses.length === 0 && (
            <option value="">No courses found</option>
          )}
          {courses.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      {loading && (
        <div className="ocean-card animate-pulse rounded-2xl p-8 text-center">
          <p className="text-muted-foreground">Loading gradebook...</p>
        </div>
      )}

      {/* Gradebook Grid */}
      {!loading && gradebook && (
        <>
          {gradebook.assignments.length === 0 || gradebook.students.length === 0 ? (
            <div className="ocean-card flex flex-col items-center justify-center rounded-2xl py-16 text-center">
              <div className="mb-3 text-5xl opacity-40">📊</div>
              <p className="text-lg font-medium text-foreground">No data to display</p>
              <p className="mt-1 text-sm text-muted-foreground">
                {gradebook.assignments.length === 0
                  ? 'Create assignments to populate the gradebook.'
                  : 'No students are enrolled in this course yet.'}
              </p>
            </div>
          ) : (
            <div className="ocean-card overflow-hidden rounded-2xl">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="sticky left-0 z-10 min-w-[180px] bg-muted/80 px-4 py-3 text-left font-medium text-muted-foreground backdrop-blur-sm">
                        Student
                      </th>
                      {gradebook.assignments.map((a) => (
                        <th
                          key={a.id}
                          className="min-w-[100px] px-3 py-3 text-center font-medium text-muted-foreground"
                          title={a.title}
                        >
                          <div className="truncate text-xs">{a.title}</div>
                          <div className="mt-0.5 text-xs font-normal opacity-60">
                            {a.max_points} pts
                          </div>
                        </th>
                      ))}
                      <th className="sticky right-0 z-10 min-w-[100px] bg-muted/80 px-4 py-3 text-center font-medium text-muted-foreground backdrop-blur-sm">
                        Overall
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border">
                    {gradebook.students.map((student) => {
                      const overall = gradebook.studentOveralls[student.id]
                      return (
                        <tr key={student.id} className="transition-colors hover:bg-muted/20">
                          <td className="sticky left-0 z-10 bg-background/80 px-4 py-3 backdrop-blur-sm">
                            <div>
                              <p className="font-medium text-foreground">{student.name}</p>
                            </div>
                          </td>
                          {gradebook.assignments.map((a) => {
                            const grade = gradebook.grades[student.id]?.[a.id]
                            if (!grade) {
                              return (
                                <td key={a.id} className="px-3 py-3 text-center text-muted-foreground">
                                  --
                                </td>
                              )
                            }
                            return (
                              <td key={a.id} className="px-3 py-3 text-center">
                                <span className={`font-medium ${gradeColorClass(grade.percentage)}`}>
                                  {grade.pointsEarned}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                  /{a.max_points}
                                </span>
                              </td>
                            )
                          })}
                          <td className="sticky right-0 z-10 bg-background/80 px-4 py-3 text-center backdrop-blur-sm">
                            {overall && overall.letterGrade !== '--' ? (
                              <div>
                                <span className={`text-lg font-bold ${gradeColorClass(overall.percentage)}`}>
                                  {overall.letterGrade}
                                </span>
                                <p className="text-xs text-muted-foreground">
                                  {overall.percentage}%
                                </p>
                              </div>
                            ) : (
                              <span className="text-muted-foreground">--</span>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>

              {/* Summary Row */}
              <div className="border-t border-border bg-muted/30 px-4 py-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">
                    {gradebook.students.length} student{gradebook.students.length !== 1 ? 's' : ''} &middot;{' '}
                    {gradebook.assignments.length} assignment{gradebook.assignments.length !== 1 ? 's' : ''}
                  </span>
                  <span className="text-muted-foreground">
                    Class Average:{' '}
                    {(() => {
                      const overalls = Object.values(gradebook.studentOveralls).filter(
                        (o) => o.letterGrade !== '--'
                      )
                      if (overalls.length === 0) return '--'
                      const avg =
                        overalls.reduce((sum, o) => sum + o.percentage, 0) / overalls.length
                      return `${Math.round(avg * 100) / 100}% (${getLetterGrade(avg)})`
                    })()}
                  </span>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
