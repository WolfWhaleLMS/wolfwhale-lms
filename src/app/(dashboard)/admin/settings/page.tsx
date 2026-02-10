'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Checkbox } from '@/components/ui/Checkbox';
import { Settings, Upload, Save } from 'lucide-react';

export default function AdminSettingsPage() {
  const [schoolName, setSchoolName] = useState('Hillside Academy');
  const [schoolEmail, setSchoolEmail] = useState('info@hillside-academy.edu');
  const [timezone, setTimezone] = useState('America/Los_Angeles');
  const [gamificationEnabled, setGamificationEnabled] = useState(true);
  const [soundsEnabled, setSoundsEnabled] = useState(true);
  const [petsEnabled, setPetsEnabled] = useState(true);
  const [xpMultiplier, setXpMultiplier] = useState('1.0');

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 dark:from-slate-950 dark:via-cyan-950 dark:to-blue-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
            School Settings
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Configure your school and platform settings
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="general" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="gamification">Gamification</TabsTrigger>
            <TabsTrigger value="grading">Grading</TabsTrigger>
            <TabsTrigger value="advanced">Advanced</TabsTrigger>
          </TabsList>

          {/* General Tab */}
          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>School Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    School Name
                  </label>
                  <Input
                    value={schoolName}
                    onChange={(e) => setSchoolName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    School Email
                  </label>
                  <Input
                    type="email"
                    value={schoolEmail}
                    onChange={(e) => setSchoolEmail(e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Timezone
                  </label>
                  <select className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white">
                    <option value="America/Los_Angeles">Pacific Time</option>
                    <option value="America/Chicago">Central Time</option>
                    <option value="America/New_York">Eastern Time</option>
                    <option value="UTC">UTC</option>
                  </select>
                </div>

                <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>School Logo</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-lg text-center">
                  <Upload className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Drag and drop your logo here
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Gamification Tab */}
          <TabsContent value="gamification" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Gamification Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Enable Gamification */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <label className="font-medium text-slate-900 dark:text-white cursor-pointer">
                    Enable Gamification
                  </label>
                  <button
                    onClick={() => setGamificationEnabled(!gamificationEnabled)}
                    className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
                      gamificationEnabled
                        ? 'bg-blue-600'
                        : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        gamificationEnabled ? 'translate-x-9' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {gamificationEnabled && (
                  <>
                    {/* Sound Effects */}
                    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <label className="font-medium text-slate-900 dark:text-white cursor-pointer">
                        Sound Effects
                      </label>
                      <button
                        onClick={() => setSoundsEnabled(!soundsEnabled)}
                        className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
                          soundsEnabled
                            ? 'bg-blue-600'
                            : 'bg-slate-300 dark:bg-slate-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                            soundsEnabled ? 'translate-x-9' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* Pets */}
                    <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                      <label className="font-medium text-slate-900 dark:text-white cursor-pointer">
                        Pet System
                      </label>
                      <button
                        onClick={() => setPetsEnabled(!petsEnabled)}
                        className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
                          petsEnabled
                            ? 'bg-blue-600'
                            : 'bg-slate-300 dark:bg-slate-600'
                        }`}
                      >
                        <span
                          className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                            petsEnabled ? 'translate-x-9' : 'translate-x-1'
                          }`}
                        />
                      </button>
                    </div>

                    {/* XP Multiplier */}
                    <div>
                      <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                        XP Multiplier
                      </label>
                      <div className="flex items-center gap-2">
                        <Input
                          type="number"
                          value={xpMultiplier}
                          onChange={(e) => setXpMultiplier(e.target.value)}
                          min="0.1"
                          max="5"
                          step="0.1"
                        />
                        <span className="text-sm text-slate-600 dark:text-slate-400">
                          Default: 1.0x
                        </span>
                      </div>
                    </div>
                  </>
                )}

                <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">
                  <Save className="w-4 h-4 mr-2" />
                  Save Changes
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Grading Tab */}
          <TabsContent value="grading" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Grading Scale</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {[
                  { letter: 'A', min: 90, max: 100 },
                  { letter: 'B', min: 80, max: 89 },
                  { letter: 'C', min: 70, max: 79 },
                  { letter: 'D', min: 60, max: 69 },
                  { letter: 'F', min: 0, max: 59 },
                ].map((grade, idx) => (
                  <div key={idx} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                    <p className="font-medium text-slate-900 dark:text-white">
                      Grade {grade.letter}
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      {grade.min}% - {grade.max}%
                    </p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advanced Tab */}
          <TabsContent value="advanced">
            <Card>
              <CardHeader>
                <CardTitle>Advanced Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-slate-600 dark:text-slate-400">
                  Advanced system configuration options
                </p>
                <Button variant="outline" className="w-full justify-start">
                  Backup Data
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  API Keys
                </Button>
                <Button variant="outline" className="w-full justify-start text-red-600 hover:text-red-700">
                  Reset System
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
