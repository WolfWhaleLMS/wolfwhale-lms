/**
 * Mock data for the Parent Portal
 * 1 parent with 2 children (Emma grade 3, Liam grade 5)
 * Each child enrolled in 3 classes with grades, attendance, assignments
 */

export interface MockChild {
  id: string;
  firstName: string;
  lastName: string;
  gradeLevel: string;
  avatarUrl: string | null;
  school: string;
  gpa: number;
  attendanceRate: number;
  missingWork: number;
  level: number;
  xp: number;
  nextLevelXp: number;
  streakDays: number;
  pet: {
    name: string;
    species: string;
    speciesLabel: string;
    stage: string;
    stageLabel: string;
    happiness: number;
    energy: number;
    knowledge: number;
    health: number;
    totalXP: number;
    emoji: string;
  };
  classes: MockClass[];
  assignments: MockAssignment[];
  attendanceRecords: MockAttendanceRecord[];
  gradeHistory: MockGradeHistoryPoint[];
}

export interface MockClass {
  id: string;
  name: string;
  teacher: string;
  currentGrade: number;
  letterGrade: string;
  trend: 'up' | 'down' | 'stable';
  gradeHistory: number[];
  assignments: MockClassAssignment[];
}

export interface MockClassAssignment {
  id: string;
  title: string;
  dueDate: string;
  maxPoints: number;
  pointsEarned: number | null;
  percentage: number | null;
  status: 'graded' | 'submitted' | 'missing' | 'upcoming';
}

export interface MockAssignment {
  id: string;
  title: string;
  className: string;
  dueDate: string;
  status: 'graded' | 'submitted' | 'in_progress' | 'not_started' | 'missing' | 'overdue';
  grade: number | null;
  maxPoints: number;
}

export interface MockAttendanceRecord {
  date: string;
  status: 'present' | 'absent' | 'tardy' | 'excused';
}

export interface MockGradeHistoryPoint {
  month: string;
  gpa: number;
}

export interface MockAnnouncement {
  id: string;
  title: string;
  content: string;
  source: string;
  date: string;
  type: 'school' | 'class';
}

export interface MockCalendarEvent {
  date: string;
  type: 'assignment' | 'event' | 'holiday';
  title: string;
}

// ---- Helper functions ----

function getLetterGrade(score: number): string {
  if (score >= 93) return 'A';
  if (score >= 90) return 'A-';
  if (score >= 87) return 'B+';
  if (score >= 83) return 'B';
  if (score >= 80) return 'B-';
  if (score >= 77) return 'C+';
  if (score >= 73) return 'C';
  if (score >= 70) return 'C-';
  if (score >= 67) return 'D+';
  if (score >= 60) return 'D';
  return 'F';
}

function generateAttendanceRecords(
  daysPresent: number,
  daysAbsent: number,
  daysTardy: number,
  daysExcused: number
): MockAttendanceRecord[] {
  const records: MockAttendanceRecord[] = [];
  const today = new Date();

  const statuses: ('present' | 'absent' | 'tardy' | 'excused')[] = [];
  for (let i = 0; i < daysPresent; i++) statuses.push('present');
  for (let i = 0; i < daysAbsent; i++) statuses.push('absent');
  for (let i = 0; i < daysTardy; i++) statuses.push('tardy');
  for (let i = 0; i < daysExcused; i++) statuses.push('excused');

  // Distribute across last 90 school days
  let dayIndex = 0;
  for (let i = 0; i < statuses.length && i < 90; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() - dayIndex);
    // Skip weekends
    while (date.getDay() === 0 || date.getDay() === 6) {
      dayIndex++;
      date.setDate(today.getDate() - dayIndex);
    }
    records.push({
      date: date.toISOString().split('T')[0],
      status: statuses[i],
    });
    dayIndex++;
  }

  return records;
}

// ---- Mock Children Data ----

export const MOCK_CHILDREN: MockChild[] = [
  {
    id: 'child-emma-001',
    firstName: 'Emma',
    lastName: 'Johnson',
    gradeLevel: '3',
    avatarUrl: null,
    school: 'Hillside Academy',
    gpa: 3.7,
    attendanceRate: 96.5,
    missingWork: 1,
    level: 8,
    xp: 2200,
    nextLevelXp: 2700,
    streakDays: 12,
    pet: {
      name: 'Luna',
      species: 'silver_wolf',
      speciesLabel: 'Silver Wolf',
      stage: 'juvenile',
      stageLabel: 'Juvenile',
      happiness: 85,
      energy: 72,
      knowledge: 68,
      health: 90,
      totalXP: 2200,
      emoji: '🐺',
    },
    classes: [
      {
        id: 'class-e-001',
        name: 'Math 3',
        teacher: 'Ms. Chen',
        currentGrade: 92,
        letterGrade: 'A-',
        trend: 'up',
        gradeHistory: [85, 87, 88, 90, 91, 92],
        assignments: [
          { id: 'a-e-001', title: 'Addition & Subtraction Quiz', dueDate: '2026-01-15', maxPoints: 100, pointsEarned: 95, percentage: 95, status: 'graded' },
          { id: 'a-e-002', title: 'Multiplication Tables Worksheet', dueDate: '2026-01-22', maxPoints: 50, pointsEarned: 46, percentage: 92, status: 'graded' },
          { id: 'a-e-003', title: 'Word Problems Set 5', dueDate: '2026-01-29', maxPoints: 100, pointsEarned: 88, percentage: 88, status: 'graded' },
          { id: 'a-e-004', title: 'Fractions Introduction', dueDate: '2026-02-05', maxPoints: 100, pointsEarned: 94, percentage: 94, status: 'graded' },
          { id: 'a-e-005', title: 'Geometry Shapes Quiz', dueDate: '2026-02-12', maxPoints: 100, pointsEarned: null, percentage: null, status: 'upcoming' },
        ],
      },
      {
        id: 'class-e-002',
        name: 'Reading & Writing 3',
        teacher: 'Mr. Patterson',
        currentGrade: 88,
        letterGrade: 'B+',
        trend: 'stable',
        gradeHistory: [86, 87, 88, 87, 88, 88],
        assignments: [
          { id: 'a-e-006', title: 'Book Report: Charlotte\'s Web', dueDate: '2026-01-17', maxPoints: 100, pointsEarned: 90, percentage: 90, status: 'graded' },
          { id: 'a-e-007', title: 'Spelling Test Week 3', dueDate: '2026-01-24', maxPoints: 50, pointsEarned: 42, percentage: 84, status: 'graded' },
          { id: 'a-e-008', title: 'Creative Writing: My Pet', dueDate: '2026-02-03', maxPoints: 100, pointsEarned: 87, percentage: 87, status: 'graded' },
          { id: 'a-e-009', title: 'Reading Comprehension Ch. 8', dueDate: '2026-02-07', maxPoints: 50, pointsEarned: null, percentage: null, status: 'missing' },
          { id: 'a-e-010', title: 'Vocabulary Quiz Week 6', dueDate: '2026-02-14', maxPoints: 50, pointsEarned: null, percentage: null, status: 'upcoming' },
        ],
      },
      {
        id: 'class-e-003',
        name: 'Science 3',
        teacher: 'Dr. Martinez',
        currentGrade: 91,
        letterGrade: 'A-',
        trend: 'up',
        gradeHistory: [84, 86, 88, 89, 90, 91],
        assignments: [
          { id: 'a-e-011', title: 'Plant Life Cycle Poster', dueDate: '2026-01-20', maxPoints: 100, pointsEarned: 93, percentage: 93, status: 'graded' },
          { id: 'a-e-012', title: 'Weather Journal', dueDate: '2026-01-27', maxPoints: 50, pointsEarned: 47, percentage: 94, status: 'graded' },
          { id: 'a-e-013', title: 'Animal Habitats Project', dueDate: '2026-02-06', maxPoints: 100, pointsEarned: 88, percentage: 88, status: 'graded' },
          { id: 'a-e-014', title: 'Rocks & Minerals Quiz', dueDate: '2026-02-13', maxPoints: 50, pointsEarned: null, percentage: null, status: 'upcoming' },
        ],
      },
    ],
    assignments: [
      { id: 'a-e-009', title: 'Reading Comprehension Ch. 8', className: 'Reading & Writing 3', dueDate: '2026-02-07', status: 'missing', grade: null, maxPoints: 50 },
      { id: 'a-e-005', title: 'Geometry Shapes Quiz', className: 'Math 3', dueDate: '2026-02-12', status: 'not_started', grade: null, maxPoints: 100 },
      { id: 'a-e-014', title: 'Rocks & Minerals Quiz', className: 'Science 3', dueDate: '2026-02-13', status: 'not_started', grade: null, maxPoints: 50 },
      { id: 'a-e-010', title: 'Vocabulary Quiz Week 6', className: 'Reading & Writing 3', dueDate: '2026-02-14', status: 'not_started', grade: null, maxPoints: 50 },
    ],
    attendanceRecords: generateAttendanceRecords(82, 2, 3, 1),
    gradeHistory: [
      { month: 'Sep', gpa: 3.2 },
      { month: 'Oct', gpa: 3.4 },
      { month: 'Nov', gpa: 3.5 },
      { month: 'Dec', gpa: 3.5 },
      { month: 'Jan', gpa: 3.6 },
      { month: 'Feb', gpa: 3.7 },
    ],
  },
  {
    id: 'child-liam-002',
    firstName: 'Liam',
    lastName: 'Johnson',
    gradeLevel: '5',
    avatarUrl: null,
    school: 'Hillside Academy',
    gpa: 3.3,
    attendanceRate: 92.0,
    missingWork: 3,
    level: 10,
    xp: 2800,
    nextLevelXp: 3250,
    streakDays: 5,
    pet: {
      name: 'Splash',
      species: 'blue_whale',
      speciesLabel: 'Blue Whale',
      stage: 'adolescent',
      stageLabel: 'Adolescent',
      happiness: 70,
      energy: 55,
      knowledge: 78,
      health: 82,
      totalXP: 2800,
      emoji: '🐋',
    },
    classes: [
      {
        id: 'class-l-001',
        name: 'Math 5',
        teacher: 'Mrs. Thompson',
        currentGrade: 78,
        letterGrade: 'C+',
        trend: 'down',
        gradeHistory: [85, 83, 81, 80, 79, 78],
        assignments: [
          { id: 'a-l-001', title: 'Decimals & Fractions Test', dueDate: '2026-01-14', maxPoints: 100, pointsEarned: 72, percentage: 72, status: 'graded' },
          { id: 'a-l-002', title: 'Long Division Worksheet', dueDate: '2026-01-21', maxPoints: 50, pointsEarned: 38, percentage: 76, status: 'graded' },
          { id: 'a-l-003', title: 'Geometry: Area & Perimeter', dueDate: '2026-01-28', maxPoints: 100, pointsEarned: 80, percentage: 80, status: 'graded' },
          { id: 'a-l-004', title: 'Pre-Algebra Practice', dueDate: '2026-02-04', maxPoints: 100, pointsEarned: null, percentage: null, status: 'missing' },
          { id: 'a-l-005', title: 'Data & Graphs Project', dueDate: '2026-02-11', maxPoints: 100, pointsEarned: null, percentage: null, status: 'upcoming' },
        ],
      },
      {
        id: 'class-l-002',
        name: 'English 5',
        teacher: 'Ms. Rivera',
        currentGrade: 85,
        letterGrade: 'B',
        trend: 'stable',
        gradeHistory: [84, 85, 84, 85, 86, 85],
        assignments: [
          { id: 'a-l-006', title: 'Persuasive Essay Draft', dueDate: '2026-01-16', maxPoints: 100, pointsEarned: 87, percentage: 87, status: 'graded' },
          { id: 'a-l-007', title: 'Grammar Quiz: Clauses', dueDate: '2026-01-23', maxPoints: 50, pointsEarned: 41, percentage: 82, status: 'graded' },
          { id: 'a-l-008', title: 'Book Club Discussion', dueDate: '2026-02-02', maxPoints: 50, pointsEarned: 44, percentage: 88, status: 'graded' },
          { id: 'a-l-009', title: 'Research Report Outline', dueDate: '2026-02-06', maxPoints: 100, pointsEarned: null, percentage: null, status: 'missing' },
          { id: 'a-l-010', title: 'Poetry Analysis', dueDate: '2026-02-15', maxPoints: 100, pointsEarned: null, percentage: null, status: 'upcoming' },
        ],
      },
      {
        id: 'class-l-003',
        name: 'Science 5',
        teacher: 'Mr. Kim',
        currentGrade: 82,
        letterGrade: 'B-',
        trend: 'up',
        gradeHistory: [76, 77, 78, 80, 81, 82],
        assignments: [
          { id: 'a-l-011', title: 'Ecosystem Diagram', dueDate: '2026-01-19', maxPoints: 100, pointsEarned: 85, percentage: 85, status: 'graded' },
          { id: 'a-l-012', title: 'Matter & Energy Quiz', dueDate: '2026-01-26', maxPoints: 50, pointsEarned: 39, percentage: 78, status: 'graded' },
          { id: 'a-l-013', title: 'Lab Report: Chemical Reactions', dueDate: '2026-02-03', maxPoints: 100, pointsEarned: 80, percentage: 80, status: 'graded' },
          { id: 'a-l-014', title: 'Solar System Model', dueDate: '2026-02-08', maxPoints: 100, pointsEarned: null, percentage: null, status: 'missing' },
          { id: 'a-l-015', title: 'Forces & Motion Test', dueDate: '2026-02-16', maxPoints: 100, pointsEarned: null, percentage: null, status: 'upcoming' },
        ],
      },
    ],
    assignments: [
      { id: 'a-l-004', title: 'Pre-Algebra Practice', className: 'Math 5', dueDate: '2026-02-04', status: 'missing', grade: null, maxPoints: 100 },
      { id: 'a-l-009', title: 'Research Report Outline', className: 'English 5', dueDate: '2026-02-06', status: 'missing', grade: null, maxPoints: 100 },
      { id: 'a-l-014', title: 'Solar System Model', className: 'Science 5', dueDate: '2026-02-08', status: 'overdue', grade: null, maxPoints: 100 },
      { id: 'a-l-005', title: 'Data & Graphs Project', className: 'Math 5', dueDate: '2026-02-11', status: 'in_progress', grade: null, maxPoints: 100 },
      { id: 'a-l-010', title: 'Poetry Analysis', className: 'English 5', dueDate: '2026-02-15', status: 'not_started', grade: null, maxPoints: 100 },
      { id: 'a-l-015', title: 'Forces & Motion Test', className: 'Science 5', dueDate: '2026-02-16', status: 'not_started', grade: null, maxPoints: 100 },
    ],
    attendanceRecords: generateAttendanceRecords(76, 5, 4, 3),
    gradeHistory: [
      { month: 'Sep', gpa: 3.5 },
      { month: 'Oct', gpa: 3.4 },
      { month: 'Nov', gpa: 3.4 },
      { month: 'Dec', gpa: 3.3 },
      { month: 'Jan', gpa: 3.3 },
      { month: 'Feb', gpa: 3.3 },
    ],
  },
];

export const MOCK_ANNOUNCEMENTS: MockAnnouncement[] = [
  {
    id: 'ann-001',
    title: 'Spring Break Schedule',
    content: 'Spring break will be March 17-21. No classes during this period. Enjoy your time off!',
    source: 'Hillside Academy',
    date: '2026-02-07',
    type: 'school',
  },
  {
    id: 'ann-002',
    title: 'Science Fair Registration Open',
    content: 'Science fair projects are due March 28. Registration forms are available in the main office.',
    source: 'Science Department',
    date: '2026-02-05',
    type: 'school',
  },
  {
    id: 'ann-003',
    title: 'Parent-Teacher Conferences',
    content: 'Conferences will be held February 20-21. Sign up for a time slot through the school portal.',
    source: 'Hillside Academy',
    date: '2026-02-03',
    type: 'school',
  },
];

export const MOCK_CALENDAR_EVENTS: MockCalendarEvent[] = [
  { date: '2026-02-07', type: 'assignment', title: 'Reading Comprehension Ch. 8 (Emma)' },
  { date: '2026-02-08', type: 'assignment', title: 'Solar System Model (Liam)' },
  { date: '2026-02-11', type: 'assignment', title: 'Data & Graphs Project (Liam)' },
  { date: '2026-02-12', type: 'assignment', title: 'Geometry Shapes Quiz (Emma)' },
  { date: '2026-02-13', type: 'assignment', title: 'Rocks & Minerals Quiz (Emma)' },
  { date: '2026-02-14', type: 'event', title: 'Valentine\'s Day Party' },
  { date: '2026-02-14', type: 'assignment', title: 'Vocabulary Quiz Week 6 (Emma)' },
  { date: '2026-02-15', type: 'assignment', title: 'Poetry Analysis (Liam)' },
  { date: '2026-02-16', type: 'assignment', title: 'Forces & Motion Test (Liam)' },
  { date: '2026-02-17', type: 'holiday', title: 'Presidents\' Day' },
  { date: '2026-02-20', type: 'event', title: 'Parent-Teacher Conferences' },
  { date: '2026-02-21', type: 'event', title: 'Parent-Teacher Conferences' },
  { date: '2026-02-28', type: 'event', title: 'School Assembly' },
  { date: '2026-03-07', type: 'event', title: 'Field Trip - Science Museum' },
];

// ---- Helper: Get child by ID ----

export function getChildById(childId: string): MockChild | undefined {
  return MOCK_CHILDREN.find((c) => c.id === childId);
}

// ---- Attendance stats helper ----

export function getAttendanceStats(records: MockAttendanceRecord[]) {
  const total = records.length;
  const present = records.filter((r) => r.status === 'present').length;
  const absent = records.filter((r) => r.status === 'absent').length;
  const tardy = records.filter((r) => r.status === 'tardy').length;
  const excused = records.filter((r) => r.status === 'excused').length;
  const rate = total > 0 ? Math.round(((present + excused) / total) * 1000) / 10 : 0;

  return { total, present, absent, tardy, excused, rate };
}
