'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowRight, Circle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import type { MockMessage } from '@/lib/mock-data';

interface MessagesSummaryProps {
  messages: MockMessage[];
}

export function MessagesSummary({ messages }: MessagesSummaryProps) {
  const unreadCount = messages.filter(m => !m.isRead).length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Mail className="w-5 h-5 text-indigo-600" />
            Messages
          </CardTitle>
          {unreadCount > 0 && (
            <Badge variant="destructive" size="sm">
              {unreadCount} unread
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {messages.slice(0, 3).map((msg, index) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <button className={cn(
                'w-full text-left p-3 rounded-xl transition-colors',
                !msg.isRead
                  ? 'bg-indigo-50/80 dark:bg-indigo-950/30 hover:bg-indigo-100/80 dark:hover:bg-indigo-950/50 border border-indigo-200/50 dark:border-indigo-800/30'
                  : 'hover:bg-slate-50 dark:hover:bg-slate-800/50 border border-transparent'
              )}>
                <div className="flex items-start gap-3">
                  {/* Unread Indicator */}
                  <div className="flex-shrink-0 mt-1.5">
                    {!msg.isRead ? (
                      <Circle className="w-2.5 h-2.5 fill-indigo-500 text-indigo-500" />
                    ) : (
                      <Circle className="w-2.5 h-2.5 text-transparent" />
                    )}
                  </div>

                  {/* Message Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className={cn(
                        'text-sm truncate',
                        !msg.isRead ? 'font-semibold text-slate-900 dark:text-white' : 'font-medium text-slate-700 dark:text-slate-300'
                      )}>
                        {msg.senderName}
                      </span>
                      <span className="text-[10px] text-slate-400 dark:text-slate-500 flex-shrink-0">
                        {msg.timestampLabel}
                      </span>
                    </div>
                    <p className={cn(
                      'text-xs mb-0.5 truncate',
                      !msg.isRead ? 'font-medium text-slate-700 dark:text-slate-300' : 'text-slate-600 dark:text-slate-400'
                    )}>
                      {msg.subject}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">
                      {msg.preview}
                    </p>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>

        <Button variant="outline" className="w-full mt-3 text-sm">
          View All Messages <ArrowRight className="w-4 h-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
