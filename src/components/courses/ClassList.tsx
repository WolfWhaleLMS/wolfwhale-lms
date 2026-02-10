'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ClassCard } from './ClassCard';
import type { MockCourseDetail } from '@/lib/mock-data';

interface ClassListProps {
  courses: MockCourseDetail[];
  variant: 'k5' | '6-12';
  viewMode?: 'grid' | 'list';
}

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export function ClassList({ courses, variant, viewMode = 'grid' }: ClassListProps) {
  if (variant === 'k5') {
    return (
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        {courses.map((course) => (
          <motion.div key={course.id} variants={item}>
            <ClassCard course={course} variant="k5" />
          </motion.div>
        ))}
      </motion.div>
    );
  }

  if (viewMode === 'list') {
    return (
      <div className="space-y-2">
        {/* Table header */}
        <div className="px-4 py-2 flex items-center gap-4 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          <div className="w-3" />
          <div className="flex-1">Class Name</div>
          <div className="hidden md:block w-32">Teacher</div>
          <div className="hidden lg:block w-24">Section</div>
          <div className="hidden lg:block w-28">Term</div>
          <div className="w-16 text-right">Grade</div>
          <div className="w-12 text-center">New</div>
          <div className="w-8" />
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="space-y-2"
        >
          {courses.map((course) => (
            <motion.div key={course.id} variants={item}>
              <ClassCard course={course} variant="6-12" viewMode="list" />
            </motion.div>
          ))}
        </motion.div>
      </div>
    );
  }

  // 6-12 grid view
  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
    >
      {courses.map((course) => (
        <motion.div key={course.id} variants={item}>
          <ClassCard course={course} variant="6-12" viewMode="grid" />
        </motion.div>
      ))}
    </motion.div>
  );
}
