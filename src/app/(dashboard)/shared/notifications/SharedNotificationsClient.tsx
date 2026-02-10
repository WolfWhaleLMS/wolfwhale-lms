'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle, Trophy, AlertCircle, MessageSquare, Zap, FileText, Filter, Trash2, Bell } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NotificationData {
  id: string;
  type: string;
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl: string | null;
}

interface SharedNotificationsClientProps {
  notifications: NotificationData[];
  currentUserId: string;
  tenantId: string;
}

function formatTimestamp(ts: string): string {
  const date = new Date(ts);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHours = diffMs / (1000 * 60 * 60);
  if (diffHours < 1) return 'Just now';
  if (diffHours < 24) return `${Math.floor(diffHours)}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays}d ago`;
  return `${Math.floor(diffDays / 7)}w ago`;
}

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'grade_posted':
    case 'submission_graded':
      return <CheckCircle className="w-5 h-5 text-green-500" />;
    case 'assignment_due':
      return <AlertCircle className="w-5 h-5 text-orange-500" />;
    case 'message_received':
      return <MessageSquare className="w-5 h-5 text-blue-500" />;
    case 'new_announcement':
    case 'course_update':
      return <FileText className="w-5 h-5 text-purple-500" />;
    case 'enrollment_approved':
      return <Trophy className="w-5 h-5 text-yellow-500" />;
    case 'system_alert':
      return <Zap className="w-5 h-5 text-red-500" />;
    default:
      return <Bell className="w-5 h-5 text-slate-500" />;
  }
};

const getTypeColor = (type: string) => {
  switch (type) {
    case 'grade_posted':
    case 'submission_graded':
      return 'bg-green-500/20 text-green-700 dark:text-green-200';
    case 'assignment_due':
      return 'bg-orange-500/20 text-orange-700 dark:text-orange-200';
    case 'message_received':
      return 'bg-blue-500/20 text-blue-700 dark:text-blue-200';
    case 'new_announcement':
    case 'course_update':
      return 'bg-purple-500/20 text-purple-700 dark:text-purple-200';
    case 'enrollment_approved':
      return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-200';
    case 'system_alert':
      return 'bg-red-500/20 text-red-700 dark:text-red-200';
    default:
      return 'bg-slate-500/20 text-slate-700 dark:text-slate-200';
  }
};

const getTypeLabel = (type: string) => {
  switch (type) {
    case 'assignment_due':
      return 'Assignment';
    case 'grade_posted':
      return 'Grade';
    case 'message_received':
      return 'Message';
    case 'enrollment_approved':
      return 'Enrollment';
    case 'new_announcement':
      return 'Announcement';
    case 'submission_graded':
      return 'Grade';
    case 'course_update':
      return 'Course';
    case 'system_alert':
      return 'System';
    default:
      return type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, ' ');
  }
};

export function SharedNotificationsClient({
  notifications: initialNotifications,
  currentUserId,
  tenantId,
}: SharedNotificationsClientProps) {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = selectedFilter
    ? notifications.filter((n) => n.type === selectedFilter)
    : notifications;

  const handleMarkAsRead = async (id: string) => {
    // Optimistically update UI
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );

    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notificationIds: [id] }),
      });
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    // Optimistically update UI
    setNotifications(notifications.map((n) => ({ ...n, read: true })));

    try {
      await fetch('/api/notifications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ markAllAsRead: true }),
      });
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  // Get unique types from notifications
  const types = [...new Set(notifications.map((n) => n.type))];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
              Notifications
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
            </p>
          </div>
          {unreadCount > 0 && (
            <Button
              variant="outline"
              onClick={handleMarkAllAsRead}
              className="text-blue-600 hover:text-blue-700"
            >
              Mark all as read
            </Button>
          )}
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={() => setSelectedFilter(null)}
            className={cn(
              'px-4 py-2 rounded-lg font-medium transition-all',
              selectedFilter === null
                ? 'bg-blue-600 text-white'
                : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200'
            )}
          >
            All ({notifications.length})
          </button>
          {types.map((type) => {
            const count = notifications.filter((n) => n.type === type).length;
            return (
              <button
                key={type}
                onClick={() => setSelectedFilter(type)}
                className={cn(
                  'px-4 py-2 rounded-lg font-medium transition-all',
                  selectedFilter === type
                    ? 'bg-blue-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white hover:bg-slate-200'
                )}
              >
                {getTypeLabel(type)} ({count})
              </button>
            );
          })}
        </div>

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Bell className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-4" />
                <p className="text-slate-600 dark:text-slate-400">
                  No notifications to display
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                key={notification.id}
                className={cn(
                  'transition-all duration-200 cursor-pointer hover:shadow-md',
                  !notification.read && 'border-2 border-blue-400 bg-blue-50/50 dark:bg-blue-950/20'
                )}
                onClick={() => handleMarkAsRead(notification.id)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="p-3 rounded-lg bg-slate-100 dark:bg-slate-800">
                      {getTypeIcon(notification.type)}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4 mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-slate-900 dark:text-white mb-1">
                            {notification.title}
                          </h4>
                          <p className="text-slate-600 dark:text-slate-400 text-sm">
                            {notification.message}
                          </p>
                        </div>
                        {!notification.read && (
                          <div className="w-2 h-2 rounded-full bg-blue-600 flex-shrink-0 mt-2" />
                        )}
                      </div>

                      <div className="flex items-center gap-3 mt-3">
                        <Badge className={cn('text-xs', getTypeColor(notification.type))}>
                          {getTypeLabel(notification.type)}
                        </Badge>
                        <span className="text-xs text-slate-500 dark:text-slate-500">
                          {formatTimestamp(notification.timestamp)}
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete(notification.id);
                      }}
                      className="p-2 text-slate-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
