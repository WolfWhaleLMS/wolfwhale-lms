'use client';

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { AchievementBadge } from './AchievementBadge';
import type { Achievement, AchievementCategory } from '@/types/gamification.types';

interface AchievementGridProps {
  achievements: Achievement[];
  earnedAchievementIds: Set<string>;
  onSelectAchievement?: (achievement: Achievement) => void;
}

const CATEGORIES: AchievementCategory[] = [
  'Academic',
  'Consistency',
  'Participation',
  'Engagement',
  'Wellness',
  'Seasonal',
];

export const AchievementGrid: React.FC<AchievementGridProps> = ({
  achievements,
  earnedAchievementIds,
  onSelectAchievement,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<AchievementCategory | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredAchievements = useMemo(() => {
    let filtered = achievements;

    // Filter by category
    if (selectedCategory !== 'All') {
      filtered = filtered.filter((a) => a.category === selectedCategory);
    }

    // Filter by search
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.name.toLowerCase().includes(query) ||
          a.description.toLowerCase().includes(query)
      );
    }

    // Sort: earned first, then by name
    return filtered.sort((a, b) => {
      const aEarned = earnedAchievementIds.has(a.id) ? 0 : 1;
      const bEarned = earnedAchievementIds.has(b.id) ? 0 : 1;

      if (aEarned !== bEarned) {
        return aEarned - bEarned;
      }

      return a.name.localeCompare(b.name);
    });
  }, [achievements, selectedCategory, searchQuery, earnedAchievementIds]);

  const categoryStats = useMemo(() => {
    return CATEGORIES.map((cat) => {
      const categoryAchievements = achievements.filter((a) => a.category === cat);
      const earned = categoryAchievements.filter((a) => earnedAchievementIds.has(a.id)).length;
      return {
        category: cat,
        total: categoryAchievements.length,
        earned,
      };
    });
  }, [achievements, earnedAchievementIds]);

  const totalStats = useMemo(() => {
    return {
      total: achievements.length,
      earned: earnedAchievementIds.size,
    };
  }, [achievements, earnedAchievementIds]);

  return (
    <div className="space-y-6">
      {/* Header Stats */}
      <motion.div
        className="grid grid-cols-3 gap-3"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="bg-white/10 border border-white/20 rounded-lg p-3">
          <p className="text-xs text-white/60 uppercase tracking-widest font-semibold">Total</p>
          <p className="text-2xl font-bold text-white mt-1">{totalStats.total}</p>
        </div>
        <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-3">
          <p className="text-xs text-green-300 uppercase tracking-widest font-semibold">Unlocked</p>
          <p className="text-2xl font-bold text-green-300 mt-1">{totalStats.earned}</p>
        </div>
        <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-3">
          <p className="text-xs text-purple-300 uppercase tracking-widest font-semibold">Progress</p>
          <p className="text-2xl font-bold text-purple-300 mt-1">
            {Math.round((totalStats.earned / totalStats.total) * 100)}%
          </p>
        </div>
      </motion.div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-white/40" />
        <Input
          type="text"
          placeholder="Search achievements..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Category Tabs */}
      <div>
        <p className="text-xs font-semibold text-white/60 uppercase mb-2">Category</p>
        <div className="flex flex-wrap gap-2">
          <Button
            variant={selectedCategory === 'All' ? 'default' : 'secondary'}
            size="sm"
            onClick={() => setSelectedCategory('All')}
          >
            All ({totalStats.total})
          </Button>
          {categoryStats.map((stat) => (
            <Button
              key={stat.category}
              variant={selectedCategory === stat.category ? 'default' : 'secondary'}
              size="sm"
              onClick={() => setSelectedCategory(stat.category)}
            >
              {stat.category} ({stat.earned}/{stat.total})
            </Button>
          ))}
        </div>
      </div>

      {/* Achievements Grid */}
      <motion.div
        className="grid grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4"
        layout
      >
        <AnimatePresence mode="popLayout">
          {filteredAchievements.map((achievement, index) => (
            <motion.div
              key={achievement.id}
              layout
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ delay: index * 0.05 }}
            >
              <AchievementBadge
                achievement={achievement}
                isEarned={earnedAchievementIds.has(achievement.id)}
                size="sm"
                onClick={() => onSelectAchievement?.(achievement)}
              />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {filteredAchievements.length === 0 && (
        <motion.div
          className="text-center py-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <p className="text-white/60">No achievements found</p>
          <p className="text-white/40 text-sm mt-1">Try different search terms or categories</p>
        </motion.div>
      )}
    </div>
  );
};
