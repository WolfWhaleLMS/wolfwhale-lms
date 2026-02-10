'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Music, Play, Pause, RotateCcw, Volume2, Eye, EyeOff, Zap, Trophy, Calendar } from 'lucide-react';

interface MusicTrack {
  id: string;
  name: string;
  description: string;
  icon: string;
}

const musicTracks: MusicTrack[] = [
  {
    id: '1',
    name: 'Lo-fi Beats',
    description: 'Chill hip-hop beats perfect for focus',
    icon: '🎵',
  },
  {
    id: '2',
    name: 'Ocean Waves',
    description: 'Peaceful ocean sounds for relaxation',
    icon: '🌊',
  },
  {
    id: '3',
    name: 'Forest Ambiance',
    description: 'Nature sounds and bird songs',
    icon: '🌲',
  },
  {
    id: '4',
    name: 'Classical Focus',
    description: 'Classical music for deep concentration',
    icon: '🎼',
  },
];

const studyStats = {
  todayStudied: 95,
  xpEarned: 340,
  sessionGoal: 120,
  thisWeekTotal: 480,
};

export default function StudyModePage() {
  const [minutes, setMinutes] = useState(25);
  const [seconds, setSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [sessionMinutes, setSessionMinutes] = useState(25);
  const [breakMinutes, setBreakMinutes] = useState(5);
  const [isBreak, setIsBreak] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [selectedMusic, setSelectedMusic] = useState('1');
  const [volume, setVolume] = useState(70);
  const [distracted, setDistracted] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isRunning) {
      interval = setInterval(() => {
        if (seconds > 0) {
          setSeconds(seconds - 1);
        } else if (minutes > 0) {
          setMinutes(minutes - 1);
          setSeconds(59);
        } else {
          // Timer finished
          setIsRunning(false);
          if (!isBreak) {
            setSessionCount(sessionCount + 1);
            setIsBreak(true);
            setMinutes(breakMinutes);
            // In real app, would show notification and award XP
          } else {
            setIsBreak(false);
            setMinutes(sessionMinutes);
          }
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isRunning, minutes, seconds, isBreak, sessionMinutes, breakMinutes, sessionCount]);

  const handleStart = () => {
    setIsRunning(true);
  };

  const handlePause = () => {
    setIsRunning(false);
  };

  const handleReset = () => {
    setIsRunning(false);
    setMinutes(sessionMinutes);
    setSeconds(0);
    setIsBreak(false);
    setSessionCount(0);
  };

  const progressPercent = isBreak
    ? ((breakMinutes - minutes) / breakMinutes) * 100
    : ((sessionMinutes - minutes) / sessionMinutes) * 100;

  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-indigo-950 dark:via-purple-950 dark:to-blue-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
            Study Mode
          </h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">
            Focus mode for distraction-free studying. Your pet earns XP while you study!
          </p>
        </div>

        {/* Main Timer Card */}
        <Card variant="fun" className="relative overflow-hidden">
          <CardContent className="p-12">
            <div className="text-center space-y-6">
              {/* Mode Indicator */}
              <Badge className={`text-lg px-6 py-2 ${
                isBreak
                  ? 'bg-green-500/20 text-green-700 dark:text-green-200'
                  : 'bg-purple-500/20 text-purple-700 dark:text-purple-200'
              }`}>
                {isBreak ? 'Break Time' : 'Focus Time'}
              </Badge>

              {/* Timer Display */}
              <div className="font-mono text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 leading-none">
                {formattedTime}
              </div>

              {/* Session Count */}
              <p className="text-2xl font-semibold text-slate-900 dark:text-white">
                Session {sessionCount + 1}
              </p>

              {/* Progress Bar */}
              <div className="space-y-2">
                <Progress value={progressPercent} className="h-4" />
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  {Math.round(progressPercent)}% complete
                </p>
              </div>

              {/* Controls */}
              <div className="flex gap-4 justify-center pt-6">
                {!isRunning ? (
                  <Button
                    onClick={handleStart}
                    className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white px-8 py-6 text-lg rounded-2xl"
                  >
                    <Play className="w-5 h-5 mr-2" />
                    Start
                  </Button>
                ) : (
                  <Button
                    onClick={handlePause}
                    className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 text-white px-8 py-6 text-lg rounded-2xl"
                  >
                    <Pause className="w-5 h-5 mr-2" />
                    Pause
                  </Button>
                )}

                <Button
                  onClick={handleReset}
                  variant="outline"
                  className="px-8 py-6 text-lg rounded-2xl"
                >
                  <RotateCcw className="w-5 h-5 mr-2" />
                  Reset
                </Button>
              </div>

              {/* Motivational Message */}
              <p className="text-lg text-slate-600 dark:text-slate-400 pt-4">
                🐺 Your pet earns XP while you study! Keep going!
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Tabs */}
        <Tabs defaultValue="music" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="music">Music</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="stats">Stats</TabsTrigger>
          </TabsList>

          {/* Music Tab */}
          <TabsContent value="music" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Music className="w-5 h-5 text-purple-600" />
                  Background Music
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Currently Playing */}
                <div className="p-4 rounded-lg bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900/30 dark:to-pink-900/30 border border-purple-200 dark:border-purple-700">
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">Now Playing</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-slate-900 dark:text-white">
                        {musicTracks.find(t => t.id === selectedMusic)?.name}
                      </p>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        {musicTracks.find(t => t.id === selectedMusic)?.description}
                      </p>
                    </div>
                    <span className="text-4xl">
                      {musicTracks.find(t => t.id === selectedMusic)?.icon}
                    </span>
                  </div>
                </div>

                {/* Volume Control */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Volume2 className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    <label className="text-sm font-medium text-slate-900 dark:text-white">
                      Volume
                    </label>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={volume}
                    onChange={(e) => setVolume(Number(e.target.value))}
                    className="w-full h-3 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer"
                  />
                  <p className="text-sm text-slate-600 dark:text-slate-400 text-right">
                    {volume}%
                  </p>
                </div>

                {/* Track Selection */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {musicTracks.map((track) => (
                    <button
                      key={track.id}
                      onClick={() => setSelectedMusic(track.id)}
                      className={`p-4 rounded-lg border-2 transition-all text-left ${
                        selectedMusic === track.id
                          ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/30'
                          : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                      }`}
                    >
                      <div className="text-3xl mb-2">{track.icon}</div>
                      <p className="font-semibold text-slate-900 dark:text-white">{track.name}</p>
                      <p className="text-xs text-slate-600 dark:text-slate-400">{track.description}</p>
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Study Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Session Duration */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Focus Session Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={sessionMinutes}
                    onChange={(e) => setSessionMinutes(Math.max(1, Number(e.target.value)))}
                    disabled={isRunning}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:opacity-50"
                  />
                </div>

                {/* Break Duration */}
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Break Duration (minutes)
                  </label>
                  <input
                    type="number"
                    value={breakMinutes}
                    onChange={(e) => setBreakMinutes(Math.max(1, Number(e.target.value)))}
                    disabled={isRunning}
                    className="w-full px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white disabled:opacity-50"
                  />
                </div>

                {/* Distraction-Free Mode */}
                <div className="flex items-center justify-between p-4 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <div className="flex items-center gap-2">
                    {distracted ? (
                      <Eye className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    ) : (
                      <EyeOff className="w-5 h-5 text-slate-600 dark:text-slate-400" />
                    )}
                    <label className="font-medium text-slate-900 dark:text-white cursor-pointer">
                      Distraction-Free Mode
                    </label>
                  </div>
                  <button
                    onClick={() => setDistracted(!distracted)}
                    className={`relative inline-flex h-8 w-16 items-center rounded-full transition-colors ${
                      distracted
                        ? 'bg-purple-600'
                        : 'bg-slate-300 dark:bg-slate-600'
                    }`}
                  >
                    <span
                      className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform ${
                        distracted ? 'translate-x-9' : 'translate-x-1'
                      }`}
                    />
                  </button>
                </div>

                {distracted && (
                  <div className="p-4 rounded-lg bg-blue-50 dark:bg-blue-950 border border-blue-200 dark:border-blue-800">
                    <p className="text-sm text-blue-700 dark:text-blue-300">
                      Distraction-free mode will hide the sidebar and notifications during study sessions.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Stats Tab */}
          <TabsContent value="stats" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600">
                      <Calendar className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Today Studied</p>
                      <p className="text-3xl font-bold text-slate-900 dark:text-white">
                        {studyStats.todayStudied}m
                      </p>
                    </div>
                  </div>
                  <Progress value={Math.min(100, (studyStats.todayStudied / studyStats.sessionGoal) * 100)} className="h-2" />
                  <p className="text-xs text-slate-600 dark:text-slate-400 mt-2">
                    Goal: {studyStats.sessionGoal} minutes
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">XP Earned Today</p>
                      <p className="text-3xl font-bold text-slate-900 dark:text-white">
                        {studyStats.xpEarned}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Your pet is proud of you!
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/30 text-purple-600">
                      <Trophy className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">This Week</p>
                      <p className="text-3xl font-bold text-slate-900 dark:text-white">
                        {studyStats.thisWeekTotal}m
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    Keep up the great work!
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/30 text-green-600">
                      <Music className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm text-slate-600 dark:text-slate-400">Current Session</p>
                      <p className="text-3xl font-bold text-slate-900 dark:text-white">
                        #{sessionCount + 1}
                      </p>
                    </div>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-400">
                    {sessionCount > 0 && `${sessionCount} completed today`}
                  </p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>

        {/* Motivational Quote */}
        <Card>
          <CardContent className="p-6 text-center">
            <p className="text-lg italic text-slate-600 dark:text-slate-400">
              "The secret of getting ahead is getting started." - Mark Twain
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
