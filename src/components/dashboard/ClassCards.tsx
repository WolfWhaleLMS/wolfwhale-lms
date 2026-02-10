'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, Clock, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { cn } from '@/lib/utils';
import type { MockClass } from '@/lib/mock-data';

interface ClassCardsProps {
  variant: 'k5' | '612';
  classes: MockClass[];
}

/* ── K-5 Colorful Class Cards ───────────────────────── */

function K5ClassCards({ classes }: { classes: MockClass[] }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-4">
        <span className="text-2xl">&#x1F3EB;</span>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">My Classes</h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.map((cls, index) => (
          <motion.div
            key={cls.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <motion.div whileHover={{ scale: 1.03, y: -4 }} whileTap={{ scale: 0.98 }}>
              <Card className="overflow-hidden cursor-pointer border-2 hover:shadow-xl transition-shadow"
                style={{ borderColor: cls.color + '40' }}>
                {/* Color Header */}
                <div
                  className="h-3 w-full"
                  style={{ background: `linear-gradient(90deg, ${cls.color}, ${cls.color}aa)` }}
                />
                <CardContent className="p-5">
                  <div className="flex items-start gap-3 mb-3">
                    {/* Class Icon */}
                    <div
                      className="flex-shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-sm"
                      style={{ backgroundColor: cls.color + '15' }}
                    >
                      {cls.iconEmoji}
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-bold text-slate-900 dark:text-white text-base truncate">
                        {cls.name}
                      </h3>
                      <p className="text-sm text-slate-500 dark:text-slate-400 truncate">
                        {cls.teacherName}
                      </p>
                    </div>
                  </div>

                  {/* Next Assignment Due */}
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 mb-3">
                    <Clock className="w-3.5 h-3.5" />
                    <span>Next due: <strong className={cn(
                      cls.nextAssignmentDue === 'Overdue' ? 'text-red-600 dark:text-red-400' :
                      cls.nextAssignmentDue === 'Today' ? 'text-amber-600 dark:text-amber-400' :
                      'text-slate-700 dark:text-slate-300'
                    )}>{cls.nextAssignmentDue}</strong></span>
                  </div>

                  <Button
                    className="w-full h-12 text-sm font-semibold rounded-xl text-white shadow-md"
                    style={{ background: `linear-gradient(135deg, ${cls.color}, ${cls.color}cc)` }}
                  >
                    Open Class <ArrowRight className="w-4 h-4 ml-1.5" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ── 6-12 Clean Grid ────────────────────────────────── */

function SecondaryClassCards({ classes }: { classes: MockClass[] }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-purple-600" />
            My Classes
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-xs">
            View All <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-3">
          {classes.map((cls, index) => (
            <motion.div
              key={cls.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
            >
              <button className="w-full text-left p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-all group">
                <div className="flex items-start gap-3">
                  <div
                    className="flex-shrink-0 w-3 h-3 rounded-full mt-1.5"
                    style={{ backgroundColor: cls.color }}
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-sm text-slate-900 dark:text-white truncate group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                      {cls.name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {cls.teacherName} &middot; {cls.roomNumber}
                    </p>
                    <div className="flex items-center gap-3 mt-2">
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {cls.studentCount}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {cls.schedule}
                      </span>
                    </div>
                    <div className="mt-2">
                      <span className="text-xs text-slate-500 dark:text-slate-400">
                        {cls.recentActivity}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Main Export ─────────────────────────────────────── */

export function ClassCards({ variant, classes }: ClassCardsProps) {
  if (variant === 'k5') {
    return <K5ClassCards classes={classes} />;
  }
  return <SecondaryClassCards classes={classes} />;
}
