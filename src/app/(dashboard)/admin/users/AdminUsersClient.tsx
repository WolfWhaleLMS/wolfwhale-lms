'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/Tabs';
import { Input } from '@/components/ui/Input';
import { Search, Plus, MoreVertical, Upload } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/DropdownMenu';
import Link from 'next/link';

interface User {
  id: string;
  membershipId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'student' | 'teacher' | 'parent' | 'admin';
  status: 'active' | 'inactive' | 'invited' | 'suspended';
  avatarUrl: string | null;
  joinedAt: string;
}

const getRoleColor = (role: string) => {
  switch (role) {
    case 'student':
      return 'bg-blue-500/20 text-blue-700 dark:text-blue-200';
    case 'teacher':
      return 'bg-green-500/20 text-green-700 dark:text-green-200';
    case 'parent':
      return 'bg-purple-500/20 text-purple-700 dark:text-purple-200';
    case 'admin':
      return 'bg-red-500/20 text-red-700 dark:text-red-200';
    default:
      return 'bg-slate-500/20 text-slate-700 dark:text-slate-200';
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active':
      return 'bg-green-500/20 text-green-700 dark:text-green-200';
    case 'invited':
      return 'bg-amber-500/20 text-amber-700 dark:text-amber-200';
    case 'suspended':
      return 'bg-red-500/20 text-red-700 dark:text-red-200';
    default:
      return 'bg-gray-500/20 text-gray-700 dark:text-gray-200';
  }
};

export default function AdminUsersClient({ users }: { users: User[] }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
      const matchesSearch =
        fullName.includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

      if (activeTab === 'all') return matchesSearch;
      return matchesSearch && user.role === activeTab;
    });
  }, [users, searchQuery, activeTab]);

  const stats = useMemo(() => ({
    all: users.length,
    student: users.filter((u) => u.role === 'student').length,
    teacher: users.filter((u) => u.role === 'teacher').length,
    parent: users.filter((u) => u.role === 'parent').length,
    admin: users.filter((u) => u.role === 'admin').length,
  }), [users]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 dark:from-slate-950 dark:via-cyan-950 dark:to-blue-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              User Management
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Manage all users in your school
            </p>
          </div>
          <div className="flex gap-3">
            <Link href="/admin/users/create">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4 mr-2" />
                Add User
              </Button>
            </Link>
          </div>
        </div>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
          <Input
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="all">All ({stats.all})</TabsTrigger>
            <TabsTrigger value="student">Students ({stats.student})</TabsTrigger>
            <TabsTrigger value="teacher">Teachers ({stats.teacher})</TabsTrigger>
            <TabsTrigger value="parent">Parents ({stats.parent})</TabsTrigger>
            <TabsTrigger value="admin">Admins ({stats.admin})</TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-4">
            {filteredUsers.map((user) => {
              const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase() || '?';
              const fullName = `${user.firstName} ${user.lastName}`.trim() || 'Unknown User';

              return (
                <Card key={user.id}>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        <Avatar>
                          <AvatarImage src={user.avatarUrl || undefined} />
                          <AvatarFallback>{initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 dark:text-white">
                            {fullName}
                          </h4>
                          <p className="text-sm text-slate-600 dark:text-slate-400">
                            {user.email}
                          </p>
                          <div className="flex gap-2 mt-2">
                            <Badge className={getRoleColor(user.role)}>
                              {user.role}
                            </Badge>
                            <Badge className={getStatusColor(user.status)}>
                              {user.status}
                            </Badge>
                          </div>
                        </div>
                      </div>

                      <div className="text-right hidden sm:block">
                        <p className="text-sm font-medium text-slate-900 dark:text-white">
                          Joined
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400">
                          {new Date(user.joinedAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </p>
                      </div>

                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="ml-4">
                            <MoreVertical className="w-4 h-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/users/${user.id}`}>
                              View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>Reset Password</DropdownMenuItem>
                          <DropdownMenuItem className="text-red-600">
                            Deactivate
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardContent>
                </Card>
              );
            })}

            {filteredUsers.length === 0 && (
              <Card>
                <CardContent className="p-12 text-center">
                  <p className="text-slate-600 dark:text-slate-400">
                    No users found matching your search
                  </p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
