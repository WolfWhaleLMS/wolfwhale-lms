'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { cn } from '@/lib/utils';

interface ChildOption {
  id: string;
  firstName: string;
  lastName: string;
  gradeLevel: string;
  avatarUrl: string | null;
  gpa: number;
}

interface ClassData {
  id: string;
  name: string;
  teacher: string;
  currentGrade: number;
  letterGrade: string;
  trend: string;
  gradeHistory: number[];
  assignments: any[];
}

interface ParentProgressClientProps {
  childOptions: ChildOption[];
  classesByChild: Record<string, ClassData[]>;
  attendanceByChild: Record<string, { records: any[]; stats: any }>;
  assignmentsByChild: Record<string, any[]>;
}

const getGradeColor = (grade: number) => {
  if (grade >= 90) return 'text-green-600 dark:text-green-400';
  if (grade >= 80) return 'text-blue-600 dark:text-blue-400';
  if (grade >= 70) return 'text-yellow-600 dark:text-yellow-400';
  return 'text-red-600 dark:text-red-400';
};

export default function ParentProgressClient({
  childOptions,
  classesByChild,
  attendanceByChild,
  assignmentsByChild,
}: ParentProgressClientProps) {
  const [selectedChild, setSelectedChild] = useState(childOptions[0]?.id || '');
  const child = childOptions.find((c) => c.id === selectedChild);
  const classes = classesByChild[selectedChild] || [];
  const attendance = attendanceByChild[selectedChild];
  const assignments = assignmentsByChild[selectedChild] || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-950 dark:via-green-950 dark:to-emerald-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
            Academic Progress
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Track your children&apos;s academic performance
          </p>
        </div>

        {/* Child Selector */}
        {childOptions.length > 1 && (
          <div className="flex gap-3 flex-wrap">
            {childOptions.map((c) => (
              <button
                key={c.id}
                onClick={() => setSelectedChild(c.id)}
                className={cn(
                  'px-4 py-2 rounded-xl font-medium transition-all',
                  selectedChild === c.id
                    ? 'bg-green-600 text-white shadow-lg'
                    : 'bg-white/70 dark:bg-slate-800/50 text-slate-700 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-800'
                )}
              >
                {c.firstName} {c.lastName}
              </button>
            ))}
          </div>
        )}

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">GPA</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{child?.gpa || '--'}</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Attendance Rate</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {attendance?.stats?.rate ?? '--'}%
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Active Courses</p>
              <p className="text-3xl font-bold text-slate-900 dark:text-white">{classes.length}</p>
            </CardContent>
          </Card>
        </div>

        {/* Course Grades */}
        <Card>
          <CardHeader>
            <CardTitle>Course Grades</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {classes.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400">No courses enrolled.</p>
            ) : (
              classes.map((cls) => (
                <div key={cls.id} className="flex items-center justify-between p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50">
                  <div>
                    <h3 className="font-semibold text-slate-900 dark:text-white">{cls.name}</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Teacher: {cls.teacher}</p>
                  </div>
                  <div className="text-right">
                    <p className={cn('text-2xl font-bold', getGradeColor(cls.currentGrade))}>
                      {cls.currentGrade > 0 ? `${cls.currentGrade}%` : '--'}
                    </p>
                    <Badge>{cls.letterGrade}</Badge>
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Recent Assignments */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Assignments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {assignments.length === 0 ? (
              <p className="text-slate-500 dark:text-slate-400">No assignments found.</p>
            ) : (
              assignments.slice(0, 10).map((a: any) => (
                <div key={a.id} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{a.title}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{a.className}</p>
                  </div>
                  <div className="text-right">
                    {a.grade !== null ? (
                      <p className="font-semibold text-slate-900 dark:text-white">
                        {a.grade}/{a.maxPoints}
                      </p>
                    ) : (
                      <Badge className={cn(
                        a.status === 'missing' ? 'bg-red-500/20 text-red-700 dark:text-red-300' :
                        a.status === 'submitted' ? 'bg-blue-500/20 text-blue-700 dark:text-blue-300' :
                        'bg-slate-500/20 text-slate-700 dark:text-slate-300'
                      )}>
                        {a.status}
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Attendance Details */}
        {attendance && (
          <Card>
            <CardHeader>
              <CardTitle>Attendance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-950 text-center">
                  <p className="text-2xl font-bold text-green-600 dark:text-green-400">{attendance.stats.present}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Present</p>
                </div>
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-950 text-center">
                  <p className="text-2xl font-bold text-red-600 dark:text-red-400">{attendance.stats.absent}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Absent</p>
                </div>
                <div className="p-3 rounded-lg bg-yellow-50 dark:bg-yellow-950 text-center">
                  <p className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{attendance.stats.tardy}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Tardy</p>
                </div>
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-950 text-center">
                  <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{attendance.stats.excused}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Excused</p>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 text-center">
                  <p className="text-2xl font-bold text-slate-900 dark:text-white">{attendance.stats.total}</p>
                  <p className="text-xs text-slate-600 dark:text-slate-400">Total Days</p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
