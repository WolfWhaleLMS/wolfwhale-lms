import { courseGrades, gradebookForCourse, attendanceForCourse } from './helpers'
import { EmptyState, StudentWorkspaceShell, WorkspaceCourseSection } from './shared'
import type { StudentView } from './types'

export function StudentGradesFeedbackWorkspace({ view }: { view: StudentView }) {
  return (
    <StudentWorkspaceShell title="Grades and feedback" subtitle="Marked work grouped by course, with feedback next to the assignment it belongs to.">
      <div className="grid gap-5">
        {view.courses.map((course) => {
          const grades = courseGrades(view, course.id)

          return (
            <WorkspaceCourseSection key={course.id} course={course} label="grades and feedback">
              {grades.length === 0 ? (
                <EmptyState>No feedback posted for this course yet.</EmptyState>
              ) : (
                <ul className="grid gap-3">
                  {grades.map((grade) => (
                    <li key={grade.assignmentId} className="rounded-lg border border-emerald-100 bg-white/74 px-4 py-3">
                      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                        <span className="font-black text-[#17352c]">{grade.assignmentTitle}</span>
                        <span className="w-fit rounded-full bg-emerald-100 px-3 py-1 text-sm font-black text-emerald-800">{grade.scoreLabel}</span>
                      </div>
                      <p className="mt-2 text-sm font-semibold leading-6 text-[#48675e]">{grade.feedback}</p>
                    </li>
                  ))}
                </ul>
              )}
            </WorkspaceCourseSection>
          )
        })}
      </div>
    </StudentWorkspaceShell>
  )
}

export function StudentGradebookWorkspace({ view }: { view: StudentView }) {
  return (
    <StudentWorkspaceShell title="Gradebook" subtitle="Course standing, missing-work counts, graded-work counts, attendance health, and learning risk in one place.">
      <div className="grid gap-5">
        {view.courses.map((course) => {
          const gradebook = gradebookForCourse(view, course.id)

          return (
            <WorkspaceCourseSection key={course.id} course={course} label="gradebook">
              {gradebook ? (
                <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
                  <div className="rounded-lg bg-emerald-50/80 p-3">
                    <dt className="text-sm font-bold text-[#55736a]">Current</dt>
                    <dd className="font-black text-[#17352c]">{gradebook.currentPercentage}% {gradebook.letterGrade}</dd>
                  </div>
                  <div className="rounded-lg bg-amber-50/80 p-3">
                    <dt className="text-sm font-bold text-[#55736a]">Missing</dt>
                    <dd className="font-black text-[#17352c]">{gradebook.missingAssignments}</dd>
                  </div>
                  <div className="rounded-lg bg-sky-50/80 p-3">
                    <dt className="text-sm font-bold text-[#55736a]">Attendance</dt>
                    <dd className="font-black text-[#17352c]">{gradebook.attendanceRate}%</dd>
                  </div>
                  <div className="rounded-lg bg-lime-50/80 p-3">
                    <dt className="text-sm font-bold text-[#55736a]">Graded</dt>
                    <dd className="font-black text-[#17352c]">{gradebook.gradedAssignments}</dd>
                  </div>
                  <div className="rounded-lg bg-white/74 p-3">
                    <dt className="text-sm font-bold text-[#55736a]">Learning health</dt>
                    <dd className="font-black capitalize text-[#17352c]">{gradebook.riskLevel}</dd>
                  </div>
                </dl>
              ) : (
                <EmptyState>No gradebook row for this course yet.</EmptyState>
              )}
            </WorkspaceCourseSection>
          )
        })}
      </div>
    </StudentWorkspaceShell>
  )
}

export function StudentAttendanceWorkspace({ view }: { view: StudentView }) {
  return (
    <StudentWorkspaceShell title="Attendance" subtitle="Attendance summaries grouped by course so students can see where they are on track.">
      <div className="grid gap-5">
        {view.courses.map((course) => {
          const attendance = attendanceForCourse(view, course.id)

          return (
            <WorkspaceCourseSection key={course.id} course={course} label="attendance">
              {attendance ? (
                <p className="rounded-lg bg-sky-50/80 p-4 text-sm font-semibold leading-6 text-[#48675e]">
                  <span className="font-black text-[#17352c]">{attendance.attendanceRate} percent present/online</span>, {attendance.absent} absent, {attendance.tardy} tardy, and {attendance.present} present records.
                </p>
              ) : (
                <EmptyState>No attendance records for this course yet.</EmptyState>
              )}
            </WorkspaceCourseSection>
          )
        })}
      </div>
    </StudentWorkspaceShell>
  )
}
