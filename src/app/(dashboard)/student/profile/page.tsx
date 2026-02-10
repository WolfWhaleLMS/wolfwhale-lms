'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Progress } from '@/components/ui/Progress';
import { Edit, Mail, School, Award, Zap, Trophy, Flame } from 'lucide-react';

interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlockedDate: string;
}

const mockProfileData = {
  name: 'Alex Johnson',
  gradeLevel: '9',
  email: 'alex.johnson@school.edu',
  school: 'Hillside Academy',
  joinDate: 'September 2023',
  avatar: '',
  totalXP: 3250,
  level: 12,
  nextLevelXP: 3850,
  tier: 'Pack Scout',
  dailyStreak: 7,
  longestStreak: 21,
};

const mockAchievements: Achievement[] = [
  {
    id: '1',
    name: 'First Steps',
    description: 'Completed your first lesson',
    icon: '🎓',
    unlockedDate: 'Sep 15, 2023',
  },
  {
    id: '2',
    name: 'Quiz Master',
    description: 'Scored perfect on 5 quizzes',
    icon: '✨',
    unlockedDate: 'Nov 2, 2023',
  },
  {
    id: '3',
    name: 'Homework Hero',
    description: 'Submitted 50 assignments on time',
    icon: '⭐',
    unlockedDate: 'Dec 20, 2023',
  },
  {
    id: '4',
    name: 'Consistency King',
    description: 'Maintained a 7-day streak',
    icon: '🔥',
    unlockedDate: 'Feb 5, 2024',
  },
  {
    id: '5',
    name: 'Level 10 Climber',
    description: 'Reached level 10',
    icon: '🎯',
    unlockedDate: 'Jan 28, 2024',
  },
  {
    id: '6',
    name: 'Perfect Week',
    description: 'Earned perfect grades for a whole week',
    icon: '💯',
    unlockedDate: 'Feb 1, 2024',
  },
];

export default function StudentProfilePage() {
  const levelProgress = ((mockProfileData.totalXP) / mockProfileData.nextLevelXP) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <Card variant="fun">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
              <div className="flex items-end gap-6">
                <Avatar className="w-20 h-20 border-4 border-white dark:border-slate-800">
                  <AvatarImage src={mockProfileData.avatar} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-400 to-pink-400 text-white">
                    {mockProfileData.name.split(' ')[0][0]}
                    {mockProfileData.name.split(' ')[1][0]}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                    {mockProfileData.name}
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400">
                    Grade {mockProfileData.gradeLevel} • {mockProfileData.school}
                  </p>
                </div>
              </div>
              <Button className="bg-purple-600 hover:bg-purple-700 text-white gap-2">
                <Edit className="w-4 h-4" />
                Edit Profile
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Contact & School Info */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5 text-blue-600" />
                Contact
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Email</p>
                <p className="font-medium text-slate-900 dark:text-white">{mockProfileData.email}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Member Since</p>
                <p className="font-medium text-slate-900 dark:text-white">{mockProfileData.joinDate}</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <School className="w-5 h-5 text-green-600" />
                School Info
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">School</p>
                <p className="font-medium text-slate-900 dark:text-white">{mockProfileData.school}</p>
              </div>
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Grade Level</p>
                <p className="font-medium text-slate-900 dark:text-white">Grade {mockProfileData.gradeLevel}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Level & XP Stats */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="w-5 h-5 text-yellow-500" />
              Progression Stats
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
                  Level {mockProfileData.level}
                </h3>
                <Badge className="bg-purple-500/20 text-purple-700 dark:text-purple-200">
                  {mockProfileData.tier}
                </Badge>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 mb-3">
                {mockProfileData.totalXP.toLocaleString()} / {mockProfileData.nextLevelXP.toLocaleString()} XP
              </p>
              <Progress value={levelProgress} className="h-3" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-yellow-50 dark:bg-yellow-950 border border-yellow-200 dark:border-yellow-800">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-5 h-5 text-yellow-600" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">Total XP</p>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {mockProfileData.totalXP.toLocaleString()}
                </p>
              </div>

              <div className="p-4 rounded-lg bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800">
                <div className="flex items-center gap-2 mb-2">
                  <Flame className="w-5 h-5 text-orange-600" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">Streak</p>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {mockProfileData.dailyStreak} days
                </p>
              </div>

              <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800">
                <div className="flex items-center gap-2 mb-2">
                  <Trophy className="w-5 h-5 text-red-600" />
                  <p className="text-sm text-slate-600 dark:text-slate-400">Best Streak</p>
                </div>
                <p className="text-2xl font-bold text-slate-900 dark:text-white">
                  {mockProfileData.longestStreak} days
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="w-5 h-5 text-purple-600" />
              Achievements Unlocked ({mockAchievements.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
              {mockAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex flex-col items-center text-center p-4 rounded-lg bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 hover:shadow-lg transition-shadow group"
                >
                  <div className="text-4xl mb-2 group-hover:scale-110 transition-transform">
                    {achievement.icon}
                  </div>
                  <h4 className="font-semibold text-sm text-slate-900 dark:text-white mb-1">
                    {achievement.name}
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-400 mb-2">
                    {achievement.description}
                  </p>
                  <Badge className="text-xs bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200">
                    {achievement.unlockedDate}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Account Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Account Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Button variant="outline" className="h-12">
                Change Password
              </Button>
              <Button variant="outline" className="h-12">
                Email Preferences
              </Button>
              <Button variant="outline" className="h-12">
                Pet Preferences
              </Button>
              <Button variant="outline" className="h-12">
                Privacy Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
