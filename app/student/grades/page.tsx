import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getLetterGrade } from '@/lib/config/constants'
import { BarChart3 } from 'lucide-react'
import { GradesClient } from './GradesClient'
import { BackToHubButton } from '@/components/hub/BackToHubButton'

interface CourseGrade {
  courseId: string
  courseTitle: string
  totalPointsEarned: number
  totalPercentage: number
  percentage: number
  letterGrade: string
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

export default async function StudentGradesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  let courseGrades: CourseGrade[] = []
  let recentGrades: GradeEntry[] = []
  let error: string | null = null

  if (tenantId) {
    // Get all grades for this student
    const { data: grades, error: gradesError } = await supabase
      .from('grades')
      .select(`
        *,
        assignments:assignment_id(id, title, type, max_points, due_date, course_id)
      `)
      .eq('student_id', user.id)
      .eq('tenant_id', tenantId)
      .order('graded_at', { ascending: false })
      .limit(500)

    if (gradesError) {
      error = 'Failed to fetch grades'
    } else if (grades && grades.length > 0) {
      // Get enrolled courses
      const { data: enrollments } = await supabase
        .from('course_enrollments')
        .select('course_id, courses:courses(id, name)')
        .eq('student_id', user.id)

      const courseMap: Record<string, string> = {}
      if (enrollments) {
        for (const e of enrollments) {
          const course = e.courses as unknown as { id: string; name: string }
          if (course) {
            courseMap[course.id] = course.name
          }
        }
      }

      // Group grades by course
      const courseGradesMap: Record<string, {
        courseId: string
        courseTitle: string
        grades: typeof grades
        totalPointsEarned: number
        totalPercentage: number
        gradeCount: number
      }> = {}

      for (const grade of grades) {
        const assignment = grade.assignments as unknown as {
          id: string; title: string; type: string; max_points: number; due_date: string; course_id: string
        }
        if (!assignment) continue

        const courseId = assignment.course_id
        if (!courseGradesMap[courseId]) {
          courseGradesMap[courseId] = {
            courseId,
            courseTitle: courseMap[courseId] || 'Unknown Course',
            grades: [],
            totalPointsEarned: 0,
            totalPercentage: 0,
            gradeCount: 0,
          }
        }
        courseGradesMap[courseId].grades.push(grade)
        courseGradesMap[courseId].totalPointsEarned += grade.points_earned
        courseGradesMap[courseId].totalPercentage += grade.percentage
        courseGradesMap[courseId].gradeCount++
      }

      courseGrades = Object.values(courseGradesMap).map((cg) => {
        const avgPercentage = cg.gradeCount > 0
          ? Math.round((cg.totalPercentage / cg.gradeCount) * 100) / 100
          : 0
        return {
          courseId: cg.courseId,
          courseTitle: cg.courseTitle,
          totalPointsEarned: cg.totalPointsEarned,
          totalPercentage: cg.totalPercentage,
          percentage: avgPercentage,
          letterGrade: cg.gradeCount > 0 ? getLetterGrade(avgPercentage) : '--',
        }
      })

      // Augment grades with course title
      recentGrades = grades.map((g) => {
        const assignment = g.assignments as unknown as { course_id: string; title: string; type: string; max_points: number }
        return {
          id: g.id,
          points_earned: g.points_earned,
          percentage: g.percentage,
          letter_grade: g.letter_grade,
          feedback: g.feedback,
          graded_at: g.graded_at,
          courseTitle: assignment ? courseMap[assignment.course_id] || 'Unknown Course' : 'Unknown Course',
          assignmentTitle: assignment?.title || 'Unknown Assignment',
          assignmentType: assignment?.type || 'other',
        }
      })
    }
  }

  // Calculate overall stats
  const overallPercentage =
    courseGrades.length > 0
      ? courseGrades.reduce((sum, c) => sum + c.percentage, 0) / courseGrades.length
      : 0

  const letterToGPA: Record<string, number> = {
    'A+': 4.0, 'A': 4.0, 'A-': 3.7,
    'B+': 3.3, 'B': 3.0, 'B-': 2.7,
    'C+': 2.3, 'C': 2.0, 'C-': 1.7,
    'D+': 1.3, 'D': 1.0, 'D-': 0.7,
    'F': 0.0
  }

  const gpa = courseGrades.length > 0
    ? courseGrades.reduce((sum, c) => sum + (letterToGPA[c.letterGrade] || 0), 0) / courseGrades.length
    : 0

  return (
    <div className="space-y-8">
      <BackToHubButton role="student" />
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

      <GradesClient
        courseGrades={courseGrades}
        recentGrades={recentGrades}
        overallPercentage={overallPercentage}
        gpa={gpa}
      />
    </div>
  )
}
