import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  ArrowLeft,
  CalendarCheck,
  Users,
  BookOpen,
  ChevronRight,
} from 'lucide-react'

export default async function TeacherAttendanceOverviewPage() {
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
    .select('id, name, subject, status')
    .eq('tenant_id', tenantId)
    .eq('created_by', user.id)
    .neq('status', 'archived')
    .order('name')

  const courseList = courses || []
  const courseIds = courseList.map((c) => c.id)

  // Fetch student counts per course
  let enrollments: any[] = []
  if (courseIds.length > 0) {
    const { data: enrollmentData } = await supabase
      .from('course_enrollments')
      .select('course_id')
      .in('course_id', courseIds)
      .eq('status', 'active')

    enrollments = enrollmentData || []
  }

  // Build student count map
  const studentCountMap = new Map<string, number>()
  for (const enrollment of enrollments) {
    const current = studentCountMap.get(enrollment.course_id) || 0
    studentCountMap.set(enrollment.course_id, current + 1)
  }

  const coursesWithCounts = courseList.map((course) => ({
    ...course,
    studentCount: studentCountMap.get(course.id) || 0,
  }))

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
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Attendance
        </h1>
        <p className="mt-1 text-muted-foreground">
          Select a course to take or review attendance.
        </p>
      </div>

      {/* Course Cards */}
      {coursesWithCounts.length === 0 ? (
        <div className="ocean-card flex flex-col items-center justify-center rounded-2xl py-20 text-center">
          <CalendarCheck className="mb-4 h-16 w-16 text-muted-foreground/40" />
          <h3 className="text-lg font-semibold text-foreground">
            No courses yet
          </h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Create a course first, then you can take attendance for your
            students.
          </p>
          <Link
            href="/teacher/courses/new"
            className="whale-gradient mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
          >
            Create a Course
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {coursesWithCounts.map((course) => (
            <div
              key={course.id}
              className="ocean-card group rounded-2xl p-6 transition-all hover:shadow-lg"
            >
              <div className="mb-4 flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-foreground truncate">
                    {course.name}
                  </h3>
                  {course.subject && (
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {course.subject}
                    </p>
                  )}
                </div>
                <CalendarCheck className="ml-2 h-5 w-5 shrink-0 text-primary/60" />
              </div>

              <div className="mb-5 flex items-center gap-1.5 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>
                  {course.studentCount}{' '}
                  {course.studentCount === 1 ? 'student' : 'students'} enrolled
                </span>
              </div>

              <Link
                href={`/teacher/courses/${course.id}/attendance`}
                className="whale-gradient inline-flex w-full items-center justify-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
              >
                <CalendarCheck className="h-4 w-4" />
                Take Attendance
                <ChevronRight className="ml-auto h-4 w-4" />
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
