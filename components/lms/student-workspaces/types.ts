import type { buildLmsDashboardViews } from '@/lib/lms/read-model'

export type StudentView = ReturnType<typeof buildLmsDashboardViews>['student']
export type StudentCourse = StudentView['courses'][number]
export type StudentAssignment = StudentView['assignments'][number]
