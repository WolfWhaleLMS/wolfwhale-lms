'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Download, Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MockTeacherAssignment, MockTeacherSubmission, MockTeacherStudent } from '@/lib/mock-data/teacher';

interface GradebookGridProps {
  students: MockTeacherStudent[];
  assignments: MockTeacherAssignment[];
  submissions: MockTeacherSubmission[];
  onCellClick: (studentId: string, assignmentId: string) => void;
}

function getGradeDisplay(pct: number | null): { text: string; color: string } {
  if (pct === null) return { text: '-', color: 'text-slate-400' };
  if (pct >= 90) return { text: `${pct}%`, color: 'text-green-600 dark:text-green-400 font-semibold' };
  if (pct >= 80) return { text: `${pct}%`, color: 'text-blue-600 dark:text-blue-400' };
  if (pct >= 70) return { text: `${pct}%`, color: 'text-yellow-600 dark:text-yellow-400' };
  if (pct >= 60) return { text: `${pct}%`, color: 'text-orange-600 dark:text-orange-400' };
  return { text: `${pct}%`, color: 'text-red-600 dark:text-red-400 font-semibold' };
}

export function GradebookGrid({ students, assignments, submissions, onCellClick }: GradebookGridProps) {
  const [searchQuery, setSearchQuery] = useState('');

  // Build lookup: submissions[assignmentId][studentId] = submission
  const submissionMap = useMemo(() => {
    const map: Record<string, Record<string, MockTeacherSubmission>> = {};
    submissions.forEach((sub) => {
      if (!map[sub.assignmentId]) map[sub.assignmentId] = {};
      map[sub.assignmentId][sub.studentId] = sub;
    });
    return map;
  }, [submissions]);

  const publishedAssignments = assignments.filter((a) => a.status === 'published');

  const filteredStudents = students.filter((s) =>
    `${s.firstName} ${s.lastName}`.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Calculate student averages
  const studentAverages = useMemo(() => {
    const avgs: Record<string, number | null> = {};
    filteredStudents.forEach((student) => {
      let totalPts = 0;
      let maxPts = 0;
      let hasGrade = false;
      publishedAssignments.forEach((a) => {
        const sub = submissionMap[a.id]?.[student.id];
        if (sub?.grade) {
          totalPts += sub.grade.pointsEarned;
          maxPts += a.maxPoints;
          hasGrade = true;
        }
      });
      avgs[student.id] = hasGrade && maxPts > 0 ? Math.round((totalPts / maxPts) * 100) : null;
    });
    return avgs;
  }, [filteredStudents, publishedAssignments, submissionMap]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Gradebook</CardTitle>
          <div className="flex items-center gap-3">
            <div className="relative w-48">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search students..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-8 text-sm"
              />
            </div>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50">
                <th className="sticky left-0 z-10 bg-slate-50 dark:bg-slate-800 px-4 py-3 text-left font-semibold text-slate-700 dark:text-slate-300 min-w-[180px]">
                  Student
                </th>
                {publishedAssignments.map((a) => (
                  <th
                    key={a.id}
                    className="px-3 py-3 text-center font-medium text-slate-600 dark:text-slate-400 min-w-[100px]"
                  >
                    <div className="max-w-[100px] truncate text-xs" title={a.title}>
                      {a.title}
                    </div>
                    <div className="text-[10px] text-slate-400 mt-0.5">{a.maxPoints}pts</div>
                  </th>
                ))}
                <th className="px-4 py-3 text-center font-semibold text-slate-700 dark:text-slate-300 min-w-[80px] bg-slate-100 dark:bg-slate-700/50">
                  Average
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredStudents.map((student, idx) => {
                const avg = studentAverages[student.id];
                const avgDisplay = getGradeDisplay(avg);

                return (
                  <tr
                    key={student.id}
                    className={cn(
                      'border-b border-slate-100 dark:border-slate-700/50',
                      idx % 2 === 0 ? 'bg-white dark:bg-slate-900' : 'bg-slate-50/50 dark:bg-slate-800/20'
                    )}
                  >
                    <td className="sticky left-0 z-10 bg-inherit px-4 py-2.5 font-medium text-slate-900 dark:text-white whitespace-nowrap">
                      {student.firstName} {student.lastName}
                    </td>
                    {publishedAssignments.map((a) => {
                      const sub = submissionMap[a.id]?.[student.id];
                      const grade = sub?.grade;
                      const pct = grade ? grade.percentage : null;
                      const display = getGradeDisplay(pct);
                      const hasSubmission = !!sub;
                      const isUngraded = hasSubmission && !grade;

                      return (
                        <td
                          key={a.id}
                          className={cn(
                            'px-3 py-2.5 text-center cursor-pointer transition-colors',
                            'hover:bg-indigo-50 dark:hover:bg-indigo-900/20',
                            isUngraded && 'bg-yellow-50 dark:bg-yellow-900/10'
                          )}
                          onClick={() => onCellClick(student.id, a.id)}
                          title={
                            isUngraded
                              ? 'Click to grade'
                              : grade
                              ? `${grade.pointsEarned}/${a.maxPoints} - Click to edit`
                              : 'No submission'
                          }
                        >
                          {isUngraded ? (
                            <Badge className="bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 text-xs">
                              Ungraded
                            </Badge>
                          ) : grade ? (
                            <span className={display.color}>{display.text}</span>
                          ) : (
                            <span className="text-slate-300 dark:text-slate-600">--</span>
                          )}
                        </td>
                      );
                    })}
                    <td className={cn('px-4 py-2.5 text-center font-semibold bg-slate-50 dark:bg-slate-800/30', avgDisplay.color)}>
                      {avgDisplay.text}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {filteredStudents.length === 0 && (
          <div className="p-8 text-center text-slate-500">No students found</div>
        )}
      </CardContent>
    </Card>
  );
}
