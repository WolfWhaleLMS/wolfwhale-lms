import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import {
  ArrowLeft,
  Users,
  BookOpen,
  GraduationCap,
} from 'lucide-react'

export default async function TeacherAllStudentsPage() {
  const supabase = await createClient()
  const [{ data: { user } }, headersList] = await Promise.all([
    supabase.auth.getUser(),
    headers(),
  ])

  if (!user) redirect('/login')

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
    .select('id, name')
    .eq('tenant_id', tenantId)
    .eq('created_by', user.id)
    .neq('status', 'archived')
    .order('name')

  const courseList = courses || []
  const courseIds = courseList.map((c) => c.id)
  const courseMap = new Map(courseList.map((c) => [c.id, c.name]))

  // Fetch all active enrollments for those courses
  let enrollments: any[] = []
  if (courseIds.length > 0) {
    const { data: enrollmentData } = await supabase
      .from('course_enrollments')
      .select('student_id, course_id')
      .in('course_id', courseIds)
      .eq('status', 'active')

    enrollments = enrollmentData || []
  }

  // Build a map of student_id -> list of course names
  const studentCourseMap = new Map<string, string[]>()
  for (const enrollment of enrollments) {
    const courseName = courseMap.get(enrollment.course_id) || 'Unknown Course'
    if (!studentCourseMap.has(enrollment.student_id)) {
      studentCourseMap.set(enrollment.student_id, [])
    }
    studentCourseMap.get(enrollment.student_id)!.push(courseName)
  }

  // Get unique student IDs
  const studentIds = Array.from(studentCourseMap.keys())

  // Fetch student profiles
  let studentProfiles: any[] = []
  if (studentIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url, grade_level')
      .in('id', studentIds)

    studentProfiles = (profiles || []).map((p) => ({
      ...p,
      fullName:
        [p.first_name, p.last_name].filter(Boolean).join(' ') || 'Unknown Student',
      enrolledCourses: studentCourseMap.get(p.id) || [],
      courseCount: (studentCourseMap.get(p.id) || []).length,
    }))

    // Sort by name
    studentProfiles.sort((a, b) => a.fullName.localeCompare(b.fullName))
  }

  function getInitials(name: string) {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase()
  }

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
            All Students
          </h1>
          <p className="mt-1 text-muted-foreground">
            Students enrolled across all your courses.
          </p>
        </div>
      </div>

      {/* Summary Stats */}
      {studentProfiles.length > 0 && (
        <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-3">
          <div className="ocean-card rounded-2xl p-3 sm:p-4 text-center">
            <Users className="mx-auto mb-1 h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <p className="text-xl sm:text-2xl font-bold text-primary">
              {studentProfiles.length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Unique Students</p>
          </div>
          <div className="ocean-card rounded-2xl p-3 sm:p-4 text-center">
            <BookOpen className="mx-auto mb-1 h-4 w-4 sm:h-5 sm:w-5 text-[#00BFFF]" />
            <p className="text-xl sm:text-2xl font-bold text-[#00BFFF] dark:text-[#00BFFF]">
              {courseList.length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Active Courses</p>
          </div>
          <div className="ocean-card rounded-2xl p-3 sm:p-4 text-center col-span-2 md:col-span-1">
            <GraduationCap className="mx-auto mb-1 h-4 w-4 sm:h-5 sm:w-5 text-[#059669]" />
            <p className="text-xl sm:text-2xl font-bold text-[#059669] dark:text-[#059669]">
              {enrollments.length}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">Total Enrollments</p>
          </div>
        </div>
      )}

      {/* Student List */}
      {studentProfiles.length === 0 ? (
        <div className="ocean-card flex flex-col items-center justify-center rounded-2xl py-20 text-center">
          <Users className="mb-4 h-16 w-16 text-muted-foreground/40" />
          <h3 className="text-lg font-semibold text-foreground">
            No students enrolled yet
          </h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Students will appear here once they enroll in your courses using a
            class code.
          </p>
          <Link
            href="/teacher/courses"
            className="whale-gradient mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
          >
            Go to Courses
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {studentProfiles.map((student) => (
            <div
              key={student.id}
              className="ocean-card group rounded-2xl p-4 sm:p-5 transition-all hover:shadow-lg"
            >
              {/* Student header */}
              <div className="mb-4 flex items-center gap-3">
                {student.avatar_url ? (
                  <img
                    src={student.avatar_url}
                    alt={student.fullName}
                    className="h-12 w-12 rounded-full object-cover ring-2 ring-border"
                  />
                ) : (
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-cyan-500 text-sm font-bold text-white shadow-md">
                    {getInitials(student.fullName)}
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-foreground truncate">
                    {student.fullName}
                  </h3>
                  {student.grade_level && (
                    <p className="text-xs text-muted-foreground">
                      Grade {student.grade_level}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-1 rounded-full bg-primary/10 px-2.5 py-1 text-xs font-medium text-primary">
                  <BookOpen className="h-3 w-3" />
                  {student.courseCount}
                </div>
              </div>

              {/* Enrolled courses */}
              <div className="space-y-1">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Enrolled In
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {student.enrolledCourses.map((courseName: string, i: number) => (
                    <span
                      key={i}
                      className="inline-flex items-center rounded-md bg-muted px-2 py-0.5 text-xs text-muted-foreground"
                    >
                      {courseName}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
