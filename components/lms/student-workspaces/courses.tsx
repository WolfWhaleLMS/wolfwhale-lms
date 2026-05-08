import {
  BarChart3,
  BookOpen,
  CalendarCheck,
  CalendarDays,
  ClipboardCheck,
  FileText,
  GraduationCap,
  MessageSquare,
} from 'lucide-react'

import {
  attendanceForCourse,
  courseAssignments,
  courseById,
  courseCalendar,
  courseGrades,
  courseLessons,
  courseMessages,
  courseResources,
  formatShortDate,
  gradebookForCourse,
} from './helpers'
import {
  AssignmentSubmitCard,
  CourseCard,
  EmptyState,
  StudentWorkspaceShell,
  WorkspacePanel,
} from './shared'
import type { StudentView } from './types'

export function StudentCoursesWorkspace({ view }: { view: StudentView }) {
  return (
    <StudentWorkspaceShell title="Courses" subtitle="Choose a course to open its syllabus, materials, assignments, submission portals, feedback, attendance, and messages.">
      <div className="grid gap-4 lg:grid-cols-2">
        {view.courses.map((course) => (
          <CourseCard key={course.id} course={course} view={view} />
        ))}
      </div>
    </StudentWorkspaceShell>
  )
}

export function StudentCourseWorkspace({ view, courseId }: { view: StudentView; courseId: string }) {
  const course = courseById(view, courseId)
  if (!course) return null

  const assignments = courseAssignments(view, courseId)
  const resources = courseResources(view, courseId)
  const lessons = courseLessons(view, courseId)
  const grades = courseGrades(view, courseId)
  const gradebook = gradebookForCourse(view, courseId)
  const attendance = attendanceForCourse(view, courseId)
  const calendar = courseCalendar(view, courseId)
  const messages = courseMessages(view, courseId)
  const assignmentCategories = Array.from(new Set(assignments.map((assignment) => assignment.category))).filter(Boolean)

  return (
    <StudentWorkspaceShell title={course.title} subtitle="Everything for this course is collected here: syllabus, lessons, resources, assignments, submissions, grading, attendance, calendar, and messages.">
      <div className="grid gap-5 xl:grid-cols-[minmax(0,1fr)_24rem]">
        <div className="space-y-5">
          <WorkspacePanel title="Course syllabus" icon={BookOpen}>
            <dl className="grid gap-3 sm:grid-cols-3">
              <div className="rounded-lg bg-emerald-50/80 p-3">
                <dt className="text-sm font-bold text-[#55736a]">Subject</dt>
                <dd className="font-black text-[#17352c]">{course.subject}</dd>
              </div>
              <div className="rounded-lg bg-sky-50/80 p-3">
                <dt className="text-sm font-bold text-[#55736a]">Grade</dt>
                <dd className="font-black text-[#17352c]">{course.gradeLevel}</dd>
              </div>
              <div className="rounded-lg bg-amber-50/80 p-3">
                <dt className="text-sm font-bold text-[#55736a]">Current</dt>
                <dd className="font-black text-[#17352c]">{gradebook ? `${gradebook.currentPercentage}% ${gradebook.letterGrade}` : 'Not graded'}</dd>
              </div>
            </dl>
            {assignmentCategories.length > 0 ? (
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                {assignmentCategories.map((category) => (
                  <div key={category} className="rounded-lg border border-emerald-100 bg-white/74 p-3">
                    <p className="font-black text-[#17352c]">{category}</p>
                    <p className="mt-1 text-sm font-semibold text-[#48675e]">Course grading category</p>
                  </div>
                ))}
              </div>
            ) : null}
          </WorkspacePanel>

          <WorkspacePanel title="Lessons" icon={BookOpen}>
            {lessons.length === 0 ? (
              <EmptyState>No published lessons yet.</EmptyState>
            ) : (
              <ul className="grid gap-2">
                {lessons.map((lesson) => (
                  <li key={lesson.id} className="rounded-lg border border-emerald-100 bg-white/74 px-3 py-2">
                    <span className="font-black text-[#17352c]">{lesson.title}</span>
                    <span className="ml-2 rounded-full bg-emerald-100 px-2 py-1 text-xs font-bold capitalize text-emerald-800">{lesson.status}</span>
                  </li>
                ))}
              </ul>
            )}
          </WorkspacePanel>

          <WorkspacePanel id="submit-work" title="Assignments and submissions" icon={ClipboardCheck}>
            {assignments.length === 0 ? (
              <EmptyState>No assignments in this course.</EmptyState>
            ) : (
              <div className="grid gap-3">
                {assignments.map((assignment) => (
                  <AssignmentSubmitCard key={assignment.id} assignment={assignment} />
                ))}
              </div>
            )}
          </WorkspacePanel>

          <WorkspacePanel title="Grades and feedback" icon={GraduationCap}>
            {grades.length === 0 ? (
              <EmptyState>No feedback posted for this course yet.</EmptyState>
            ) : (
              <ul className="grid gap-2">
                {grades.map((grade) => (
                  <li key={grade.assignmentId} className="rounded-lg border border-emerald-100 bg-white/74 px-3 py-2">
                    <span className="font-black text-[#17352c]">{grade.assignmentTitle}</span>
                    <span className="ml-2 rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-800">{grade.scoreLabel}</span>
                    <p className="mt-1 text-sm font-semibold text-[#48675e]">{grade.feedback}</p>
                  </li>
                ))}
              </ul>
            )}
          </WorkspacePanel>
        </div>

        <div className="space-y-5">
          <WorkspacePanel title="Course materials" icon={FileText}>
            {resources.length === 0 ? (
              <EmptyState>No course materials yet.</EmptyState>
            ) : (
              <ul className="grid gap-2">
                {resources.map((resource) => (
                  <li key={resource.id} className="rounded-lg border border-emerald-100 bg-white/74 px-3 py-2">
                    <a href={`/api/lms/resources/${resource.id}`} className="font-black text-emerald-800 hover:text-emerald-950">
                      {resource.title}
                    </a>
                    <p className="mt-1 text-sm font-semibold text-[#48675e]">{resource.fileName}</p>
                  </li>
                ))}
              </ul>
            )}
          </WorkspacePanel>

          <WorkspacePanel title="Gradebook" icon={BarChart3}>
            <dl className="grid grid-cols-2 gap-2 text-sm">
              <div className="rounded-lg bg-emerald-50/80 p-3">
                <dt className="font-bold text-[#55736a]">Current</dt>
                <dd className="font-black text-[#17352c]">{gradebook ? `${gradebook.currentPercentage}% ${gradebook.letterGrade}` : 'Not graded'}</dd>
              </div>
              <div className="rounded-lg bg-amber-50/80 p-3">
                <dt className="font-bold text-[#55736a]">Missing</dt>
                <dd className="font-black text-[#17352c]">{gradebook?.missingAssignments ?? 0}</dd>
              </div>
            </dl>
          </WorkspacePanel>

          <WorkspacePanel title="Attendance" icon={CalendarCheck}>
            {attendance ? (
              <p className="rounded-lg bg-sky-50/80 p-3 text-sm font-semibold text-[#48675e]">
                <span className="font-black text-[#17352c]">{attendance.attendanceRate}%</span> present/online, {attendance.absent} absent, {attendance.tardy} tardy.
              </p>
            ) : (
              <EmptyState>No attendance in this course.</EmptyState>
            )}
          </WorkspacePanel>

          <WorkspacePanel title="Calendar" icon={CalendarDays}>
            {calendar.length === 0 ? (
              <EmptyState>No dated course items.</EmptyState>
            ) : (
              <ul className="grid gap-2">
                {calendar.map((item) => (
                  <li key={item.id} className="rounded-lg border border-sky-100 bg-white/74 px-3 py-2 text-sm font-semibold text-[#48675e]">
                    <span className="font-black text-[#17352c]">{item.title}</span> - {formatShortDate(item.dueAt)}
                  </li>
                ))}
              </ul>
            )}
          </WorkspacePanel>

          <WorkspacePanel title="Messages" icon={MessageSquare}>
            {messages.length === 0 ? (
              <EmptyState>No messages for this course.</EmptyState>
            ) : (
              <ul className="grid gap-2">
                {messages.map((message) => (
                  <li key={message.id} className="rounded-lg border border-sky-100 bg-white/74 px-3 py-2">
                    <span className="font-black text-[#17352c]">{message.subject}</span>
                    <p className="mt-1 text-sm font-semibold text-[#48675e]">{message.content}</p>
                  </li>
                ))}
              </ul>
            )}
          </WorkspacePanel>
        </div>
      </div>
    </StudentWorkspaceShell>
  )
}
