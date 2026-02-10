'use client';

import React from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Switch } from '@/components/ui/Switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { FileText, Upload, Clock, Save, Send } from 'lucide-react';
import { cn } from '@/lib/utils';

const assignmentFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(255),
  description: z.string().max(5000).optional(),
  instructions: z.string().min(1, 'Instructions are required').max(10000),
  type: z.enum(['homework', 'quiz', 'project', 'exam', 'discussion']),
  dueDate: z.string().min(1, 'Due date is required'),
  dueTime: z.string().min(1, 'Due time is required'),
  maxPoints: z.coerce.number().min(0, 'Points must be non-negative').max(1000),
  submissionType: z.enum(['text', 'file', 'link', 'discussion']),
  allowLateSubmission: z.boolean(),
  lateSubmissionDays: z.coerce.number().min(0).max(30).optional(),
  latePenaltyPercent: z.coerce.number().min(0).max(100).optional(),
});

export type AssignmentFormData = z.infer<typeof assignmentFormSchema>;

interface AssignmentFormProps {
  courseId: string;
  courseName: string;
  initialData?: Partial<AssignmentFormData>;
  onSubmit: (data: AssignmentFormData, publish: boolean) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
}

const assignmentTypes = [
  { value: 'homework', label: 'Homework', description: 'Regular homework assignment' },
  { value: 'quiz', label: 'Quiz', description: 'Timed quiz or short assessment' },
  { value: 'project', label: 'Project', description: 'Long-term project with extended deadline' },
  { value: 'exam', label: 'Exam', description: 'Major examination or test' },
  { value: 'discussion', label: 'Discussion', description: 'Class discussion or forum post' },
];

const submissionTypes = [
  { value: 'text', label: 'Text Entry', description: 'Students type their response' },
  { value: 'file', label: 'File Upload', description: 'Students upload a file' },
  { value: 'link', label: 'External URL', description: 'Students submit a link' },
  { value: 'discussion', label: 'Discussion Post', description: 'Students post to a discussion' },
];

export function AssignmentForm({
  courseId,
  courseName,
  initialData,
  onSubmit,
  onCancel,
  isLoading = false,
  mode = 'create',
}: AssignmentFormProps) {
  const {
    register,
    handleSubmit,
    control,
    watch,
    formState: { errors },
  } = useForm<AssignmentFormData>({
    resolver: zodResolver(assignmentFormSchema),
    defaultValues: {
      title: '',
      description: '',
      instructions: '',
      type: 'homework',
      dueDate: '',
      dueTime: '23:59',
      maxPoints: 100,
      submissionType: 'text',
      allowLateSubmission: true,
      lateSubmissionDays: 3,
      latePenaltyPercent: 10,
      ...initialData,
    },
  });

  const allowLate = watch('allowLateSubmission');

  const handleFormSubmit = (publish: boolean) => {
    handleSubmit((data) => onSubmit(data, publish))();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-2 text-sm text-slate-500">
        <FileText className="w-4 h-4" />
        <span>Creating assignment for <span className="font-medium text-slate-700 dark:text-slate-300">{courseName}</span></span>
      </div>

      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle>Assignment Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="title">Title *</Label>
            <Input
              id="title"
              placeholder="e.g., Chapter 5 Problem Set"
              error={errors.title?.message}
              {...register('title')}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description for the assignment list..."
              rows={2}
              {...register('description')}
            />
          </div>

          <div>
            <Label htmlFor="instructions">Instructions *</Label>
            <Textarea
              id="instructions"
              placeholder="Detailed instructions for students. Supports basic formatting."
              rows={6}
              error={errors.instructions?.message}
              {...register('instructions')}
            />
            <p className="text-xs text-slate-500 mt-1">Tip: Use markdown formatting for rich text</p>
          </div>
        </CardContent>
      </Card>

      {/* Type and Submission */}
      <Card>
        <CardHeader>
          <CardTitle>Assignment Type</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Type *</Label>
            <Controller
              name="type"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 md:grid-cols-5 gap-2 mt-2">
                  {assignmentTypes.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => field.onChange(t.value)}
                      className={cn(
                        'p-3 rounded-xl border-2 transition-all text-center',
                        field.value === t.value
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                          : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                      )}
                    >
                      <p className="font-medium text-sm text-slate-900 dark:text-white">{t.label}</p>
                    </button>
                  ))}
                </div>
              )}
            />
          </div>

          <div>
            <Label>Submission Type *</Label>
            <Controller
              name="submissionType"
              control={control}
              render={({ field }) => (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  {submissionTypes.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => field.onChange(t.value)}
                      className={cn(
                        'p-3 rounded-xl border-2 transition-all text-left',
                        field.value === t.value
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                          : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                      )}
                    >
                      <p className="font-medium text-sm text-slate-900 dark:text-white">{t.label}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{t.description}</p>
                    </button>
                  ))}
                </div>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {/* Due Date and Points */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Schedule & Points
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                error={errors.dueDate?.message}
                {...register('dueDate')}
              />
            </div>
            <div>
              <Label htmlFor="dueTime">Due Time *</Label>
              <Input
                id="dueTime"
                type="time"
                error={errors.dueTime?.message}
                {...register('dueTime')}
              />
            </div>
            <div>
              <Label htmlFor="maxPoints">Points Possible *</Label>
              <Input
                id="maxPoints"
                type="number"
                min={0}
                max={1000}
                error={errors.maxPoints?.message}
                {...register('maxPoints')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Late Submission Policy */}
      <Card>
        <CardHeader>
          <CardTitle>Late Submission Policy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <Label>Allow Late Submissions</Label>
              <p className="text-sm text-slate-500">Students can submit after the due date</p>
            </div>
            <Controller
              name="allowLateSubmission"
              control={control}
              render={({ field }) => (
                <Switch checked={field.value} onCheckedChange={field.onChange} />
              )}
            />
          </div>

          {allowLate && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-slate-200 dark:border-slate-700">
              <div>
                <Label htmlFor="lateSubmissionDays">Late Window (days)</Label>
                <Input
                  id="lateSubmissionDays"
                  type="number"
                  min={0}
                  max={30}
                  {...register('lateSubmissionDays')}
                />
              </div>
              <div>
                <Label htmlFor="latePenaltyPercent">Penalty per Day (%)</Label>
                <Input
                  id="latePenaltyPercent"
                  type="number"
                  min={0}
                  max={100}
                  {...register('latePenaltyPercent')}
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex justify-between items-center">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <div className="flex gap-3">
          <Button
            type="button"
            variant="outline"
            onClick={() => handleFormSubmit(false)}
            isLoading={isLoading}
          >
            <Save className="w-4 h-4 mr-2" />
            Save as Draft
          </Button>
          <Button
            type="button"
            onClick={() => handleFormSubmit(true)}
            isLoading={isLoading}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            <Send className="w-4 h-4 mr-2" />
            Publish
          </Button>
        </div>
      </div>
    </div>
  );
}
