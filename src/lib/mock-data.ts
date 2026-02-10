/**
 * Mock data for Student Dashboard
 * This will be replaced with real Supabase queries later.
 */

import type { GradeLevel } from '@/types/database.types';

/* ── Student Profile ───────────────────────────────── */

export interface MockStudentProfile {
  id: string;
  firstName: string;
  lastName: string;
  gradeLevel: GradeLevel;
  email: string;
  profilePictureUrl: string | null;
  tenantId: string;
}

export const mockStudentProfile: MockStudentProfile = {
  id: 'student-001',
  firstName: 'Alex',
  lastName: 'Johnson',
  gradeLevel: '4',
  email: 'alex.johnson@wolfwhale.school',
  profilePictureUrl: null,
  tenantId: 'tenant-001',
};

/* ── Pet Data ──────────────────────────────────────── */

export interface MockPetData {
  id: string;
  name: string;
  species: string;
  stage: string;
  emoji: string;
  happiness: number;
  energy: number;
  knowledge: number;
  health: number;
  totalXP: number;
}

export const mockPetData: MockPetData = {
  id: 'pet-001',
  name: 'Luna',
  species: 'Silver Wolf',
  stage: 'adolescent',
  emoji: '\uD83D\uDC3A',
  happiness: 85,
  energy: 72,
  knowledge: 64,
  health: 91,
  totalXP: 1850,
};

/* ── XP / Level Data ───────────────────────────────── */

export interface MockXPData {
  totalXP: number;
  currentLevel: number;
  currentTier: string;
  nextLevelXP: number;
  previousLevelXP: number;
  coinsBalance: number;
  dailyStreak: number;
  longestStreak: number;
  weeklyXPEarned: number;
  dailyXPEarned: number;
}

export const mockXPData: MockXPData = {
  totalXP: 3250,
  currentLevel: 12,
  currentTier: 'Alpha Tracker',
  nextLevelXP: 3850,
  previousLevelXP: 3000,
  coinsBalance: 245,
  dailyStreak: 7,
  longestStreak: 14,
  weeklyXPEarned: 350,
  dailyXPEarned: 45,
};

/* ── Tasks / Assignments ───────────────────────────── */

export type TaskStatus = 'overdue' | 'due_soon' | 'upcoming' | 'submitted' | 'in_progress' | 'not_started';

export interface MockTask {
  id: string;
  title: string;
  courseName: string;
  courseColor: string;
  dueDate: string;
  dueDateLabel: string;
  status: TaskStatus;
  pointsPossible: number;
  xpReward: number;
  type: string;
}

export const mockTasks: MockTask[] = [
  {
    id: 'task-001',
    title: 'Math Problem Set Ch. 5',
    courseName: 'Mathematics',
    courseColor: '#3b82f6',
    dueDate: '2026-02-08T23:59:00',
    dueDateLabel: 'Yesterday',
    status: 'overdue',
    pointsPossible: 100,
    xpReward: 30,
    type: 'text_entry',
  },
  {
    id: 'task-002',
    title: 'Reading Response: Charlotte\'s Web',
    courseName: 'English Language Arts',
    courseColor: '#8b5cf6',
    dueDate: '2026-02-09T23:59:00',
    dueDateLabel: 'Today',
    status: 'due_soon',
    pointsPossible: 50,
    xpReward: 20,
    type: 'text_entry',
  },
  {
    id: 'task-003',
    title: 'Science Lab Report',
    courseName: 'Science',
    courseColor: '#10b981',
    dueDate: '2026-02-10T23:59:00',
    dueDateLabel: 'Tomorrow',
    status: 'due_soon',
    pointsPossible: 75,
    xpReward: 25,
    type: 'file_upload',
  },
  {
    id: 'task-004',
    title: 'History Timeline Project',
    courseName: 'Social Studies',
    courseColor: '#f59e0b',
    dueDate: '2026-02-13T23:59:00',
    dueDateLabel: 'Thu, Feb 13',
    status: 'in_progress',
    pointsPossible: 150,
    xpReward: 40,
    type: 'file_upload',
  },
  {
    id: 'task-005',
    title: 'Art Portfolio Piece #3',
    courseName: 'Art',
    courseColor: '#ec4899',
    dueDate: '2026-02-14T23:59:00',
    dueDateLabel: 'Fri, Feb 14',
    status: 'not_started',
    pointsPossible: 80,
    xpReward: 20,
    type: 'file_upload',
  },
];

/* ── Classes ───────────────────────────────────────── */

export interface MockClass {
  id: string;
  name: string;
  teacherName: string;
  roomNumber: string;
  color: string;
  iconEmoji: string;
  schedule: string;
  nextAssignmentDue: string;
  studentCount: number;
  averageGrade: number;
  recentActivity: string;
}

export const mockClasses: MockClass[] = [
  {
    id: 'class-001',
    name: 'Mathematics',
    teacherName: 'Ms. Chen',
    roomNumber: '201',
    color: '#3b82f6',
    iconEmoji: '\uD83D\uDCCF',
    schedule: 'Mon/Wed/Fri 9:00 AM',
    nextAssignmentDue: 'Overdue',
    studentCount: 24,
    averageGrade: 88,
    recentActivity: 'New lesson posted',
  },
  {
    id: 'class-002',
    name: 'English Language Arts',
    teacherName: 'Mr. Patterson',
    roomNumber: '305',
    color: '#8b5cf6',
    iconEmoji: '\uD83D\uDCDA',
    schedule: 'Tue/Thu 10:00 AM',
    nextAssignmentDue: 'Today',
    studentCount: 22,
    averageGrade: 91,
    recentActivity: 'Quiz graded',
  },
  {
    id: 'class-003',
    name: 'Science',
    teacherName: 'Dr. Martinez',
    roomNumber: '102',
    color: '#10b981',
    iconEmoji: '\uD83D\uDD2C',
    schedule: 'Mon/Wed 1:00 PM',
    nextAssignmentDue: 'Tomorrow',
    studentCount: 26,
    averageGrade: 85,
    recentActivity: 'Lab report assigned',
  },
  {
    id: 'class-004',
    name: 'Social Studies',
    teacherName: 'Mrs. Williams',
    roomNumber: '204',
    color: '#f59e0b',
    iconEmoji: '\uD83C\uDF0D',
    schedule: 'Tue/Thu 1:00 PM',
    nextAssignmentDue: 'Feb 13',
    studentCount: 28,
    averageGrade: 90,
    recentActivity: 'Discussion posted',
  },
  {
    id: 'class-005',
    name: 'Art',
    teacherName: 'Ms. Rivera',
    roomNumber: '108',
    color: '#ec4899',
    iconEmoji: '\uD83C\uDFA8',
    schedule: 'Fri 2:00 PM',
    nextAssignmentDue: 'Feb 14',
    studentCount: 20,
    averageGrade: 95,
    recentActivity: 'Portfolio review',
  },
];

/* ── Attendance ────────────────────────────────────── */

export interface MockAttendanceDay {
  date: string;
  dayLabel: string;
  status: 'present' | 'absent' | 'late' | 'excused' | 'future';
}

export const mockAttendance: MockAttendanceDay[] = [
  { date: '2026-02-02', dayLabel: 'Mon', status: 'present' },
  { date: '2026-02-03', dayLabel: 'Tue', status: 'present' },
  { date: '2026-02-04', dayLabel: 'Wed', status: 'present' },
  { date: '2026-02-05', dayLabel: 'Thu', status: 'late' },
  { date: '2026-02-06', dayLabel: 'Fri', status: 'present' },
];

export const mockAttendanceStats = {
  totalDays: 85,
  presentDays: 80,
  absentDays: 2,
  lateDays: 3,
  excusedDays: 0,
  attendanceRate: 94.1,
};

/* ── Recent Grades ─────────────────────────────────── */

export interface MockGrade {
  id: string;
  assignmentTitle: string;
  courseName: string;
  courseColor: string;
  score: number;
  totalPoints: number;
  percentage: number;
  gradedDate: string;
  gradedDateLabel: string;
}

export const mockRecentGrades: MockGrade[] = [
  {
    id: 'grade-001',
    assignmentTitle: 'Math Quiz Ch. 4',
    courseName: 'Mathematics',
    courseColor: '#3b82f6',
    score: 95,
    totalPoints: 100,
    percentage: 95,
    gradedDate: '2026-02-07',
    gradedDateLabel: '2 days ago',
  },
  {
    id: 'grade-002',
    assignmentTitle: 'Essay: My Favorite Book',
    courseName: 'English Language Arts',
    courseColor: '#8b5cf6',
    score: 87,
    totalPoints: 100,
    percentage: 87,
    gradedDate: '2026-02-05',
    gradedDateLabel: '4 days ago',
  },
  {
    id: 'grade-003',
    assignmentTitle: 'Ecosystem Diagram',
    courseName: 'Science',
    courseColor: '#10b981',
    score: 92,
    totalPoints: 100,
    percentage: 92,
    gradedDate: '2026-02-03',
    gradedDateLabel: '6 days ago',
  },
  {
    id: 'grade-004',
    assignmentTitle: 'Map Skills Worksheet',
    courseName: 'Social Studies',
    courseColor: '#f59e0b',
    score: 88,
    totalPoints: 100,
    percentage: 88,
    gradedDate: '2026-02-01',
    gradedDateLabel: '1 week ago',
  },
  {
    id: 'grade-005',
    assignmentTitle: 'Color Wheel Project',
    courseName: 'Art',
    courseColor: '#ec4899',
    score: 98,
    totalPoints: 100,
    percentage: 98,
    gradedDate: '2026-01-30',
    gradedDateLabel: '10 days ago',
  },
];

/* ── Messages ──────────────────────────────────────── */

export interface MockMessage {
  id: string;
  senderName: string;
  senderRole: string;
  subject: string;
  preview: string;
  timestamp: string;
  timestampLabel: string;
  isRead: boolean;
}

export const mockMessages: MockMessage[] = [
  {
    id: 'msg-001',
    senderName: 'Ms. Chen',
    senderRole: 'teacher',
    subject: 'Great work on your quiz!',
    preview: 'Hi Alex, I wanted to let you know that you did an amazing job on...',
    timestamp: '2026-02-09T08:30:00',
    timestampLabel: '2 hours ago',
    isRead: false,
  },
  {
    id: 'msg-002',
    senderName: 'Mr. Patterson',
    senderRole: 'teacher',
    subject: 'Reading response reminder',
    preview: 'Just a friendly reminder that your reading response is due today...',
    timestamp: '2026-02-09T07:15:00',
    timestampLabel: '3 hours ago',
    isRead: false,
  },
  {
    id: 'msg-003',
    senderName: 'Dr. Martinez',
    senderRole: 'teacher',
    subject: 'Lab report feedback',
    preview: 'I have posted feedback on your last lab report. Please review...',
    timestamp: '2026-02-08T15:45:00',
    timestampLabel: 'Yesterday',
    isRead: true,
  },
];

/* ── Calendar Events ───────────────────────────────── */

export interface MockCalendarEvent {
  id: string;
  title: string;
  date: string;
  type: 'assignment' | 'quiz' | 'event' | 'holiday';
  courseName?: string;
  courseColor?: string;
}

export const mockCalendarEvents: MockCalendarEvent[] = [
  { id: 'evt-001', title: 'Math Problem Set', date: '2026-02-08', type: 'assignment', courseName: 'Mathematics', courseColor: '#3b82f6' },
  { id: 'evt-002', title: 'Reading Response', date: '2026-02-09', type: 'assignment', courseName: 'English Language Arts', courseColor: '#8b5cf6' },
  { id: 'evt-003', title: 'Science Lab Report', date: '2026-02-10', type: 'assignment', courseName: 'Science', courseColor: '#10b981' },
  { id: 'evt-004', title: 'History Timeline', date: '2026-02-13', type: 'assignment', courseName: 'Social Studies', courseColor: '#f59e0b' },
  { id: 'evt-005', title: 'Art Portfolio', date: '2026-02-14', type: 'assignment', courseName: 'Art', courseColor: '#ec4899' },
  { id: 'evt-006', title: 'Presidents\' Day', date: '2026-02-16', type: 'holiday' },
  { id: 'evt-007', title: 'Science Quiz', date: '2026-02-17', type: 'quiz', courseName: 'Science', courseColor: '#10b981' },
  { id: 'evt-008', title: 'Math Test Ch. 5', date: '2026-02-20', type: 'quiz', courseName: 'Mathematics', courseColor: '#3b82f6' },
  { id: 'evt-009', title: 'Book Report', date: '2026-02-21', type: 'assignment', courseName: 'English Language Arts', courseColor: '#8b5cf6' },
  { id: 'evt-010', title: 'Parent-Teacher Conf.', date: '2026-02-25', type: 'event' },
];

/* ── Detailed Grade Data (for Grades Page) ────────── */

export interface MockClassGradeAssignment {
  id: string;
  name: string;
  type: 'homework' | 'quiz' | 'project' | 'exam' | 'lab' | 'essay' | 'discussion';
  score: number;
  totalPoints: number;
  percentage: number;
  gradedDate: string;
  feedback?: string;
  weight: string;
}

export interface MockClassGrade {
  id: string;
  className: string;
  teacher: string;
  color: string;
  iconEmoji: string;
  currentGrade: number;
  letterGrade: string;
  trend: 'up' | 'down' | 'stable';
  trendHistory: { week: string; grade: number }[];
  gpaPoints: number;
  assignmentsDone: number;
  assignmentsTotal: number;
  assignments: MockClassGradeAssignment[];
}

export const mockClassGrades: MockClassGrade[] = [
  {
    id: 'cg-001',
    className: 'Mathematics',
    teacher: 'Ms. Chen',
    color: '#3b82f6',
    iconEmoji: '\uD83D\uDCCF',
    currentGrade: 92,
    letterGrade: 'A',
    trend: 'up',
    trendHistory: [
      { week: 'W1', grade: 85 },
      { week: 'W2', grade: 87 },
      { week: 'W3', grade: 90 },
      { week: 'W4', grade: 88 },
      { week: 'W5', grade: 91 },
      { week: 'W6', grade: 92 },
    ],
    gpaPoints: 4.0,
    assignmentsDone: 8,
    assignmentsTotal: 10,
    assignments: [
      { id: 'a-001', name: 'Problem Set 1', type: 'homework', score: 95, totalPoints: 100, percentage: 95, gradedDate: '2026-01-13', weight: 'Homework', feedback: 'Excellent work!' },
      { id: 'a-002', name: 'Quiz 1: Fractions', type: 'quiz', score: 88, totalPoints: 100, percentage: 88, gradedDate: '2026-01-17', weight: 'Quiz', feedback: 'Review question 5.' },
      { id: 'a-003', name: 'Problem Set 2', type: 'homework', score: 92, totalPoints: 100, percentage: 92, gradedDate: '2026-01-22', weight: 'Homework' },
      { id: 'a-004', name: 'Quiz 2: Decimals', type: 'quiz', score: 90, totalPoints: 100, percentage: 90, gradedDate: '2026-01-27', weight: 'Quiz' },
      { id: 'a-005', name: 'Midterm Exam', type: 'exam', score: 91, totalPoints: 100, percentage: 91, gradedDate: '2026-01-31', weight: 'Exam', feedback: 'Strong performance overall.' },
      { id: 'a-006', name: 'Problem Set 3', type: 'homework', score: 94, totalPoints: 100, percentage: 94, gradedDate: '2026-02-03', weight: 'Homework' },
      { id: 'a-007', name: 'Quiz 3: Geometry', type: 'quiz', score: 93, totalPoints: 100, percentage: 93, gradedDate: '2026-02-05', weight: 'Quiz' },
      { id: 'a-008', name: 'Math Quiz Ch. 4', type: 'quiz', score: 95, totalPoints: 100, percentage: 95, gradedDate: '2026-02-07', weight: 'Quiz', feedback: 'Outstanding!' },
    ],
  },
  {
    id: 'cg-002',
    className: 'English Language Arts',
    teacher: 'Mr. Patterson',
    color: '#8b5cf6',
    iconEmoji: '\uD83D\uDCDA',
    currentGrade: 87,
    letterGrade: 'B',
    trend: 'stable',
    trendHistory: [
      { week: 'W1', grade: 86 },
      { week: 'W2', grade: 88 },
      { week: 'W3', grade: 85 },
      { week: 'W4', grade: 87 },
      { week: 'W5', grade: 86 },
      { week: 'W6', grade: 87 },
    ],
    gpaPoints: 3.0,
    assignmentsDone: 6,
    assignmentsTotal: 9,
    assignments: [
      { id: 'a-009', name: 'Reading Response 1', type: 'essay', score: 88, totalPoints: 100, percentage: 88, gradedDate: '2026-01-14', weight: 'Essay' },
      { id: 'a-010', name: 'Vocabulary Quiz 1', type: 'quiz', score: 90, totalPoints: 100, percentage: 90, gradedDate: '2026-01-18', weight: 'Quiz' },
      { id: 'a-011', name: 'Book Report: Charlotte\'s Web', type: 'project', score: 85, totalPoints: 100, percentage: 85, gradedDate: '2026-01-24', weight: 'Project', feedback: 'Good analysis, expand on themes.' },
      { id: 'a-012', name: 'Grammar Worksheet', type: 'homework', score: 86, totalPoints: 100, percentage: 86, gradedDate: '2026-01-28', weight: 'Homework' },
      { id: 'a-013', name: 'Essay: My Favorite Book', type: 'essay', score: 87, totalPoints: 100, percentage: 87, gradedDate: '2026-02-05', weight: 'Essay', feedback: 'Nice personal voice.' },
      { id: 'a-014', name: 'Vocabulary Quiz 2', type: 'quiz', score: 84, totalPoints: 100, percentage: 84, gradedDate: '2026-02-07', weight: 'Quiz' },
    ],
  },
  {
    id: 'cg-003',
    className: 'Science',
    teacher: 'Dr. Martinez',
    color: '#10b981',
    iconEmoji: '\uD83D\uDD2C',
    currentGrade: 91,
    letterGrade: 'A',
    trend: 'up',
    trendHistory: [
      { week: 'W1', grade: 82 },
      { week: 'W2', grade: 85 },
      { week: 'W3', grade: 87 },
      { week: 'W4', grade: 89 },
      { week: 'W5', grade: 90 },
      { week: 'W6', grade: 91 },
    ],
    gpaPoints: 4.0,
    assignmentsDone: 7,
    assignmentsTotal: 10,
    assignments: [
      { id: 'a-015', name: 'Lab Report: Plants', type: 'lab', score: 82, totalPoints: 100, percentage: 82, gradedDate: '2026-01-15', weight: 'Lab' },
      { id: 'a-016', name: 'Quiz 1: Ecosystems', type: 'quiz', score: 85, totalPoints: 100, percentage: 85, gradedDate: '2026-01-20', weight: 'Quiz' },
      { id: 'a-017', name: 'Worksheet: Food Chains', type: 'homework', score: 90, totalPoints: 100, percentage: 90, gradedDate: '2026-01-23', weight: 'Homework' },
      { id: 'a-018', name: 'Lab Report: Water Cycle', type: 'lab', score: 92, totalPoints: 100, percentage: 92, gradedDate: '2026-01-28', weight: 'Lab', feedback: 'Great observations!' },
      { id: 'a-019', name: 'Quiz 2: Weather', type: 'quiz', score: 94, totalPoints: 100, percentage: 94, gradedDate: '2026-02-01', weight: 'Quiz' },
      { id: 'a-020', name: 'Ecosystem Diagram', type: 'project', score: 92, totalPoints: 100, percentage: 92, gradedDate: '2026-02-03', weight: 'Project' },
      { id: 'a-021', name: 'Lab Report: Rocks', type: 'lab', score: 93, totalPoints: 100, percentage: 93, gradedDate: '2026-02-06', weight: 'Lab' },
    ],
  },
  {
    id: 'cg-004',
    className: 'Social Studies',
    teacher: 'Mrs. Williams',
    color: '#f59e0b',
    iconEmoji: '\uD83C\uDF0D',
    currentGrade: 78,
    letterGrade: 'C',
    trend: 'down',
    trendHistory: [
      { week: 'W1', grade: 85 },
      { week: 'W2', grade: 83 },
      { week: 'W3', grade: 82 },
      { week: 'W4', grade: 80 },
      { week: 'W5', grade: 79 },
      { week: 'W6', grade: 78 },
    ],
    gpaPoints: 2.0,
    assignmentsDone: 6,
    assignmentsTotal: 8,
    assignments: [
      { id: 'a-022', name: 'Map Skills Worksheet', type: 'homework', score: 88, totalPoints: 100, percentage: 88, gradedDate: '2026-01-14', weight: 'Homework' },
      { id: 'a-023', name: 'Quiz 1: Geography', type: 'quiz', score: 82, totalPoints: 100, percentage: 82, gradedDate: '2026-01-20', weight: 'Quiz' },
      { id: 'a-024', name: 'Timeline Project', type: 'project', score: 78, totalPoints: 100, percentage: 78, gradedDate: '2026-01-27', weight: 'Project', feedback: 'Missing some key dates.' },
      { id: 'a-025', name: 'Discussion: Communities', type: 'discussion', score: 75, totalPoints: 100, percentage: 75, gradedDate: '2026-01-30', weight: 'Discussion' },
      { id: 'a-026', name: 'Quiz 2: Government', type: 'quiz', score: 72, totalPoints: 100, percentage: 72, gradedDate: '2026-02-03', weight: 'Quiz', feedback: 'Study chapters 4-5 more carefully.' },
      { id: 'a-027', name: 'Map Skills Worksheet 2', type: 'homework', score: 76, totalPoints: 100, percentage: 76, gradedDate: '2026-02-06', weight: 'Homework' },
    ],
  },
];

/* ── Detailed Attendance Data (for Attendance Page) ── */

export interface MockDetailedAttendance {
  id: string;
  date: string;
  status: 'present' | 'absent' | 'tardy' | 'excused' | 'online';
  courseName?: string;
  courseColor?: string;
  notes?: string;
}

export const mockDetailedAttendance: MockDetailedAttendance[] = [
  { id: 'att-001', date: '2026-01-05', status: 'present', courseName: 'All Classes' },
  { id: 'att-002', date: '2026-01-06', status: 'present', courseName: 'All Classes' },
  { id: 'att-003', date: '2026-01-07', status: 'present', courseName: 'All Classes' },
  { id: 'att-004', date: '2026-01-08', status: 'present', courseName: 'All Classes' },
  { id: 'att-005', date: '2026-01-09', status: 'present', courseName: 'All Classes' },
  { id: 'att-006', date: '2026-01-12', status: 'present', courseName: 'All Classes' },
  { id: 'att-007', date: '2026-01-13', status: 'present', courseName: 'All Classes' },
  { id: 'att-008', date: '2026-01-14', status: 'tardy', courseName: 'Mathematics', courseColor: '#3b82f6', notes: 'Arrived 10 minutes late' },
  { id: 'att-009', date: '2026-01-15', status: 'present', courseName: 'All Classes' },
  { id: 'att-010', date: '2026-01-16', status: 'present', courseName: 'All Classes' },
  { id: 'att-011', date: '2026-01-19', status: 'absent', courseName: 'All Classes', notes: 'Sick day' },
  { id: 'att-012', date: '2026-01-20', status: 'absent', courseName: 'All Classes', notes: 'Sick day' },
  { id: 'att-013', date: '2026-01-21', status: 'present', courseName: 'All Classes' },
  { id: 'att-014', date: '2026-01-22', status: 'present', courseName: 'All Classes' },
  { id: 'att-015', date: '2026-01-23', status: 'present', courseName: 'All Classes' },
  { id: 'att-016', date: '2026-01-26', status: 'present', courseName: 'All Classes' },
  { id: 'att-017', date: '2026-01-27', status: 'present', courseName: 'All Classes' },
  { id: 'att-018', date: '2026-01-28', status: 'present', courseName: 'All Classes' },
  { id: 'att-019', date: '2026-01-29', status: 'tardy', courseName: 'Science', courseColor: '#10b981', notes: 'Bus was late' },
  { id: 'att-020', date: '2026-01-30', status: 'present', courseName: 'All Classes' },
  { id: 'att-021', date: '2026-02-02', status: 'present', courseName: 'All Classes' },
  { id: 'att-022', date: '2026-02-03', status: 'present', courseName: 'All Classes' },
  { id: 'att-023', date: '2026-02-04', status: 'present', courseName: 'All Classes' },
  { id: 'att-024', date: '2026-02-05', status: 'tardy', courseName: 'Mathematics', courseColor: '#3b82f6', notes: 'Arrived 5 minutes late' },
  { id: 'att-025', date: '2026-02-06', status: 'present', courseName: 'All Classes' },
  { id: 'att-026', date: '2026-02-09', status: 'present', courseName: 'All Classes' },
];

export const mockDetailedAttendanceStats = {
  totalDays: 26,
  presentDays: 21,
  absentDays: 2,
  tardyDays: 3,
  excusedDays: 0,
  onlineDays: 0,
  attendanceRate: 92.3,
  perfectWeeks: 3,
  currentStreak: 4,
};

/* ── Enhanced Calendar Events (for Calendar Page) ─── */

export interface MockEnhancedCalendarEvent {
  id: string;
  title: string;
  date: string;
  endDate?: string;
  time?: string;
  type: 'assignment' | 'quiz' | 'event' | 'holiday' | 'class_activity';
  courseName?: string;
  courseColor?: string;
  description?: string;
  priority?: 'high' | 'medium' | 'low';
}

export const mockEnhancedCalendarEvents: MockEnhancedCalendarEvent[] = [
  { id: 'ce-001', title: 'Math Problem Set Ch. 5', date: '2026-02-08', type: 'assignment', courseName: 'Mathematics', courseColor: '#3b82f6', priority: 'high', description: 'Complete problems 1-20 from chapter 5' },
  { id: 'ce-002', title: 'Reading Response Due', date: '2026-02-09', type: 'assignment', courseName: 'English Language Arts', courseColor: '#8b5cf6', priority: 'high', description: 'Write a 2-paragraph response' },
  { id: 'ce-003', title: 'Science Lab Report', date: '2026-02-10', type: 'assignment', courseName: 'Science', courseColor: '#10b981', priority: 'high', description: 'Lab report on rock classification' },
  { id: 'ce-004', title: 'Art Class: Watercolors', date: '2026-02-11', time: '2:00 PM', type: 'class_activity', courseName: 'Art', courseColor: '#ec4899', description: 'Bring watercolor supplies' },
  { id: 'ce-005', title: 'Math Study Group', date: '2026-02-12', time: '3:30 PM', type: 'event', description: 'Library study room B' },
  { id: 'ce-006', title: 'History Timeline Project', date: '2026-02-13', type: 'assignment', courseName: 'Social Studies', courseColor: '#f59e0b', priority: 'medium', description: 'Create a timeline of key events' },
  { id: 'ce-007', title: 'Art Portfolio Piece #3', date: '2026-02-14', type: 'assignment', courseName: 'Art', courseColor: '#ec4899', priority: 'medium' },
  { id: 'ce-008', title: 'Valentine\'s Day Party', date: '2026-02-14', time: '1:00 PM', type: 'event', description: 'Class celebration' },
  { id: 'ce-009', title: 'Presidents\' Day - No School', date: '2026-02-16', type: 'holiday' },
  { id: 'ce-010', title: 'Science Quiz: Rocks & Minerals', date: '2026-02-17', time: '1:00 PM', type: 'quiz', courseName: 'Science', courseColor: '#10b981', priority: 'high', description: 'Covers chapters 6-7' },
  { id: 'ce-011', title: 'ELA Discussion: Poetry', date: '2026-02-18', time: '10:00 AM', type: 'class_activity', courseName: 'English Language Arts', courseColor: '#8b5cf6' },
  { id: 'ce-012', title: 'Math Worksheet', date: '2026-02-19', type: 'assignment', courseName: 'Mathematics', courseColor: '#3b82f6', priority: 'low' },
  { id: 'ce-013', title: 'Math Test Ch. 5', date: '2026-02-20', time: '9:00 AM', type: 'quiz', courseName: 'Mathematics', courseColor: '#3b82f6', priority: 'high', description: 'Chapters 4-5 cumulative test' },
  { id: 'ce-014', title: 'Book Report Due', date: '2026-02-21', type: 'assignment', courseName: 'English Language Arts', courseColor: '#8b5cf6', priority: 'high' },
  { id: 'ce-015', title: 'Science Fair Prep', date: '2026-02-23', time: '1:00 PM', type: 'class_activity', courseName: 'Science', courseColor: '#10b981', description: 'Work on science fair projects in class' },
  { id: 'ce-016', title: 'Social Studies Project', date: '2026-02-24', type: 'assignment', courseName: 'Social Studies', courseColor: '#f59e0b', priority: 'medium' },
  { id: 'ce-017', title: 'Parent-Teacher Conference', date: '2026-02-25', time: '4:00 PM', type: 'event', description: 'Spring parent-teacher conferences' },
  { id: 'ce-018', title: 'Art Show', date: '2026-02-27', time: '6:00 PM', type: 'event', courseName: 'Art', courseColor: '#ec4899', description: 'Student art show in the gymnasium' },
  { id: 'ce-019', title: 'Science Lab: Volcanoes', date: '2026-02-26', time: '1:00 PM', type: 'class_activity', courseName: 'Science', courseColor: '#10b981', description: 'Volcano model building' },
  { id: 'ce-020', title: 'ELA Vocabulary Quiz 3', date: '2026-02-28', time: '10:00 AM', type: 'quiz', courseName: 'English Language Arts', courseColor: '#8b5cf6', priority: 'medium' },
  { id: 'ce-021', title: 'Math Problem Set Ch. 6', date: '2026-03-02', type: 'assignment', courseName: 'Mathematics', courseColor: '#3b82f6', priority: 'medium' },
  { id: 'ce-022', title: 'Science Fair', date: '2026-03-05', time: '9:00 AM', type: 'event', courseName: 'Science', courseColor: '#10b981', description: 'Annual science fair presentations' },
  { id: 'ce-023', title: 'Spring Break', date: '2026-03-09', endDate: '2026-03-13', type: 'holiday', description: 'No school - Spring Break' },
];

/* ── Achievements ──────────────────────────────────── */

export interface MockAchievement {
  id: string;
  name: string;
  description: string;
  iconEmoji: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  earnedDate: string | null;
}

export const mockAchievements: MockAchievement[] = [
  { id: 'ach-001', name: 'First Steps', description: 'Complete your first assignment', iconEmoji: '\uD83D\uDC63', tier: 'bronze', earnedDate: '2026-01-15' },
  { id: 'ach-002', name: 'Bookworm', description: 'Complete 10 reading assignments', iconEmoji: '\uD83D\uDC1B', tier: 'silver', earnedDate: '2026-01-28' },
  { id: 'ach-003', name: 'Perfect Score', description: 'Get 100% on any assignment', iconEmoji: '\uD83C\uDF1F', tier: 'gold', earnedDate: '2026-02-01' },
  { id: 'ach-004', name: 'Streak Master', description: 'Maintain a 7-day login streak', iconEmoji: '\uD83D\uDD25', tier: 'gold', earnedDate: '2026-02-09' },
  { id: 'ach-005', name: 'Scholar Elite', description: 'Reach Level 15', iconEmoji: '\uD83C\uDFC6', tier: 'platinum', earnedDate: null },
];

/* ── Assignments (Full Detail) ────────────────────── */

export type AssignmentStatus = 'not_started' | 'in_progress' | 'due_soon' | 'overdue' | 'submitted' | 'graded';
export type AssignmentKind = 'homework' | 'quiz' | 'project' | 'exam' | 'discussion';
export type SubmissionType = 'text' | 'file' | 'link' | 'discussion';

export interface MockAssignment {
  id: string;
  title: string;
  description: string;
  instructions: string;
  type: AssignmentKind;
  submissionType: SubmissionType;
  courseName: string;
  courseColor: string;
  courseId: string;
  teacherName: string;
  dueDate: string;
  startDate: string;
  maxPoints: number;
  xpReward: number;
  allowLateSubmission: boolean;
  latePenaltyPercent: number;
  status: AssignmentStatus;
  /** Present only when submitted/graded */
  submission?: MockSubmission;
  /** Present only when graded */
  grade?: MockAssignmentGrade;
  attachments?: { name: string; url: string; size: string }[];
  rubric?: { criterion: string; maxPoints: number; description: string }[];
}

export interface MockSubmission {
  id: string;
  submittedAt: string;
  submittedLate: boolean;
  submissionText?: string;
  filePath?: string;
  fileName?: string;
  submissionUrl?: string;
  status: 'submitted' | 'graded' | 'returned';
}

export interface MockAssignmentGrade {
  id: string;
  pointsEarned: number;
  percentage: number;
  letterGrade: string;
  feedback: string;
  gradedAt: string;
}

export const mockAssignments: MockAssignment[] = [
  {
    id: 'asgn-001',
    title: 'Math Problem Set Ch. 5',
    description: 'Complete problems 1-20 from Chapter 5 on fractions and decimals.',
    instructions: '## Instructions\n\nComplete all 20 problems from Chapter 5. Show your work for each problem.\n\n**Important:**\n* Use pencil or type your answers\n* Show all steps for full credit\n* Check your work before submitting\n\nProblems cover:\n* Adding and subtracting fractions\n* Converting between fractions and decimals\n* Word problems with fractions',
    type: 'homework',
    submissionType: 'text',
    courseName: 'Mathematics',
    courseColor: '#3b82f6',
    courseId: 'class-001',
    teacherName: 'Ms. Chen',
    dueDate: '2026-02-08T23:59:00',
    startDate: '2026-02-03T08:00:00',
    maxPoints: 100,
    xpReward: 30,
    allowLateSubmission: true,
    latePenaltyPercent: 10,
    status: 'overdue',
    rubric: [
      { criterion: 'Correct Answers', maxPoints: 60, description: '3 points per correct answer' },
      { criterion: 'Work Shown', maxPoints: 30, description: 'Must show steps for each problem' },
      { criterion: 'Neatness', maxPoints: 10, description: 'Clear and organized work' },
    ],
  },
  {
    id: 'asgn-002',
    title: "Reading Response: Charlotte's Web",
    description: 'Write a reading response about chapters 10-15 of Charlotte\'s Web.',
    instructions: "## Reading Response\n\nWrite a thoughtful response about chapters 10-15 of Charlotte's Web.\n\nYour response should include:\n* A brief summary of what happened\n* Your favorite part and why\n* How do you think the story will end?\n* One question you have about the story\n\nWrite at least 3 paragraphs. Use details from the book to support your ideas!",
    type: 'homework',
    submissionType: 'text',
    courseName: 'English Language Arts',
    courseColor: '#8b5cf6',
    courseId: 'class-002',
    teacherName: 'Mr. Patterson',
    dueDate: '2026-02-09T23:59:00',
    startDate: '2026-02-05T08:00:00',
    maxPoints: 50,
    xpReward: 20,
    allowLateSubmission: true,
    latePenaltyPercent: 5,
    status: 'due_soon',
  },
  {
    id: 'asgn-003',
    title: 'Science Lab Report: Plant Growth',
    description: 'Write up your lab report on the plant growth experiment we conducted in class.',
    instructions: '## Lab Report: Plant Growth Experiment\n\nWrite a complete lab report for our plant growth experiment. Use the template below:\n\n### Sections Required:\n1. **Title** - Name of the experiment\n2. **Hypothesis** - What did you think would happen?\n3. **Materials** - List everything we used\n4. **Procedure** - Step-by-step what we did\n5. **Observations** - What did you see? Include your data table\n6. **Conclusion** - Was your hypothesis correct? What did you learn?\n\nUpload your report as a PDF or Word document. Include any photos or drawings of your plants.',
    type: 'project',
    submissionType: 'file',
    courseName: 'Science',
    courseColor: '#10b981',
    courseId: 'class-003',
    teacherName: 'Dr. Martinez',
    dueDate: '2026-02-10T23:59:00',
    startDate: '2026-02-03T13:00:00',
    maxPoints: 75,
    xpReward: 25,
    allowLateSubmission: true,
    latePenaltyPercent: 15,
    status: 'in_progress',
    attachments: [
      { name: 'Lab Report Template.docx', url: '#', size: '245 KB' },
      { name: 'Data Table Example.pdf', url: '#', size: '120 KB' },
    ],
    rubric: [
      { criterion: 'Hypothesis', maxPoints: 10, description: 'Clear, testable hypothesis' },
      { criterion: 'Procedure', maxPoints: 15, description: 'Detailed, step-by-step procedure' },
      { criterion: 'Data & Observations', maxPoints: 25, description: 'Complete data table with accurate observations' },
      { criterion: 'Conclusion', maxPoints: 20, description: 'Thoughtful analysis connecting results to hypothesis' },
      { criterion: 'Formatting', maxPoints: 5, description: 'Follows template, neat and organized' },
    ],
  },
  {
    id: 'asgn-004',
    title: 'History Timeline Project',
    description: 'Create an illustrated timeline of key events in American history from 1776-1800.',
    instructions: '## American History Timeline (1776-1800)\n\nCreate a detailed, illustrated timeline covering the founding period of America.\n\n### Requirements:\n* At least 12 events on your timeline\n* Each event needs a date, title, and 2-3 sentence description\n* Include at least 4 illustrations or images\n* Timeline must be neat and colorful\n* Can be done digitally or on poster board\n\n### Key Events to Include:\n* Declaration of Independence (1776)\n* Battle of Yorktown (1781)\n* Constitutional Convention (1787)\n* Bill of Rights (1791)\n* Add at least 8 more events of your choosing!',
    type: 'project',
    submissionType: 'file',
    courseName: 'Social Studies',
    courseColor: '#f59e0b',
    courseId: 'class-004',
    teacherName: 'Mrs. Williams',
    dueDate: '2026-02-13T23:59:00',
    startDate: '2026-02-03T13:00:00',
    maxPoints: 150,
    xpReward: 40,
    allowLateSubmission: false,
    latePenaltyPercent: 0,
    status: 'not_started',
  },
  {
    id: 'asgn-005',
    title: 'Art Portfolio Piece #3: Self Portrait',
    description: 'Create a self-portrait using the techniques we learned in class.',
    instructions: '## Self Portrait\n\nCreate a self-portrait using any medium we have studied this semester.\n\n### Options:\n* Colored pencils\n* Watercolor\n* Acrylic paint\n* Mixed media collage\n\n### Requirements:\n* Must be on standard art paper (provided in class)\n* Should fill at least 75% of the page\n* Use proper proportions as we practiced\n* Include a background that tells something about you\n* Write a short artist statement (3-5 sentences) about your choices',
    type: 'homework',
    submissionType: 'file',
    courseName: 'Art',
    courseColor: '#ec4899',
    courseId: 'class-005',
    teacherName: 'Ms. Rivera',
    dueDate: '2026-02-14T23:59:00',
    startDate: '2026-02-07T14:00:00',
    maxPoints: 80,
    xpReward: 20,
    allowLateSubmission: true,
    latePenaltyPercent: 10,
    status: 'not_started',
  },
  {
    id: 'asgn-006',
    title: 'Math Quiz Ch. 4: Multiplication',
    description: 'Quiz covering multiplication facts and multi-digit multiplication.',
    instructions: '## Math Quiz - Chapter 4\n\nThis quiz covers multiplication concepts from Chapter 4.\n\n**Topics covered:**\n* Multiplication facts through 12x12\n* Multi-digit multiplication\n* Word problems\n* Estimation\n\n**Rules:**\n* You have 30 minutes to complete the quiz\n* No calculator allowed\n* Show your work for partial credit',
    type: 'quiz',
    submissionType: 'text',
    courseName: 'Mathematics',
    courseColor: '#3b82f6',
    courseId: 'class-001',
    teacherName: 'Ms. Chen',
    dueDate: '2026-02-05T10:00:00',
    startDate: '2026-02-05T09:00:00',
    maxPoints: 100,
    xpReward: 25,
    allowLateSubmission: false,
    latePenaltyPercent: 0,
    status: 'graded',
    submission: {
      id: 'sub-006',
      submittedAt: '2026-02-05T09:28:00',
      submittedLate: false,
      submissionText: 'Completed all quiz questions in class.',
      status: 'graded',
    },
    grade: {
      id: 'grade-006',
      pointsEarned: 95,
      percentage: 95,
      letterGrade: 'A',
      feedback: 'Excellent work, Alex! You only missed one problem on multi-digit multiplication. Your work was very neat and well-organized. Keep it up!',
      gradedAt: '2026-02-07T14:30:00',
    },
  },
  {
    id: 'asgn-007',
    title: 'Ecosystem Diagram',
    description: 'Create a diagram showing a local ecosystem with at least 8 organisms.',
    instructions: '## Ecosystem Diagram\n\nDraw and label a diagram of a local ecosystem.\n\n### Must Include:\n* At least 8 different organisms\n* Producers, consumers, and decomposers labeled\n* Food chain arrows showing energy flow\n* Habitat description (forest, pond, meadow, etc.)\n* Title and your name\n\n### Bonus Points:\n* Include a food web (not just a chain)\n* Add abiotic factors (sun, water, soil)\n* Color your diagram',
    type: 'homework',
    submissionType: 'file',
    courseName: 'Science',
    courseColor: '#10b981',
    courseId: 'class-003',
    teacherName: 'Dr. Martinez',
    dueDate: '2026-02-01T23:59:00',
    startDate: '2026-01-27T13:00:00',
    maxPoints: 100,
    xpReward: 30,
    allowLateSubmission: true,
    latePenaltyPercent: 10,
    status: 'graded',
    submission: {
      id: 'sub-007',
      submittedAt: '2026-02-01T20:15:00',
      submittedLate: false,
      fileName: 'Alex_Ecosystem_Diagram.pdf',
      filePath: '/submissions/alex-ecosystem.pdf',
      status: 'graded',
    },
    grade: {
      id: 'grade-007',
      pointsEarned: 92,
      percentage: 92,
      letterGrade: 'A-',
      feedback: 'Great ecosystem diagram! Your food web was very detailed and accurate. I especially liked how you included both terrestrial and aquatic organisms. For next time, try to include more abiotic factors. Overall, wonderful work!',
      gradedAt: '2026-02-03T16:00:00',
    },
  },
  {
    id: 'asgn-008',
    title: 'Book Report: My Favorite Book',
    description: 'Write a book report on a book of your choosing that you read this semester.',
    instructions: '## Book Report\n\nWrite a book report on any book you have read this semester.\n\n### Include:\n* **Title and Author** of the book\n* **Summary** - What is the book about? (1 paragraph)\n* **Characters** - Describe the main characters (1 paragraph)\n* **Favorite Part** - What was your favorite part and why? (1 paragraph)\n* **Recommendation** - Would you recommend this book? Why or why not? (1 paragraph)\n* **Rating** - Give it a star rating (1-5 stars)\n\n### Format:\n* At least 4 paragraphs\n* Typed or neatly handwritten\n* Include the book title and author at the top',
    type: 'homework',
    submissionType: 'text',
    courseName: 'English Language Arts',
    courseColor: '#8b5cf6',
    courseId: 'class-002',
    teacherName: 'Mr. Patterson',
    dueDate: '2026-02-03T23:59:00',
    startDate: '2026-01-20T10:00:00',
    maxPoints: 100,
    xpReward: 30,
    allowLateSubmission: true,
    latePenaltyPercent: 5,
    status: 'submitted',
    submission: {
      id: 'sub-008',
      submittedAt: '2026-02-03T21:45:00',
      submittedLate: false,
      submissionText: "# Book Report: Hatchet by Gary Paulsen\n\n## Summary\nHatchet is about a boy named Brian Robeson who survives a plane crash in the Canadian wilderness. With only a hatchet his mother gave him, Brian must learn to find food, build shelter, and stay alive. The story follows his 54 days alone in the wild as he transforms from a scared city kid into a resourceful survivor.\n\n## Characters\nBrian Robeson is the main character. He is 13 years old and starts out feeling sorry for himself because his parents are getting divorced. But as he faces challenges in the wilderness, he becomes brave and smart. He learns to think before acting and never gives up even when things seem impossible.\n\n## My Favorite Part\nMy favorite part was when Brian finally figured out how to make fire using his hatchet and a rock. He had been trying for so long and was about to give up. When the sparks finally caught the birch bark, I felt so happy for him. It showed that persistence pays off.\n\n## Recommendation\nI would absolutely recommend Hatchet to anyone who likes adventure stories. It teaches you about survival skills and also about never giving up. I give it 5 out of 5 stars!",
      status: 'submitted',
    },
  },
];

/* ── Course Detail Data (for Course & Class Pages) ──── */

export interface MockCourseDetail {
  id: string;
  name: string;
  code: string;
  teacherName: string;
  teacherInitials: string;
  teacherAvatar?: string;
  subject: string;
  subjectColor: string;
  subjectIcon: string;
  gradeLevel: GradeLevel;
  section: string;
  period: string;
  room: string;
  term: string;
  schedule: string;
  description: string;
  currentGrade: number;
  progressPercent: number;
  unreadCount: number;
  assignmentsDue: number;
  lastVisited: string;
  studentCount: number;
  isMuted: boolean;
}

export const mockCourseDetails: MockCourseDetail[] = [
  {
    id: 'class-001',
    name: 'Mathematics',
    code: 'MATH4A',
    teacherName: 'Ms. Chen',
    teacherInitials: 'MC',
    subject: 'Mathematics',
    subjectColor: '#3b82f6',
    subjectIcon: '\uD83D\uDCCF',
    gradeLevel: '4',
    section: 'Section A',
    period: 'Period 1',
    room: 'Room 201',
    term: 'Spring 2026',
    schedule: 'Mon/Wed/Fri 9:00 AM',
    description: 'Explore numbers, fractions, geometry, and problem-solving strategies for 4th graders.',
    currentGrade: 88,
    progressPercent: 72,
    unreadCount: 2,
    assignmentsDue: 1,
    lastVisited: '2026-02-09T08:30:00',
    studentCount: 24,
    isMuted: false,
  },
  {
    id: 'class-002',
    name: 'English Language Arts',
    code: 'ELA4B',
    teacherName: 'Mr. Patterson',
    teacherInitials: 'JP',
    subject: 'English',
    subjectColor: '#8b5cf6',
    subjectIcon: '\uD83D\uDCDA',
    gradeLevel: '4',
    section: 'Section B',
    period: 'Period 2',
    room: 'Room 305',
    term: 'Spring 2026',
    schedule: 'Tue/Thu 10:00 AM',
    description: 'Reading comprehension, creative writing, grammar, and vocabulary building.',
    currentGrade: 91,
    progressPercent: 65,
    unreadCount: 1,
    assignmentsDue: 1,
    lastVisited: '2026-02-08T14:00:00',
    studentCount: 22,
    isMuted: false,
  },
  {
    id: 'class-003',
    name: 'Science',
    code: 'SCI4A',
    teacherName: 'Dr. Martinez',
    teacherInitials: 'DM',
    subject: 'Science',
    subjectColor: '#10b981',
    subjectIcon: '\uD83D\uDD2C',
    gradeLevel: '4',
    section: 'Section A',
    period: 'Period 4',
    room: 'Room 102',
    term: 'Spring 2026',
    schedule: 'Mon/Wed 1:00 PM',
    description: 'Hands-on experiments and discovery in life science, earth science, and physical science.',
    currentGrade: 85,
    progressPercent: 70,
    unreadCount: 0,
    assignmentsDue: 1,
    lastVisited: '2026-02-07T13:00:00',
    studentCount: 26,
    isMuted: false,
  },
  {
    id: 'class-004',
    name: 'Social Studies',
    code: 'SS4C',
    teacherName: 'Mrs. Williams',
    teacherInitials: 'AW',
    subject: 'Social Studies',
    subjectColor: '#f59e0b',
    subjectIcon: '\uD83C\uDF0D',
    gradeLevel: '4',
    section: 'Section C',
    period: 'Period 5',
    room: 'Room 204',
    term: 'Spring 2026',
    schedule: 'Tue/Thu 1:00 PM',
    description: 'U.S. history, geography, government, and citizenship for 4th graders.',
    currentGrade: 90,
    progressPercent: 68,
    unreadCount: 3,
    assignmentsDue: 1,
    lastVisited: '2026-02-06T13:30:00',
    studentCount: 28,
    isMuted: true,
  },
];

/* ── Lessons per Course ─────────────────────────────── */

export interface MockCourseLesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  orderIndex: number;
  status: 'completed' | 'in_progress' | 'locked' | 'available';
  duration: number;
  xpReward: number;
  completedDate?: string;
}

export const mockCourseLessons: MockCourseLesson[] = [
  { id: 'lesson-001', courseId: 'class-001', title: 'Introduction to Fractions', description: 'Learn what fractions are and how to read them.', orderIndex: 1, status: 'completed', duration: 20, xpReward: 30, completedDate: '2026-01-20' },
  { id: 'lesson-002', courseId: 'class-001', title: 'Adding Fractions', description: 'Learn to add fractions with like denominators.', orderIndex: 2, status: 'completed', duration: 25, xpReward: 30, completedDate: '2026-01-27' },
  { id: 'lesson-003', courseId: 'class-001', title: 'Subtracting Fractions', description: 'Subtract fractions and mixed numbers.', orderIndex: 3, status: 'in_progress', duration: 25, xpReward: 30 },
  { id: 'lesson-004', courseId: 'class-001', title: 'Multiplying Fractions', description: 'Multiply fractions and whole numbers.', orderIndex: 4, status: 'available', duration: 30, xpReward: 35 },
  { id: 'lesson-005', courseId: 'class-001', title: 'Geometry Basics', description: 'Lines, angles, and shapes.', orderIndex: 5, status: 'locked', duration: 30, xpReward: 35 },

  { id: 'lesson-006', courseId: 'class-002', title: 'Reading Comprehension Strategies', description: 'Learn how to understand what you read better.', orderIndex: 1, status: 'completed', duration: 20, xpReward: 30, completedDate: '2026-01-22' },
  { id: 'lesson-007', courseId: 'class-002', title: 'Story Elements', description: 'Characters, setting, plot, and theme.', orderIndex: 2, status: 'completed', duration: 25, xpReward: 30, completedDate: '2026-01-29' },
  { id: 'lesson-008', courseId: 'class-002', title: 'Writing a Paragraph', description: 'Topic sentences, details, and conclusions.', orderIndex: 3, status: 'in_progress', duration: 30, xpReward: 35 },
  { id: 'lesson-009', courseId: 'class-002', title: 'Grammar: Parts of Speech', description: 'Nouns, verbs, adjectives, and adverbs.', orderIndex: 4, status: 'available', duration: 20, xpReward: 25 },

  { id: 'lesson-010', courseId: 'class-003', title: 'The Water Cycle', description: 'Evaporation, condensation, and precipitation.', orderIndex: 1, status: 'completed', duration: 25, xpReward: 30, completedDate: '2026-01-21' },
  { id: 'lesson-011', courseId: 'class-003', title: 'Ecosystems', description: 'How living things interact with their environment.', orderIndex: 2, status: 'completed', duration: 30, xpReward: 35, completedDate: '2026-01-28' },
  { id: 'lesson-012', courseId: 'class-003', title: 'Forces and Motion', description: 'Push, pull, gravity, and friction.', orderIndex: 3, status: 'in_progress', duration: 25, xpReward: 30 },
  { id: 'lesson-013', courseId: 'class-003', title: 'Simple Machines', description: 'Levers, pulleys, and inclined planes.', orderIndex: 4, status: 'locked', duration: 30, xpReward: 35 },
  { id: 'lesson-014', courseId: 'class-003', title: 'Earth\'s Layers', description: 'Crust, mantle, and core.', orderIndex: 5, status: 'locked', duration: 25, xpReward: 30 },

  { id: 'lesson-015', courseId: 'class-004', title: 'Map Skills', description: 'Reading maps, legends, and compass directions.', orderIndex: 1, status: 'completed', duration: 20, xpReward: 25, completedDate: '2026-01-23' },
  { id: 'lesson-016', courseId: 'class-004', title: 'Early American History', description: 'Native Americans and early explorers.', orderIndex: 2, status: 'completed', duration: 30, xpReward: 35, completedDate: '2026-01-30' },
  { id: 'lesson-017', courseId: 'class-004', title: 'The American Revolution', description: 'The fight for independence.', orderIndex: 3, status: 'in_progress', duration: 35, xpReward: 40 },
  { id: 'lesson-018', courseId: 'class-004', title: 'U.S. Government', description: 'Three branches of government.', orderIndex: 4, status: 'available', duration: 25, xpReward: 30 },
];

/* ── Assignments per Course ─────────────────────────── */

export type MockAssignmentStatusCourse = 'not_started' | 'in_progress' | 'submitted' | 'graded' | 'overdue';

export interface MockCourseAssignment {
  id: string;
  courseId: string;
  title: string;
  description: string;
  type: 'homework' | 'quiz' | 'project' | 'exam';
  dueDate: string;
  dueDateLabel: string;
  pointsPossible: number;
  xpReward: number;
  status: MockAssignmentStatusCourse;
  score?: number;
  grade?: string;
  submittedDate?: string;
  gradedDate?: string;
  feedback?: string;
}

export const mockCourseAssignments: MockCourseAssignment[] = [
  { id: 'ca-001', courseId: 'class-001', title: 'Fractions Practice Worksheet', description: 'Complete problems 1-20 on adding and subtracting fractions.', type: 'homework', dueDate: '2026-02-07T23:59:00', dueDateLabel: '2 days ago', pointsPossible: 100, xpReward: 30, status: 'graded', score: 92, grade: 'A', submittedDate: '2026-02-06', gradedDate: '2026-02-07', feedback: 'Great work! Watch out for simplifying answers.' },
  { id: 'ca-002', courseId: 'class-001', title: 'Math Problem Set Ch. 5', description: 'Mixed practice on fractions, decimals, and word problems.', type: 'homework', dueDate: '2026-02-08T23:59:00', dueDateLabel: 'Yesterday', pointsPossible: 100, xpReward: 30, status: 'overdue' },
  { id: 'ca-003', courseId: 'class-001', title: 'Fraction Quiz', description: 'Timed quiz covering all fraction operations.', type: 'quiz', dueDate: '2026-02-14T23:59:00', dueDateLabel: 'Feb 14', pointsPossible: 50, xpReward: 20, status: 'not_started' },

  { id: 'ca-004', courseId: 'class-002', title: 'Essay: My Favorite Book', description: 'Write a 3-paragraph essay about your favorite book.', type: 'project', dueDate: '2026-02-05T23:59:00', dueDateLabel: '4 days ago', pointsPossible: 100, xpReward: 35, status: 'graded', score: 87, grade: 'B+', submittedDate: '2026-02-04', gradedDate: '2026-02-05', feedback: 'Good thesis. Add more supporting details.' },
  { id: 'ca-005', courseId: 'class-002', title: 'Reading Response: Charlotte\'s Web', description: 'Answer comprehension questions about chapters 5-8.', type: 'homework', dueDate: '2026-02-09T23:59:00', dueDateLabel: 'Today', pointsPossible: 50, xpReward: 20, status: 'in_progress' },
  { id: 'ca-006', courseId: 'class-002', title: 'Vocabulary Quiz Unit 6', description: 'Spelling and definitions for Unit 6 words.', type: 'quiz', dueDate: '2026-02-12T23:59:00', dueDateLabel: 'Feb 12', pointsPossible: 40, xpReward: 15, status: 'not_started' },
  { id: 'ca-007', courseId: 'class-002', title: 'Book Report: Bridge to Terabithia', description: 'Full book report with summary, analysis, and review.', type: 'project', dueDate: '2026-02-21T23:59:00', dueDateLabel: 'Feb 21', pointsPossible: 150, xpReward: 50, status: 'not_started' },

  { id: 'ca-008', courseId: 'class-003', title: 'Ecosystem Diagram', description: 'Draw and label a food web for a chosen ecosystem.', type: 'project', dueDate: '2026-02-03T23:59:00', dueDateLabel: '6 days ago', pointsPossible: 100, xpReward: 30, status: 'graded', score: 95, grade: 'A', submittedDate: '2026-02-02', gradedDate: '2026-02-03', feedback: 'Excellent diagram! Very detailed and accurate.' },
  { id: 'ca-009', courseId: 'class-003', title: 'Science Lab Report', description: 'Write up your observations from the forces experiment.', type: 'homework', dueDate: '2026-02-10T23:59:00', dueDateLabel: 'Tomorrow', pointsPossible: 75, xpReward: 25, status: 'submitted', submittedDate: '2026-02-09' },

  { id: 'ca-010', courseId: 'class-004', title: 'Map Skills Worksheet', description: 'Practice using map legends, scale, and compass rose.', type: 'homework', dueDate: '2026-02-01T23:59:00', dueDateLabel: '1 week ago', pointsPossible: 100, xpReward: 25, status: 'graded', score: 88, grade: 'B+', submittedDate: '2026-01-31', gradedDate: '2026-02-01', feedback: 'Good work, review scale calculations.' },
  { id: 'ca-011', courseId: 'class-004', title: 'History Timeline Project', description: 'Create a timeline of major events in early American history.', type: 'project', dueDate: '2026-02-13T23:59:00', dueDateLabel: 'Feb 13', pointsPossible: 150, xpReward: 40, status: 'in_progress' },
];

/* ── Announcements per Course ───────────────────────── */

export interface MockCourseAnnouncement {
  id: string;
  courseId: string;
  title: string;
  content: string;
  authorName: string;
  authorInitials: string;
  isPinned: boolean;
  createdAt: string;
  createdAtLabel: string;
  isRead: boolean;
}

export const mockCourseAnnouncements: MockCourseAnnouncement[] = [
  { id: 'ann-001', courseId: 'class-001', title: 'Fraction Quiz on Friday!', content: 'Hi everyone! We will have a quiz on fractions this Friday. Please review chapters 5 and 6. Remember to practice both adding and subtracting fractions with unlike denominators.', authorName: 'Ms. Chen', authorInitials: 'MC', isPinned: true, createdAt: '2026-02-08T09:00:00', createdAtLabel: 'Yesterday', isRead: false },
  { id: 'ann-002', courseId: 'class-001', title: 'New Lesson Materials Available', content: 'I have posted the new lesson on multiplying fractions. You can find the materials in the Lessons tab. There are also extra practice worksheets for those who want additional help.', authorName: 'Ms. Chen', authorInitials: 'MC', isPinned: false, createdAt: '2026-02-06T14:30:00', createdAtLabel: '3 days ago', isRead: true },

  { id: 'ann-003', courseId: 'class-002', title: 'Reading Response Due Today', content: 'Friendly reminder that your Charlotte\'s Web reading response is due tonight by 11:59 PM. Make sure to answer all three questions with complete sentences.', authorName: 'Mr. Patterson', authorInitials: 'JP', isPinned: true, createdAt: '2026-02-09T07:00:00', createdAtLabel: 'Today', isRead: false },
  { id: 'ann-004', courseId: 'class-002', title: 'Book Report Assignment Posted', content: 'The Bridge to Terabithia book report has been posted. You will have two weeks to complete it. Start reading early!', authorName: 'Mr. Patterson', authorInitials: 'JP', isPinned: false, createdAt: '2026-02-07T10:00:00', createdAtLabel: '2 days ago', isRead: true },

  { id: 'ann-005', courseId: 'class-003', title: 'Lab Safety Reminder', content: 'As we start our new unit on forces and motion, please remember to wear your safety goggles during experiments. Also, bring a notebook to record your observations.', authorName: 'Dr. Martinez', authorInitials: 'DM', isPinned: false, createdAt: '2026-02-05T11:00:00', createdAtLabel: '4 days ago', isRead: true },
  { id: 'ann-006', courseId: 'class-003', title: 'Science Fair Sign-Up', content: 'The school science fair is coming up in March! If you would like to participate, please sign up by February 20th.', authorName: 'Dr. Martinez', authorInitials: 'DM', isPinned: false, createdAt: '2026-02-03T09:00:00', createdAtLabel: '6 days ago', isRead: true },

  { id: 'ann-007', courseId: 'class-004', title: 'Field Trip Permission Slips', content: 'We are going on a field trip to the History Museum on February 28th! Please have your parents sign the permission slip and return it by February 21st.', authorName: 'Mrs. Williams', authorInitials: 'AW', isPinned: true, createdAt: '2026-02-09T08:00:00', createdAtLabel: 'Today', isRead: false },
  { id: 'ann-008', courseId: 'class-004', title: 'Timeline Project Tips', content: 'Here are some tips for your timeline project: 1) Include at least 10 events. 2) Use colors to categorize events. 3) Add illustrations. 4) Write a brief description for each event.', authorName: 'Mrs. Williams', authorInitials: 'AW', isPinned: false, createdAt: '2026-02-07T13:00:00', createdAtLabel: '2 days ago', isRead: true },
  { id: 'ann-009', courseId: 'class-004', title: 'Guest Speaker Next Week', content: 'We will have a special guest speaker next Tuesday! A local historian will be talking about the American Revolution. Please prepare two questions to ask.', authorName: 'Mrs. Williams', authorInitials: 'AW', isPinned: false, createdAt: '2026-02-05T10:00:00', createdAtLabel: '4 days ago', isRead: true },
];

/* ── Classmates per Course ──────────────────────────── */

export interface MockClassmate {
  id: string;
  courseId: string;
  firstName: string;
  lastName: string;
  initials: string;
  avatarUrl?: string;
  isOnline: boolean;
}

export const mockClassmatesData: MockClassmate[] = [
  { id: 'mate-001', courseId: 'class-001', firstName: 'Jordan', lastName: 'Smith', initials: 'JS', isOnline: true },
  { id: 'mate-002', courseId: 'class-001', firstName: 'Emma', lastName: 'Wilson', initials: 'EW', isOnline: false },
  { id: 'mate-003', courseId: 'class-001', firstName: 'Liam', lastName: 'Brown', initials: 'LB', isOnline: true },
  { id: 'mate-004', courseId: 'class-001', firstName: 'Sophia', lastName: 'Johnson', initials: 'SJ', isOnline: false },
  { id: 'mate-005', courseId: 'class-001', firstName: 'Noah', lastName: 'Davis', initials: 'ND', isOnline: false },
  { id: 'mate-006', courseId: 'class-001', firstName: 'Olivia', lastName: 'Miller', initials: 'OM', isOnline: true },

  { id: 'mate-007', courseId: 'class-002', firstName: 'Jordan', lastName: 'Smith', initials: 'JS', isOnline: true },
  { id: 'mate-008', courseId: 'class-002', firstName: 'Mia', lastName: 'Garcia', initials: 'MG', isOnline: false },
  { id: 'mate-009', courseId: 'class-002', firstName: 'Ethan', lastName: 'Lee', initials: 'EL', isOnline: true },
  { id: 'mate-010', courseId: 'class-002', firstName: 'Ava', lastName: 'Thomas', initials: 'AT', isOnline: false },
  { id: 'mate-011', courseId: 'class-002', firstName: 'Lucas', lastName: 'Anderson', initials: 'LA', isOnline: false },

  { id: 'mate-012', courseId: 'class-003', firstName: 'Emma', lastName: 'Wilson', initials: 'EW', isOnline: false },
  { id: 'mate-013', courseId: 'class-003', firstName: 'Liam', lastName: 'Brown', initials: 'LB', isOnline: true },
  { id: 'mate-014', courseId: 'class-003', firstName: 'Isabella', lastName: 'Martinez', initials: 'IM', isOnline: true },
  { id: 'mate-015', courseId: 'class-003', firstName: 'Mason', lastName: 'Taylor', initials: 'MT', isOnline: false },
  { id: 'mate-016', courseId: 'class-003', firstName: 'Charlotte', lastName: 'White', initials: 'CW', isOnline: false },

  { id: 'mate-017', courseId: 'class-004', firstName: 'Sophia', lastName: 'Johnson', initials: 'SJ', isOnline: false },
  { id: 'mate-018', courseId: 'class-004', firstName: 'Aiden', lastName: 'Clark', initials: 'AC', isOnline: true },
  { id: 'mate-019', courseId: 'class-004', firstName: 'Harper', lastName: 'Lewis', initials: 'HL', isOnline: false },
  { id: 'mate-020', courseId: 'class-004', firstName: 'Jackson', lastName: 'Walker', initials: 'JW', isOnline: true },
];

/* ── Gradebook per Course ───────────────────────────── */

export interface MockGradebookEntry {
  id: string;
  courseId: string;
  assignmentTitle: string;
  category: string;
  pointsEarned: number | null;
  pointsPossible: number;
  percentage: number | null;
  letterGrade: string | null;
  gradedDate: string | null;
}

export const mockGradebookEntries: MockGradebookEntry[] = [
  { id: 'gb-001', courseId: 'class-001', assignmentTitle: 'Fractions Practice Worksheet', category: 'Homework', pointsEarned: 92, pointsPossible: 100, percentage: 92, letterGrade: 'A', gradedDate: '2026-02-07' },
  { id: 'gb-002', courseId: 'class-001', assignmentTitle: 'Math Quiz Ch. 4', category: 'Quizzes', pointsEarned: 47, pointsPossible: 50, percentage: 94, letterGrade: 'A', gradedDate: '2026-02-03' },
  { id: 'gb-003', courseId: 'class-001', assignmentTitle: 'Problem Set Ch. 3', category: 'Homework', pointsEarned: 85, pointsPossible: 100, percentage: 85, letterGrade: 'B', gradedDate: '2026-01-27' },
  { id: 'gb-004', courseId: 'class-001', assignmentTitle: 'Unit 1 Test', category: 'Tests', pointsEarned: 88, pointsPossible: 100, percentage: 88, letterGrade: 'B+', gradedDate: '2026-01-20' },
  { id: 'gb-005', courseId: 'class-001', assignmentTitle: 'Math Problem Set Ch. 5', category: 'Homework', pointsEarned: null, pointsPossible: 100, percentage: null, letterGrade: null, gradedDate: null },

  { id: 'gb-006', courseId: 'class-002', assignmentTitle: 'Essay: My Favorite Book', category: 'Writing', pointsEarned: 87, pointsPossible: 100, percentage: 87, letterGrade: 'B+', gradedDate: '2026-02-05' },
  { id: 'gb-007', courseId: 'class-002', assignmentTitle: 'Vocabulary Quiz Unit 5', category: 'Quizzes', pointsEarned: 38, pointsPossible: 40, percentage: 95, letterGrade: 'A', gradedDate: '2026-01-29' },
  { id: 'gb-008', courseId: 'class-002', assignmentTitle: 'Reading Response Ch. 1-4', category: 'Homework', pointsEarned: 45, pointsPossible: 50, percentage: 90, letterGrade: 'A-', gradedDate: '2026-01-24' },

  { id: 'gb-009', courseId: 'class-003', assignmentTitle: 'Ecosystem Diagram', category: 'Projects', pointsEarned: 95, pointsPossible: 100, percentage: 95, letterGrade: 'A', gradedDate: '2026-02-03' },
  { id: 'gb-010', courseId: 'class-003', assignmentTitle: 'Water Cycle Quiz', category: 'Quizzes', pointsEarned: 42, pointsPossible: 50, percentage: 84, letterGrade: 'B', gradedDate: '2026-01-28' },
  { id: 'gb-011', courseId: 'class-003', assignmentTitle: 'Lab Report: Water Cycle', category: 'Labs', pointsEarned: 70, pointsPossible: 75, percentage: 93, letterGrade: 'A', gradedDate: '2026-01-22' },

  { id: 'gb-012', courseId: 'class-004', assignmentTitle: 'Map Skills Worksheet', category: 'Homework', pointsEarned: 88, pointsPossible: 100, percentage: 88, letterGrade: 'B+', gradedDate: '2026-02-01' },
  { id: 'gb-013', courseId: 'class-004', assignmentTitle: 'Early America Quiz', category: 'Quizzes', pointsEarned: 46, pointsPossible: 50, percentage: 92, letterGrade: 'A-', gradedDate: '2026-01-27' },
  { id: 'gb-014', courseId: 'class-004', assignmentTitle: 'Geography Worksheet', category: 'Homework', pointsEarned: 90, pointsPossible: 100, percentage: 90, letterGrade: 'A-', gradedDate: '2026-01-20' },
];
