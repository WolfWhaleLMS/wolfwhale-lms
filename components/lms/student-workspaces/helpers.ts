import type { StudentView } from './types'

export function formatShortDate(value: string) {
  const parsed = new Date(value)
  if (Number.isNaN(parsed.getTime())) return value

  return parsed.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  })
}

export function courseAssignments(view: StudentView, courseId: string) {
  return view.assignments.filter((assignment) => assignment.courseId === courseId)
}

export function courseGrades(view: StudentView, courseId: string) {
  return view.grades.filter((grade) => grade.courseId === courseId)
}

export function courseResources(view: StudentView, courseId: string) {
  return view.resources.filter((resource) => resource.courseId === courseId)
}

export function courseLessons(view: StudentView, courseId: string) {
  return view.lessons.filter((lesson) => lesson.courseId === courseId)
}

export function courseCalendar(view: StudentView, courseId: string) {
  return view.calendar.filter((item) => item.courseId === courseId)
}

export function courseMessages(view: StudentView, courseId: string) {
  return view.messages.filter((message) => message.courseId === courseId)
}

export function courseById(view: StudentView, courseId: string) {
  return view.courses.find((course) => course.id === courseId)
}

export function gradebookForCourse(view: StudentView, courseId: string) {
  return view.gradebook.find((course) => course.courseId === courseId)
}

export function attendanceForCourse(view: StudentView, courseId: string) {
  return view.attendance.find((course) => course.courseId === courseId)
}
