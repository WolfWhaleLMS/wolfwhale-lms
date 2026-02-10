'use client';

import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Badge } from '@/components/ui/Badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/Select';
import { Switch } from '@/components/ui/Switch';
import { GRADE_LEVELS, GRADE_LEVEL_NAMES } from '@/config/constants';
import { BookOpen, Copy, Eye, ArrowLeft, RefreshCw } from 'lucide-react';
import { cn } from '@/lib/utils';

const courseFormSchema = z.object({
  name: z.string().min(1, 'Course name is required').max(255),
  description: z.string().max(2000).optional(),
  subject: z.string().min(1, 'Subject is required'),
  gradeLevel: z.string().min(1, 'Grade level is required'),
  semester: z.string().min(1, 'Semester is required'),
  startDate: z.string().min(1, 'Start date is required'),
  endDate: z.string().min(1, 'End date is required'),
  enrollmentMethod: z.enum(['manual', 'code', 'auto']),
  enrollmentCode: z.string().optional(),
  room: z.string().max(20).optional(),
  period: z.coerce.number().min(1).max(12).optional(),
});

export type CourseFormData = z.infer<typeof courseFormSchema>;

interface CourseFormProps {
  initialData?: Partial<CourseFormData>;
  onSubmit: (data: CourseFormData) => void;
  onCancel: () => void;
  isLoading?: boolean;
  mode?: 'create' | 'edit';
}

function generateCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  const prefix = 'WOLF';
  let suffix = '';
  for (let i = 0; i < 3; i++) {
    suffix += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `${prefix}${suffix}`;
}

const subjects = [
  'Mathematics', 'English Language Arts', 'Science', 'Social Studies',
  'History', 'Geography', 'Physics', 'Chemistry', 'Biology',
  'Computer Science', 'Art', 'Music', 'Physical Education',
  'Foreign Language', 'Health', 'Other',
];

const semesters = [
  'Fall 2025', 'Spring 2026', 'Summer 2026', 'Fall 2026', 'Spring 2027',
];

export function CourseForm({ initialData, onSubmit, onCancel, isLoading = false, mode = 'create' }: CourseFormProps) {
  const [showPreview, setShowPreview] = useState(false);

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CourseFormData>({
    resolver: zodResolver(courseFormSchema),
    defaultValues: {
      name: '',
      description: '',
      subject: '',
      gradeLevel: '',
      semester: 'Spring 2026',
      startDate: '2026-01-06',
      endDate: '2026-05-29',
      enrollmentMethod: 'code',
      enrollmentCode: generateCode(),
      room: '',
      period: undefined,
      ...initialData,
    },
  });

  const formValues = watch();

  const handleGenerateCode = () => {
    setValue('enrollmentCode', generateCode());
  };

  if (showPreview) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="w-5 h-5" />
            Course Preview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white">
            <h2 className="text-2xl font-bold">{formValues.name || 'Untitled Course'}</h2>
            <p className="text-blue-100 mt-1">{formValues.subject} - Grade {formValues.gradeLevel}</p>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-slate-500">Semester</p>
              <p className="font-medium text-slate-900 dark:text-white">{formValues.semester}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Period</p>
              <p className="font-medium text-slate-900 dark:text-white">{formValues.period || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Room</p>
              <p className="font-medium text-slate-900 dark:text-white">{formValues.room || 'N/A'}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Enrollment Method</p>
              <p className="font-medium text-slate-900 dark:text-white capitalize">{formValues.enrollmentMethod}</p>
            </div>
            <div>
              <p className="text-sm text-slate-500">Dates</p>
              <p className="font-medium text-slate-900 dark:text-white">{formValues.startDate} to {formValues.endDate}</p>
            </div>
            {formValues.enrollmentMethod === 'code' && (
              <div>
                <p className="text-sm text-slate-500">Enrollment Code</p>
                <Badge className="bg-indigo-100 text-indigo-800 text-base font-mono px-3 py-1">
                  {formValues.enrollmentCode}
                </Badge>
              </div>
            )}
          </div>

          {formValues.description && (
            <div>
              <p className="text-sm text-slate-500 mb-1">Description</p>
              <p className="text-slate-700 dark:text-slate-300">{formValues.description}</p>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowPreview(false)}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Edit
            </Button>
            <Button
              onClick={handleSubmit(onSubmit)}
              isLoading={isLoading}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
            >
              {mode === 'create' ? 'Create Course' : 'Save Changes'}
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {/* Basic Info */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Course Details
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="name">Course Name *</Label>
            <Input
              id="name"
              placeholder="e.g., Algebra 1 - Period 2"
              error={errors.name?.message}
              {...register('name')}
            />
          </div>

          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Brief description of the course..."
              {...register('description')}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Subject *</Label>
              <Controller
                name="subject"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={errors.subject ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select subject" />
                    </SelectTrigger>
                    <SelectContent>
                      {subjects.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.subject && <p className="mt-1 text-sm text-red-500">{errors.subject.message}</p>}
            </div>

            <div>
              <Label>Grade Level *</Label>
              <Controller
                name="gradeLevel"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className={errors.gradeLevel ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select grade" />
                    </SelectTrigger>
                    <SelectContent>
                      {GRADE_LEVELS.map((g) => (
                        <SelectItem key={g} value={g}>{GRADE_LEVEL_NAMES[g]}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.gradeLevel && <p className="mt-1 text-sm text-red-500">{errors.gradeLevel.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label>Semester *</Label>
              <Controller
                name="semester"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select semester" />
                    </SelectTrigger>
                    <SelectContent>
                      {semesters.map((s) => (
                        <SelectItem key={s} value={s}>{s}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </div>

            <div>
              <Label htmlFor="period">Period</Label>
              <Input
                id="period"
                type="number"
                min={1}
                max={12}
                placeholder="e.g., 2"
                {...register('period')}
              />
            </div>

            <div>
              <Label htmlFor="room">Room</Label>
              <Input
                id="room"
                placeholder="e.g., 201"
                {...register('room')}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="startDate">Start Date *</Label>
              <Input
                id="startDate"
                type="date"
                error={errors.startDate?.message}
                {...register('startDate')}
              />
            </div>
            <div>
              <Label htmlFor="endDate">End Date *</Label>
              <Input
                id="endDate"
                type="date"
                error={errors.endDate?.message}
                {...register('endDate')}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Enrollment */}
      <Card>
        <CardHeader>
          <CardTitle>Enrollment Settings</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Enrollment Method</Label>
            <Controller
              name="enrollmentMethod"
              control={control}
              render={({ field }) => (
                <div className="flex gap-3 mt-2">
                  {(['manual', 'code', 'auto'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => field.onChange(method)}
                      className={cn(
                        'flex-1 p-3 rounded-xl border-2 transition-all text-center',
                        field.value === method
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/30'
                          : 'border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                      )}
                    >
                      <p className="font-medium capitalize text-slate-900 dark:text-white">{method}</p>
                      <p className="text-xs text-slate-500 mt-1">
                        {method === 'manual' && 'Add students yourself'}
                        {method === 'code' && 'Students join with a code'}
                        {method === 'auto' && 'Auto-enroll from roster'}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            />
          </div>

          {formValues.enrollmentMethod === 'code' && (
            <div>
              <Label>Enrollment Code</Label>
              <div className="flex items-center gap-2 mt-1">
                <div className="flex-1 flex items-center gap-2 bg-slate-100 dark:bg-slate-800 rounded-xl px-4 py-2">
                  <span className="text-lg font-mono font-bold text-indigo-600 dark:text-indigo-400 tracking-wider">
                    {formValues.enrollmentCode}
                  </span>
                </div>
                <Button type="button" variant="outline" size="icon" onClick={handleGenerateCode} title="Generate new code">
                  <RefreshCw className="w-4 h-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => navigator.clipboard.writeText(formValues.enrollmentCode || '')}
                  title="Copy code"
                >
                  <Copy className="w-4 h-4" />
                </Button>
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
          <Button type="button" variant="outline" onClick={() => setShowPreview(true)}>
            <Eye className="w-4 h-4 mr-2" />
            Preview
          </Button>
          <Button
            type="submit"
            isLoading={isLoading}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white"
          >
            {mode === 'create' ? 'Create Course' : 'Save Changes'}
          </Button>
        </div>
      </div>
    </form>
  );
}
