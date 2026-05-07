import type { buildLmsDashboardViews } from '@/lib/lms/read-model'

type StudentView = ReturnType<typeof buildLmsDashboardViews>['student']

export function companionSummaryFromStudentView(view: StudentView) {
  const gradebook = view.gradebook[0]
  const progressValue = gradebook ? Math.max(0, Math.min(100, Math.round(gradebook.currentPercentage))) : 0
  const nextAssignment = view.assignments[0]
  const firstCourse = view.courses[0]

  return {
    progressLabel: gradebook?.courseTitle ?? firstCourse?.title ?? 'Course progress',
    progressValue,
    nextLesson: firstCourse ? `Continue ${firstCourse.title}` : 'Choose a course',
    nextAssignment: nextAssignment ? `${nextAssignment.title} · due ${nextAssignment.dueAt}` : 'No upcoming assignment',
    continueHref: firstCourse ? `/student/courses/${firstCourse.id}` : '/student/courses',
  }
}
