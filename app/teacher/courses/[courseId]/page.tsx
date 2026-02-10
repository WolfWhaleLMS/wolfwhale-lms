import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  BookOpen,
  Users,
  ClipboardList,
  Plus,
  GripVertical,
  Settings,
  Clock,
} from 'lucide-react'
import { CopyCodeButton } from './copy-code-button'
import { LessonActions } from './lesson-actions'

export default async function TeacherCourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  if (!tenantId) return notFound()

  // Fetch course
  const { data: course, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .eq('tenant_id', tenantId)
    .single()

  if (error || !course) return notFound()

  // Fetch lessons, enrollments, class code, and assignment count in parallel
  const [lessonResult, enrollmentResult, codeResult, assignmentResult] =
    await Promise.all([
      supabase
        .from('lessons')
        .select(
          'id, title, description, order_index, status, duration_minutes, created_at'
        )
        .eq('course_id', courseId)
        .order('order_index', { ascending: true }),
      supabase
        .from('course_enrollments')
        .select('id, student_id, status, enrolled_at, grade_letter, grade_numeric')
        .eq('course_id', courseId)
        .eq('status', 'active'),
      supabase
        .from('class_codes')
        .select('id, code, is_active, expires_at, use_count, max_uses')
        .eq('course_id', courseId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1),
      supabase
        .from('assignments')
        .select('id')
        .eq('course_id', courseId),
    ])

  const lessons = lessonResult.data || []
  const enrollments = enrollmentResult.data || []
  const classCode = codeResult.data?.[0] || null
  const assignmentCount = assignmentResult.data?.length || 0

  // Get student profiles
  const studentIds = enrollments.map((e) => e.student_id)
  let studentProfiles: any[] = []
  if (studentIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url')
      .in('id', studentIds)
    studentProfiles = profiles || []
  }

  const enrolledStudents = enrollments.map((enrollment) => {
    const profile = studentProfiles.find(
      (p) => p.id === enrollment.student_id
    )
    return {
      ...enrollment,
      name: profile
        ? `${profile.first_name || ''} ${profile.last_name || ''}`.trim() ||
          'Student'
        : 'Student',
      avatar_url: profile?.avatar_url || null,
    }
  })

  const statusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'draft':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      case 'published':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'archived':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <Link
        href="/teacher/courses"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Courses
      </Link>

      {/* Course Header */}
      <div className="ocean-card rounded-2xl p-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-2xl font-bold text-foreground">
                {course.name}
              </h1>
              <span
                className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColor(course.status)}`}
              >
                {course.status}
              </span>
            </div>
            {course.description && (
              <p className="text-muted-foreground mb-3">{course.description}</p>
            )}
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {course.subject && (
                <span className="rounded-md bg-muted px-2 py-1">
                  {course.subject}
                </span>
              )}
              {course.grade_level && (
                <span className="rounded-md bg-muted px-2 py-1">
                  Grade {course.grade_level}
                </span>
              )}
              {course.semester && (
                <span className="rounded-md bg-muted px-2 py-1">
                  {course.semester}
                </span>
              )}
            </div>
          </div>

          {/* Class Code */}
          {classCode && (
            <div className="rounded-xl border border-border bg-muted/30 px-5 py-4 text-center sm:min-w-[180px]">
              <p className="text-xs font-medium text-muted-foreground mb-1">
                Class Code
              </p>
              <div className="flex items-center justify-center gap-2">
                <code className="text-2xl font-bold tracking-wider text-primary">
                  {classCode.code}
                </code>
                <CopyCodeButton code={classCode.code} />
              </div>
              {classCode.use_count > 0 && (
                <p className="mt-1 text-xs text-muted-foreground">
                  Used {classCode.use_count} time
                  {classCode.use_count !== 1 ? 's' : ''}
                </p>
              )}
            </div>
          )}
        </div>

        {/* Stats Row */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="rounded-xl bg-muted/50 p-4 text-center">
            <Users className="mx-auto mb-1 h-5 w-5 text-muted-foreground" />
            <p className="text-2xl font-bold text-foreground">
              {enrollments.length}
            </p>
            <p className="text-xs text-muted-foreground">Students</p>
          </div>
          <div className="rounded-xl bg-muted/50 p-4 text-center">
            <BookOpen className="mx-auto mb-1 h-5 w-5 text-muted-foreground" />
            <p className="text-2xl font-bold text-foreground">
              {lessons.length}
            </p>
            <p className="text-xs text-muted-foreground">Lessons</p>
          </div>
          <div className="rounded-xl bg-muted/50 p-4 text-center">
            <ClipboardList className="mx-auto mb-1 h-5 w-5 text-muted-foreground" />
            <p className="text-2xl font-bold text-foreground">
              {assignmentCount}
            </p>
            <p className="text-xs text-muted-foreground">Assignments</p>
          </div>
          <div className="rounded-xl bg-muted/50 p-4 text-center">
            <Clock className="mx-auto mb-1 h-5 w-5 text-muted-foreground" />
            <p className="text-2xl font-bold text-foreground">
              {lessons.reduce(
                (sum, l) => sum + (l.duration_minutes || 0),
                0
              )}
            </p>
            <p className="text-xs text-muted-foreground">Total Minutes</p>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="lessons" className="space-y-6">
        <TabsList>
          <TabsTrigger value="lessons">
            Lessons ({lessons.length})
          </TabsTrigger>
          <TabsTrigger value="students">
            Students ({enrollments.length})
          </TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>

        {/* --- Lessons Tab --- */}
        <TabsContent value="lessons">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-foreground">
                Course Lessons
              </h2>
              <LessonActions courseId={courseId} />
            </div>

            {lessons.length === 0 ? (
              <div className="ocean-card flex flex-col items-center justify-center rounded-2xl py-16 text-center">
                <BookOpen className="mb-3 h-12 w-12 text-muted-foreground/40" />
                <h3 className="text-lg font-semibold text-foreground">
                  No lessons yet
                </h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Start building your course by adding your first lesson.
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {lessons.map((lesson, index) => (
                  <div
                    key={lesson.id}
                    className="ocean-card flex items-center gap-4 rounded-xl p-4 transition-colors hover:bg-muted/30"
                  >
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                      {index + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground truncate">
                          {lesson.title}
                        </h4>
                        <span
                          className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColor(lesson.status)}`}
                        >
                          {lesson.status}
                        </span>
                      </div>
                      {lesson.description && (
                        <p className="mt-0.5 text-sm text-muted-foreground truncate">
                          {lesson.description}
                        </p>
                      )}
                    </div>
                    {lesson.duration_minutes && (
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {lesson.duration_minutes} min
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </TabsContent>

        {/* --- Students Tab --- */}
        <TabsContent value="students">
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              Enrolled Students
            </h2>

            {enrolledStudents.length === 0 ? (
              <div className="ocean-card flex flex-col items-center justify-center rounded-2xl py-16 text-center">
                <Users className="mb-3 h-12 w-12 text-muted-foreground/40" />
                <h3 className="text-lg font-semibold text-foreground">
                  No students enrolled
                </h3>
                <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                  Share the class code with students so they can join your
                  course.
                </p>
                {classCode && (
                  <div className="mt-4 rounded-lg bg-muted/50 px-4 py-2">
                    <code className="text-lg font-bold tracking-wider text-primary">
                      {classCode.code}
                    </code>
                  </div>
                )}
              </div>
            ) : (
              <div className="ocean-card overflow-hidden rounded-2xl">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-border bg-muted/50">
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                          Student
                        </th>
                        <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                          Enrolled
                        </th>
                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                          Grade
                        </th>
                        <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                          Status
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {enrolledStudents.map((student) => (
                        <tr key={student.id}>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-3">
                              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-bold text-primary">
                                {student.name.charAt(0).toUpperCase()}
                              </div>
                              <span className="font-medium text-foreground">
                                {student.name}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3 text-muted-foreground">
                            {new Date(
                              student.enrolled_at
                            ).toLocaleDateString()}
                          </td>
                          <td className="px-4 py-3 text-right font-medium text-foreground">
                            {student.grade_letter || '--'}
                          </td>
                          <td className="px-4 py-3 text-right">
                            <span className="inline-flex items-center rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                              {student.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </TabsContent>

        {/* --- Settings Tab --- */}
        <TabsContent value="settings">
          <div className="ocean-card rounded-2xl p-6 space-y-6">
            <h2 className="text-lg font-semibold text-foreground">
              Course Settings
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Course Name
                </p>
                <p className="mt-1 text-foreground">{course.name}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Status
                </p>
                <p className="mt-1 text-foreground capitalize">
                  {course.status}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Subject
                </p>
                <p className="mt-1 text-foreground">
                  {course.subject || 'Not set'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Grade Level
                </p>
                <p className="mt-1 text-foreground">
                  {course.grade_level
                    ? `Grade ${course.grade_level}`
                    : 'Not set'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Semester
                </p>
                <p className="mt-1 text-foreground">
                  {course.semester || 'Not set'}
                </p>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Created
                </p>
                <p className="mt-1 text-foreground">
                  {new Date(course.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
            {course.max_students && (
              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  Max Students
                </p>
                <p className="mt-1 text-foreground">{course.max_students}</p>
              </div>
            )}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
