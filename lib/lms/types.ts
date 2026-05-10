export type LmsMembershipRole = 'student' | 'teacher' | 'parent' | 'admin' | 'super_admin'

export interface LmsTenantRecord {
  id: string
  name: string
  slug: string
  status: string
}

export interface LmsUserRecord {
  id: string
  email: string
  firstName: string
  lastName: string
}

export interface LmsMembershipRecord {
  tenantId: string
  userId: string
  role: LmsMembershipRole
  status: string
}

export interface LmsParentLinkRecord {
  tenantId: string
  studentId: string
  parentId: string
  status: string
}

export interface LmsCourseRecord {
  id: string
  tenantId: string
  title: string
  subject: string
  gradeLevel: string
  sectionLabel: string
  termLabel: string
  createdBy: string
  status: string
  gradingPolicy: LmsGradingPolicy
}

export interface LmsEnrollmentRecord {
  tenantId: string
  courseId: string
  studentId: string
  teacherId: string
  status: string
}

export interface LmsAssignmentRecord {
  id: string
  tenantId: string
  courseId: string
  title: string
  instructions: string
  dueAt: string
  maxPoints: number
  status: string
  category: string
}

export interface LmsSubmissionRecord {
  id: string
  tenantId: string
  assignmentId: string
  studentId: string
  content: string
  filePath: string
  fileName: string
  submissionUrl: string
  status: string
  submittedAt: string
}

export interface LmsGradeRecord {
  id: string
  tenantId: string
  assignmentId: string
  studentId: string
  courseId: string
  pointsEarned: number
  percentage: number
  letterGrade: string
  feedback: string
  gradedAt: string
  rubricScores: LmsRubricScore[]
}

export interface LmsNotificationRecord {
  id: string
  tenantId: string
  userId: string
  title: string
  message: string
  read: boolean
  createdAt: string
}

export interface LmsAuditRecord {
  id: string
  tenantId: string
  action: string
  resourceType: string
  createdAt: string
}

export interface LmsLessonRecord {
  id: string
  tenantId: string
  courseId: string
  title: string
  status: string
}

export interface LmsResourceRecord {
  id: string
  lessonId: string
  fileName: string
  fileType: string
  displayName: string
  scanStatus: string
  scanProvider: string
  legalHold: boolean
  retentionExpiresAt: string
  quarantineReason: string
}

export interface LmsConversationRecord {
  id: string
  tenantId: string
  subject: string
  courseId: string
  createdBy: string
  updatedAt: string
}

export interface LmsConversationMemberRecord {
  conversationId: string
  userId: string
}

export interface LmsMessageRecord {
  id: string
  tenantId: string
  conversationId: string
  senderId: string
  content: string
  createdAt: string
}

export interface LmsRubricRecord {
  id: string
  tenantId: string
  assignmentId: string
  name: string
  description: string
  criteria: LmsRubricCriterion[]
  createdBy: string
}

export type LmsAttendanceStatus = 'present' | 'absent' | 'tardy' | 'excused' | 'online'

export interface LmsAttendanceRecord {
  id: string
  tenantId: string
  courseId: string
  studentId: string
  attendanceDate: string
  status: LmsAttendanceStatus
  notes: string
  markedBy: string
}

export interface LmsCalendarEventRecord {
  id: string
  tenantId: string
  courseId: string
  title: string
  description: string
  startsAt: string
  endsAt: string
  status: string
  createdBy: string
}

export interface LmsGradingPolicyCategory {
  name: string
  weight: number
}

export interface LmsGradingPolicy {
  categories: LmsGradingPolicyCategory[]
}

export interface LmsRubricCriterion {
  name: string
  points: number
}

export interface LmsRubricScore {
  name: string
  points: number
}

export interface LmsRecords {
  actorIds: {
    admin: string
    teacher: string
    student: string
    guardian: string
  }
  tenant: LmsTenantRecord
  users: LmsUserRecord[]
  memberships: LmsMembershipRecord[]
  parentLinks: LmsParentLinkRecord[]
  courses: LmsCourseRecord[]
  enrollments: LmsEnrollmentRecord[]
  assignments: LmsAssignmentRecord[]
  submissions: LmsSubmissionRecord[]
  grades: LmsGradeRecord[]
  notifications: LmsNotificationRecord[]
  auditTrail: LmsAuditRecord[]
  lessons: LmsLessonRecord[]
  resources: LmsResourceRecord[]
  conversations: LmsConversationRecord[]
  conversationMembers: LmsConversationMemberRecord[]
  messages: LmsMessageRecord[]
  rubrics: LmsRubricRecord[]
  attendance: LmsAttendanceRecord[]
  calendarEvents: LmsCalendarEventRecord[]
}

export interface LmsPerson {
  id: string
  name: string
}

export interface LmsCourseSummary {
  id: string
  title: string
  subject: string
  gradeLevel: string
  sectionLabel: string
  termLabel: string
}

export interface LmsAssignmentSummary {
  id: string
  courseId: string
  courseTitle: string
  title: string
  category: string
  instructions: string
  dueAt: string
  maxPoints: number
  status: string
}

export interface LmsGradeSummary {
  assignmentId: string
  courseId: string
  courseTitle: string
  assignmentTitle: string
  scoreLabel: string
  feedback: string
}

export interface LmsLessonSummary {
  id: string
  courseId: string
  courseTitle: string
  title: string
  status: string
}

export interface LmsGradingQueueItem {
  submissionId: string
  assignmentTitle: string
  studentName: string
  submittedAt: string
  maxPoints: number
  fileName: string
}

export interface LmsCalendarItem {
  id: string
  courseId: string
  title: string
  courseTitle: string
  dueAt: string
  status: string
}

export interface LmsResourceSummary {
  id: string
  lessonId: string
  courseId: string
  title: string
  courseTitle: string
  fileName: string
  fileType: string
  scanStatus: string
  scanProvider: string
  legalHold: boolean
  retentionExpiresAt: string
  quarantineReason: string
}

export interface LmsMessageSummary {
  id: string
  courseId: string
  subject: string
  senderName: string
  content: string
  createdAt: string
}

export type LmsRiskLevel = 'good' | 'watch' | 'high'

export interface LmsGradebookStudentSummary {
  studentId: string
  studentName: string
  currentPercentage: number
  letterGrade: string
  gradedAssignments: number
  missingAssignments: number
  attendanceRate: number
  riskLevel: LmsRiskLevel
}

export interface LmsGradebookCourseSummary {
  courseId: string
  courseTitle: string
  categoryWeights: LmsGradingPolicyCategory[]
  students: LmsGradebookStudentSummary[]
}

export interface LmsStudentGradebookSummary {
  courseId: string
  courseTitle: string
  currentPercentage: number
  letterGrade: string
  gradedAssignments: number
  missingAssignments: number
  attendanceRate: number
  riskLevel: LmsRiskLevel
}

export interface LmsRubricSummary {
  id: string
  assignmentId: string
  assignmentTitle: string
  name: string
  criteriaCount: number
}

export interface LmsAttendanceSummary {
  courseId: string
  courseTitle: string
  present: number
  absent: number
  tardy: number
  excused: number
  online: number
  attendanceRate: number
}

export interface LmsRiskSummary {
  good: number
  watch: number
  high: number
}
