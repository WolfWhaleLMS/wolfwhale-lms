'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle, Trophy, AlertCircle, MessageSquare, Zap, FileText, Filter, Trash2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'achievement' | 'grade' | 'assignment' | 'message' | 'announcement' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  icon: React.ReactNode;
  link?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'achievement',
    title: 'Achievement Unlocked',
    message: 'You earned the "Quiz Master" achievement!',
    timestamp: '1 hour ago',
    read: false,
    icon: <Trophy className="w-5 h-5 text-yellow-500" />,
  },
  {
    id: '2',
    type: 'grade',
    title: 'Grade Posted',
    message: 'Ms. Chen posted your math quiz grade: 95%',
    timestamp: '2 hours ago',
    read: false,
    icon: <CheckCircle className="w-5 h-5 text-green-500" />,
  },
  {
    id: '3',
    type: 'assignment',
    title: 'Assignment Due Soon',
    message: 'Your essay "The Great Gatsby Analysis" is due tomorrow',
    timestamp: '1 day ago',
    read: true,
    icon: <AlertCircle className="w-5 h-5 text-orange-500" />,
  },
  {
    id: '4',
    type: 'message',
    title: 'New Message',
    message: 'Ms. Chen sent you a message',
    timestamp: '2 days ago',
    read: true,
    icon: <MessageSquare className="w-5 h-5 text-blue-500" />,
  },
  {
    id: '5',
    type: 'announcement',
    title: 'Class Announcement',
    message: 'Quiz tomorrow in Math class. Review chapters 3-4.',
    timestamp: '3 days ago',
    read: true,
    icon: <FileText className="w-5 h-5 text-purple-500" />,
  },
  {
    id: '6',
    type: 'reminder',
    title: 'Reminder',
    message: 'Attend your Biology lab today at 1:00 PM',
    timestamp: '1 week ago',
    read: true,
    icon: <Zap className="w-5 h-5 text-slate-500" />,
  },
];

const getTypeColor = (type: string) => {
  switch (type) {
    case 'achievement':
      return 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-200';
    case 'grade':
      return 'bg-green-500/20 text-green-700 dark:text-green-200';
    case 'assignment':
      return 'bg-orange-500/20 text-orange-700 dark:text-orange-200';
    case 'message':
      return 'bg-blue-500/20 text-blue-700 dark:text-blue-200';
    case 'announcement':
      return 'bg-purple-500/20 text-purple-700 dark:text-purple-200';
    case 'reminder':
      return 'bg-slate-500/20 text-slate-700 dark:text-slate-200';
    default:
      return 'bg-slate-500/20 text-slate-700 dark:text-slate-200';
  }
};

const getTypeLabel = (type: string) => {
  return type.charAt(0).toUpperCase() + type.slice(1);
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const filteredNotifications = selectedFilter
    ? notifications.filter((n) => n.type === selectedFilter)
    : notifications;

  const handleMarkAsRead = (id: string) => {
    setNotifications(
      notifications.map((n) => (n.id === id ? { ...n, read: true } : n))
    );
  };

  const handleMarkAllAsRead = () => {
    setNotifications(notifications.map((n) => ({ ...n, read: true })));
  };

  const handleDelete = (id: string) => {
    setNotifications(notifications.filter((n) => n.id !== id));
  };

  const types = ['achievement', 'grade', 'assignment', 'message', 'announcement', 'reminder'];

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
                      {notification.icon}
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
                          {notification.timestamp}
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
