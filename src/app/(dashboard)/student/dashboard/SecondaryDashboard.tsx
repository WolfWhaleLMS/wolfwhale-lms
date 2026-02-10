'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Calendar, FileText, Mail, ArrowRight } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { PetStatusCard } from '@/components/dashboard/PetStatusCard';
import { TasksCard } from '@/components/dashboard/TasksCard';
import { ClassCards } from '@/components/dashboard/ClassCards';
import { XPProgressBar } from '@/components/dashboard/XPProgressBar';
import { AttendanceWidget } from '@/components/dashboard/AttendanceWidget';
import { CalendarWidget } from '@/components/dashboard/CalendarWidget';
import { RecentGrades } from '@/components/dashboard/RecentGrades';
import { MessagesSummary } from '@/components/dashboard/MessagesSummary';
import {
  mockStudentProfile,
  mockPetData,
  mockXPData,
  mockTasks,
  mockClasses,
  mockAttendance,
  mockAttendanceStats,
  mockCalendarEvents,
  mockRecentGrades,
  mockMessages,
  mockAchievements,
} from '@/lib/mock-data';

interface SecondaryDashboardProps {
  gradeLabel: string;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      delayChildren: 0.05,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.35, ease: 'easeOut' },
  },
};

export function SecondaryDashboard({ gradeLabel }: SecondaryDashboardProps) {
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  const pendingCount = mockTasks.filter(t => t.status !== 'submitted').length;
  const unreadMessages = mockMessages.filter(m => !m.isRead).length;
  const overdueCount = mockTasks.filter(t => t.status === 'overdue').length;

  return (
    <div className="min-h-screen -m-4 md:-m-8 -mt-6 p-4 md:p-8 pt-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-7xl mx-auto space-y-6"
      >
        {/* ── Today's Overview ─────────────────────────── */}
        <motion.div variants={itemVariants}>
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                {/* Left: Welcome */}
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-white">
                    Welcome back, {mockStudentProfile.firstName}
                  </h1>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                    {currentDate} &middot; {gradeLabel}
                  </p>
                </div>

                {/* Right: Quick Stats */}
                <div className="flex flex-wrap items-center gap-3">
                  {overdueCount > 0 && (
                    <Badge variant="destructive" size="lg" className="gap-1.5">
                      <FileText className="w-3.5 h-3.5" />
                      {overdueCount} overdue
                    </Badge>
                  )}
                  <Badge variant="default" size="lg" className="gap-1.5">
                    <Calendar className="w-3.5 h-3.5" />
                    {pendingCount} assignments due
                  </Badge>
                  {unreadMessages > 0 && (
                    <Badge variant="secondary" size="lg" className="gap-1.5">
                      <Mail className="w-3.5 h-3.5" />
                      {unreadMessages} unread
                    </Badge>
                  )}
                  <Button size="sm" variant="outline" className="hidden sm:inline-flex">
                    View Schedule <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* ── Main Content: 2-Column Layout ────────────── */}
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-6">
          {/* Left Column: Primary Content (8 cols) */}
          <div className="xl:col-span-8 space-y-6">
            {/* Upcoming Assignments */}
            <motion.div variants={itemVariants}>
              <TasksCard variant="612" tasks={mockTasks} />
            </motion.div>

            {/* Class Listing */}
            <motion.div variants={itemVariants}>
              <ClassCards variant="612" classes={mockClasses} />
            </motion.div>

            {/* Recent Grades */}
            <motion.div variants={itemVariants}>
              <RecentGrades grades={mockRecentGrades} />
            </motion.div>
          </div>

          {/* Right Column: Sidebar Content (4 cols) */}
          <div className="xl:col-span-4 space-y-6">
            {/* Calendar Preview */}
            <motion.div variants={itemVariants}>
              <CalendarWidget variant="612" events={mockCalendarEvents} />
            </motion.div>

            {/* Messages Summary */}
            <motion.div variants={itemVariants}>
              <MessagesSummary messages={mockMessages} />
            </motion.div>

            {/* Pet Status (Compact) */}
            <motion.div variants={itemVariants}>
              <PetStatusCard variant="612" petData={mockPetData} xpData={mockXPData} />
            </motion.div>

            {/* XP / Level (Sidebar) */}
            <motion.div variants={itemVariants}>
              <XPProgressBar variant="612" xpData={mockXPData} achievements={mockAchievements} />
            </motion.div>

            {/* Attendance */}
            <motion.div variants={itemVariants}>
              <AttendanceWidget variant="612" attendance={mockAttendance} stats={mockAttendanceStats} />
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
