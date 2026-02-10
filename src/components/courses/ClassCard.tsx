'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
import { Progress } from '@/components/ui/Progress';
import {
  ArrowRight,
  Bell,
  Calendar,
  MoreVertical,
  BookOpen,
  ClipboardList,
  Megaphone,
  VolumeX,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import { cn } from '@/lib/utils';
import type { MockCourseDetail } from '@/lib/mock-data';

interface ClassCardProps {
  course: MockCourseDetail;
  variant: 'k5' | '6-12';
  viewMode?: 'grid' | 'list';
}

const getGradeColor = (grade: number) => {
  if (grade >= 90) return 'text-emerald-600 dark:text-emerald-400';
  if (grade >= 80) return 'text-blue-600 dark:text-blue-400';
  if (grade >= 70) return 'text-amber-600 dark:text-amber-400';
  return 'text-red-600 dark:text-red-400';
};

export function ClassCard({ course, variant, viewMode = 'grid' }: ClassCardProps) {
  if (variant === 'k5') {
    return <K5ClassCard course={course} />;
  }

  if (viewMode === 'list') {
    return <ListClassCard course={course} />;
  }

  return <CompactClassCard course={course} />;
}

/* ── K-5 Variant: Large, colorful, fun ──────────────── */

function K5ClassCard({ course }: { course: MockCourseDetail }) {
  return (
    <motion.div
      whileHover={{ scale: 1.03, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      <Link href={`/student/courses/${course.id}`}>
        <Card variant="fun" className="overflow-hidden cursor-pointer group">
          {/* Colorful header band */}
          <div
            className="h-28 relative flex items-center justify-center overflow-hidden"
            style={{ background: `linear-gradient(135deg, ${course.subjectColor}40, ${course.subjectColor}20)` }}
          >
            <span className="text-6xl group-hover:scale-125 transition-transform duration-500">
              {course.subjectIcon}
            </span>

            {/* Unread badge */}
            {course.unreadCount > 0 && (
              <div className="absolute top-3 right-3">
                <Badge className="bg-red-500 text-white border-0 shadow-lg px-2.5 py-1 text-xs font-bold animate-bounce">
                  <Bell className="w-3 h-3 mr-1" />
                  {course.unreadCount} new
                </Badge>
              </div>
            )}
          </div>

          <div className="p-5 space-y-4">
            {/* Class name */}
            <h3 className="text-2xl font-extrabold text-slate-900 dark:text-white leading-tight">
              {course.name}
            </h3>

            {/* Teacher info */}
            <div className="flex items-center gap-3">
              <Avatar size="sm">
                <AvatarFallback className="text-xs font-bold">{course.teacherInitials}</AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                {course.teacherName}
              </span>
            </div>

            {/* Quick stat */}
            {course.assignmentsDue > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-100/60 dark:bg-amber-900/30 border border-amber-200/60 dark:border-amber-800/40">
                <Calendar className="w-4 h-4 text-amber-600" />
                <span className="text-sm font-semibold text-amber-700 dark:text-amber-300">
                  {course.assignmentsDue} assignment{course.assignmentsDue > 1 ? 's' : ''} due
                </span>
              </div>
            )}

            {/* Progress */}
            <div>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-slate-500 dark:text-slate-400 font-medium">Progress</span>
                <span className="font-bold text-slate-800 dark:text-white">{course.progressPercent}%</span>
              </div>
              <Progress value={course.progressPercent} className="h-3" />
            </div>

            {/* Open Class button */}
            <Button
              variant="fun"
              size="lg"
              className="w-full text-base font-bold py-6 rounded-2xl"
            >
              Open Class <ArrowRight className="ml-2 w-5 h-5" />
            </Button>
          </div>
        </Card>
      </Link>
    </motion.div>
  );
}

/* ── 6-12 Grid Variant: Compact, professional ───────── */

function CompactClassCard({ course }: { course: MockCourseDetail }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 group">
        {/* Color accent bar */}
        <div className="h-1.5" style={{ backgroundColor: course.subjectColor }} />

        <CardContent className="p-5 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <Link
                href={`/student/courses/${course.id}`}
                className="text-lg font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors line-clamp-1"
              >
                {course.name}
              </Link>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                {course.teacherName} &middot; {course.section}
              </p>
            </div>

            <div className="flex items-center gap-2 ml-3 flex-shrink-0">
              {course.unreadCount > 0 && (
                <Badge className="bg-red-500/15 text-red-600 dark:text-red-400 border-0 text-xs">
                  {course.unreadCount}
                </Badge>
              )}
              <QuickActionMenu course={course} />
            </div>
          </div>

          {/* Stats row */}
          <div className="flex items-center gap-4 text-sm">
            <div>
              <span className="text-slate-500 dark:text-slate-400">Grade: </span>
              <span className={cn('font-semibold', getGradeColor(course.currentGrade))}>
                {course.currentGrade}%
              </span>
            </div>
            <div>
              <span className="text-slate-500 dark:text-slate-400">Term: </span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{course.term}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500 dark:text-slate-400">Progress</span>
              <span className="font-medium text-slate-700 dark:text-slate-300">{course.progressPercent}%</span>
            </div>
            <Progress value={course.progressPercent} className="h-1.5" />
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
            {course.assignmentsDue > 0 ? (
              <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">
                {course.assignmentsDue} due soon
              </span>
            ) : (
              <span className="text-xs text-slate-400">No upcoming work</span>
            )}
            <Link href={`/student/courses/${course.id}`}>
              <Button variant="ghost" size="sm" className="text-xs h-7 px-2">
                Open <ArrowRight className="ml-1 w-3 h-3" />
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ── 6-12 List / Table Row Variant ──────────────────── */

function ListClassCard({ course }: { course: MockCourseDetail }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.15 }}
    >
      <Card className="hover:shadow-md transition-shadow duration-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-4">
            {/* Color dot + Name */}
            <div
              className="w-3 h-3 rounded-full flex-shrink-0"
              style={{ backgroundColor: course.subjectColor }}
            />
            <div className="flex-1 min-w-0">
              <Link
                href={`/student/courses/${course.id}`}
                className="font-semibold text-slate-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
              >
                {course.name}
              </Link>
            </div>

            {/* Teacher */}
            <div className="hidden md:block w-32 text-sm text-slate-600 dark:text-slate-400 truncate">
              {course.teacherName}
            </div>

            {/* Section */}
            <div className="hidden lg:block w-24 text-sm text-slate-600 dark:text-slate-400">
              {course.section}
            </div>

            {/* Term */}
            <div className="hidden lg:block w-28 text-sm text-slate-600 dark:text-slate-400">
              {course.term}
            </div>

            {/* Grade */}
            <div className="w-16 text-right">
              <span className={cn('font-semibold text-sm', getGradeColor(course.currentGrade))}>
                {course.currentGrade}%
              </span>
            </div>

            {/* Unread */}
            <div className="w-12 text-center">
              {course.unreadCount > 0 ? (
                <Badge className="bg-red-500/15 text-red-600 dark:text-red-400 border-0 text-xs">
                  {course.unreadCount}
                </Badge>
              ) : (
                <span className="text-xs text-slate-400">--</span>
              )}
            </div>

            {/* Actions */}
            <QuickActionMenu course={course} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ── Quick Action Menu ─────────────────────────────── */

function QuickActionMenu({ course }: { course: MockCourseDetail }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="h-8 w-8">
          <MoreVertical className="w-4 h-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem asChild>
          <Link href={`/student/courses/${course.id}`} className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            Open Class
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/student/courses/${course.id}?tab=grades`} className="flex items-center gap-2">
            <ClipboardList className="w-4 h-4" />
            Gradebook
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href={`/student/courses/${course.id}?tab=announcements`} className="flex items-center gap-2">
            <Megaphone className="w-4 h-4" />
            Announcements
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem className="flex items-center gap-2 text-slate-500">
          <VolumeX className="w-4 h-4" />
          {course.isMuted ? 'Unmute' : 'Mute'} Notifications
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
