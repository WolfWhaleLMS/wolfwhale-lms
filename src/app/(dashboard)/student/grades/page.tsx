'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Button } from '@/components/ui/Button';
import { ChevronDown, TrendingUp, Download } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClassGrade {
  id: string;
  className: string;
  teacher: string;
  currentGrade: number;
  assignmentsDone: number;
  assignmentsTotal: number;
  trend: 'up' | 'down' | 'stable';
  expanded?: boolean;
  assignments: {
    name: string;
    score: number;
    total: number;
    date: string;
    weight: string;
  }[];
}

const mockGradeData: ClassGrade[] = [
  {
    id: '1',
    className: 'Mathematics 9',
    teacher: 'Ms. Chen',
    currentGrade: 92,
    assignmentsDone: 8,
    assignmentsTotal: 10,
    trend: 'up',
    assignments: [
      { name: 'Problem Set 1', score: 95, total: 100, date: 'Mar 5', weight: 'Homework' },
      { name: 'Quiz 1', score: 92, total: 100, date: 'Mar 8', weight: 'Quiz' },
      { name: 'Problem Set 2', score: 88, total: 100, date: 'Mar 10', weight: 'Homework' },
      { name: 'Quiz 2', score: 94, total: 100, date: 'Mar 12', weight: 'Quiz' },
      { name: 'Worksheet 5', score: 90, total: 100, date: 'Mar 15', weight: 'Homework' },
      { name: 'Problem Set 3', score: 92, total: 100, date: 'Mar 17', weight: 'Homework' },
      { name: 'Quiz 3', score: 94, total: 100, date: 'Mar 19', weight: 'Quiz' },
      { name: 'Problem Set 4', score: 90, total: 100, date: 'Mar 22', weight: 'Homework' },
    ],
  },
  {
    id: '2',
    className: 'English Literature',
    teacher: 'Mr. Patterson',
    currentGrade: 87,
    assignmentsDone: 6,
    assignmentsTotal: 9,
    trend: 'stable',
    assignments: [
      { name: 'Reading Response 1', score: 88, total: 100, date: 'Mar 3', weight: 'Assignment' },
      { name: 'Essay 1: Romeo and Juliet', score: 85, total: 100, date: 'Mar 8', weight: 'Essay' },
      { name: 'Reading Response 2', score: 87, total: 100, date: 'Mar 10', weight: 'Assignment' },
      { name: 'Vocabulary Quiz 1', score: 90, total: 100, date: 'Mar 12', weight: 'Quiz' },
      { name: 'Essay 2: Character Analysis', score: 86, total: 100, date: 'Mar 15', weight: 'Essay' },
      { name: 'Reading Response 3', score: 85, total: 100, date: 'Mar 17', weight: 'Assignment' },
    ],
  },
  {
    id: '3',
    className: 'Biology I',
    teacher: 'Dr. Martinez',
    currentGrade: 88,
    assignmentsDone: 7,
    assignmentsTotal: 10,
    trend: 'up',
    assignments: [
      { name: 'Lab Report 1', score: 85, total: 100, date: 'Mar 2', weight: 'Lab' },
      { name: 'Quiz 1', score: 88, total: 100, date: 'Mar 5', weight: 'Quiz' },
      { name: 'Worksheet 1', score: 90, total: 100, date: 'Mar 7', weight: 'Homework' },
      { name: 'Lab Report 2', score: 88, total: 100, date: 'Mar 10', weight: 'Lab' },
      { name: 'Quiz 2', score: 89, total: 100, date: 'Mar 12', weight: 'Quiz' },
      { name: 'Worksheet 2', score: 87, total: 100, date: 'Mar 14', weight: 'Homework' },
      { name: 'Lab Report 3', score: 88, total: 100, date: 'Mar 17', weight: 'Lab' },
    ],
  },
  {
    id: '4',
    className: 'Chemistry I',
    teacher: 'Dr. Williams',
    currentGrade: 85,
    assignmentsDone: 6,
    assignmentsTotal: 10,
    trend: 'down',
    assignments: [
      { name: 'Lab Report 1', score: 88, total: 100, date: 'Mar 1', weight: 'Lab' },
      { name: 'Problem Set 1', score: 87, total: 100, date: 'Mar 4', weight: 'Homework' },
      { name: 'Quiz 1', score: 84, total: 100, date: 'Mar 6', weight: 'Quiz' },
      { name: 'Lab Report 2', score: 82, total: 100, date: 'Mar 9', weight: 'Lab' },
      { name: 'Problem Set 2', score: 85, total: 100, date: 'Mar 11', weight: 'Homework' },
      { name: 'Quiz 2', score: 83, total: 100, date: 'Mar 13', weight: 'Quiz' },
    ],
  },
  {
    id: '5',
    className: 'U.S. History',
    teacher: 'Mr. Thompson',
    currentGrade: 91,
    assignmentsDone: 7,
    assignmentsTotal: 9,
    trend: 'up',
    assignments: [
      { name: 'Timeline Activity', score: 92, total: 100, date: 'Mar 1', weight: 'Assignment' },
      { name: 'Quiz 1', score: 89, total: 100, date: 'Mar 4', weight: 'Quiz' },
      { name: 'Essay 1: Civil War', score: 91, total: 100, date: 'Mar 7', weight: 'Essay' },
      { name: 'Document Analysis', score: 92, total: 100, date: 'Mar 9', weight: 'Assignment' },
      { name: 'Quiz 2', score: 91, total: 100, date: 'Mar 11', weight: 'Quiz' },
      { name: 'Essay 2: Reconstruction', score: 92, total: 100, date: 'Mar 14', weight: 'Essay' },
      { name: 'Research Project', score: 90, total: 100, date: 'Mar 16', weight: 'Project' },
    ],
  },
];

const getGradeColor = (grade: number) => {
  if (grade >= 90) return 'bg-green-500/20 text-green-700 dark:text-green-200';
  if (grade >= 80) return 'bg-blue-500/20 text-blue-700 dark:text-blue-200';
  if (grade >= 70) return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-200';
  return 'bg-red-500/20 text-red-700 dark:text-red-200';
};

const getTrendIcon = (trend: string) => {
  if (trend === 'up') return '📈';
  if (trend === 'down') return '📉';
  return '➡️';
};

export default function GradesPage() {
  const [expandedClasses, setExpandedClasses] = useState<string[]>([]);

  const toggleClass = (classId: string) => {
    setExpandedClasses((prev) =>
      prev.includes(classId) ? prev.filter((id) => id !== classId) : [...prev, classId]
    );
  };

  const overallGrade = Math.round(
    mockGradeData.reduce((acc, cls) => acc + cls.currentGrade, 0) / mockGradeData.length
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
              My Grades
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Grade summary across all classes
            </p>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white">
            <Download className="w-4 h-4 mr-2" />
            Download Report
          </Button>
        </div>

        {/* Overall Grade Summary */}
        <Card variant="fun">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Overall GPA</p>
                <p className="text-5xl font-bold text-slate-900 dark:text-white">
                  {overallGrade}%
                </p>
              </div>
              <div className="text-right">
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Cumulative</p>
                <Badge className={cn('text-lg px-4 py-2', getGradeColor(overallGrade))}>
                  {overallGrade >= 90 ? 'A' : overallGrade >= 80 ? 'B' : overallGrade >= 70 ? 'C' : 'D'}
                </Badge>
              </div>
            </div>
            <Progress value={overallGrade} className="h-3 mt-4" />
          </CardContent>
        </Card>

        {/* Grade Breakdown by Class */}
        <div className="space-y-4">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Classes</h2>
          {mockGradeData.map((classGrade) => (
            <Card
              key={classGrade.id}
              className="hover:shadow-lg transition-all duration-300"
            >
              <button
                onClick={() => toggleClass(classGrade.id)}
                className="w-full text-left p-6 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors"
              >
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">
                    {classGrade.className}
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                    {classGrade.teacher} • {classGrade.assignmentsDone}/{classGrade.assignmentsTotal} assignments graded
                  </p>
                  <div className="flex items-center gap-4">
                    <div className="flex-1 max-w-xs">
                      <Progress
                        value={classGrade.currentGrade}
                        className="h-2"
                      />
                    </div>
                    <span className="text-xs text-slate-600 dark:text-slate-400">
                      {Math.round((classGrade.assignmentsDone / classGrade.assignmentsTotal) * 100)}% complete
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-4 ml-6">
                  <div className="text-right">
                    <p className="text-3xl font-bold text-slate-900 dark:text-white">
                      {classGrade.currentGrade}%
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {getTrendIcon(classGrade.trend)}
                    </p>
                  </div>
                  <ChevronDown
                    className={cn(
                      'w-5 h-5 text-slate-600 transition-transform',
                      expandedClasses.includes(classGrade.id) && 'rotate-180'
                    )}
                  />
                </div>
              </button>

              {expandedClasses.includes(classGrade.id) && (
                <CardContent className="border-t border-slate-200 dark:border-slate-700 p-6">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-slate-900 dark:text-white mb-4">
                      All Assignments
                    </h4>
                    {classGrade.assignments.map((assignment, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 flex items-center justify-between"
                      >
                        <div className="flex-1">
                          <p className="font-medium text-slate-900 dark:text-white">
                            {assignment.name}
                          </p>
                          <div className="flex gap-3 text-xs text-slate-600 dark:text-slate-400">
                            <span>{assignment.weight}</span>
                            <span>{assignment.date}</span>
                          </div>
                        </div>
                        <Badge className={cn('text-sm', getGradeColor(assignment.score))}>
                          {assignment.score}/{assignment.total}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              )}
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
