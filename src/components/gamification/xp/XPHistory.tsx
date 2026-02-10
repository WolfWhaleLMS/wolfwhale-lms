'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { BookOpen, FileText, Award, Zap, Star } from 'lucide-react';
import type { XPTransaction } from '@/types/gamification.types';

interface XPHistoryProps {
  transactions: XPTransaction[];
  isLoading?: boolean;
}

const SOURCE_ICONS: Record<string, React.ReactNode> = {
  assignment: <FileText className="w-4 h-4" />,
  lesson: <BookOpen className="w-4 h-4" />,
  achievement: <Award className="w-4 h-4" />,
  bonus: <Star className="w-4 h-4" />,
  daily: <Zap className="w-4 h-4" />,
};

const SOURCE_COLORS: Record<string, string> = {
  assignment: 'bg-blue-500/20 border-blue-500/30 text-blue-300',
  lesson: 'bg-green-500/20 border-green-500/30 text-green-300',
  achievement: 'bg-purple-500/20 border-purple-500/30 text-purple-300',
  bonus: 'bg-yellow-500/20 border-yellow-500/30 text-yellow-300',
  daily: 'bg-orange-500/20 border-orange-500/30 text-orange-300',
};

export const XPHistory: React.FC<XPHistoryProps> = ({ transactions, isLoading = false }) => {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-12 bg-white/5 border border-white/10 rounded-lg animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-white/60">No XP history yet</p>
        <p className="text-white/40 text-sm mt-1">Complete assignments and lessons to earn XP</p>
      </div>
    );
  }

  return (
    <div className="space-y-2 max-h-96 overflow-y-auto">
      {transactions.map((transaction, index) => {
        const sourceType = transaction.sourceType.toLowerCase();
        const icon = SOURCE_ICONS[sourceType] || <Star className="w-4 h-4" />;
        const colorClass = SOURCE_COLORS[sourceType] || SOURCE_COLORS.bonus;

        return (
          <motion.div
            key={transaction.id}
            className={`flex items-center justify-between p-3 rounded-lg border transition-all ${colorClass}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            whileHover={{ scale: 1.02, x: 4 }}
          >
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <div className="flex-shrink-0 p-2 rounded-lg bg-black/30">
                {icon}
              </div>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">
                  {transaction.sourceDescription}
                </p>
                <p className="text-xs opacity-75">
                  {format(new Date(transaction.createdAt), 'MMM d, HH:mm')}
                </p>
              </div>
            </div>

            <motion.div
              className="flex-shrink-0 text-right font-bold text-lg ml-2"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ delay: index * 0.05 + 0.3 }}
            >
              +{transaction.amount}
            </motion.div>
          </motion.div>
        );
      })}
    </div>
  );
};
