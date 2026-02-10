/**
 * Mock data for Teacher Flows
 * 3 classes with 8-12 students each, mix of graded/ungraded submissions,
 * attendance records for current week.
 */

export interface MockTeacherStudent {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string | null;
  gradeLevel: string;
  enrollmentStatus: 'active' | 'inactive' | 'withdrawn';
  enrolledAt: string;
  averageGrade: number | null;
  attendanceRate: number;
}

export interface MockTeacherCourse {
  id: string;
  name: string;
  description: string;
  subject: string;
  gradeLevel: string;
  period: number;
  room: string;
  semester: string;
  startDate: string;
  endDate: string;
  status: 'active' | 'draft' | 'archived';
  enrollmentCode: string;
  enrollmentMethod: 'manual' | 'code' | 'auto';
  studentCount: number;
  averageGrade: number;
  attendanceRate: number;
  lastActivity: string;
  color: string;
  iconEmoji: string;
  students: MockTeacherStudent[];
}

export interface MockTeacherLesson {
  id: string;
  courseId: string;
  title: string;
  description: string;
  content: string;
  orderIndex: number;
  status: 'draft' | 'published' | 'archived';
  publishedAt: string | null;
  createdAt: string;
}

export interface MockTeacherAssignment {
  id: string;
  courseId: string;
  courseName: string;
  title: string;
  description: string;
  instructions: string;
  type: 'homework' | 'quiz' | 'project' | 'exam' | 'discussion';
  dueDate: string;
  maxPoints: number;
  submissionType: 'text' | 'file' | 'link' | 'discussion';
  allowLateSubmission: boolean;
  lateSubmissionDays: number;
  status: 'draft' | 'published' | 'archived';
  createdAt: string;
  totalSubmissions: number;
  gradedSubmissions: number;
}

export interface MockTeacherSubmission {
  id: string;
  assignmentId: string;
  assignmentTitle: string;
  studentId: string;
  studentName: string;
  submissionText: string | null;
  filePath: string | null;
  fileName: string | null;
  submittedAt: string;
  submittedLate: boolean;
  status: 'submitted' | 'graded' | 'returned';
  grade: {
    pointsEarned: number;
    percentage: number;
    letterGrade: string;
    feedback: string;
  } | null;
}

export interface MockTeacherAttendanceRecord {
  studentId: string;
  studentName: string;
  status: 'present' | 'absent' | 'tardy' | 'excused' | null;
  notes: string;
}

export interface MockTeacherMessage {
  id: string;
  senderName: string;
  senderRole: string;
  subject: string;
  preview: string;
  timestamp: string;
  isRead: boolean;
}

// ----------------------------------------------------------------
// Students pools (shared across classes)
// ----------------------------------------------------------------

const studentsPool: MockTeacherStudent[] = [
  { id: 'stu-001', firstName: 'Emma', lastName: 'Wilson', email: 'emma.w@school.edu', avatarUrl: null, gradeLevel: '9', enrollmentStatus: 'active', enrolledAt: '2026-01-06', averageGrade: 92, attendanceRate: 98 },
  { id: 'stu-002', firstName: 'Liam', lastName: 'Brown', email: 'liam.b@school.edu', avatarUrl: null, gradeLevel: '9', enrollmentStatus: 'active', enrolledAt: '2026-01-06', averageGrade: 78, attendanceRate: 90 },
  { id: 'stu-003', firstName: 'Sophia', lastName: 'Johnson', email: 'sophia.j@school.edu', avatarUrl: null, gradeLevel: '9', enrollmentStatus: 'active', enrolledAt: '2026-01-06', averageGrade: 95, attendanceRate: 100 },
  { id: 'stu-004', firstName: 'Noah', lastName: 'Davis', email: 'noah.d@school.edu', avatarUrl: null, gradeLevel: '9', enrollmentStatus: 'active', enrolledAt: '2026-01-06', averageGrade: 68, attendanceRate: 85 },
  { id: 'stu-005', firstName: 'Olivia', lastName: 'Miller', email: 'olivia.m@school.edu', avatarUrl: null, gradeLevel: '9', enrollmentStatus: 'active', enrolledAt: '2026-01-06', averageGrade: 88, attendanceRate: 95 },
  { id: 'stu-006', firstName: 'Ethan', lastName: 'Garcia', email: 'ethan.g@school.edu', avatarUrl: null, gradeLevel: '9', enrollmentStatus: 'active', enrolledAt: '2026-01-06', averageGrade: 72, attendanceRate: 88 },
  { id: 'stu-007', firstName: 'Ava', lastName: 'Martinez', email: 'ava.m@school.edu', avatarUrl: null, gradeLevel: '9', enrollmentStatus: 'active', enrolledAt: '2026-01-06', averageGrade: 85, attendanceRate: 93 },
  { id: 'stu-008', firstName: 'Mason', lastName: 'Anderson', email: 'mason.a@school.edu', avatarUrl: null, gradeLevel: '9', enrollmentStatus: 'active', enrolledAt: '2026-01-06', averageGrade: 91, attendanceRate: 97 },
  { id: 'stu-009', firstName: 'Isabella', lastName: 'Thomas', email: 'isabella.t@school.edu', avatarUrl: null, gradeLevel: '9', enrollmentStatus: 'active', enrolledAt: '2026-01-08', averageGrade: 76, attendanceRate: 87 },
  { id: 'stu-010', firstName: 'James', lastName: 'Jackson', email: 'james.j@school.edu', avatarUrl: null, gradeLevel: '9', enrollmentStatus: 'active', enrolledAt: '2026-01-06', averageGrade: 83, attendanceRate: 92 },
  { id: 'stu-011', firstName: 'Mia', lastName: 'White', email: 'mia.w@school.edu', avatarUrl: null, gradeLevel: '10', enrollmentStatus: 'active', enrolledAt: '2026-01-06', averageGrade: 97, attendanceRate: 100 },
  { id: 'stu-012', firstName: 'Lucas', lastName: 'Harris', email: 'lucas.h@school.edu', avatarUrl: null, gradeLevel: '10', enrollmentStatus: 'active', enrolledAt: '2026-01-06', averageGrade: 89, attendanceRate: 95 },
  { id: 'stu-013', firstName: 'Charlotte', lastName: 'Clark', email: 'charlotte.c@school.edu', avatarUrl: null, gradeLevel: '10', enrollmentStatus: 'active', enrolledAt: '2026-01-06', averageGrade: 94, attendanceRate: 98 },
  { id: 'stu-014', firstName: 'Benjamin', lastName: 'Lewis', email: 'benjamin.l@school.edu', avatarUrl: null, gradeLevel: '10', enrollmentStatus: 'active', enrolledAt: '2026-01-06', averageGrade: 62, attendanceRate: 80 },
  { id: 'stu-015', firstName: 'Amelia', lastName: 'Robinson', email: 'amelia.r@school.edu', avatarUrl: null, gradeLevel: '10', enrollmentStatus: 'active', enrolledAt: '2026-01-06', averageGrade: 86, attendanceRate: 93 },
  { id: 'stu-016', firstName: 'Alexander', lastName: 'Walker', email: 'alex.w@school.edu', avatarUrl: null, gradeLevel: '10', enrollmentStatus: 'active', enrolledAt: '2026-01-06', averageGrade: 79, attendanceRate: 90 },
  { id: 'stu-017', firstName: 'Harper', lastName: 'Young', email: 'harper.y@school.edu', avatarUrl: null, gradeLevel: '10', enrollmentStatus: 'active', enrolledAt: '2026-01-06', averageGrade: 91, attendanceRate: 96 },
  { id: 'stu-018', firstName: 'Daniel', lastName: 'King', email: 'daniel.k@school.edu', avatarUrl: null, gradeLevel: '10', enrollmentStatus: 'active', enrolledAt: '2026-01-06', averageGrade: 74, attendanceRate: 86 },
  { id: 'stu-019', firstName: 'Ella', lastName: 'Wright', email: 'ella.w@school.edu', avatarUrl: null, gradeLevel: '11', enrollmentStatus: 'active', enrolledAt: '2026-01-06', averageGrade: 96, attendanceRate: 99 },
  { id: 'stu-020', firstName: 'Henry', lastName: 'Lopez', email: 'henry.l@school.edu', avatarUrl: null, gradeLevel: '11', enrollmentStatus: 'active', enrolledAt: '2026-01-06', averageGrade: 88, attendanceRate: 94 },
  { id: 'stu-021', firstName: 'Grace', lastName: 'Hill', email: 'grace.h@school.edu', avatarUrl: null, gradeLevel: '11', enrollmentStatus: 'active', enrolledAt: '2026-01-06', averageGrade: 92, attendanceRate: 97 },
  { id: 'stu-022', firstName: 'Sebastian', lastName: 'Scott', email: 'sebastian.s@school.edu', avatarUrl: null, gradeLevel: '11', enrollmentStatus: 'active', enrolledAt: '2026-01-06', averageGrade: 71, attendanceRate: 83 },
  { id: 'stu-023', firstName: 'Chloe', lastName: 'Green', email: 'chloe.g@school.edu', avatarUrl: null, gradeLevel: '11', enrollmentStatus: 'active', enrolledAt: '2026-01-06', averageGrade: 84, attendanceRate: 91 },
  { id: 'stu-024', firstName: 'Jack', lastName: 'Adams', email: 'jack.a@school.edu', avatarUrl: null, gradeLevel: '11', enrollmentStatus: 'active', enrolledAt: '2026-01-06', averageGrade: 77, attendanceRate: 89 },
  { id: 'stu-025', firstName: 'Lily', lastName: 'Nelson', email: 'lily.n@school.edu', avatarUrl: null, gradeLevel: '11', enrollmentStatus: 'active', enrolledAt: '2026-01-06', averageGrade: 90, attendanceRate: 95 },
  { id: 'stu-026', firstName: 'Owen', lastName: 'Carter', email: 'owen.c@school.edu', avatarUrl: null, gradeLevel: '11', enrollmentStatus: 'inactive', enrolledAt: '2026-01-06', averageGrade: 65, attendanceRate: 78 },
];

// ----------------------------------------------------------------
// Courses
// ----------------------------------------------------------------

export const mockTeacherCourses: MockTeacherCourse[] = [
  {
    id: 'tc-001',
    name: 'Algebra 1 - Period 2',
    description: 'Introduction to algebraic concepts including linear equations, inequalities, and functions.',
    subject: 'Mathematics',
    gradeLevel: '9',
    period: 2,
    room: '201',
    semester: 'Spring 2026',
    startDate: '2026-01-06',
    endDate: '2026-05-29',
    status: 'active',
    enrollmentCode: 'WOLF42A',
    enrollmentMethod: 'code',
    studentCount: 10,
    averageGrade: 84,
    attendanceRate: 93,
    lastActivity: '2026-02-09T10:30:00',
    color: '#3b82f6',
    iconEmoji: '\u{1F4D0}',
    students: studentsPool.slice(0, 10),
  },
  {
    id: 'tc-002',
    name: 'Geometry - Period 4',
    description: 'Study of shapes, angles, theorems, and geometric proofs.',
    subject: 'Mathematics',
    gradeLevel: '10',
    period: 4,
    room: '201',
    semester: 'Spring 2026',
    startDate: '2026-01-06',
    endDate: '2026-05-29',
    status: 'active',
    enrollmentCode: 'WOLF42B',
    enrollmentMethod: 'code',
    studentCount: 8,
    averageGrade: 87,
    attendanceRate: 95,
    lastActivity: '2026-02-09T14:15:00',
    color: '#8b5cf6',
    iconEmoji: '\u{1F4D0}',
    students: studentsPool.slice(10, 18),
  },
  {
    id: 'tc-003',
    name: 'Pre-Calculus - Period 6',
    description: 'Advanced algebra, trigonometry, and analytic geometry in preparation for calculus.',
    subject: 'Mathematics',
    gradeLevel: '11',
    period: 6,
    room: '205',
    semester: 'Spring 2026',
    startDate: '2026-01-06',
    endDate: '2026-05-29',
    status: 'active',
    enrollmentCode: 'WOLF42C',
    enrollmentMethod: 'code',
    studentCount: 8,
    averageGrade: 83,
    attendanceRate: 91,
    lastActivity: '2026-02-08T15:00:00',
    color: '#10b981',
    iconEmoji: '\u{1F4D0}',
    students: studentsPool.slice(18, 26),
  },
];

// ----------------------------------------------------------------
// Lessons
// ----------------------------------------------------------------

export const mockTeacherLessons: MockTeacherLesson[] = [
  // Algebra 1
  { id: 'tl-001', courseId: 'tc-001', title: 'Introduction to Variables', description: 'Understanding what variables represent in math.', content: 'Variables are symbols...', orderIndex: 1, status: 'published', publishedAt: '2026-01-06T09:00:00', createdAt: '2026-01-04' },
  { id: 'tl-002', courseId: 'tc-001', title: 'Solving Linear Equations', description: 'Step-by-step methods for solving one-variable equations.', content: 'To solve a linear equation...', orderIndex: 2, status: 'published', publishedAt: '2026-01-13T09:00:00', createdAt: '2026-01-10' },
  { id: 'tl-003', courseId: 'tc-001', title: 'Graphing Linear Functions', description: 'Plotting y = mx + b on the coordinate plane.', content: 'A linear function can be graphed...', orderIndex: 3, status: 'published', publishedAt: '2026-01-20T09:00:00', createdAt: '2026-01-17' },
  { id: 'tl-004', courseId: 'tc-001', title: 'Systems of Equations', description: 'Solving two equations with two unknowns.', content: 'A system of equations is...', orderIndex: 4, status: 'published', publishedAt: '2026-01-27T09:00:00', createdAt: '2026-01-24' },
  { id: 'tl-005', courseId: 'tc-001', title: 'Inequalities', description: 'Solving and graphing linear inequalities.', content: 'An inequality is similar to an equation...', orderIndex: 5, status: 'draft', publishedAt: null, createdAt: '2026-02-05' },
  // Geometry
  { id: 'tl-006', courseId: 'tc-002', title: 'Points, Lines, and Planes', description: 'Fundamental geometric objects.', content: 'In geometry, the most basic objects...', orderIndex: 1, status: 'published', publishedAt: '2026-01-06T11:00:00', createdAt: '2026-01-04' },
  { id: 'tl-007', courseId: 'tc-002', title: 'Angles and Angle Relationships', description: 'Types of angles and their properties.', content: 'An angle is formed by...', orderIndex: 2, status: 'published', publishedAt: '2026-01-13T11:00:00', createdAt: '2026-01-10' },
  { id: 'tl-008', courseId: 'tc-002', title: 'Triangle Congruence', description: 'SSS, SAS, ASA, AAS theorems.', content: 'Two triangles are congruent if...', orderIndex: 3, status: 'published', publishedAt: '2026-01-20T11:00:00', createdAt: '2026-01-17' },
  { id: 'tl-009', courseId: 'tc-002', title: 'Quadrilaterals', description: 'Properties of parallelograms, rectangles, rhombi, and trapezoids.', content: 'A quadrilateral is a polygon with four sides...', orderIndex: 4, status: 'draft', publishedAt: null, createdAt: '2026-02-03' },
  // Pre-Calculus
  { id: 'tl-010', courseId: 'tc-003', title: 'Functions and Their Graphs', description: 'Review of function notation and transformations.', content: 'A function f(x) maps each input...', orderIndex: 1, status: 'published', publishedAt: '2026-01-06T13:00:00', createdAt: '2026-01-04' },
  { id: 'tl-011', courseId: 'tc-003', title: 'Polynomial Functions', description: 'Higher-degree polynomials and their behavior.', content: 'A polynomial function is...', orderIndex: 2, status: 'published', publishedAt: '2026-01-13T13:00:00', createdAt: '2026-01-10' },
  { id: 'tl-012', courseId: 'tc-003', title: 'Trigonometric Functions', description: 'Sine, cosine, tangent and their applications.', content: 'Trigonometric functions relate angles to ratios...', orderIndex: 3, status: 'published', publishedAt: '2026-01-27T13:00:00', createdAt: '2026-01-24' },
];

// ----------------------------------------------------------------
// Assignments
// ----------------------------------------------------------------

export const mockTeacherAssignments: MockTeacherAssignment[] = [
  // Algebra 1
  { id: 'ta-001', courseId: 'tc-001', courseName: 'Algebra 1 - Period 2', title: 'Problem Set: Linear Equations', description: 'Solve 20 linear equations.', instructions: 'Complete problems 1-20 on page 85.', type: 'homework', dueDate: '2026-02-03T23:59:00', maxPoints: 100, submissionType: 'text', allowLateSubmission: true, lateSubmissionDays: 3, status: 'published', createdAt: '2026-01-27', totalSubmissions: 10, gradedSubmissions: 10 },
  { id: 'ta-002', courseId: 'tc-001', courseName: 'Algebra 1 - Period 2', title: 'Quiz: Graphing Lines', description: 'Quiz on slope-intercept and point-slope forms.', instructions: 'Answer all 15 questions. Show your work.', type: 'quiz', dueDate: '2026-02-07T10:00:00', maxPoints: 50, submissionType: 'text', allowLateSubmission: false, lateSubmissionDays: 0, status: 'published', createdAt: '2026-02-03', totalSubmissions: 10, gradedSubmissions: 7 },
  { id: 'ta-003', courseId: 'tc-001', courseName: 'Algebra 1 - Period 2', title: 'Systems of Equations Project', description: 'Real-world application of systems of equations.', instructions: 'Find 3 real-world examples that can be modeled with systems of equations. Solve each system and explain your reasoning.', type: 'project', dueDate: '2026-02-14T23:59:00', maxPoints: 150, submissionType: 'file', allowLateSubmission: true, lateSubmissionDays: 5, status: 'published', createdAt: '2026-02-03', totalSubmissions: 4, gradedSubmissions: 0 },
  // Geometry
  { id: 'ta-004', courseId: 'tc-002', courseName: 'Geometry - Period 4', title: 'Angle Relationships Worksheet', description: 'Complementary, supplementary, and vertical angles.', instructions: 'Complete all 25 problems on the worksheet.', type: 'homework', dueDate: '2026-02-05T23:59:00', maxPoints: 100, submissionType: 'text', allowLateSubmission: true, lateSubmissionDays: 2, status: 'published', createdAt: '2026-01-28', totalSubmissions: 8, gradedSubmissions: 8 },
  { id: 'ta-005', courseId: 'tc-002', courseName: 'Geometry - Period 4', title: 'Triangle Proofs', description: 'Prove triangle congruence using theorems.', instructions: 'Complete proofs 1-5. Use the two-column proof format.', type: 'homework', dueDate: '2026-02-10T23:59:00', maxPoints: 100, submissionType: 'file', allowLateSubmission: true, lateSubmissionDays: 3, status: 'published', createdAt: '2026-02-04', totalSubmissions: 5, gradedSubmissions: 2 },
  { id: 'ta-006', courseId: 'tc-002', courseName: 'Geometry - Period 4', title: 'Midterm Exam', description: 'Covers chapters 1-5.', instructions: 'Complete all sections. You have 90 minutes.', type: 'exam', dueDate: '2026-02-20T14:00:00', maxPoints: 200, submissionType: 'text', allowLateSubmission: false, lateSubmissionDays: 0, status: 'draft', createdAt: '2026-02-07', totalSubmissions: 0, gradedSubmissions: 0 },
  // Pre-Calculus
  { id: 'ta-007', courseId: 'tc-003', courseName: 'Pre-Calculus - Period 6', title: 'Polynomial Functions Homework', description: 'Factor and graph polynomial functions.', instructions: 'Complete problems 1-15 from section 3.2.', type: 'homework', dueDate: '2026-02-04T23:59:00', maxPoints: 75, submissionType: 'text', allowLateSubmission: true, lateSubmissionDays: 2, status: 'published', createdAt: '2026-01-28', totalSubmissions: 8, gradedSubmissions: 8 },
  { id: 'ta-008', courseId: 'tc-003', courseName: 'Pre-Calculus - Period 6', title: 'Trigonometry Unit Test', description: 'Test on sine, cosine, tangent, and their applications.', instructions: 'Answer all 20 questions. Calculators allowed for section B only.', type: 'exam', dueDate: '2026-02-11T14:00:00', maxPoints: 100, submissionType: 'text', allowLateSubmission: false, lateSubmissionDays: 0, status: 'published', createdAt: '2026-02-03', totalSubmissions: 6, gradedSubmissions: 0 },
  { id: 'ta-009', courseId: 'tc-003', courseName: 'Pre-Calculus - Period 6', title: 'Discussion: Math in Real Life', description: 'Discuss how trigonometry is used in real-world applications.', instructions: 'Post an initial response (min 200 words) and reply to at least 2 classmates.', type: 'discussion', dueDate: '2026-02-15T23:59:00', maxPoints: 50, submissionType: 'discussion', allowLateSubmission: true, lateSubmissionDays: 1, status: 'published', createdAt: '2026-02-07', totalSubmissions: 3, gradedSubmissions: 0 },
];

// ----------------------------------------------------------------
// Submissions
// ----------------------------------------------------------------

function makeSubmissions(assignmentId: string, assignmentTitle: string, students: MockTeacherStudent[], total: number, graded: number): MockTeacherSubmission[] {
  const subs: MockTeacherSubmission[] = [];
  for (let i = 0; i < total; i++) {
    const s = students[i];
    const isGraded = i < graded;
    const ptsEarned = isGraded ? Math.round(60 + Math.random() * 40) : 0;
    const pct = isGraded ? ptsEarned : 0;
    subs.push({
      id: `sub-${assignmentId}-${s.id}`,
      assignmentId,
      assignmentTitle,
      studentId: s.id,
      studentName: `${s.firstName} ${s.lastName}`,
      submissionText: 'Lorem ipsum student response text here...',
      filePath: null,
      fileName: null,
      submittedAt: `2026-02-${String(3 + i).padStart(2, '0')}T${10 + i}:30:00`,
      submittedLate: i >= total - 1,
      status: isGraded ? 'graded' : 'submitted',
      grade: isGraded
        ? {
            pointsEarned: ptsEarned,
            percentage: pct,
            letterGrade: pct >= 90 ? 'A' : pct >= 80 ? 'B' : pct >= 70 ? 'C' : pct >= 60 ? 'D' : 'F',
            feedback: `Good work, ${s.firstName}. ${pct >= 90 ? 'Excellent job!' : pct >= 80 ? 'Keep it up!' : 'Review the areas where you lost points.'}`,
          }
        : null,
    });
  }
  return subs;
}

const alg1Students = mockTeacherCourses[0].students;
const geoStudents = mockTeacherCourses[1].students;
const preCalcStudents = mockTeacherCourses[2].students;

export const mockTeacherSubmissions: MockTeacherSubmission[] = [
  ...makeSubmissions('ta-001', 'Problem Set: Linear Equations', alg1Students, 10, 10),
  ...makeSubmissions('ta-002', 'Quiz: Graphing Lines', alg1Students, 10, 7),
  ...makeSubmissions('ta-003', 'Systems of Equations Project', alg1Students, 4, 0),
  ...makeSubmissions('ta-004', 'Angle Relationships Worksheet', geoStudents, 8, 8),
  ...makeSubmissions('ta-005', 'Triangle Proofs', geoStudents, 5, 2),
  ...makeSubmissions('ta-007', 'Polynomial Functions Homework', preCalcStudents, 8, 8),
  ...makeSubmissions('ta-008', 'Trigonometry Unit Test', preCalcStudents, 6, 0),
  ...makeSubmissions('ta-009', 'Discussion: Math in Real Life', preCalcStudents, 3, 0),
];

// ----------------------------------------------------------------
// Today's schedule
// ----------------------------------------------------------------

export const mockTeacherSchedule = [
  { courseId: 'tc-001', name: 'Algebra 1 - Period 2', period: 2, time: '9:00 AM - 9:50 AM', students: 10, room: '201' },
  { courseId: 'tc-002', name: 'Geometry - Period 4', period: 4, time: '11:00 AM - 11:50 AM', students: 8, room: '201' },
  { courseId: 'tc-003', name: 'Pre-Calculus - Period 6', period: 6, time: '1:00 PM - 1:50 PM', students: 8, room: '205' },
];

// ----------------------------------------------------------------
// Messages
// ----------------------------------------------------------------

export const mockTeacherMessages: MockTeacherMessage[] = [
  { id: 'tm-001', senderName: 'Principal Thompson', senderRole: 'admin', subject: 'Staff Meeting Tomorrow', preview: 'Reminder: there is a mandatory staff meeting tomorrow at 3:30 PM in the auditorium...', timestamp: '2026-02-09T08:00:00', isRead: false },
  { id: 'tm-002', senderName: 'Sarah Wilson (Parent)', senderRole: 'parent', subject: "Emma's Progress", preview: "Hi Ms. Chen, I wanted to check in on Emma's progress in Algebra 1. She mentioned...", timestamp: '2026-02-08T19:30:00', isRead: false },
  { id: 'tm-003', senderName: 'Noah Davis', senderRole: 'student', subject: 'Late Assignment Request', preview: 'Ms. Chen, I was sick last week and could not complete the problem set on time. Could I...', timestamp: '2026-02-08T16:45:00', isRead: true },
  { id: 'tm-004', senderName: 'Mr. Patterson', senderRole: 'teacher', subject: 'Math/ELA Cross-Curricular Project', preview: 'Hey, I had an idea for a cross-curricular project between our classes...', timestamp: '2026-02-07T14:00:00', isRead: true },
];

// ----------------------------------------------------------------
// Calendar events (next 30 days)
// ----------------------------------------------------------------

export const mockTeacherCalendarEvents = [
  { date: '2026-02-10', title: 'Triangle Proofs Due', courseId: 'tc-002', color: '#8b5cf6' },
  { date: '2026-02-11', title: 'Trig Unit Test', courseId: 'tc-003', color: '#10b981' },
  { date: '2026-02-14', title: 'Systems Project Due', courseId: 'tc-001', color: '#3b82f6' },
  { date: '2026-02-15', title: 'Discussion Due', courseId: 'tc-003', color: '#10b981' },
  { date: '2026-02-16', title: "Presidents' Day - No School", courseId: '', color: '#ef4444' },
  { date: '2026-02-20', title: 'Geometry Midterm', courseId: 'tc-002', color: '#8b5cf6' },
  { date: '2026-02-24', title: 'Parent-Teacher Conf.', courseId: '', color: '#f59e0b' },
  { date: '2026-02-28', title: 'Algebra 1 Quiz', courseId: 'tc-001', color: '#3b82f6' },
  { date: '2026-03-03', title: 'Pre-Calc Homework Due', courseId: 'tc-003', color: '#10b981' },
  { date: '2026-03-07', title: 'End of Grading Period', courseId: '', color: '#ef4444' },
];

// ----------------------------------------------------------------
// Gradebook snapshot
// ----------------------------------------------------------------

export const mockGradebookSnapshot = [
  { courseId: 'tc-001', courseName: 'Algebra 1 - Period 2', percentGraded: 85, averageGrade: 84, belowC: 2 },
  { courseId: 'tc-002', courseName: 'Geometry - Period 4', percentGraded: 78, averageGrade: 87, belowC: 1 },
  { courseId: 'tc-003', courseName: 'Pre-Calculus - Period 6', percentGraded: 62, averageGrade: 83, belowC: 2 },
];

// ----------------------------------------------------------------
// Attendance records for current week
// ----------------------------------------------------------------

export function getMockAttendanceForDate(courseId: string, _date: string): MockTeacherAttendanceRecord[] {
  const course = mockTeacherCourses.find((c) => c.id === courseId);
  if (!course) return [];
  return course.students.map((s) => ({
    studentId: s.id,
    studentName: `${s.firstName} ${s.lastName}`,
    status: null,
    notes: '',
  }));
}

export const mockWeekAttendance: Record<string, Record<string, 'present' | 'absent' | 'tardy' | 'excused'>> = {
  '2026-02-02': { 'stu-001': 'present', 'stu-002': 'present', 'stu-003': 'present', 'stu-004': 'absent', 'stu-005': 'present', 'stu-006': 'tardy', 'stu-007': 'present', 'stu-008': 'present', 'stu-009': 'present', 'stu-010': 'present' },
  '2026-02-03': { 'stu-001': 'present', 'stu-002': 'present', 'stu-003': 'present', 'stu-004': 'present', 'stu-005': 'present', 'stu-006': 'present', 'stu-007': 'present', 'stu-008': 'present', 'stu-009': 'tardy', 'stu-010': 'present' },
  '2026-02-04': { 'stu-001': 'present', 'stu-002': 'absent', 'stu-003': 'present', 'stu-004': 'present', 'stu-005': 'present', 'stu-006': 'present', 'stu-007': 'present', 'stu-008': 'present', 'stu-009': 'present', 'stu-010': 'excused' },
  '2026-02-05': { 'stu-001': 'present', 'stu-002': 'present', 'stu-003': 'present', 'stu-004': 'present', 'stu-005': 'tardy', 'stu-006': 'present', 'stu-007': 'present', 'stu-008': 'present', 'stu-009': 'present', 'stu-010': 'present' },
  '2026-02-06': { 'stu-001': 'present', 'stu-002': 'present', 'stu-003': 'present', 'stu-004': 'absent', 'stu-005': 'present', 'stu-006': 'present', 'stu-007': 'excused', 'stu-008': 'present', 'stu-009': 'present', 'stu-010': 'present' },
};
