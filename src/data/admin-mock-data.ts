/**
 * Mock data for Admin Panel
 * Provides realistic test data: 48 teachers, 450 students (K-5), 120 parents,
 * 25 classes, engagement metrics, audit logs, and billing info.
 */

// ─── Helpers ────────────────────────────────────────────────────────────────

function randomDate(start: Date, end: Date): string {
  const d = new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
  return d.toISOString();
}

function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

const firstNames = [
  'Emma', 'Liam', 'Olivia', 'Noah', 'Ava', 'Ethan', 'Sophia', 'Mason',
  'Isabella', 'Logan', 'Mia', 'Lucas', 'Amelia', 'Jack', 'Harper',
  'Aiden', 'Evelyn', 'Jackson', 'Aria', 'Sebastian', 'Luna', 'Mateo',
  'Chloe', 'Henry', 'Penelope', 'Owen', 'Layla', 'Alexander', 'Riley',
  'James', 'Zoey', 'Benjamin', 'Nora', 'Elijah', 'Lily', 'William',
  'Eleanor', 'Daniel', 'Hannah', 'Michael', 'Lillian', 'Carter',
  'Addison', 'Jayden', 'Aubrey', 'Gabriel', 'Ellie', 'Luke',
  'Stella', 'Anthony', 'Natalie', 'Isaac', 'Zoe', 'Dylan',
  'Leah', 'Leo', 'Hazel', 'Jaxon', 'Violet', 'Lincoln',
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller',
  'Davis', 'Rodriguez', 'Martinez', 'Hernandez', 'Lopez', 'Gonzalez',
  'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark',
  'Ramirez', 'Lewis', 'Robinson', 'Walker', 'Young', 'Allen', 'King',
  'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores', 'Green',
  'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell',
  'Carter', 'Roberts', 'Kim', 'Chen', 'Patel', 'Singh', 'Park',
];

const gradeLabels = ['K', '1', '2', '3', '4', '5'] as const;
type GradeK5 = typeof gradeLabels[number];

// ─── Types ──────────────────────────────────────────────────────────────────

export interface MockUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'teacher' | 'parent' | 'admin';
  status: 'active' | 'inactive' | 'invited' | 'suspended';
  grade?: GradeK5;
  lastLogin: string;
  createdAt: string;
  avatarUrl?: string;
  phone?: string;
  linkedParentId?: string;
  linkedStudentIds?: string[];
}

export interface MockClass {
  id: string;
  name: string;
  teacherId: string;
  teacherName: string;
  grade: GradeK5;
  period: number;
  studentCount: number;
  term: string;
  status: 'active' | 'archived' | 'draft';
  room: string;
  capacity: number;
  enrollmentMethod: 'open' | 'invite' | 'manual';
  subject: string;
}

export interface MockAuditLog {
  id: string;
  timestamp: string;
  userId: string;
  userName: string;
  action: string;
  resourceType: string;
  resourceId: string;
  details: string;
  ipAddress: string;
}

export interface MockEngagementMetric {
  date: string;
  activeStudents: number;
  totalLogins: number;
  assignmentCompletionRate: number;
  avgSessionMinutes: number;
}

export interface MockRecentActivity {
  id: string;
  description: string;
  type: 'user_created' | 'class_created' | 'enrollment' | 'system' | 'setting_changed';
  timestamp: string;
  actor: string;
}

export interface MockAlert {
  id: string;
  type: 'warning' | 'error' | 'info';
  title: string;
  description: string;
  count?: number;
}

// ─── Generate Users ─────────────────────────────────────────────────────────

let userId = 1;
function makeUser(
  role: MockUser['role'],
  overrides?: Partial<MockUser>
): MockUser {
  const fn = randomFrom(firstNames);
  const ln = randomFrom(lastNames);
  const id = `usr_${String(userId++).padStart(4, '0')}`;
  const emailDomain = role === 'parent' ? 'gmail.com' : 'hillside-academy.edu';
  return {
    id,
    firstName: fn,
    lastName: ln,
    email: `${fn.toLowerCase()}.${ln.toLowerCase()}@${emailDomain}`,
    role,
    status: Math.random() > 0.08 ? 'active' : randomFrom(['inactive', 'invited']),
    lastLogin: randomDate(new Date('2026-01-01'), new Date('2026-02-09')),
    createdAt: randomDate(new Date('2024-08-01'), new Date('2025-12-01')),
    ...overrides,
  };
}

// Teachers: 48
export const mockTeachers: MockUser[] = Array.from({ length: 48 }, () =>
  makeUser('teacher')
);

// Students: 450, distributed across K-5 (75 per grade)
export const mockStudents: MockUser[] = gradeLabels.flatMap((grade) =>
  Array.from({ length: 75 }, () => makeUser('student', { grade }))
);

// Parents: 120
export const mockParents: MockUser[] = Array.from({ length: 120 }, (_, i) => {
  const parent = makeUser('parent');
  // Link 2-4 students
  const start = i * 3;
  parent.linkedStudentIds = mockStudents
    .slice(start, start + Math.floor(Math.random() * 3) + 1)
    .map((s) => s.id);
  return parent;
});

// Admin users
export const mockAdmins: MockUser[] = [
  makeUser('admin', {
    firstName: 'Sarah',
    lastName: 'Mitchell',
    email: 'sarah.mitchell@hillside-academy.edu',
    status: 'active',
  }),
  makeUser('admin', {
    firstName: 'David',
    lastName: 'Chen',
    email: 'david.chen@hillside-academy.edu',
    status: 'active',
  }),
];

export const allMockUsers: MockUser[] = [
  ...mockAdmins,
  ...mockTeachers,
  ...mockStudents,
  ...mockParents,
];

// ─── Generate Classes ───────────────────────────────────────────────────────

const subjects = [
  'English Language Arts', 'Mathematics', 'Science', 'Social Studies',
  'Art', 'Music', 'Physical Education', 'Reading', 'Writing',
];

const rooms = [
  '101', '102', '103', '104', '105', '201', '202', '203', '204', '205',
  '301', '302', '303', '304', '305', 'Gym', 'Art Studio', 'Music Room',
  'Library', 'Lab 1', 'Lab 2', '106', '206', '306', '107',
];

export const mockClasses: MockClass[] = Array.from({ length: 25 }, (_, i) => {
  const grade = gradeLabels[i % 6];
  const teacher = mockTeachers[i % mockTeachers.length];
  const subject = subjects[i % subjects.length];
  const period = (i % 8) + 1;
  return {
    id: `cls_${String(i + 1).padStart(4, '0')}`,
    name: `${grade === 'K' ? 'Kindergarten' : `Grade ${grade}`} ${subject}`,
    teacherId: teacher.id,
    teacherName: `${teacher.firstName} ${teacher.lastName}`,
    grade,
    period,
    studentCount: 15 + Math.floor(Math.random() * 13),
    term: 'Spring 2026',
    status: i < 23 ? 'active' : i === 23 ? 'draft' : 'archived',
    room: rooms[i % rooms.length],
    capacity: 30,
    enrollmentMethod: randomFrom(['open', 'invite', 'manual']),
    subject,
  };
});

// ─── Engagement Metrics (last 30 days) ──────────────────────────────────────

export const mockEngagementMetrics: MockEngagementMetric[] = Array.from(
  { length: 30 },
  (_, i) => {
    const date = new Date('2026-01-11');
    date.setDate(date.getDate() + i);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    return {
      date: date.toISOString().split('T')[0],
      activeStudents: isWeekend
        ? 50 + Math.floor(Math.random() * 60)
        : 300 + Math.floor(Math.random() * 120),
      totalLogins: isWeekend
        ? 80 + Math.floor(Math.random() * 80)
        : 400 + Math.floor(Math.random() * 150),
      assignmentCompletionRate: isWeekend
        ? 0.3 + Math.random() * 0.3
        : 0.65 + Math.random() * 0.25,
      avgSessionMinutes: isWeekend
        ? 10 + Math.floor(Math.random() * 15)
        : 25 + Math.floor(Math.random() * 20),
    };
  }
);

// ─── Recent Activity ────────────────────────────────────────────────────────

export const mockRecentActivities: MockRecentActivity[] = [
  { id: 'ra_1', description: '3 new teacher accounts created', type: 'user_created', timestamp: '2026-02-09T10:30:00Z', actor: 'Sarah Mitchell' },
  { id: 'ra_2', description: 'Grade 3 Science class created', type: 'class_created', timestamp: '2026-02-09T09:15:00Z', actor: 'David Chen' },
  { id: 'ra_3', description: '12 students enrolled in Grade 2 Math', type: 'enrollment', timestamp: '2026-02-08T16:45:00Z', actor: 'System' },
  { id: 'ra_4', description: 'Password policy updated', type: 'setting_changed', timestamp: '2026-02-08T14:20:00Z', actor: 'Sarah Mitchell' },
  { id: 'ra_5', description: '5 new parent accounts registered', type: 'user_created', timestamp: '2026-02-08T11:00:00Z', actor: 'System' },
  { id: 'ra_6', description: 'Kindergarten Art class archived', type: 'class_created', timestamp: '2026-02-07T15:30:00Z', actor: 'David Chen' },
  { id: 'ra_7', description: 'System maintenance completed', type: 'system', timestamp: '2026-02-07T03:00:00Z', actor: 'System' },
  { id: 'ra_8', description: 'Bulk import: 28 student records processed', type: 'user_created', timestamp: '2026-02-06T09:45:00Z', actor: 'Sarah Mitchell' },
  { id: 'ra_9', description: 'Grade 5 ELA teacher reassigned', type: 'class_created', timestamp: '2026-02-06T08:10:00Z', actor: 'David Chen' },
  { id: 'ra_10', description: 'FERPA consent forms updated', type: 'setting_changed', timestamp: '2026-02-05T16:00:00Z', actor: 'Sarah Mitchell' },
];

// ─── Alerts ─────────────────────────────────────────────────────────────────

export const mockAlerts: MockAlert[] = [
  { id: 'al_1', type: 'warning', title: 'Incomplete Profiles', description: '23 students have missing profile information', count: 23 },
  { id: 'al_2', type: 'warning', title: 'Unassigned Classes', description: '2 classes do not have a teacher assigned', count: 2 },
  { id: 'al_3', type: 'info', title: 'Pending Consent', description: '8 parent consent forms are awaiting approval', count: 8 },
  { id: 'al_4', type: 'error', title: 'Failed Imports', description: '1 bulk import had validation errors', count: 1 },
];

// ─── Audit Logs ─────────────────────────────────────────────────────────────

const auditActions = [
  { action: 'user.created', resourceType: 'user', details: 'Created new user account' },
  { action: 'user.updated', resourceType: 'user', details: 'Updated user profile information' },
  { action: 'user.deactivated', resourceType: 'user', details: 'Deactivated user account' },
  { action: 'user.password_reset', resourceType: 'user', details: 'Reset user password' },
  { action: 'class.created', resourceType: 'class', details: 'Created new class' },
  { action: 'class.updated', resourceType: 'class', details: 'Updated class settings' },
  { action: 'class.enrollment_changed', resourceType: 'class', details: 'Modified class enrollment' },
  { action: 'settings.updated', resourceType: 'settings', details: 'Updated school settings' },
  { action: 'settings.grading_updated', resourceType: 'settings', details: 'Modified grading scale' },
  { action: 'auth.login', resourceType: 'auth', details: 'Successful login' },
  { action: 'auth.failed_login', resourceType: 'auth', details: 'Failed login attempt' },
  { action: 'data.exported', resourceType: 'data', details: 'Exported user data to CSV' },
  { action: 'data.imported', resourceType: 'data', details: 'Imported records from CSV' },
  { action: 'consent.approved', resourceType: 'consent', details: 'Parent consent form approved' },
  { action: 'announcement.created', resourceType: 'announcement', details: 'Created new announcement' },
  { action: 'role.changed', resourceType: 'user', details: 'Changed user role' },
  { action: 'security.2fa_enabled', resourceType: 'security', details: 'Enabled two-factor authentication' },
  { action: 'billing.invoice_paid', resourceType: 'billing', details: 'Invoice payment processed' },
  { action: 'system.backup', resourceType: 'system', details: 'System backup completed' },
  { action: 'system.maintenance', resourceType: 'system', details: 'Scheduled maintenance performed' },
];

export const mockAuditLogs: MockAuditLog[] = Array.from({ length: 50 }, (_, i) => {
  const auditAction = auditActions[i % auditActions.length];
  const actor = randomFrom([...mockAdmins, ...mockTeachers.slice(0, 5)]);
  return {
    id: `audit_${String(i + 1).padStart(4, '0')}`,
    timestamp: randomDate(new Date('2026-01-15'), new Date('2026-02-09')),
    userId: actor.id,
    userName: `${actor.firstName} ${actor.lastName}`,
    action: auditAction.action,
    resourceType: auditAction.resourceType,
    resourceId: `res_${String(Math.floor(Math.random() * 500)).padStart(4, '0')}`,
    details: auditAction.details,
    ipAddress: `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
  };
}).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

// ─── Enrollment by Grade (K-5 pie chart data) ──────────────────────────────

export const enrollmentByGrade = gradeLabels.map((grade) => ({
  name: grade === 'K' ? 'Kindergarten' : `Grade ${grade}`,
  value: mockStudents.filter((s) => s.grade === grade).length,
  grade,
}));

// ─── Subscription / Billing ─────────────────────────────────────────────────

export const mockSubscription = {
  plan: 'Professional' as const,
  price: 299,
  billingCycle: 'monthly' as const,
  currentPeriodStart: '2026-02-01',
  currentPeriodEnd: '2026-02-28',
  renewalDate: '2026-03-01',
  storageUsedGb: 18.4,
  storageMaxGb: 50,
  activeUsers: allMockUsers.filter((u) => u.status === 'active').length,
  maxUsers: 500,
  features: [
    'Up to 500 students',
    'Unlimited classes',
    'Advanced analytics',
    'Priority support',
    '50GB storage',
    'Gamification features',
    'Custom branding',
  ],
};

// ─── Dashboard Stats ────────────────────────────────────────────────────────

export const dashboardStats = {
  totalStudents: mockStudents.length,
  totalTeachers: mockTeachers.length,
  totalParents: mockParents.length,
  totalClasses: mockClasses.filter((c) => c.status === 'active').length,
  activeUsers: allMockUsers.filter((u) => u.status === 'active').length,
  dailyActiveUsers: 312,
  storageUsedGb: 18.4,
  storageMaxGb: 50,
  systemUptime: 99.97,
  apiLatencyMs: 42,
  errorRate: 0.02,
  studentActiveRate: 0.82,
  assignmentCompletionRate: 0.74,
};
