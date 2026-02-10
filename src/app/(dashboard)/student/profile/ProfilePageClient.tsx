'use client';

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Edit, Mail, School } from 'lucide-react';

interface ProfileData {
  userId: string;
  email: string;
  firstName: string;
  lastName: string;
  avatarUrl: string | null;
  phone: string | null;
  dateOfBirth: string | null;
  bio: string | null;
  timezone: string | null;
  language: string;
  preferences: Record<string, any>;
  createdAt: string;
  role: string;
  joinedAt: string;
  tenantId: string | null;
  tenantName: string;
  tenantSlug: string;
}

function formatDate(dateStr: string): string {
  if (!dateStr) return 'Unknown';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
}

interface ProfilePageClientProps {
  profile: ProfileData;
}

export function ProfilePageClient({ profile }: ProfilePageClientProps) {
  const fullName = `${profile.firstName} ${profile.lastName}`.trim() || 'Student';
  const initials = `${(profile.firstName || '?')[0]}${(profile.lastName || '?')[0]}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-purple-50 to-pink-50 dark:from-slate-950 dark:via-purple-950 dark:to-pink-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Profile Header */}
        <Card variant="fun">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-6">
              <div className="flex items-end gap-6">
                <Avatar className="w-20 h-20 border-4 border-white dark:border-slate-800">
                  <AvatarImage src={profile.avatarUrl || undefined} />
                  <AvatarFallback className="text-2xl bg-gradient-to-br from-purple-400 to-pink-400 text-white">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-1">
                    {fullName}
                  </h1>
                  <p className="text-slate-600 dark:text-slate-400">
                    {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                    {profile.tenantName && ` at ${profile.tenantName}`}
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
                <p className="font-medium text-slate-900 dark:text-white">{profile.email}</p>
              </div>
              {profile.phone && (
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Phone</p>
                  <p className="font-medium text-slate-900 dark:text-white">{profile.phone}</p>
                </div>
              )}
              <div>
                <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Member Since</p>
                <p className="font-medium text-slate-900 dark:text-white">
                  {formatDate(profile.joinedAt || profile.createdAt)}
                </p>
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
                <p className="font-medium text-slate-900 dark:text-white">
                  {profile.tenantName || 'Not assigned'}
                </p>
              </div>
              {profile.timezone && (
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Timezone</p>
                  <p className="font-medium text-slate-900 dark:text-white">{profile.timezone}</p>
                </div>
              )}
              {profile.language && (
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Language</p>
                  <p className="font-medium text-slate-900 dark:text-white">
                    {profile.language === 'en' ? 'English' : profile.language}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Bio */}
        {profile.bio && (
          <Card>
            <CardHeader>
              <CardTitle>About Me</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-slate-700 dark:text-slate-300">{profile.bio}</p>
            </CardContent>
          </Card>
        )}

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
