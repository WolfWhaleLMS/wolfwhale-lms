import { z } from 'zod';

// Auth Schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
  role: z.enum(['student', 'parent', 'teacher']),
  schoolCode: z.string().optional(),
  acceptTerms: z.boolean().refine((val) => val === true, {
    message: 'You must accept the terms and conditions',
  }),
  acceptCOPPA: z.boolean().optional(),
});

// Course Schemas
export const createCourseSchema = z.object({
  name: z.string().min(1, 'Course name is required').max(255),
  code: z.string().min(1, 'Course code is required').max(50),
  description: z.string().max(1000).optional(),
  academicTermId: z.string().uuid('Invalid academic term'),
  gradeLevelStart: z.number().min(0, 'Invalid grade level').max(12),
  gradeLevelEnd: z.number().min(0, 'Invalid grade level').max(12),
  credits: z.number().min(0).optional(),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid hex color').optional(),
});

export const updateCourseSchema = createCourseSchema.partial();

// Assignment Schemas
export const createAssignmentSchema = z.object({
  title: z.string().min(1, 'Assignment title is required').max(255),
  description: z.string().min(1, 'Assignment description is required').max(5000),
  type: z.enum(['file_upload', 'text_entry', 'quiz', 'discussion', 'external_url']),
  classId: z.string().uuid('Invalid class'),
  dueDate: z.string().datetime('Invalid due date'),
  pointsPossible: z.number().min(0, 'Points must be non-negative'),
  xpReward: z.number().min(0, 'XP reward must be non-negative'),
  allowLate: z.boolean().default(false),
  latePenaltyPercent: z.number().min(0).max(100).optional(),
  attachments: z.array(z.string().url()).optional(),
  rubricId: z.string().uuid().optional(),
});

export const updateAssignmentSchema = createAssignmentSchema.partial();

// Lesson Schemas
export const createLessonSchema = z.object({
  title: z.string().min(1, 'Lesson title is required').max(255),
  description: z.string().max(5000).optional(),
  content: z.string().min(1, 'Lesson content is required'),
  courseId: z.string().uuid('Invalid course'),
  order: z.number().min(0, 'Order must be non-negative'),
  estimatedDurationMinutes: z.number().min(0).optional(),
  learningObjectives: z.array(z.string()).optional(),
  resources: z.array(z.string().url()).optional(),
});

export const updateLessonSchema = createLessonSchema.partial();

// Grade Schemas
export const gradeSubmissionSchema = z.object({
  submissionId: z.string().uuid('Invalid submission'),
  score: z.number().min(0, 'Score must be non-negative'),
  feedback: z.string().max(5000).optional(),
  rubricScores: z.record(z.number()).optional(),
  awardedXP: z.number().min(0).optional(),
});

// Attendance Schemas
export const attendanceRecordSchema = z.object({
  classId: z.string().uuid('Invalid class'),
  recordDate: z.string().date('Invalid date'),
  attendance: z.array(
    z.object({
      studentId: z.string().uuid('Invalid student'),
      status: z.enum(['present', 'absent', 'late', 'excused']),
      notes: z.string().optional(),
    })
  ),
});

// Message Schemas
export const messageSchema = z.object({
  recipientId: z.string().uuid('Invalid recipient'),
  content: z.string().min(1, 'Message cannot be empty').max(5000),
  conversationId: z.string().uuid().optional(),
  attachments: z.array(z.string().url()).optional(),
});

export const createConversationSchema = z.object({
  participantIds: z.array(z.string().uuid('Invalid participant')).min(1),
  title: z.string().max(255).optional(),
  isGroup: z.boolean().default(false),
});

// Notification Schemas
export const notificationPreferencesSchema = z.object({
  email_assignments: z.boolean().default(true),
  email_grades: z.boolean().default(true),
  email_messages: z.boolean().default(true),
  email_announcements: z.boolean().default(true),
  email_achievements: z.boolean().default(true),
  push_assignments: z.boolean().default(true),
  push_grades: z.boolean().default(true),
  push_messages: z.boolean().default(true),
  push_announcements: z.boolean().default(true),
  push_achievements: z.boolean().default(true),
});

// User Management Schemas
export const createUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100),
  lastName: z.string().min(1, 'Last name is required').max(100),
  email: z.string().email('Invalid email address'),
  role: z.enum(['student', 'parent', 'teacher', 'admin']),
  gradeLevel: z.number().min(0).max(12).optional(),
  parentEmail: z.string().email().optional(),
  dateOfBirth: z.string().date().optional(),
  sendInviteEmail: z.boolean().default(true),
});

export const updateUserSchema = z.object({
  firstName: z.string().max(100).optional(),
  lastName: z.string().max(100).optional(),
  gradeLevel: z.number().min(0).max(12).optional(),
  role: z.enum(['student', 'parent', 'teacher', 'admin']).optional(),
  profilePictureUrl: z.string().url().optional(),
  bio: z.string().max(500).optional(),
});

// School Settings Schemas
export const schoolSettingsSchema = z.object({
  schoolName: z.string().min(1, 'School name is required').max(255),
  schoolCode: z.string().min(1, 'School code is required').max(50),
  address: z.string().max(255).optional(),
  city: z.string().max(100).optional(),
  state: z.string().max(100).optional(),
  zipCode: z.string().max(10).optional(),
  phone: z.string().max(20).optional(),
  website: z.string().url().optional(),
  principal: z.string().max(100).optional(),
  timezone: z.string().default('UTC'),
  academicYearStart: z.string().date().optional(),
  academicYearEnd: z.string().date().optional(),
});

// File Upload Schema
export const fileUploadSchema = z.object({
  bucket: z.enum(['avatars', 'assignments', 'content', 'media']),
  file: z.instanceof(File),
  path: z.string().min(1, 'File path is required'),
});

// Pagination Schema
export const paginationSchema = z.object({
  page: z.number().min(1).default(1),
  pageSize: z.number().min(1).max(100).default(20),
  sortBy: z.string().optional(),
  sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

// Filter Schemas
export const assignmentFilterSchema = paginationSchema.extend({
  classId: z.string().uuid().optional(),
  status: z.enum(['draft', 'published', 'archived']).optional(),
  dueDateFrom: z.string().datetime().optional(),
  dueDateTo: z.string().datetime().optional(),
});

export const gradeFilterSchema = paginationSchema.extend({
  classId: z.string().uuid().optional(),
  studentId: z.string().uuid().optional(),
  minGrade: z.number().min(0).optional(),
  maxGrade: z.number().max(100).optional(),
});

export const attendanceFilterSchema = paginationSchema.extend({
  classId: z.string().uuid().optional(),
  studentId: z.string().uuid().optional(),
  dateFrom: z.string().date().optional(),
  dateTo: z.string().date().optional(),
  status: z.enum(['present', 'absent', 'late', 'excused']).optional(),
});

