'use client'

import Link from 'next/link'

// Placeholder data - will be replaced with real data from database
const MOCK_DATA = {
  teacher: {
    name: 'Dr. Morgan',
    totalCourses: 4,
    totalStudents: 87,
    pendingGrading: 12,
    todayAttendanceRate: 94,
  },
  actionItems: {
    ungradedSubmissions: 12,
    upcomingDeadlines: 3,
    absentStudents: 5,
  },
  courses: [
    {
      id: '1',
      name: 'Introduction to Marine Biology',
      studentCount: 24,
      recentActivity: 'Last submission 2h ago',
      color: 'bg-blue-500',
    },
    {
      id: '2',
      name: 'Advanced Oceanography',
      studentCount: 18,
      recentActivity: 'Quiz due in 2 days',
      color: 'bg-teal-500',
    },
    {
      id: '3',
      name: 'Aquatic Ecosystems',
      studentCount: 22,
      recentActivity: 'New assignment posted',
      color: 'bg-cyan-500',
    },
    {
      id: '4',
      name: 'Marine Conservation',
      studentCount: 23,
      recentActivity: 'Last activity 1 day ago',
      color: 'bg-indigo-500',
    },
  ],
  recentSubmissions: [
    {
      id: '1',
      studentName: 'Alice Johnson',
      assignment: 'Chapter 3 Quiz',
      course: 'Marine Biology',
      submittedDate: '2 hours ago',
      status: 'ungraded',
    },
    {
      id: '2',
      studentName: 'Bob Smith',
      assignment: 'Ocean Currents Essay',
      course: 'Oceanography',
      submittedDate: '3 hours ago',
      status: 'ungraded',
    },
    {
      id: '3',
      studentName: 'Carol Davis',
      assignment: 'Ecosystem Analysis',
      course: 'Aquatic Ecosystems',
      submittedDate: '5 hours ago',
      status: 'graded',
    },
    {
      id: '4',
      studentName: 'David Lee',
      assignment: 'Conservation Plan',
      course: 'Marine Conservation',
      submittedDate: '1 day ago',
      status: 'graded',
    },
    {
      id: '5',
      studentName: 'Emma Wilson',
      assignment: 'Chapter 3 Quiz',
      course: 'Marine Biology',
      submittedDate: '1 day ago',
      status: 'ungraded',
    },
  ],
  performance: [
    {
      course: 'Introduction to Marine Biology',
      avgGrade: 87.5,
      completionRate: 92,
      attendanceRate: 95,
    },
    {
      course: 'Advanced Oceanography',
      avgGrade: 91.2,
      completionRate: 88,
      attendanceRate: 96,
    },
    {
      course: 'Aquatic Ecosystems',
      avgGrade: 85.8,
      completionRate: 90,
      attendanceRate: 93,
    },
    {
      course: 'Marine Conservation',
      avgGrade: 89.3,
      completionRate: 94,
      attendanceRate: 94,
    },
  ],
}

function getCurrentDate() {
  const options: Intl.DateTimeFormatOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }
  return new Date().toLocaleDateString('en-US', options)
}

export default function TeacherDashboardPage() {
  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="ocean-card rounded-2xl p-6">
        <div className="mb-4">
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Welcome back, {MOCK_DATA.teacher.name}
          </h1>
          <p className="mt-1 text-muted-foreground">{getCurrentDate()}</p>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-border bg-muted/30 p-4 text-center">
            <p className="text-3xl font-bold text-primary">
              {MOCK_DATA.teacher.totalCourses}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Total Courses</p>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-4 text-center">
            <p className="text-3xl font-bold text-primary">
              {MOCK_DATA.teacher.totalStudents}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">Total Students</p>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-4 text-center">
            <p className="text-3xl font-bold text-amber-600 dark:text-amber-400">
              {MOCK_DATA.teacher.pendingGrading}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Pending Grading
            </p>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-4 text-center">
            <p className="text-3xl font-bold text-green-600 dark:text-green-400">
              {MOCK_DATA.teacher.todayAttendanceRate}%
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Today's Attendance
            </p>
          </div>
        </div>
      </div>

      {/* Action Required Section */}
      <div className="ocean-card rounded-2xl p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-2xl">🚨</span>
          <h2 className="text-xl font-bold text-foreground">Action Required</h2>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <Link
            href="/teacher/grading"
            className="group rounded-xl border-2 border-amber-500/30 bg-amber-50 p-4 transition-all hover:border-amber-500 hover:shadow-md dark:bg-amber-950/20"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-amber-900 dark:text-amber-100">
                  Ungraded Submissions
                </p>
                <p className="mt-1 text-xs text-amber-700 dark:text-amber-300">
                  Review and grade student work
                </p>
              </div>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-amber-500 text-sm font-bold text-white">
                {MOCK_DATA.actionItems.ungradedSubmissions}
              </span>
            </div>
          </Link>

          <Link
            href="/teacher/assignments"
            className="group rounded-xl border-2 border-blue-500/30 bg-blue-50 p-4 transition-all hover:border-blue-500 hover:shadow-md dark:bg-blue-950/20"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Upcoming Deadlines
                </p>
                <p className="mt-1 text-xs text-blue-700 dark:text-blue-300">
                  Assignments due within 3 days
                </p>
              </div>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500 text-sm font-bold text-white">
                {MOCK_DATA.actionItems.upcomingDeadlines}
              </span>
            </div>
          </Link>

          <Link
            href="/teacher/attendance"
            className="group rounded-xl border-2 border-red-500/30 bg-red-50 p-4 transition-all hover:border-red-500 hover:shadow-md dark:bg-red-950/20"
          >
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-medium text-red-900 dark:text-red-100">
                  Absent Students Today
                </p>
                <p className="mt-1 text-xs text-red-700 dark:text-red-300">
                  Follow up on absences
                </p>
              </div>
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500 text-sm font-bold text-white">
                {MOCK_DATA.actionItems.absentStudents}
              </span>
            </div>
          </Link>
        </div>
      </div>

      {/* My Courses */}
      <div className="ocean-card rounded-2xl p-6">
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">📚</span>
            <h2 className="text-xl font-bold text-foreground">My Courses</h2>
          </div>
          <Link
            href="/teacher/courses"
            className="text-sm text-primary hover:underline"
          >
            View All
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
          {MOCK_DATA.courses.map((course) => (
            <div
              key={course.id}
              className="group rounded-xl border border-border bg-muted/30 p-4 transition-all hover:shadow-md"
            >
              <div className="mb-3 flex items-start gap-3">
                <div
                  className={`h-10 w-10 flex-shrink-0 rounded-lg ${course.color}`}
                />
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/teacher/courses/${course.id}`}
                    className="block font-semibold text-foreground hover:text-primary"
                  >
                    {course.name}
                  </Link>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {course.studentCount} students
                  </p>
                </div>
              </div>
              <p className="mb-3 text-xs text-muted-foreground">
                {course.recentActivity}
              </p>
              <div className="flex flex-wrap gap-1">
                <Link
                  href={`/teacher/courses/${course.id}/lessons`}
                  className="rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/20"
                >
                  Lessons
                </Link>
                <Link
                  href={`/teacher/courses/${course.id}/assignments`}
                  className="rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/20"
                >
                  Assignments
                </Link>
                <Link
                  href={`/teacher/courses/${course.id}/gradebook`}
                  className="rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/20"
                >
                  Gradebook
                </Link>
                <Link
                  href={`/teacher/courses/${course.id}/attendance`}
                  className="rounded bg-primary/10 px-2 py-1 text-xs font-medium text-primary hover:bg-primary/20"
                >
                  Attendance
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Recent Submissions */}
        <div className="ocean-card rounded-2xl p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-2xl">📝</span>
            <h2 className="text-xl font-bold text-foreground">
              Recent Submissions
            </h2>
          </div>
          <div className="overflow-hidden rounded-xl border border-border">
            <div className="max-h-96 overflow-y-auto">
              <table className="w-full text-sm">
                <thead className="sticky top-0 bg-muted/80 backdrop-blur-sm">
                  <tr className="border-b border-border">
                    <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                      Student
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                      Assignment
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                      Course
                    </th>
                    <th className="px-3 py-2 text-left text-xs font-medium text-muted-foreground">
                      Time
                    </th>
                    <th className="px-3 py-2 text-center text-xs font-medium text-muted-foreground">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {MOCK_DATA.recentSubmissions.map((submission) => (
                    <tr
                      key={submission.id}
                      className="transition-colors hover:bg-muted/50"
                    >
                      <td className="px-3 py-3 font-medium text-foreground">
                        {submission.studentName}
                      </td>
                      <td className="px-3 py-3 text-muted-foreground">
                        {submission.assignment}
                      </td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">
                        {submission.course}
                      </td>
                      <td className="px-3 py-3 text-xs text-muted-foreground">
                        {submission.submittedDate}
                      </td>
                      <td className="px-3 py-3 text-center">
                        {submission.status === 'ungraded' ? (
                          <button className="rounded-lg bg-primary px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-primary/90">
                            Grade
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 text-xs text-green-600 dark:text-green-400">
                            <svg
                              className="h-4 w-4"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M5 13l4 4L19 7"
                              />
                            </svg>
                            Graded
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Class Performance Overview */}
        <div className="ocean-card rounded-2xl p-6">
          <div className="mb-4 flex items-center gap-2">
            <span className="text-2xl">📊</span>
            <h2 className="text-xl font-bold text-foreground">
              Class Performance
            </h2>
          </div>
          <div className="space-y-4">
            {MOCK_DATA.performance.map((perf, idx) => (
              <div key={idx} className="rounded-xl border border-border p-4">
                <p className="mb-3 font-semibold text-foreground">
                  {perf.course}
                </p>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div>
                    <p className="text-lg font-bold text-primary">
                      {perf.avgGrade}%
                    </p>
                    <p className="text-xs text-muted-foreground">Avg Grade</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                      {perf.completionRate}%
                    </p>
                    <p className="text-xs text-muted-foreground">Completion</p>
                  </div>
                  <div>
                    <p className="text-lg font-bold text-green-600 dark:text-green-400">
                      {perf.attendanceRate}%
                    </p>
                    <p className="text-xs text-muted-foreground">Attendance</p>
                  </div>
                </div>
              </div>
            ))}
            <Link
              href="/teacher/reports"
              className="block rounded-lg bg-muted/50 px-4 py-2 text-center text-sm font-medium text-primary transition-colors hover:bg-muted"
            >
              View Detailed Reports
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="ocean-card rounded-2xl p-6">
        <div className="mb-4 flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <h2 className="text-xl font-bold text-foreground">Quick Actions</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-5">
          <Link
            href="/teacher/courses/create"
            className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-gradient-to-br from-primary/10 to-primary/5 p-6 transition-all hover:shadow-lg hover:scale-105"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary/20 text-2xl transition-transform group-hover:scale-110">
              📚
            </div>
            <span className="text-sm font-semibold text-foreground">
              Create Course
            </span>
          </Link>

          <Link
            href="/teacher/assignments/create"
            className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-gradient-to-br from-blue-500/10 to-blue-500/5 p-6 transition-all hover:shadow-lg hover:scale-105"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-500/20 text-2xl transition-transform group-hover:scale-110">
              📋
            </div>
            <span className="text-sm font-semibold text-foreground">
              Create Assignment
            </span>
          </Link>

          <Link
            href="/teacher/attendance/take"
            className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-gradient-to-br from-green-500/10 to-green-500/5 p-6 transition-all hover:shadow-lg hover:scale-105"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-green-500/20 text-2xl transition-transform group-hover:scale-110">
              ✓
            </div>
            <span className="text-sm font-semibold text-foreground">
              Take Attendance
            </span>
          </Link>

          <Link
            href="/teacher/messages"
            className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-gradient-to-br from-purple-500/10 to-purple-500/5 p-6 transition-all hover:shadow-lg hover:scale-105"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-purple-500/20 text-2xl transition-transform group-hover:scale-110">
              💬
            </div>
            <span className="text-sm font-semibold text-foreground">
              Messages
            </span>
          </Link>

          <Link
            href="/teacher/calendar"
            className="group flex flex-col items-center gap-2 rounded-xl border border-border bg-gradient-to-br from-amber-500/10 to-amber-500/5 p-6 transition-all hover:shadow-lg hover:scale-105"
          >
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-amber-500/20 text-2xl transition-transform group-hover:scale-110">
              📅
            </div>
            <span className="text-sm font-semibold text-foreground">
              Calendar
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
