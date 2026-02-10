'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Badge } from '@/components/ui/Badge';
import {
  ArrowLeft,
  UserPlus,
  Eye,
  EyeOff,
  GraduationCap,
  BookOpen,
  Users,
  AlertCircle,
  CheckCircle2,
  Loader2,
} from 'lucide-react';
import { createUserAction } from './actions';

type Role = 'teacher' | 'student' | 'parent';

const roleInfo: Record<Role, { label: string; description: string; icon: React.ReactNode; color: string }> = {
  teacher: {
    label: 'Teacher',
    description: 'Can create courses, assignments, and grade students',
    icon: <BookOpen className="w-5 h-5" />,
    color: 'border-green-500 bg-green-50 dark:bg-green-900/20',
  },
  student: {
    label: 'Student',
    description: 'Can enroll in courses and submit assignments',
    icon: <GraduationCap className="w-5 h-5" />,
    color: 'border-blue-500 bg-blue-50 dark:bg-blue-900/20',
  },
  parent: {
    label: 'Parent',
    description: 'Can view their children\'s progress and communicate with teachers',
    icon: <Users className="w-5 h-5" />,
    color: 'border-purple-500 bg-purple-50 dark:bg-purple-900/20',
  },
};

export default function CreateUserPage() {
  const router = useRouter();
  const [role, setRole] = useState<Role>('student');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [bio, setBio] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.set('email', email);
    formData.set('password', password);
    formData.set('firstName', firstName);
    formData.set('lastName', lastName);
    formData.set('role', role);
    formData.set('phone', phone);
    formData.set('bio', bio);

    try {
      const result = await createUserAction(formData);

      if (result.success) {
        setSuccess(result.message || 'User created successfully!');
        // Reset form
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        setPhone('');
        setBio('');
        // Redirect after short delay
        setTimeout(() => {
          router.push('/admin/users');
        }, 1500);
      } else {
        setError(result.error?.message || 'Failed to create user');
      }
    } catch {
      setError('An unexpected error occurred.');
    } finally {
      setLoading(false);
    }
  };

  const generatePassword = () => {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    const specials = '!@#$%&*';
    let pw = '';
    for (let i = 0; i < 10; i++) {
      pw += chars[Math.floor(Math.random() * chars.length)];
    }
    pw += specials[Math.floor(Math.random() * specials.length)];
    pw += String(Math.floor(Math.random() * 10));
    // Shuffle
    pw = pw.split('').sort(() => Math.random() - 0.5).join('');
    setPassword(pw);
    setShowPassword(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 dark:from-slate-950 dark:via-cyan-950 dark:to-blue-950 p-4 md:p-8">
      <div className="max-w-2xl mx-auto space-y-6">
        {/* Back Button */}
        <Link href="/admin/users">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Users
          </Button>
        </Link>

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">
            Create New User
          </h1>
          <p className="text-slate-600 dark:text-slate-400">
            Add a new teacher, student, or parent to your school
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Role Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Select Role</CardTitle>
              <CardDescription>
                Choose the role for the new user. Admins cannot create other admin accounts.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {(Object.entries(roleInfo) as [Role, typeof roleInfo[Role]][]).map(([key, info]) => (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setRole(key)}
                    className={`p-4 rounded-lg border-2 text-left transition-all ${
                      role === key
                        ? info.color + ' border-current'
                        : 'border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      {info.icon}
                      <span className="font-semibold text-slate-900 dark:text-white">
                        {info.label}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {info.description}
                    </p>
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* User Info */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">User Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    First Name *
                  </label>
                  <Input
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    placeholder="John"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                    Last Name *
                  </label>
                  <Input
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    placeholder="Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Email Address *
                </label>
                <Input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john.doe@school.edu"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Password *
                </label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Min 8 chars, uppercase, lowercase, number"
                      required
                      minLength={8}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={generatePassword}
                    className="whitespace-nowrap"
                  >
                    Generate
                  </Button>
                </div>
                <p className="text-xs text-slate-500 mt-1">
                  Must contain at least 8 characters, including uppercase, lowercase, and a number.
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Phone (optional)
                </label>
                <Input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="(555) 123-4567"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                  Bio (optional)
                </label>
                <Textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  rows={3}
                  placeholder="Brief description..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Error / Success Messages */}
          {error && (
            <div className="p-4 rounded-lg bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-red-700 dark:text-red-200">{error}</p>
            </div>
          )}

          {success && (
            <div className="p-4 rounded-lg bg-green-50 dark:bg-green-950 border border-green-200 dark:border-green-800 flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0 mt-0.5" />
              <p className="text-sm text-green-700 dark:text-green-200">{success}</p>
            </div>
          )}

          {/* Submit */}
          <div className="flex gap-3">
            <Link href="/admin/users" className="flex-1">
              <Button type="button" variant="outline" className="w-full">
                Cancel
              </Button>
            </Link>
            <Button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Creating...
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" />
                  Create {roleInfo[role].label}
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
