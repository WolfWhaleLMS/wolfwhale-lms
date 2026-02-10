'use client';

import { useState, useMemo } from 'react';
import { useParams } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Calendar,
  Clock,
  Award,
  AlertTriangle,
  RotateCcw,
  Info,
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Skeleton } from '@/components/ui/Skeleton';
import { AssignmentHeader } from '@/components/assignments/AssignmentHeader';
import { AssignmentContent } from '@/components/assignments/AssignmentContent';
import { SubmissionForm } from '@/components/assignments/SubmissionForm';
import { SubmissionStatus } from '@/components/assignments/SubmissionStatus';
import { GradeDisplay } from '@/components/assignments/GradeDisplay';
import { useGradeLevel } from '@/hooks/useGradeLevel';
import { mockAssignments } from '@/lib/mock-data';

export default function AssignmentDetailPage() {
  const params = useParams();
  const assignmentId = params.assignmentId as string;
  const { variant, loading, isElementary } = useGradeLevel();
  const isK5 = variant === 'k5';

  const [showResubmit, setShowResubmit] = useState(false);

  // Find the assignment
  const assignment = useMemo(() => {
    return mockAssignments.find((a) => a.id === assignmentId);
  }, [assignmentId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950 p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-96" />
          <Skeleton className="h-6 w-48" />
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
            <Skeleton className="h-80 rounded-2xl lg:col-span-2" />
            <Skeleton className="h-80 rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  // Not found state
  if (!assignment) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <div className="rounded-2xl border-2 border-dashed border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 p-12 text-center">
            <AlertTriangle className="h-12 w-12 text-slate-400 mx-auto mb-4" />
            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-2">
              Assignment Not Found
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-6">
              The assignment you are looking for does not exist or may have been removed.
            </p>
            <Button asChild>
              <a href="/student/assignments">Back to Assignments</a>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isSubmitted = assignment.status === 'submitted' || assignment.status === 'graded';
  const isGraded = assignment.status === 'graded';
  const canResubmit = isSubmitted && !isGraded && assignment.allowLateSubmission;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <AssignmentHeader assignment={assignment} />
        </motion.div>

        {/* Main layout: sidebar + content */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          {/* Left Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 space-y-4 order-2 lg:order-1"
          >
            {/* Assignment Details Card */}
            <div className="rounded-2xl border border-white/30 dark:border-slate-700/30 bg-white/50 dark:bg-slate-800/30 backdrop-blur-md p-5">
              <h3 className={cn(
                'font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2',
                isK5 ? 'text-lg' : 'text-base'
              )}>
                <Info className="h-4 w-4 text-indigo-500" />
                Details
              </h3>

              <div className="space-y-4">
                {/* Start date */}
                <div className="flex items-start gap-3">
                  <Calendar className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Start Date
                    </p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {formatDate(assignment.startDate, 'EEEE, MMM d, yyyy')}
                    </p>
                  </div>
                </div>

                {/* Due date + time */}
                <div className="flex items-start gap-3">
                  <Clock className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Due Date
                    </p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {formatDate(assignment.dueDate, 'EEEE, MMM d, yyyy')}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      at {formatDate(assignment.dueDate, 'h:mm a')}
                    </p>
                  </div>
                </div>

                {/* Points */}
                <div className="flex items-start gap-3">
                  <Award className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Point Value
                    </p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {assignment.maxPoints} points
                    </p>
                    <p className="text-xs text-amber-600 dark:text-amber-400">
                      +{assignment.xpReward} XP reward
                    </p>
                  </div>
                </div>

                {/* Late policy */}
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-4 w-4 text-slate-400 mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                      Late Policy
                    </p>
                    <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                      {assignment.allowLateSubmission
                        ? `Accepted (${assignment.latePenaltyPercent}% penalty)`
                        : 'Not accepted'}
                    </p>
                  </div>
                </div>

                {/* Submission type */}
                <div className="pt-3 border-t border-slate-200/50 dark:border-slate-700/50">
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Submission Type
                  </p>
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-300 capitalize">
                    {assignment.submissionType === 'text'
                      ? 'Text Entry'
                      : assignment.submissionType === 'file'
                      ? 'File Upload'
                      : assignment.submissionType === 'link'
                      ? 'URL / Link'
                      : 'Discussion Post'}
                  </p>
                </div>
              </div>
            </div>

            {/* Submission Info (if submitted) */}
            {assignment.submission && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <SubmissionStatus submission={assignment.submission} />

                {/* Resubmit option */}
                {canResubmit && !showResubmit && (
                  <Button
                    variant="outline"
                    className="w-full mt-3 flex items-center gap-2"
                    onClick={() => setShowResubmit(true)}
                  >
                    <RotateCcw className="h-4 w-4" />
                    Resubmit
                  </Button>
                )}
              </motion.div>
            )}

            {/* Grade Display (if graded) */}
            {assignment.grade && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <GradeDisplay
                  grade={assignment.grade}
                  maxPoints={assignment.maxPoints}
                  variant="full"
                />
              </motion.div>
            )}
          </motion.div>

          {/* Main Content Area */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            className="lg:col-span-2 space-y-6 order-1 lg:order-2"
          >
            {/* Assignment content / instructions */}
            <AssignmentContent
              assignment={assignment}
              variant={variant}
            />

            {/* Submission Form (if not submitted, or resubmitting) */}
            {(!isSubmitted || showResubmit) && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.25 }}
              >
                <SubmissionForm
                  assignment={assignment}
                  variant={variant}
                />
              </motion.div>
            )}

            {/* If submitted/graded and text submission exists, show it */}
            {isSubmitted && !showResubmit && assignment.submission?.submissionText && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="rounded-2xl border border-white/30 dark:border-slate-700/30 bg-white/50 dark:bg-slate-800/30 backdrop-blur-md p-6"
              >
                <h3 className={cn(
                  'font-bold text-slate-900 dark:text-white mb-4',
                  isK5 ? 'text-xl' : 'text-lg'
                )}>
                  Your Submission
                </h3>
                <div className="prose prose-sm dark:prose-invert max-w-none text-slate-600 dark:text-slate-400 leading-relaxed whitespace-pre-wrap">
                  {assignment.submission.submissionText}
                </div>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
}
