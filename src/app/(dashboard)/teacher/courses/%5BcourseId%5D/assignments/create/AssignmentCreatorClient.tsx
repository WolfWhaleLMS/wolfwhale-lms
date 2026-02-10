'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { toast } from 'sonner';

interface AssignmentCreatorClientProps {
  courseId: string;
  courseName: string;
  tenantId: string;
  teacherId: string;
}

export function AssignmentCreatorClient({ courseId, courseName, tenantId, teacherId }: AssignmentCreatorClientProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('homework');
  const [maxPoints, setMaxPoints] = useState(100);
  const [dueDate, setDueDate] = useState('');
  const [allowLate, setAllowLate] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !dueDate) {
      toast.error('Please fill in all required fields');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title,
          description,
          type,
          max_points: maxPoints,
          due_date: new Date(dueDate).toISOString(),
          course_id: courseId,
          tenant_id: tenantId,
          allow_late_submissions: allowLate,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.message || 'Failed to create assignment');
      }

      toast.success('Assignment created successfully!');
      router.push(`/teacher/courses/${courseId}`);
    } catch (err: any) {
      toast.error(err.message || 'Failed to create assignment');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Create Assignment</h1>
        <p className="text-slate-600 dark:text-slate-400 mb-8">for {courseName}</p>

        <Card>
          <CardHeader>
            <CardTitle>Assignment Details</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Assignment title"
                  required
                />
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Assignment instructions..."
                  rows={4}
                  className="flex w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="type">Type</Label>
                  <select
                    id="type"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="flex h-10 w-full rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm"
                  >
                    <option value="homework">Homework</option>
                    <option value="quiz">Quiz</option>
                    <option value="exam">Exam</option>
                    <option value="project">Project</option>
                    <option value="essay">Essay</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="maxPoints">Max Points</Label>
                  <Input
                    id="maxPoints"
                    type="number"
                    value={maxPoints}
                    onChange={(e) => setMaxPoints(Number(e.target.value))}
                    min={1}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="dueDate">Due Date *</Label>
                <Input
                  id="dueDate"
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  required
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  id="allowLate"
                  type="checkbox"
                  checked={allowLate}
                  onChange={(e) => setAllowLate(e.target.checked)}
                  className="rounded"
                />
                <Label htmlFor="allowLate">Allow late submissions</Label>
              </div>

              <div className="flex gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.back()}
                  className="flex-1"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {loading ? 'Creating...' : 'Create Assignment'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
