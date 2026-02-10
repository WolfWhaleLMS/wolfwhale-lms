'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Sun } from 'lucide-react';
import { PetStatusCard } from '@/components/dashboard/PetStatusCard';
import { TasksCard } from '@/components/dashboard/TasksCard';
import { ClassCards } from '@/components/dashboard/ClassCards';
import { XPProgressBar } from '@/components/dashboard/XPProgressBar';
import { AttendanceWidget } from '@/components/dashboard/AttendanceWidget';
import { CalendarWidget } from '@/components/dashboard/CalendarWidget';
import {
  mockStudentProfile,
  mockPetData,
  mockXPData,
  mockTasks,
  mockClasses,
  mockAttendance,
  mockAttendanceStats,
  mockCalendarEvents,
} from '@/lib/mock-data';

interface K5DashboardProps {
  gradeLabel: string;
}

function getGreeting() {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: 'easeOut' },
  },
};

export function K5Dashboard({ gradeLabel }: K5DashboardProps) {
  const greeting = getGreeting();
  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-indigo-950 dark:to-purple-950 -m-4 md:-m-8 -mt-6 p-4 md:p-8 pt-6">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-5xl mx-auto space-y-6"
      >
        {/* ── Welcome Header ──────────────────────────── */}
        <motion.div variants={itemVariants} className="text-center md:text-left">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-2 md:gap-4">
            <div>
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.2 }}
                className="inline-flex items-center gap-2 mb-2"
              >
                <Sun className="w-7 h-7 text-amber-400" />
                <span className="text-lg text-slate-600 dark:text-slate-400 font-medium">
                  {greeting}!
                </span>
              </motion.div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white font-display">
                Hi, {mockStudentProfile.firstName}!{' '}
                <motion.span
                  animate={{ rotate: [0, 14, -8, 14, -4, 10, 0] }}
                  transition={{ duration: 2.5, repeat: Infinity, repeatDelay: 3 }}
                  className="inline-block origin-bottom-right"
                >
                  &#x1F44B;
                </motion.span>
              </h1>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                {currentDate} &middot; {gradeLabel}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-gold-500" />
              <span className="text-sm font-semibold text-gold-600 dark:text-gold-400">
                {mockXPData.totalXP.toLocaleString()} XP
              </span>
            </div>
          </div>
        </motion.div>

        {/* ── Pet Status Card (Top, Large) ────────────── */}
        <motion.div variants={itemVariants}>
          <PetStatusCard variant="k5" petData={mockPetData} xpData={mockXPData} />
        </motion.div>

        {/* ── Today's Tasks ───────────────────────────── */}
        <motion.div variants={itemVariants}>
          <TasksCard variant="k5" tasks={mockTasks} />
        </motion.div>

        {/* ── Class Cards ─────────────────────────────── */}
        <motion.div variants={itemVariants}>
          <ClassCards variant="k5" classes={mockClasses} />
        </motion.div>

        {/* ── XP / Level Bar ──────────────────────────── */}
        <motion.div variants={itemVariants}>
          <XPProgressBar variant="k5" xpData={mockXPData} />
        </motion.div>

        {/* ── Attendance + Calendar Row ────────────────── */}
        <motion.div variants={itemVariants} className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AttendanceWidget variant="k5" attendance={mockAttendance} stats={mockAttendanceStats} />
          <CalendarWidget variant="k5" events={mockCalendarEvents} />
        </motion.div>
      </motion.div>
    </div>
  );
}
