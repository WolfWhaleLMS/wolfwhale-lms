'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Select } from '@/components/ui/Select';
import { Checkbox } from '@/components/ui/Checkbox';
import { Save, Plus, X } from 'lucide-react';

interface RubricCriteria {
  id: string;
  name: string;
  description: string;
  levels: {
    name: string;
    description: string;
    points: number;
  }[];
}

export default function AssignmentCreatorPage({
  params,
}: {
  params: { courseId: string };
}) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState('file_upload');
  const [dueDate, setDueDate] = useState('');
  const [pointsPossible, setPointsPossible] = useState('100');
  const [xpReward, setXpReward] = useState('50');
  const [allowLate, setAllowLate] = useState(false);
  const [latePenalty, setLatePenalty] = useState('10');
  const [useRubric, setUseRubric] = useState(false);
  const [assignToAll, setAssignToAll] = useState(true);
  const [rubricCriteria, setRubricCriteria] = useState<RubricCriteria[]>([]);

  const addRubricCriteria = () => {
    const newCriteria: RubricCriteria = {
      id: Date.now().toString(),
      name: '',
      description: '',
      levels: [
        { name: 'Excellent', description: '', points: 100 },
        { name: 'Good', description: '', points: 75 },
        { name: 'Fair', description: '', points: 50 },
        { name: 'Poor', description: '', points: 0 },
      ],
    };
    setRubricCriteria([...rubricCriteria, newCriteria]);
  };

  const removeRubricCriteria = (id: string) => {
    setRubricCriteria(rubricCriteria.filter((c) => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">
            Create Assignment
          </h1>
          <div className="flex gap-3">
            <Button variant="outline">Save Draft</Button>
            <Button className="bg-green-600 hover:bg-green-700 text-white">
              <Save className="w-4 h-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>

        {/* Basic Info */}
        <Card>
          <CardHeader>
            <CardTitle>Assignment Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Title *
              </label>
              <Input
                placeholder="Assignment title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Description
              </label>
              <Textarea
                placeholder="Detailed assignment instructions"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={4}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Assignment Type *
                </label>
                <Select value={type} onValueChange={setType}>
                  <option value="file_upload">File Upload</option>
                  <option value="text_entry">Text Entry</option>
                  <option value="quiz">Quiz</option>
                  <option value="discussion">Discussion</option>
                  <option value="external_url">External URL</option>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Due Date *
                </label>
                <Input
                  type="datetime-local"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Points Possible *
                </label>
                <Input
                  type="number"
                  value={pointsPossible}
                  onChange={(e) => setPointsPossible(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  XP Reward
                </label>
                <Input
                  type="number"
                  value={xpReward}
                  onChange={(e) => setXpReward(e.target.value)}
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
            <div className="flex items-center gap-3">
              <Checkbox
                id="allow-late"
                checked={allowLate}
                onCheckedChange={(checked) => setAllowLate(checked === true)}
              />
              <label htmlFor="allow-late" className="font-medium text-slate-900 dark:text-white">
                Allow late submissions
              </label>
            </div>

            {allowLate && (
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Late Penalty (% deduction per day)
                </label>
                <Input
                  type="number"
                  value={latePenalty}
                  onChange={(e) => setLatePenalty(e.target.value)}
                  min="0"
                  max="100"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Rubric */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Grading Rubric</span>
              <Badge variant="secondary">{rubricCriteria.length} criteria</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Checkbox
                id="use-rubric"
                checked={useRubric}
                onCheckedChange={(checked) => setUseRubric(checked === true)}
              />
              <label htmlFor="use-rubric" className="font-medium text-slate-900 dark:text-white">
                Use rubric for grading
              </label>
            </div>

            {useRubric && (
              <>
                {rubricCriteria.length === 0 && (
                  <p className="text-slate-600 dark:text-slate-400 text-center py-8">
                    No rubric criteria added yet
                  </p>
                )}

                {rubricCriteria.map((criteria) => (
                  <div
                    key={criteria.id}
                    className="border-2 border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-3"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <Input
                          placeholder="Criteria name"
                          value={criteria.name}
                          className="mb-2"
                        />
                        <Textarea
                          placeholder="Criteria description"
                          value={criteria.description}
                          rows={2}
                        />
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeRubricCriteria(criteria.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {criteria.levels.map((level, idx) => (
                        <div key={idx} className="grid grid-cols-3 gap-2 items-start">
                          <Input
                            placeholder="Level name"
                            value={level.name}
                            disabled
                            className="opacity-75"
                          />
                          <Textarea
                            placeholder="Level description"
                            value={level.description}
                            rows={1}
                            className="text-sm"
                          />
                          <Input
                            type="number"
                            placeholder="Points"
                            value={level.points}
                            disabled
                            className="opacity-75"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}

                {useRubric && (
                  <Button
                    variant="outline"
                    className="w-full"
                    onClick={addRubricCriteria}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add Rubric Criteria
                  </Button>
                )}
              </>
            )}
          </CardContent>
        </Card>

        {/* Assignment To */}
        <Card>
          <CardHeader>
            <CardTitle>Assign To</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Checkbox
                id="assign-all"
                checked={assignToAll}
                onCheckedChange={(checked) => setAssignToAll(checked === true)}
              />
              <label htmlFor="assign-all" className="font-medium text-slate-900 dark:text-white">
                Assign to all students in this class
              </label>
            </div>

            {!assignToAll && (
              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Select specific students
                </label>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Student selection interface would go here
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
