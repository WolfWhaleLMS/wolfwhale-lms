'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { Users, GraduationCap, BookOpen, UserCheck } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/Card';

interface SnapshotStat {
  label: string;
  value: number;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  trend?: { value: number; isPositive: boolean };
}

interface SchoolSnapshotProps {
  totalStudents: number;
  totalTeachers: number;
  totalClasses: number;
  activeUsers: number;
}

export function SchoolSnapshot({
  totalStudents,
  totalTeachers,
  totalClasses,
  activeUsers,
}: SchoolSnapshotProps) {
  const stats: SnapshotStat[] = [
    {
      label: 'Total Students',
      value: totalStudents,
      icon: <GraduationCap className="h-6 w-6" />,
      color: 'text-whale-600 dark:text-whale-400',
      bgColor: 'bg-whale-100/60 dark:bg-whale-900/30',
      trend: { value: 4.2, isPositive: true },
    },
    {
      label: 'Teachers',
      value: totalTeachers,
      icon: <Users className="h-6 w-6" />,
      color: 'text-success-600 dark:text-success-400',
      bgColor: 'bg-success-100/60 dark:bg-success-900/30',
      trend: { value: 2.1, isPositive: true },
    },
    {
      label: 'Active Classes',
      value: totalClasses,
      icon: <BookOpen className="h-6 w-6" />,
      color: 'text-aurora-600 dark:text-aurora-400',
      bgColor: 'bg-aurora-100/60 dark:bg-aurora-900/30',
    },
    {
      label: 'Active Users Today',
      value: activeUsers,
      icon: <UserCheck className="h-6 w-6" />,
      color: 'text-gold-600 dark:text-gold-400',
      bgColor: 'bg-gold-100/60 dark:bg-gold-900/30',
      trend: { value: 8.5, isPositive: true },
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <motion.div
          key={stat.label}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.08, duration: 0.4 }}
        >
          <Card className="relative overflow-hidden hover:shadow-lg transition-shadow duration-200">
            <CardContent className="p-5">
              <div className="flex items-start justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400 truncate">
                    {stat.label}
                  </p>
                  <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white tabular-nums">
                    {stat.value.toLocaleString()}
                  </p>
                  {stat.trend && (
                    <p
                      className={cn(
                        'mt-1 text-xs font-semibold',
                        stat.trend.isPositive
                          ? 'text-success-600 dark:text-success-400'
                          : 'text-danger-600 dark:text-danger-400'
                      )}
                    >
                      {stat.trend.isPositive ? '+' : '-'}{stat.trend.value}% from last month
                    </p>
                  )}
                </div>
                <div className={cn('rounded-xl p-3', stat.bgColor, stat.color)}>
                  {stat.icon}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
