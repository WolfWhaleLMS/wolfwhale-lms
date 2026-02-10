'use client';

import React from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { TrendingUp, TrendingDown, Minus, AlertTriangle, Calendar, GraduationCap, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { cn } from '@/lib/utils';

interface ChildOverviewCardProps {
  id: string;
  firstName: string;
  lastName: string;
  gradeLevel: string;
  avatarUrl: string | null;
  gpa: number;
  attendanceRate: number;
  missingWork: number;
  level: number;
  xp: number;
  nextLevelXp: number;
  petEmoji: string;
  petName: string;
  className?: string;
}

function getGPAColor(gpa: number): string {
  if (gpa >= 3.5) return 'text-emerald-600 dark:text-emerald-400';
  if (gpa >= 3.0) return 'text-blue-600 dark:text-blue-400';
  if (gpa >= 2.5) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}

function getGPABg(gpa: number): string {
  if (gpa >= 3.5) return 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200/50 dark:border-emerald-800/50';
  if (gpa >= 3.0) return 'bg-blue-50 dark:bg-blue-900/20 border-blue-200/50 dark:border-blue-800/50';
  if (gpa >= 2.5) return 'bg-amber-50 dark:bg-amber-900/20 border-amber-200/50 dark:border-amber-800/50';
  return 'bg-red-50 dark:bg-red-900/20 border-red-200/50 dark:border-red-800/50';
}

function getAttendanceColor(rate: number): string {
  if (rate >= 95) return 'text-emerald-600 dark:text-emerald-400';
  if (rate >= 90) return 'text-blue-600 dark:text-blue-400';
  if (rate >= 85) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
}

export function ChildOverviewCard({
  id,
  firstName,
  lastName,
  gradeLevel,
  avatarUrl,
  gpa,
  attendanceRate,
  missingWork,
  level,
  xp,
  nextLevelXp,
  petEmoji,
  petName,
  className: cardClassName,
}: ChildOverviewCardProps) {
  const xpProgress = nextLevelXp > 0 ? Math.round((xp / nextLevelXp) * 100) : 0;

  return (
    <motion.div
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/parent/children/${id}`}>
        <Card className={cn(
          'overflow-hidden cursor-pointer hover:shadow-lg transition-shadow duration-200',
          'border-2 hover:border-emerald-300 dark:hover:border-emerald-600',
          cardClassName
        )}>
          <CardContent className="p-6">
            {/* Top: Child identity */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <Avatar size="lg">
                  <AvatarImage src={avatarUrl || undefined} />
                  <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-base">
                    {firstName[0]}{lastName[0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white">
                    {firstName} {lastName}
                  </h3>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" size="sm">
                      Grade {gradeLevel}
                    </Badge>
                    <span className="text-xs text-slate-500 dark:text-slate-400">
                      Lv. {level}
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-2xl" title={petName}>
                {petEmoji}
              </div>
            </div>

            {/* Quick stats grid */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              {/* GPA */}
              <div className={cn('rounded-xl border p-3 text-center', getGPABg(gpa))}>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-0.5">GPA</p>
                <p className={cn('text-xl font-bold', getGPAColor(gpa))}>
                  {gpa.toFixed(1)}
                </p>
              </div>

              {/* Attendance */}
              <div className="rounded-xl border border-slate-200/50 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/30 p-3 text-center">
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-0.5">Attendance</p>
                <p className={cn('text-xl font-bold', getAttendanceColor(attendanceRate))}>
                  {attendanceRate}%
                </p>
              </div>

              {/* Missing Work */}
              <div className={cn(
                'rounded-xl border p-3 text-center',
                missingWork > 0
                  ? 'border-red-200/50 dark:border-red-800/50 bg-red-50 dark:bg-red-900/20'
                  : 'border-slate-200/50 dark:border-slate-700/50 bg-slate-50 dark:bg-slate-800/30'
              )}>
                <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-0.5">Missing</p>
                <p className={cn(
                  'text-xl font-bold',
                  missingWork > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
                )}>
                  {missingWork}
                </p>
              </div>
            </div>

            {/* XP Bar */}
            <div className="mb-3">
              <div className="flex justify-between items-center text-xs text-slate-500 dark:text-slate-400 mb-1">
                <span>Level {level} Progress</span>
                <span>{xp.toLocaleString()} / {nextLevelXp.toLocaleString()} XP</span>
              </div>
              <Progress value={xpProgress} className="h-2" />
            </div>

            {/* View details prompt */}
            <div className="flex items-center justify-end text-xs font-medium text-emerald-600 dark:text-emerald-400 gap-1">
              View Details
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
