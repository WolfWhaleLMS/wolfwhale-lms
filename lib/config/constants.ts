// WolfWhale LMS - Application Constants

export const APP = {
  name: 'WolfWhale LMS',
  version: '2.0.0',
  supportEmail: 'support@wolfwhale.ca',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://wolfwhale.ca',
} as const

// Grade scale (traditional)
export const GRADE_SCALE = [
  { letter: 'A+', min: 97, max: 100 },
  { letter: 'A', min: 93, max: 96.99 },
  { letter: 'A-', min: 90, max: 92.99 },
  { letter: 'B+', min: 87, max: 89.99 },
  { letter: 'B', min: 83, max: 86.99 },
  { letter: 'B-', min: 80, max: 82.99 },
  { letter: 'C+', min: 77, max: 79.99 },
  { letter: 'C', min: 73, max: 76.99 },
  { letter: 'C-', min: 70, max: 72.99 },
  { letter: 'D+', min: 67, max: 69.99 },
  { letter: 'D', min: 63, max: 66.99 },
  { letter: 'D-', min: 60, max: 62.99 },
  { letter: 'F', min: 0, max: 59.99 },
] as const

export function getLetterGrade(percentage: number): string {
  if (percentage > 100) return 'A+'
  for (const grade of GRADE_SCALE) {
    if (percentage >= grade.min && percentage <= grade.max) {
      return grade.letter
    }
  }
  return 'F'
}

// Subjects
export const SUBJECTS = [
  'Mathematics',
  'English Language Arts',
  'Science',
  'Social Studies',
  'History',
  'Physical Education',
  'Art',
  'Music',
  'French',
  'Computer Science',
  'Other',
] as const

// Grade levels
export const GRADE_LEVELS = [
  'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
  'AP', 'IB', 'College',
] as const

// Semesters
export const SEMESTERS = ['Fall', 'Spring', 'Summer', 'Year-round'] as const

// Assignment types
export const ASSIGNMENT_TYPES = [
  { value: 'homework', label: 'Homework' },
  { value: 'quiz', label: 'Quiz' },
  { value: 'project', label: 'Project' },
  { value: 'exam', label: 'Exam' },
  { value: 'discussion', label: 'Discussion' },
  { value: 'presentation', label: 'Presentation' },
  { value: 'other', label: 'Other' },
] as const

// Submission types
export const SUBMISSION_TYPES = [
  { value: 'text', label: 'Text Entry' },
  { value: 'file', label: 'File Upload' },
  { value: 'link', label: 'URL Link' },
  { value: 'discussion', label: 'Discussion Post' },
  { value: 'multi', label: 'Multiple Types' },
] as const

// File upload limits (bytes)
export const FILE_LIMITS = {
  avatar: 5 * 1024 * 1024, // 5MB
  document: 100 * 1024 * 1024, // 100MB
  submission: 50 * 1024 * 1024, // 50MB
  tenantTotal: 50 * 1024 * 1024 * 1024, // 50GB
} as const

// Session config
export const SESSION = {
  tokenExpiry: 24 * 60 * 60, // 24 hours in seconds
  refreshBefore: 5 * 60, // 5 minutes in seconds
  cookieName: 'wolfwhale_session',
} as const

// Pagination
export const PAGINATION = {
  defaultLimit: 20,
  maxLimit: 100,
  defaultPage: 1,
} as const

// Notification types
export const NOTIFICATION_TYPES = [
  'assignment_due',
  'grade_posted',
  'message_received',
  'enrollment_approved',
  'new_announcement',
  'submission_graded',
  'course_update',
  'system_alert',
] as const

// Attendance statuses
export const ATTENDANCE_STATUSES = [
  { value: 'present', label: 'Present', color: 'green' },
  { value: 'absent', label: 'Absent', color: 'red' },
  { value: 'tardy', label: 'Tardy', color: 'yellow' },
  { value: 'excused', label: 'Excused', color: 'blue' },
  { value: 'online', label: 'Online', color: 'purple' },
] as const
