'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGradeLevel } from '@/hooks/useGradeLevel';
import { K5Dashboard } from './K5Dashboard';
import { SecondaryDashboard } from './SecondaryDashboard';
import { Skeleton } from '@/components/ui/Skeleton';

export default function StudentDashboard() {
  const { variant, loading, gradeLabel } = useGradeLevel();

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <AnimatePresence mode="wait">
      {variant === 'k5' ? (
        <motion.div
          key="k5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <K5Dashboard gradeLabel={gradeLabel} />
        </motion.div>
      ) : (
        <motion.div
          key="612"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4 }}
        >
          <SecondaryDashboard gradeLabel={gradeLabel} />
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function DashboardSkeleton() {
  return (
    <div className="space-y-6 p-4">
      <div className="space-y-2">
        <Skeleton className="h-10 w-80" />
        <Skeleton className="h-5 w-48" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Skeleton className="h-72 rounded-2xl" />
        <Skeleton className="h-72 rounded-2xl md:col-span-2" />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Skeleton className="h-64 rounded-2xl" />
        <Skeleton className="h-64 rounded-2xl" />
      </div>
      <Skeleton className="h-48 rounded-2xl" />
    </div>
  );
}
