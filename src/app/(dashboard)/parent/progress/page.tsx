'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, GraduationCap, Calendar, ClipboardList } from 'lucide-react';
import { ChildSelector, type ChildOption } from '@/components/parent/ChildSelector';
import { ParentGradeView } from '@/components/parent/ParentGradeView';
import { ParentAttendanceView } from '@/components/parent/ParentAttendanceView';
import { ParentAssignmentView } from '@/components/parent/ParentAssignmentView';
import { Card, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';

// --- Mock Data ---

const mockChildOptions: ChildOption[] = [
  {
    id: 'student-1',
    firstName: 'Emma',
    lastName: 'Johnson',
    gradeLevel: '9',
    avatarUrl: null,
    gpa: 3.7,
  },
  {
    id: 'student-2',
    firstName: 'Noah',
    lastName: 'Johnson',
    gradeLevel: '7',
    avatarUrl: null,
    gpa: 3.2,
  },
  {
    id: 'student-3',
    firstName: 'Olivia',
    lastName: 'Johnson',
    gradeLevel: '4',
    avatarUrl: null,
    gpa: 3.9,
  },
];

const mockClassesByChild: Record<string, any[]> = {
  'student-1': [
    {
      id: 'c1',
      name: 'Algebra II',
      teacher: 'Ms. Chen',
      currentGrade: 94,
      letterGrade: 'A',
      trend: 'up' as const,
      gradeHistory: [88, 90, 91, 92, 94],
      assignments: [
        { id: 'a1', title: 'Quadratic Equations Quiz', dueDate: '2026-02-07', maxPoints: 50, pointsEarned: 47, percentage: 94, status: 'graded' as const },
        { id: 'a2', title: 'Chapter 5 Homework', dueDate: '2026-02-10', maxPoints: 30, pointsEarned: 28, percentage: 93, status: 'graded' as const },
        { id: 'a3', title: 'Polynomial Functions Test', dueDate: '2026-02-14', maxPoints: 100, pointsEarned: null, percentage: null, status: 'upcoming' as const },
      ],
    },
    {
      id: 'c2',
      name: 'English Literature',
      teacher: 'Mr. Patterson',
      currentGrade: 87,
      letterGrade: 'B+',
      trend: 'stable' as const,
      gradeHistory: [85, 86, 87, 86, 87],
      assignments: [
        { id: 'a4', title: 'Essay: The Great Gatsby', dueDate: '2026-02-12', maxPoints: 100, pointsEarned: null, percentage: null, status: 'submitted' as const },
        { id: 'a5', title: 'Reading Journal Week 6', dueDate: '2026-02-09', maxPoints: 20, pointsEarned: 18, percentage: 90, status: 'graded' as const },
      ],
    },
    {
      id: 'c3',
      name: 'Biology I',
      teacher: 'Dr. Martinez',
      currentGrade: 91,
      letterGrade: 'A-',
      trend: 'up' as const,
      gradeHistory: [84, 86, 88, 90, 91],
      assignments: [
        { id: 'a6', title: 'Lab Report: Cell Division', dueDate: '2026-02-08', maxPoints: 50, pointsEarned: 46, percentage: 92, status: 'graded' as const },
        { id: 'a7', title: 'Unit 4 Exam', dueDate: '2026-02-15', maxPoints: 100, pointsEarned: null, percentage: null, status: 'upcoming' as const },
      ],
    },
    {
      id: 'c4',
      name: 'Chemistry I',
      teacher: 'Ms. Park',
      currentGrade: 82,
      letterGrade: 'B-',
      trend: 'down' as const,
      gradeHistory: [88, 86, 85, 83, 82],
      assignments: [
        { id: 'a8', title: 'Periodic Table Quiz', dueDate: '2026-02-05', maxPoints: 30, pointsEarned: 24, percentage: 80, status: 'graded' as const },
        { id: 'a9', title: 'Balancing Equations Worksheet', dueDate: '2026-02-03', maxPoints: 20, pointsEarned: null, percentage: null, status: 'missing' as const },
      ],
    },
  ],
  'student-2': [
    {
      id: 'c5',
      name: 'Pre-Algebra',
      teacher: 'Mr. Williams',
      currentGrade: 78,
      letterGrade: 'C+',
      trend: 'up' as const,
      gradeHistory: [72, 74, 75, 77, 78],
      assignments: [
        { id: 'a10', title: 'Fractions Test', dueDate: '2026-02-06', maxPoints: 50, pointsEarned: 39, percentage: 78, status: 'graded' as const },
      ],
    },
    {
      id: 'c6',
      name: 'English 7',
      teacher: 'Mrs. Taylor',
      currentGrade: 88,
      letterGrade: 'B+',
      trend: 'stable' as const,
      gradeHistory: [87, 88, 87, 88, 88],
      assignments: [
        { id: 'a11', title: 'Book Report', dueDate: '2026-02-13', maxPoints: 100, pointsEarned: null, percentage: null, status: 'upcoming' as const },
      ],
    },
    {
      id: 'c7',
      name: 'Life Science',
      teacher: 'Ms. Green',
      currentGrade: 85,
      letterGrade: 'B',
      trend: 'up' as const,
      gradeHistory: [80, 81, 83, 84, 85],
      assignments: [],
    },
  ],
  'student-3': [
    {
      id: 'c8',
      name: 'Math 4',
      teacher: 'Mrs. Davis',
      currentGrade: 96,
      letterGrade: 'A',
      trend: 'up' as const,
      gradeHistory: [92, 93, 94, 95, 96],
      assignments: [
        { id: 'a12', title: 'Multiplication Facts Quiz', dueDate: '2026-02-07', maxPoints: 20, pointsEarned: 20, percentage: 100, status: 'graded' as const },
      ],
    },
    {
      id: 'c9',
      name: 'Reading & Writing',
      teacher: 'Ms. Brown',
      currentGrade: 94,
      letterGrade: 'A',
      trend: 'stable' as const,
      gradeHistory: [93, 94, 93, 94, 94],
      assignments: [],
    },
    {
      id: 'c10',
      name: 'Science 4',
      teacher: 'Mr. Wilson',
      currentGrade: 92,
      letterGrade: 'A-',
      trend: 'up' as const,
      gradeHistory: [88, 89, 90, 91, 92],
      assignments: [],
    },
  ],
};

function generateAttendanceRecords(rate: number) {
  const records = [];
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  for (let day = 1; day <= Math.min(today.getDate(), daysInMonth); day++) {
    const date = new Date(currentYear, currentMonth, day);
    if (date.getDay() === 0 || date.getDay() === 6) continue;
    if (date > today) continue;

    const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    const rand = Math.random() * 100;
    let status: 'present' | 'absent' | 'tardy' | 'excused' = 'present';
    if (rand > rate) {
      status = rand > rate + 2 ? 'absent' : 'tardy';
    }
    records.push({ date: dateStr, status });
  }
  return records;
}

const mockAttendanceByChild: Record<string, { records: any[]; stats: any }> = {
  'student-1': {
    records: generateAttendanceRecords(96),
    stats: { total: 96, present: 92, absent: 1, tardy: 2, excused: 1, rate: 96 },
  },
  'student-2': {
    records: generateAttendanceRecords(92),
    stats: { total: 96, present: 88, absent: 3, tardy: 3, excused: 2, rate: 92 },
  },
  'student-3': {
    records: generateAttendanceRecords(100),
    stats: { total: 96, present: 96, absent: 0, tardy: 0, excused: 0, rate: 100 },
  },
};

const mockAssignmentsByChild: Record<string, any[]> = {
  'student-1': [
    { id: 'pa1', title: 'Polynomial Functions Test', className: 'Algebra II', dueDate: '2026-02-14', status: 'not_started', grade: null, maxPoints: 100 },
    { id: 'pa2', title: 'Essay: The Great Gatsby', className: 'English Literature', dueDate: '2026-02-12', status: 'submitted', grade: null, maxPoints: 100 },
    { id: 'pa3', title: 'Unit 4 Exam', className: 'Biology I', dueDate: '2026-02-15', status: 'not_started', grade: null, maxPoints: 100 },
    { id: 'pa4', title: 'Balancing Equations Worksheet', className: 'Chemistry I', dueDate: '2026-02-03', status: 'missing', grade: null, maxPoints: 20 },
    { id: 'pa5', title: 'Quadratic Equations Quiz', className: 'Algebra II', dueDate: '2026-02-07', status: 'graded', grade: 47, maxPoints: 50 },
    { id: 'pa6', title: 'Lab Report: Cell Division', className: 'Biology I', dueDate: '2026-02-08', status: 'graded', grade: 46, maxPoints: 50 },
  ],
  'student-2': [
    { id: 'pa7', title: 'Book Report', className: 'English 7', dueDate: '2026-02-13', status: 'not_started', grade: null, maxPoints: 100 },
    { id: 'pa8', title: 'Fractions Test', className: 'Pre-Algebra', dueDate: '2026-02-06', status: 'graded', grade: 39, maxPoints: 50 },
  ],
  'student-3': [
    { id: 'pa9', title: 'Multiplication Facts Quiz', className: 'Math 4', dueDate: '2026-02-07', status: 'graded', grade: 20, maxPoints: 20 },
  ],
};

// --- Component ---

export default function ParentProgressPage() {
  const [selectedChildId, setSelectedChildId] = useState(mockChildOptions[0].id);

  const classes = mockClassesByChild[selectedChildId] || [];
  const attendance = mockAttendanceByChild[selectedChildId] || {
    records: [],
    stats: { total: 0, present: 0, absent: 0, tardy: 0, excused: 0, rate: 0 },
  };
  const assignments = mockAssignmentsByChild[selectedChildId] || [];

  const avgGrade =
    classes.length > 0
      ? Math.round(classes.reduce((sum: number, c: any) => sum + c.currentGrade, 0) / classes.length)
      : 0;
  const missingCount = assignments.filter((a: any) => a.status === 'missing').length;
  const upcomingCount = assignments.filter(
    (a: any) => a.status === 'not_started' || a.status === 'in_progress'
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-950 dark:via-green-950 dark:to-emerald-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <motion.h1
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2"
            >
              Academic Progress
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-slate-600 dark:text-slate-400"
            >
              Track grades, attendance, and assignments across all classes
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
          >
            <ChildSelector
              children={mockChildOptions}
              selectedChildId={selectedChildId}
              onSelect={setSelectedChildId}
            />
          </motion.div>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
        >
          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Overall Average
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {avgGrade}%
              </p>
              <Badge
                className={
                  avgGrade >= 90
                    ? 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                    : avgGrade >= 80
                    ? 'bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                    : avgGrade >= 70
                    ? 'bg-amber-100/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                    : 'bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                }
                size="sm"
              >
                {avgGrade >= 90
                  ? 'Excellent'
                  : avgGrade >= 80
                  ? 'Good'
                  : avgGrade >= 70
                  ? 'Needs Improvement'
                  : 'At Risk'}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Attendance
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {attendance.stats.rate}%
              </p>
              <Badge
                className={
                  attendance.stats.rate >= 95
                    ? 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                    : 'bg-amber-100/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                }
                size="sm"
              >
                {attendance.stats.rate >= 95 ? 'On Track' : 'Monitor'}
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Upcoming Work
              </p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {upcomingCount}
              </p>
              <Badge variant="secondary" size="sm">
                assignments
              </Badge>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                Missing Work
              </p>
              <p
                className={`text-3xl font-bold ${
                  missingCount > 0
                    ? 'text-red-600 dark:text-red-400'
                    : 'text-emerald-600 dark:text-emerald-400'
                }`}
              >
                {missingCount}
              </p>
              <Badge
                className={
                  missingCount > 0
                    ? 'bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-300'
                    : 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                }
                size="sm"
              >
                {missingCount > 0 ? 'Action Needed' : 'All Clear'}
              </Badge>
            </CardContent>
          </Card>
        </motion.div>

        {/* Tabs for Grades / Attendance / Assignments */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Tabs defaultValue="grades" className="w-full">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="grades" className="flex items-center gap-2">
                <GraduationCap className="w-4 h-4" />
                Grades
              </TabsTrigger>
              <TabsTrigger value="attendance" className="flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Attendance
              </TabsTrigger>
              <TabsTrigger value="assignments" className="flex items-center gap-2">
                <ClipboardList className="w-4 h-4" />
                Assignments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="grades" className="mt-6">
              <ParentGradeView
                classes={classes}
                showMiniChart={true}
                expandable={true}
              />
            </TabsContent>

            <TabsContent value="attendance" className="mt-6">
              <ParentAttendanceView
                records={attendance.records}
                stats={attendance.stats}
              />
            </TabsContent>

            <TabsContent value="assignments" className="mt-6">
              <ParentAssignmentView
                assignments={assignments}
                title="All Assignments"
                showNext7Days={false}
              />
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Per-child summary comparison (visible when looking at overall) */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                Family Overview
              </h3>
              <div className="space-y-3">
                {mockChildOptions.map((child) => {
                  const childClasses = mockClassesByChild[child.id] || [];
                  const childAvg =
                    childClasses.length > 0
                      ? Math.round(
                          childClasses.reduce((s: number, c: any) => s + c.currentGrade, 0) /
                            childClasses.length
                        )
                      : 0;
                  const childAttendance = mockAttendanceByChild[child.id]?.stats.rate || 0;
                  const childMissing = (mockAssignmentsByChild[child.id] || []).filter(
                    (a: any) => a.status === 'missing'
                  ).length;

                  return (
                    <button
                      key={child.id}
                      onClick={() => setSelectedChildId(child.id)}
                      className={`w-full flex items-center justify-between p-4 rounded-xl transition-all duration-200 ${
                        child.id === selectedChildId
                          ? 'bg-emerald-50 dark:bg-emerald-900/20 border-2 border-emerald-300 dark:border-emerald-700'
                          : 'bg-slate-50 dark:bg-slate-800/30 border-2 border-transparent hover:border-slate-200 dark:hover:border-slate-700'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center text-white font-bold text-sm">
                          {child.firstName[0]}
                          {child.lastName[0]}
                        </div>
                        <div className="text-left">
                          <p className="font-semibold text-slate-900 dark:text-white text-sm">
                            {child.firstName} {child.lastName}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            Grade {child.gradeLevel}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-xs text-slate-500 dark:text-slate-400">Avg</p>
                          <p
                            className={`text-sm font-bold ${
                              childAvg >= 90
                                ? 'text-emerald-600 dark:text-emerald-400'
                                : childAvg >= 80
                                ? 'text-blue-600 dark:text-blue-400'
                                : 'text-amber-600 dark:text-amber-400'
                            }`}
                          >
                            {childAvg}%
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500 dark:text-slate-400">Attend</p>
                          <p className="text-sm font-bold text-slate-900 dark:text-white">
                            {childAttendance}%
                          </p>
                        </div>
                        {childMissing > 0 && (
                          <Badge className="bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-300" size="sm">
                            {childMissing} missing
                          </Badge>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
