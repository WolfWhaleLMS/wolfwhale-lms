'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Eye, EyeOff } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Tabs } from '@/components/ui/Tabs';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/Avatar';
import type { LeaderboardEntry, LeaderboardScope, LeaderboardTimeframe } from '@/types/gamification.types';

interface LeaderboardProps {
  topThree: LeaderboardEntry[];
  allEntries: LeaderboardEntry[];
  currentUserRank: LeaderboardEntry | null;
  scope: LeaderboardScope;
  timeframe: LeaderboardTimeframe;
  gradeLevel?: string;
  onScopeChange?: (scope: LeaderboardScope) => void;
  onTimeframeChange?: (timeframe: LeaderboardTimeframe) => void;
}

const SCOPE_OPTIONS: LeaderboardScope[] = ['class', 'grade', 'school'];
const TIMEFRAME_OPTIONS: LeaderboardTimeframe[] = ['week', 'month', 'all'];

const TIER_ICONS: Record<string, string> = {
  'Wave Runner': '🌊',
  'Knowledge Keeper': '📚',
  'Consistency Champion': '⭐',
  'Participation Pro': '🎯',
  'Wellness Warrior': '💪',
  Luminary: '✨',
};

const PODIUM_POSITIONS = ['🥇', '🥈', '🥉'];

export const Leaderboard: React.FC<LeaderboardProps> = ({
  topThree,
  allEntries,
  currentUserRank,
  scope,
  timeframe,
  gradeLevel,
  onScopeChange,
  onTimeframeChange,
}) => {
  const [showPrivacyToggle, setShowPrivacyToggle] = useState(false);
  const [isPrivate, setIsPrivate] = useState(false);
  const isK5 = gradeLevel && parseInt(gradeLevel) <= 5;

  const handlePrivacyToggle = () => {
    setIsPrivate(!isPrivate);
    // TODO: Save privacy preference to API
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white flex items-center gap-2">
            <Users className="w-6 h-6" />
            Leaderboard
          </h2>
          {!isK5 && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setShowPrivacyToggle(!showPrivacyToggle)}
              className="gap-2"
            >
              {isPrivate ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              {isPrivate ? 'Private' : 'Public'}
            </Button>
          )}
        </div>

        {/* K-5 Special Message */}
        {isK5 && (
          <motion.div
            className="bg-gradient-to-r from-pink-500/20 to-purple-500/20 border border-pink-500/30 rounded-lg p-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-sm text-pink-200">
              ✨ Everyone is a star! Celebrate your learning journey.
            </p>
          </motion.div>
        )}
      </div>

      {/* Filters */}
      <div className="space-y-4">
        {/* Scope Tabs */}
        <div>
          <p className="text-xs font-semibold text-white/70 uppercase mb-2">Scope</p>
          <div className="flex gap-2">
            {SCOPE_OPTIONS.map((opt) => (
              <Button
                key={opt}
                variant={scope === opt ? 'default' : 'secondary'}
                size="sm"
                onClick={() => onScopeChange?.(opt)}
                className="capitalize"
              >
                {opt}
              </Button>
            ))}
          </div>
        </div>

        {/* Timeframe Tabs */}
        <div>
          <p className="text-xs font-semibold text-white/70 uppercase mb-2">Time Period</p>
          <div className="flex gap-2">
            {TIMEFRAME_OPTIONS.map((opt) => (
              <Button
                key={opt}
                variant={timeframe === opt ? 'default' : 'secondary'}
                size="sm"
                onClick={() => onTimeframeChange?.(opt)}
                className="capitalize"
              >
                {opt === 'all' ? 'All Time' : `This ${opt === 'week' ? 'Week' : 'Month'}`}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Top 3 Podium */}
      {topThree.length > 0 && (
        <motion.div
          className="relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="grid grid-cols-3 gap-2 md:gap-4">
            {topThree.map((entry, index) => (
              <motion.div
                key={entry.studentId}
                className={`relative ${index === 0 ? 'md:order-2 md:scale-110' : index === 1 ? 'md:order-1' : 'md:order-3'}`}
                animate={index === 0 ? { y: [0, -10, 0] } : {}}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {/* Card */}
                <div className={`bg-gradient-to-br rounded-xl p-4 text-center space-y-3 border-2 ${
                  index === 0
                    ? 'from-yellow-500/20 to-orange-500/20 border-yellow-400/50 shadow-lg shadow-yellow-400/20'
                    : index === 1
                      ? 'from-gray-400/20 to-gray-500/20 border-gray-400/50 shadow-lg shadow-gray-400/20'
                      : 'from-orange-600/20 to-orange-700/20 border-orange-600/50 shadow-lg shadow-orange-600/20'
                }`}>
                  {/* Medal */}
                  <motion.div
                    className="text-4xl"
                    animate={index === 0 ? { rotate: [0, -5, 5, 0] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    {PODIUM_POSITIONS[index]}
                  </motion.div>

                  {/* Avatar */}
                  <div className="flex justify-center">
                    <Avatar className="w-12 h-12">
                      {entry.avatarUrl && <AvatarImage src={entry.avatarUrl} />}
                      <AvatarFallback>{entry.studentName?.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </div>

                  {/* Name */}
                  <div>
                    <p className="font-bold text-white text-sm">
                      {isPrivate && !entry.isCurrentUser ? 'Anonymous' : entry.studentName}
                    </p>
                    <p className="text-xs text-white/60">
                      {TIER_ICONS[entry.tier] || '🎮'} {entry.tier}
                    </p>
                  </div>

                  {/* Stats */}
                  <div className="pt-2 border-t border-white/10">
                    <p className="text-2xl font-bold text-white">{entry.xp.toLocaleString()}</p>
                    <p className="text-xs text-white/60">XP</p>
                  </div>

                  {/* Current User Badge */}
                  {entry.isCurrentUser && (
                    <motion.div
                      className="absolute top-2 right-2 bg-green-500/30 border border-green-500/50 rounded-full px-2 py-1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', damping: 8 }}
                    >
                      <span className="text-xs font-bold text-green-300">You</span>
                    </motion.div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Full Leaderboard List */}
      <motion.div
        className="space-y-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <p className="text-xs font-semibold text-white/70 uppercase">Full Rankings</p>

        {allEntries.length > 0 ? (
          <div className="space-y-1 max-h-96 overflow-y-auto">
            <AnimatePresence>
              {allEntries.map((entry, index) => (
                <motion.div
                  key={entry.studentId}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                    entry.isCurrentUser
                      ? 'bg-green-500/10 border-green-500/30 ring-2 ring-green-500/20'
                      : 'bg-white/5 border-white/10 hover:bg-white/10'
                  }`}
                  whileHover={{ x: 4 }}
                >
                  {/* Rank */}
                  <div className="flex-shrink-0 w-8 text-center">
                    <span className="text-lg font-bold text-amber-300">
                      #{index + 1}
                    </span>
                  </div>

                  {/* Avatar */}
                  <Avatar className="w-8 h-8 flex-shrink-0">
                    {entry.avatarUrl && <AvatarImage src={entry.avatarUrl} />}
                    <AvatarFallback>{entry.studentName?.slice(0, 2).toUpperCase()}</AvatarFallback>
                  </Avatar>

                  {/* Name and Tier */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-white text-sm truncate">
                      {isPrivate && !entry.isCurrentUser ? 'Anonymous' : entry.studentName}
                    </p>
                    <p className="text-xs text-white/60">
                      {TIER_ICONS[entry.tier] || '🎮'} Level {entry.level}
                    </p>
                  </div>

                  {/* XP */}
                  <div className="flex-shrink-0 text-right">
                    <p className="font-bold text-yellow-300">
                      {entry.xp.toLocaleString()}
                    </p>
                    <p className="text-xs text-white/60">XP</p>
                  </div>

                  {/* Current User Badge */}
                  {entry.isCurrentUser && (
                    <motion.div
                      className="flex-shrink-0 bg-green-500/30 border border-green-500/50 rounded px-2 py-1"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    >
                      <span className="text-xs font-bold text-green-300">You</span>
                    </motion.div>
                  )}
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        ) : (
          <div className="text-center py-8">
            <p className="text-white/60">No data available</p>
          </div>
        )}
      </motion.div>

      {/* Current User Position (if not in top 3) */}
      {currentUserRank && !topThree.find((e) => e.isCurrentUser) && (
        <motion.div
          className="bg-green-500/10 border-2 border-green-500/30 rounded-lg p-4"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white">Your Position</p>
              <p className="text-xs text-white/70 mt-1">
                Rank #{currentUserRank.rank} · {currentUserRank.xp.toLocaleString()} XP
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-green-300 font-bold">
                {TIER_ICONS[currentUserRank.tier] || '🎮'}
              </p>
              <p className="text-xs text-green-300">Level {currentUserRank.level}</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};
