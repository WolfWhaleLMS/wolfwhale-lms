'use client';

import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { cn } from '@/lib/utils';
import { CheckCircle, XCircle, Clock, Shield, Wifi, Trophy, Flame } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface AttendanceSummaryProps {
  stats: {
    totalDays: number;
    presentDays: number;
    absentDays: number;
    tardyDays: number;
    excusedDays: number;
    onlineDays: number;
    attendanceRate: number;
    perfectWeeks: number;
    currentStreak: number;
  };
  isK5?: boolean;
}

const COLORS = {
  present: '#22c55e',
  absent: '#ef4444',
  tardy: '#f59e0b',
  excused: '#3b82f6',
  online: '#8b5cf6',
};

export default function AttendanceSummary({ stats, isK5 = false }: AttendanceSummaryProps) {
  const gaugeData = [
    { name: 'Present', value: stats.attendanceRate },
    { name: 'Remaining', value: 100 - stats.attendanceRate },
  ];

  const breakdownData = [
    { name: 'Present', value: stats.presentDays, color: COLORS.present },
    { name: 'Absent', value: stats.absentDays, color: COLORS.absent },
    { name: 'Tardy', value: stats.tardyDays, color: COLORS.tardy },
    { name: 'Excused', value: stats.excusedDays, color: COLORS.excused },
    { name: 'Online', value: stats.onlineDays, color: COLORS.online },
  ].filter(d => d.value > 0);

  const getRateColor = (rate: number) => {
    if (rate >= 95) return 'text-green-600 dark:text-green-400';
    if (rate >= 90) return 'text-blue-600 dark:text-blue-400';
    if (rate >= 85) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getRateMessage = (rate: number) => {
    if (rate >= 98) return 'Outstanding attendance!';
    if (rate >= 95) return 'Excellent attendance!';
    if (rate >= 90) return 'Good attendance - keep it up!';
    if (rate >= 85) return 'Room for improvement';
    return 'Attendance needs attention';
  };

  if (isK5) {
    return (
      <div className="space-y-6">
        {/* Big Percentage Circle */}
        <Card variant="fun">
          <CardContent className="p-8">
            <div className="flex flex-col items-center">
              <div className="relative w-48 h-48">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gaugeData}
                      cx="50%"
                      cy="50%"
                      innerRadius={65}
                      outerRadius={85}
                      startAngle={90}
                      endAngle={-270}
                      dataKey="value"
                      strokeWidth={0}
                    >
                      <Cell fill={stats.attendanceRate >= 90 ? '#22c55e' : stats.attendanceRate >= 80 ? '#f59e0b' : '#ef4444'} />
                      <Cell fill="#e2e8f0" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className={cn('text-4xl font-bold', getRateColor(stats.attendanceRate))}>
                    {stats.attendanceRate.toFixed(0)}%
                  </span>
                  <span className="text-sm text-slate-500 dark:text-slate-400">Attendance</span>
                </div>
              </div>
              <p className="text-lg font-semibold text-slate-700 dark:text-slate-300 mt-4">
                {getRateMessage(stats.attendanceRate)}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Streak & Perfect Weeks */}
        <div className="grid grid-cols-2 gap-4">
          <Card>
            <CardContent className="p-5 text-center">
              <Flame className="w-8 h-8 text-orange-500 mx-auto mb-2" />
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {stats.currentStreak}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Day Streak</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5 text-center">
              <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
              <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {stats.perfectWeeks}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400">Perfect Weeks</p>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  // 6-12 variant
  return (
    <div className="space-y-6">
      {/* Attendance Rate Gauge */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center gap-8">
            <div className="relative w-36 h-36 flex-shrink-0">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={gaugeData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={65}
                    startAngle={90}
                    endAngle={-270}
                    dataKey="value"
                    strokeWidth={0}
                  >
                    <Cell fill={stats.attendanceRate >= 90 ? '#22c55e' : stats.attendanceRate >= 80 ? '#f59e0b' : '#ef4444'} />
                    <Cell fill="#e2e8f0" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={cn('text-2xl font-bold', getRateColor(stats.attendanceRate))}>
                  {stats.attendanceRate.toFixed(1)}%
                </span>
              </div>
            </div>

            <div className="flex-1 grid grid-cols-2 gap-4">
              <div className="flex items-center gap-3">
                <CheckCircle className="w-5 h-5 text-green-500" />
                <div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.presentDays}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Present</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <XCircle className="w-5 h-5 text-red-500" />
                <div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.absentDays}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Absent</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-yellow-500" />
                <div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.tardyDays}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Tardy</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-blue-500" />
                <div>
                  <p className="text-lg font-bold text-slate-900 dark:text-white">{stats.excusedDays}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">Excused</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Streaks */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <Flame className="w-6 h-6 text-orange-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.currentStreak}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Day Streak</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <Trophy className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.perfectWeeks}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Perfect Weeks</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-1" />
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{stats.totalDays}</p>
            <p className="text-xs text-slate-500 dark:text-slate-400">Total Days</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
