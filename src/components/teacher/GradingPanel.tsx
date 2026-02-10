'use client';

import React, { useState, useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
import {
  ChevronLeft,
  ChevronRight,
  Check,
  FileText,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MockTeacherSubmission } from '@/lib/mock-data/teacher';

const gradeFormSchema = z.object({
  pointsEarned: z.coerce.number().min(0, 'Points must be non-negative'),
  feedback: z.string().max(5000).optional(),
});

type GradeFormData = z.infer<typeof gradeFormSchema>;

interface GradingPanelProps {
  submissions: MockTeacherSubmission[];
  maxPoints: number;
  assignmentTitle: string;
  onGrade: (submissionId: string, data: { pointsEarned: number; feedback: string }) => void;
  onClose: () => void;
}

function getLetterGrade(pct: number): string {
  if (pct >= 93) return 'A';
  if (pct >= 90) return 'A-';
  if (pct >= 87) return 'B+';
  if (pct >= 83) return 'B';
  if (pct >= 80) return 'B-';
  if (pct >= 77) return 'C+';
  if (pct >= 73) return 'C';
  if (pct >= 70) return 'C-';
  if (pct >= 67) return 'D+';
  if (pct >= 63) return 'D';
  if (pct >= 60) return 'D-';
  return 'F';
}

function getGradeColor(pct: number): string {
  if (pct >= 90) return 'text-green-600 dark:text-green-400';
  if (pct >= 80) return 'text-blue-600 dark:text-blue-400';
  if (pct >= 70) return 'text-yellow-600 dark:text-yellow-400';
  if (pct >= 60) return 'text-orange-600 dark:text-orange-400';
  return 'text-red-600 dark:text-red-400';
}

export function GradingPanel({
  submissions,
  maxPoints,
  assignmentTitle,
  onGrade,
  onClose,
}: GradingPanelProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [gradedIds, setGradedIds] = useState<Set<string>>(new Set());

  const current = submissions[currentIndex];
  const ungradedSubmissions = submissions.filter((s) => s.status === 'submitted' && !gradedIds.has(s.id));
  const totalGraded = submissions.filter((s) => s.status === 'graded').length + gradedIds.size;

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm<GradeFormData>({
    resolver: zodResolver(gradeFormSchema),
    defaultValues: {
      pointsEarned: current?.grade?.pointsEarned ?? 0,
      feedback: current?.grade?.feedback ?? '',
    },
  });

  const pointsEarned = watch('pointsEarned');
  const percentage = maxPoints > 0 ? Math.round((pointsEarned / maxPoints) * 100) : 0;
  const letterGrade = getLetterGrade(percentage);

  // When navigating to a different student, reset the form
  useEffect(() => {
    if (current) {
      reset({
        pointsEarned: current.grade?.pointsEarned ?? 0,
        feedback: current.grade?.feedback ?? '',
      });
    }
  }, [currentIndex, current, reset]);

  const goToNext = useCallback(() => {
    if (currentIndex < submissions.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  }, [currentIndex, submissions.length]);

  const goToPrevious = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  }, [currentIndex]);

  // Keyboard shortcuts for efficient grading
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'Enter') {
          e.preventDefault();
          handleSubmit(onSubmitGrade)();
        }
        if (e.key === 'ArrowRight') {
          e.preventDefault();
          goToNext();
        }
        if (e.key === 'ArrowLeft') {
          e.preventDefault();
          goToPrevious();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [goToNext, goToPrevious, handleSubmit]);

  const onSubmitGrade = (data: GradeFormData) => {
    onGrade(current.id, {
      pointsEarned: data.pointsEarned,
      feedback: data.feedback || '',
    });
    setGradedIds((prev) => new Set(prev).add(current.id));
    // Auto-advance to next ungraded
    if (currentIndex < submissions.length - 1) {
      goToNext();
    }
  };

  const quickGrade = (pts: number) => {
    setValue('pointsEarned', pts);
  };

  if (!current) return null;

  const isAlreadyGraded = current.status === 'graded' || gradedIds.has(current.id);

  return (
    <div className="space-y-4">
      {/* Header Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">{assignmentTitle}</h2>
          <p className="text-sm text-slate-500">
            {totalGraded}/{submissions.length} graded | {ungradedSubmissions.length} remaining
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300">
            {currentIndex + 1} of {submissions.length}
          </Badge>
          <Button variant="outline" size="sm" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-2 bg-slate-200 dark:bg-slate-700 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-indigo-600 transition-all duration-300"
          style={{ width: `${(totalGraded / submissions.length) * 100}%` }}
        />
      </div>

      {/* Student selector - compact horizontal list */}
      <div className="flex gap-1 overflow-x-auto pb-2">
        {submissions.map((sub, idx) => {
          const sGraded = sub.status === 'graded' || gradedIds.has(sub.id);
          return (
            <button
              key={sub.id}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                'flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium transition-all',
                idx === currentIndex
                  ? 'ring-2 ring-indigo-500 ring-offset-2 dark:ring-offset-slate-900'
                  : '',
                sGraded
                  ? 'bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
              )}
              title={sub.studentName}
            >
              {sub.studentName.split(' ').map((n) => n[0]).join('')}
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Submission View */}
        <Card>
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="w-10 h-10">
                  <AvatarFallback className="text-white text-sm">
                    {current.studentName.split(' ').map((n) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg">{current.studentName}</CardTitle>
                  <div className="flex items-center gap-2 text-sm text-slate-500">
                    <Clock className="w-3 h-3" />
                    {new Date(current.submittedAt).toLocaleString()}
                    {current.submittedLate && (
                      <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300 text-xs">
                        <AlertTriangle className="w-3 h-3 mr-1" />
                        Late
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
              {isAlreadyGraded && (
                <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                  <Check className="w-3 h-3 mr-1" />
                  Graded
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-xl p-4 min-h-[200px] max-h-[400px] overflow-y-auto">
              {current.submissionText ? (
                <div className="prose dark:prose-invert prose-sm max-w-none whitespace-pre-wrap">
                  {current.submissionText}
                </div>
              ) : current.fileName ? (
                <div className="flex items-center gap-3 p-4 bg-white dark:bg-slate-700 rounded-lg">
                  <FileText className="w-8 h-8 text-blue-500" />
                  <div>
                    <p className="font-medium text-slate-900 dark:text-white">{current.fileName}</p>
                    <p className="text-sm text-slate-500">Click to preview file</p>
                  </div>
                </div>
              ) : (
                <p className="text-slate-400 italic">No submission content</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Grading Form */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Grade</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmitGrade)} className="space-y-4">
              {/* Points input with large display */}
              <div className="text-center p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <div className="flex items-center justify-center gap-2">
                  <Input
                    type="number"
                    min={0}
                    max={maxPoints}
                    className="w-24 text-center text-2xl font-bold h-14"
                    {...register('pointsEarned')}
                    // Auto-select on focus for quick entry
                    onFocus={(e) => e.target.select()}
                  />
                  <span className="text-2xl text-slate-400">/</span>
                  <span className="text-2xl font-bold text-slate-400">{maxPoints}</span>
                </div>
                <div className="flex items-center justify-center gap-4 mt-3">
                  <span className={cn('text-3xl font-bold', getGradeColor(percentage))}>
                    {percentage}%
                  </span>
                  <span className={cn('text-2xl font-bold', getGradeColor(percentage))}>
                    {letterGrade}
                  </span>
                </div>
              </div>

              {/* Quick grade buttons */}
              <div>
                <Label className="text-xs text-slate-500">Quick Grade</Label>
                <div className="flex gap-2 mt-1 flex-wrap">
                  {[100, 90, 80, 70, 60, 50].map((pct) => {
                    const pts = Math.round((pct / 100) * maxPoints);
                    return (
                      <button
                        key={pct}
                        type="button"
                        onClick={() => quickGrade(pts)}
                        className={cn(
                          'px-3 py-1.5 rounded-lg text-sm font-medium transition-all border',
                          pointsEarned === pts
                            ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-700'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 hover:border-indigo-300'
                        )}
                      >
                        {pct}% ({pts}pts)
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Feedback */}
              <div>
                <Label htmlFor="feedback">Feedback</Label>
                <Textarea
                  id="feedback"
                  placeholder="Write feedback for the student..."
                  rows={4}
                  {...register('feedback')}
                />
              </div>

              {/* Submit + Navigation */}
              <div className="flex items-center justify-between pt-2">
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={goToPrevious}
                    disabled={currentIndex === 0}
                    title="Previous student (Ctrl+Left)"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={goToNext}
                    disabled={currentIndex === submissions.length - 1}
                    title="Next student (Ctrl+Right)"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>

                <Button
                  type="submit"
                  className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white"
                  title="Save grade (Ctrl+Enter)"
                >
                  <Check className="w-4 h-4 mr-2" />
                  {isAlreadyGraded ? 'Update Grade' : 'Save & Next'}
                </Button>
              </div>

              <p className="text-xs text-slate-400 text-center">
                Shortcuts: Ctrl+Enter to save, Ctrl+Arrow to navigate
              </p>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
