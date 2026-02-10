'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AlertCircle, Clock, CheckCircle2, FileText, ArrowRight, CircleDot } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import type { MockTask, TaskStatus } from '@/lib/mock-data';

interface TasksCardProps {
  variant: 'k5' | '612';
  tasks: MockTask[];
}

function getStatusConfig(status: TaskStatus) {
  switch (status) {
    case 'overdue':
      return {
        label: 'Overdue',
        bg: 'bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/50',
        text: 'text-red-700 dark:text-red-300',
        badge: 'bg-red-100 text-red-700 dark:bg-red-900/50 dark:text-red-300 border-red-200/50',
        icon: AlertCircle,
        iconColor: 'text-red-500',
        dotColor: 'bg-red-500',
      };
    case 'due_soon':
      return {
        label: 'Due Soon',
        bg: 'bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/50',
        text: 'text-amber-700 dark:text-amber-300',
        badge: 'bg-amber-100 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300 border-amber-200/50',
        icon: Clock,
        iconColor: 'text-amber-500',
        dotColor: 'bg-amber-500',
      };
    case 'submitted':
      return {
        label: 'Submitted',
        bg: 'bg-green-50 dark:bg-green-950/40 border-green-200 dark:border-green-800/50',
        text: 'text-green-700 dark:text-green-300',
        badge: 'bg-green-100 text-green-700 dark:bg-green-900/50 dark:text-green-300 border-green-200/50',
        icon: CheckCircle2,
        iconColor: 'text-green-500',
        dotColor: 'bg-green-500',
      };
    case 'in_progress':
      return {
        label: 'In Progress',
        bg: 'bg-blue-50 dark:bg-blue-950/40 border-blue-200 dark:border-blue-800/50',
        text: 'text-blue-700 dark:text-blue-300',
        badge: 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300 border-blue-200/50',
        icon: CircleDot,
        iconColor: 'text-blue-500',
        dotColor: 'bg-blue-500',
      };
    default:
      return {
        label: 'Not Started',
        bg: 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700/50',
        text: 'text-slate-600 dark:text-slate-400',
        badge: 'bg-slate-100 text-slate-600 dark:bg-slate-800/50 dark:text-slate-400 border-slate-200/50',
        icon: FileText,
        iconColor: 'text-slate-400',
        dotColor: 'bg-slate-400',
      };
  }
}

/* ── K-5 Visual Task Cards ──────────────────────────── */

function K5TasksCard({ tasks }: { tasks: MockTask[] }) {
  const displayTasks = tasks.slice(0, 5);

  return (
    <Card variant="fun" className="overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center gap-2">
          <span className="text-2xl">&#x1F4DD;</span>
          Today&apos;s Tasks
          <Badge variant="default" size="sm" className="ml-auto">
            {displayTasks.length}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayTasks.map((task, index) => {
          const config = getStatusConfig(task.status);
          const Icon = config.icon;

          return (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.08 }}
            >
              <motion.button
                whileHover={{ scale: 1.02, x: 4 }}
                whileTap={{ scale: 0.98 }}
                className={cn(
                  'w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-shadow hover:shadow-md text-left',
                  config.bg
                )}
              >
                {/* Color indicator + Icon */}
                <div
                  className="flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center shadow-sm"
                  style={{ backgroundColor: task.courseColor + '20' }}
                >
                  <Icon className={cn('w-6 h-6', config.iconColor)} />
                </div>

                {/* Task Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-slate-900 dark:text-white text-sm truncate">
                    {task.title}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    {task.courseName}
                  </p>
                </div>

                {/* Due Date + Status */}
                <div className="flex-shrink-0 text-right">
                  <span className={cn('text-xs font-bold block', config.text)}>
                    {task.dueDateLabel}
                  </span>
                  <span className="text-[10px] text-slate-400 mt-0.5 block">+{task.xpReward} XP</span>
                </div>
              </motion.button>
            </motion.div>
          );
        })}

        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <Button
            className="w-full h-12 text-sm font-semibold bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white rounded-2xl mt-2"
          >
            View All Tasks <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </motion.div>
      </CardContent>
    </Card>
  );
}

/* ── 6-12 Table View ────────────────────────────────── */

function SecondaryTasksCard({ tasks }: { tasks: MockTask[] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Upcoming Assignments
          </CardTitle>
          <Badge variant="secondary" size="sm">{tasks.length} due</Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Table Header */}
        <div className="hidden sm:grid grid-cols-12 gap-3 px-3 py-2 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700 mb-1">
          <div className="col-span-5">Assignment</div>
          <div className="col-span-3">Class</div>
          <div className="col-span-2">Due Date</div>
          <div className="col-span-2 text-right">Status</div>
        </div>

        {/* Table Rows */}
        <div className="space-y-1">
          {tasks.map((task, index) => {
            const config = getStatusConfig(task.status);
            return (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <button
                  className="w-full grid grid-cols-12 gap-3 items-center px-3 py-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors text-left"
                >
                  {/* Assignment Name */}
                  <div className="col-span-12 sm:col-span-5 flex items-center gap-2.5">
                    <div
                      className="w-2 h-2 rounded-full flex-shrink-0"
                      style={{ backgroundColor: task.courseColor }}
                    />
                    <span className="text-sm font-medium text-slate-900 dark:text-white truncate">
                      {task.title}
                    </span>
                  </div>

                  {/* Class */}
                  <div className="col-span-4 sm:col-span-3">
                    <span className="text-sm text-slate-600 dark:text-slate-400 truncate block">
                      {task.courseName}
                    </span>
                  </div>

                  {/* Due Date */}
                  <div className="col-span-4 sm:col-span-2">
                    <span className={cn('text-sm font-medium', config.text)}>
                      {task.dueDateLabel}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-4 sm:col-span-2 text-right">
                    <span className={cn(
                      'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium border',
                      config.badge
                    )}>
                      {config.label}
                    </span>
                  </div>
                </button>
              </motion.div>
            );
          })}
        </div>

        <Button
          variant="outline"
          className="w-full mt-3 text-sm"
        >
          View All Assignments <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}

/* ── Main Export ─────────────────────────────────────── */

export function TasksCard({ variant, tasks }: TasksCardProps) {
  if (variant === 'k5') {
    return <K5TasksCard tasks={tasks} />;
  }
  return <SecondaryTasksCard tasks={tasks} />;
}
