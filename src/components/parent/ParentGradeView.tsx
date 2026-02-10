'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, TrendingDown, Minus, ChevronDown, ChevronRight } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
} from 'recharts';

interface ClassAssignment {
  id: string;
  title: string;
  dueDate: string;
  maxPoints: number;
  pointsEarned: number | null;
  percentage: number | null;
  status: 'graded' | 'submitted' | 'missing' | 'upcoming';
}

interface ClassData {
  id: string;
  name: string;
  teacher: string;
  currentGrade: number;
  letterGrade: string;
  trend: 'up' | 'down' | 'stable';
  gradeHistory: number[];
  assignments: ClassAssignment[];
}

interface ParentGradeViewProps {
  classes: ClassData[];
  showMiniChart?: boolean;
  expandable?: boolean;
  className?: string;
}

function getGradeColor(grade: number): string {
  if (grade >= 90) return 'text-emerald-600 dark:text-emerald-400';
  if (grade >= 80) return 'text-blue-600 dark:text-blue-400';
  if (grade >= 70) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}

function getGradeBg(grade: number): string {
  if (grade >= 90) return 'bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300';
  if (grade >= 80) return 'bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
  if (grade >= 70) return 'bg-amber-100/80 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300';
  return 'bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-300';
}

function TrendIcon({ trend }: { trend: 'up' | 'down' | 'stable' }) {
  if (trend === 'up') return <TrendingUp className="w-4 h-4 text-emerald-500" />;
  if (trend === 'down') return <TrendingDown className="w-4 h-4 text-red-500" />;
  return <Minus className="w-4 h-4 text-slate-400" />;
}

function MiniSparkline({ data, trend }: { data: number[]; trend: 'up' | 'down' | 'stable' }) {
  const chartData = data.map((val, idx) => ({ idx, value: val }));
  const color = trend === 'up' ? '#10b981' : trend === 'down' ? '#ef4444' : '#6b7280';

  return (
    <div className="w-20 h-8">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData}>
          <Line
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function getStatusBadge(status: string) {
  switch (status) {
    case 'graded':
      return <Badge className="bg-emerald-100/80 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300" size="sm">Graded</Badge>;
    case 'submitted':
      return <Badge className="bg-blue-100/80 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300" size="sm">Submitted</Badge>;
    case 'missing':
      return <Badge className="bg-red-100/80 text-red-700 dark:bg-red-900/30 dark:text-red-300" size="sm">Missing</Badge>;
    case 'upcoming':
      return <Badge variant="secondary" size="sm">Upcoming</Badge>;
    default:
      return <Badge variant="secondary" size="sm">{status}</Badge>;
  }
}

export function ParentGradeView({ classes, showMiniChart = true, expandable = false, className }: ParentGradeViewProps) {
  const [expandedClass, setExpandedClass] = useState<string | null>(null);

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <GradeIcon />
          Grades & Performance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-1">
          {/* Table header */}
          <div className="grid grid-cols-12 gap-2 px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
            <div className="col-span-4">Class</div>
            <div className="col-span-3">Teacher</div>
            <div className="col-span-2 text-center">Grade</div>
            <div className="col-span-1 text-center">Trend</div>
            {showMiniChart && <div className="col-span-2 text-right">Trend</div>}
          </div>

          {/* Class rows */}
          {classes.map((cls) => {
            const isExpanded = expandedClass === cls.id;
            return (
              <div key={cls.id}>
                <button
                  onClick={() => expandable && setExpandedClass(isExpanded ? null : cls.id)}
                  className={cn(
                    'w-full grid grid-cols-12 gap-2 items-center px-3 py-3 rounded-xl transition-all duration-150',
                    'hover:bg-slate-50 dark:hover:bg-slate-800/50',
                    isExpanded && 'bg-slate-50 dark:bg-slate-800/50',
                    expandable && 'cursor-pointer'
                  )}
                >
                  <div className="col-span-4 flex items-center gap-2">
                    {expandable && (
                      <motion.div
                        animate={{ rotate: isExpanded ? 90 : 0 }}
                        transition={{ duration: 0.15 }}
                      >
                        <ChevronRight className="w-4 h-4 text-slate-400" />
                      </motion.div>
                    )}
                    <span className="font-medium text-slate-900 dark:text-white text-sm truncate">
                      {cls.name}
                    </span>
                  </div>
                  <div className="col-span-3 text-sm text-slate-600 dark:text-slate-400 truncate">
                    {cls.teacher}
                  </div>
                  <div className="col-span-2 text-center">
                    <Badge className={cn(getGradeBg(cls.currentGrade))} size="sm">
                      {cls.letterGrade} ({cls.currentGrade}%)
                    </Badge>
                  </div>
                  <div className="col-span-1 flex justify-center">
                    <TrendIcon trend={cls.trend} />
                  </div>
                  {showMiniChart && (
                    <div className="col-span-2 flex justify-end">
                      <MiniSparkline data={cls.gradeHistory} trend={cls.trend} />
                    </div>
                  )}
                </button>

                {/* Expanded assignments */}
                <AnimatePresence>
                  {expandable && isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="ml-6 mr-2 mb-3 space-y-1 border-l-2 border-slate-200 dark:border-slate-700 pl-4">
                        {cls.assignments.map((assignment) => (
                          <div
                            key={assignment.id}
                            className="flex items-center justify-between py-2 px-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800/30"
                          >
                            <div className="flex-1">
                              <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                                {assignment.title}
                              </p>
                              <p className="text-xs text-slate-500 dark:text-slate-400">
                                Due: {new Date(assignment.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                              </p>
                            </div>
                            <div className="flex items-center gap-3">
                              {assignment.percentage !== null ? (
                                <span className={cn('text-sm font-semibold', getGradeColor(assignment.percentage))}>
                                  {assignment.pointsEarned}/{assignment.maxPoints}
                                </span>
                              ) : (
                                <span className="text-sm text-slate-400">--</span>
                              )}
                              {getStatusBadge(assignment.status)}
                            </div>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}

function GradeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-600 dark:text-emerald-400">
      <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
      <path d="M6 12v5c3 3 9 3 12 0v-5" />
    </svg>
  );
}
