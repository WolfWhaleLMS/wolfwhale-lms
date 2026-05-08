import { courseAssignments } from './helpers'
import {
  AssignmentSubmitCard,
  EmptyState,
  StudentWorkspaceShell,
  WorkspaceCourseSection,
} from './shared'
import type { StudentView } from './types'

export function StudentAssignmentsWorkspace({ view }: { view: StudentView }) {
  return (
    <StudentWorkspaceShell title="Assignments" subtitle="All student assignment portals grouped by course, with instructions, due dates, points, and submission boxes in one place.">
      <div id="submit-work" className="grid gap-5 scroll-mt-28">
        {view.courses.map((course) => {
          const assignments = courseAssignments(view, course.id)

          return (
            <WorkspaceCourseSection key={course.id} course={course} label="assignments">
              {assignments.length === 0 ? (
                <EmptyState>No assignments in this course.</EmptyState>
              ) : (
                <div className="grid gap-3">
                  {assignments.map((assignment) => (
                    <AssignmentSubmitCard key={assignment.id} assignment={assignment} />
                  ))}
                </div>
              )}
            </WorkspaceCourseSection>
          )
        })}
      </div>
    </StudentWorkspaceShell>
  )
}
