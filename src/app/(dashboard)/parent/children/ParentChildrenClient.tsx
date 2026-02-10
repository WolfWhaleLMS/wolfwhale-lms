'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Search, Bell, TrendingUp } from 'lucide-react';
import { ChildOverviewCard } from '@/components/parent/ChildOverviewCard';
import { Card, CardContent } from '@/components/ui/Card';
import { Input } from '@/components/ui/Input';

interface ChildData {
  id: string;
  firstName: string;
  lastName: string;
  gradeLevel: string;
  avatarUrl: string | null;
  gpa: number;
  attendanceRate: number;
  missingWork: number;
  level: number;
  xp: number;
  nextLevelXp: number;
  petEmoji: string;
  petName: string;
}

interface Props {
  children: ChildData[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 },
};

export default function ParentChildrenClient({ children: childrenData }: Props) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredChildren = childrenData.filter((child) =>
    `${child.firstName} ${child.lastName}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase())
  );

  const totalMissing = childrenData.reduce((sum, c) => sum + c.missingWork, 0);
  const avgGPA =
    childrenData.length > 0
      ? childrenData.reduce((sum, c) => sum + c.gpa, 0) / childrenData.length
      : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-950 dark:via-green-950 dark:to-emerald-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2"
          >
            My Children
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-slate-600 dark:text-slate-400"
          >
            View and manage your children&apos;s academic profiles
          </motion.p>
        </div>

        {/* Summary Stats */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        >
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Children Enrolled
                  </p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {childrenData.length}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-emerald-100 dark:bg-emerald-900/30">
                  <Users className="w-6 h-6 text-emerald-600 dark:text-emerald-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Average GPA
                  </p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {avgGPA.toFixed(1)}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                  <TrendingUp className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">
                    Missing Work
                  </p>
                  <p className={`text-3xl font-bold ${totalMissing > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`}>
                    {totalMissing}
                  </p>
                </div>
                <div className={`p-3 rounded-xl ${totalMissing > 0 ? 'bg-red-100 dark:bg-red-900/30' : 'bg-emerald-100 dark:bg-emerald-900/30'}`}>
                  <Bell className={`w-6 h-6 ${totalMissing > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Search */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search children..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>
        </motion.div>

        {/* Children Cards Grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {filteredChildren.map((child) => (
            <motion.div key={child.id} variants={itemVariants}>
              <ChildOverviewCard
                id={child.id}
                firstName={child.firstName}
                lastName={child.lastName}
                gradeLevel={child.gradeLevel}
                avatarUrl={child.avatarUrl}
                gpa={child.gpa}
                attendanceRate={child.attendanceRate}
                missingWork={child.missingWork}
                level={child.level}
                xp={child.xp}
                nextLevelXp={child.nextLevelXp}
                petEmoji={child.petEmoji}
                petName={child.petName}
              />
            </motion.div>
          ))}
        </motion.div>

        {filteredChildren.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
            <p className="text-slate-500 dark:text-slate-400 text-sm">
              No children match your search.
            </p>
          </div>
        )}

        {/* Quick Tips */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <Card>
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/30 flex-shrink-0">
                  <Bell className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <h3 className="font-semibold text-slate-900 dark:text-white mb-1">
                    Stay Updated
                  </h3>
                  <p className="text-sm text-slate-600 dark:text-slate-400">
                    Click on any child&apos;s card to view their detailed academic profile, including grades,
                    attendance history, assignments, and pet progress. You will receive notifications
                    for any missing work or attendance concerns.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
