'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronLeft, ChevronRight, Home, BookOpen, FileText, Crown, Trophy, MessageCircle, PieChart } from 'lucide-react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { UserRole } from '@/types';
import { NAV_ITEMS } from '@/config/constants';
import type { DashboardVariant } from '@/hooks/useGradeLevel';

/* ── K-5 Friendly Nav Items ─────────────────────────── */

const K5_NAV_ITEMS: Array<{
  label: string;
  shortLabel: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  emoji: string;
  color: string;
}> = [
  { label: 'Home', shortLabel: 'Home', href: '/student/dashboard', icon: Home, emoji: '\uD83C\uDFE0', color: 'from-blue-400 to-indigo-500' },
  { label: 'Classes', shortLabel: 'Class', href: '/student/classes', icon: BookOpen, emoji: '\uD83D\uDCDA', color: 'from-purple-400 to-violet-500' },
  { label: 'Tasks', shortLabel: 'Tasks', href: '/student/assignments', icon: FileText, emoji: '\uD83D\uDCDD', color: 'from-green-400 to-emerald-500' },
  { label: 'My Pet', shortLabel: 'Pet', href: '/student/pet', icon: Crown, emoji: '\uD83D\uDC3E', color: 'from-amber-400 to-orange-500' },
  { label: 'Awards', shortLabel: 'Awards', href: '/student/achievements', icon: Trophy, emoji: '\uD83C\uDFC6', color: 'from-yellow-400 to-amber-500' },
  { label: 'Chat', shortLabel: 'Chat', href: '/student/messages', icon: MessageCircle, emoji: '\uD83D\uDCAC', color: 'from-pink-400 to-rose-500' },
];

export interface SidebarProps {
  isCollapsed: boolean;
  onCollapsedChange: (collapsed: boolean) => void;
  userRole: UserRole;
  userLevel?: number;
  userXP?: number;
  gradeVariant?: DashboardVariant;
}

export function Sidebar({
  isCollapsed,
  onCollapsedChange,
  userRole,
  userLevel = 1,
  userXP = 0,
  gradeVariant,
}: SidebarProps) {
  const pathname = usePathname();
  const navItems = NAV_ITEMS[userRole] || [];
  const isK5 = gradeVariant === 'k5' && userRole === 'student';

  const isActive = (href: string) => {
    return pathname === href || pathname.startsWith(href + '/');
  };

  return (
    <motion.aside
      animate={{ width: isCollapsed ? 72 : 280 }}
      transition={{ duration: 0.3 }}
      className={cn(
        'fixed left-0 top-0 h-screen flex flex-col border-r',
        'glass backdrop-blur-xl border-white/30 dark:border-slate-800/50',
        'z-40 shadow-lg',
        isK5
          ? 'bg-gradient-to-b from-white/80 via-blue-50/60 to-purple-50/60 dark:from-slate-900/80 dark:via-indigo-950/40 dark:to-purple-950/40'
          : 'bg-white/70 dark:bg-slate-900/70'
      )}
    >
      {/* Logo / Branding */}
      <div className={cn(
        'flex items-center justify-center border-b border-white/20 dark:border-slate-800/30',
        'p-4 transition-all duration-300',
        isCollapsed ? 'py-4' : 'py-6'
      )}>
        {!isCollapsed ? (
          <Link href="/" className="flex items-center gap-2">
            <div className={cn(
              'flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600',
              isK5 && 'h-12 w-12 rounded-2xl'
            )}>
              <span className={cn('text-xl font-bold text-white', isK5 && 'text-2xl')}>W</span>
            </div>
            <span className={cn(
              'text-lg font-bold text-slate-900 dark:text-white',
              isK5 && 'text-xl font-display'
            )}>
              Wolf Whale
            </span>
          </Link>
        ) : (
          <Link href="/" className={cn(
            'flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600',
            isK5 && 'h-12 w-12 rounded-2xl'
          )}>
            <span className={cn('text-lg font-bold text-white', isK5 && 'text-xl')}>W</span>
          </Link>
        )}
      </div>

      {/* Navigation Items */}
      <nav className={cn(
        'flex-1 overflow-y-auto px-3 py-4',
        isK5 ? 'space-y-2' : 'space-y-1'
      )}>
        {isK5 ? (
          /* ── K-5 Large Icon Nav ──────────────────────── */
          K5_NAV_ITEMS.map((item) => {
            const active = isActive(item.href);
            const Icon = item.icon;

            return (
              <Link key={item.href} href={item.href}>
                <motion.button
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className={cn(
                    'relative w-full flex items-center gap-3 rounded-2xl transition-all duration-200',
                    isCollapsed ? 'justify-center p-3' : 'px-4 py-3',
                    active
                      ? 'bg-white dark:bg-slate-800 shadow-lg ring-2 ring-indigo-300 dark:ring-indigo-700'
                      : 'hover:bg-white/60 dark:hover:bg-slate-800/40'
                  )}
                >
                  {/* Icon Container */}
                  <div className={cn(
                    'flex items-center justify-center rounded-xl flex-shrink-0',
                    isCollapsed ? 'w-10 h-10' : 'w-12 h-12',
                    active
                      ? `bg-gradient-to-br ${item.color} shadow-md`
                      : 'bg-slate-100 dark:bg-slate-800'
                  )}>
                    {isCollapsed ? (
                      <Icon className={cn(
                        'w-5 h-5',
                        active ? 'text-white' : 'text-slate-500 dark:text-slate-400'
                      )} />
                    ) : (
                      <span className={cn(
                        'text-2xl',
                        !active && 'grayscale-[50%] opacity-70'
                      )}>{item.emoji}</span>
                    )}
                  </div>

                  {/* Label */}
                  {!isCollapsed && (
                    <span className={cn(
                      'text-base font-semibold',
                      active
                        ? 'text-slate-900 dark:text-white'
                        : 'text-slate-600 dark:text-slate-400'
                    )}>
                      {item.label}
                    </span>
                  )}
                </motion.button>
              </Link>
            );
          })
        ) : (
          /* ── Standard 6-12 Nav ───────────────────────── */
          navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href);

            return (
              <Link key={item.href} href={item.href}>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={cn(
                    'relative w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                    active
                      ? 'bg-indigo-100 dark:bg-indigo-900/40 text-indigo-900 dark:text-indigo-100 shadow-md'
                      : 'text-slate-700 dark:text-slate-300 hover:bg-white/50 dark:hover:bg-slate-800/50',
                    isCollapsed && 'justify-center px-0'
                  )}
                >
                  {active && !isCollapsed && (
                    <motion.div
                      layoutId="active-indicator"
                      className="absolute inset-0 rounded-xl bg-gradient-to-r from-indigo-500/20 to-purple-500/20"
                    />
                  )}
                  <Icon className={cn('h-5 w-5 flex-shrink-0', active && 'text-indigo-600 dark:text-indigo-400')} />
                  {!isCollapsed && (
                    <>
                      <span className="relative flex-1 text-left">{item.label}</span>
                      {item.badge && (
                        <Badge variant="secondary" size="sm">
                          {item.badge}
                        </Badge>
                      )}
                    </>
                  )}
                </motion.button>
              </Link>
            );
          })
        )}
      </nav>

      {/* Level/XP Bar (Student Only) */}
      {userRole === 'student' && !isCollapsed && (
        <div className={cn(
          'border-t border-white/20 dark:border-slate-800/30 p-4 space-y-2',
          isK5 && 'p-5'
        )}>
          <div className="flex items-center justify-between">
            <span className={cn(
              'font-semibold text-slate-700 dark:text-slate-300',
              isK5 ? 'text-sm' : 'text-xs'
            )}>Level</span>
            <Badge variant="level" size={isK5 ? 'lg' : 'sm'}>
              {userLevel}
            </Badge>
          </div>
          <div className="space-y-1">
            <div className={cn(
              'flex justify-between text-slate-600 dark:text-slate-400',
              isK5 ? 'text-sm' : 'text-xs'
            )}>
              <span>XP</span>
              <span>{userXP.toLocaleString()}</span>
            </div>
            <div className={cn(
              'rounded-full bg-slate-200 dark:bg-slate-700',
              isK5 ? 'h-3' : 'h-2'
            )}>
              <div
                className={cn(
                  'h-full rounded-full bg-gradient-to-r from-gold-400 to-gold-500',
                  isK5 && 'shadow-sm'
                )}
                style={{ width: `${(userXP % 500) / 5}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Collapse Button */}
      <div className="border-t border-white/20 dark:border-slate-800/30 p-3">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => onCollapsedChange(!isCollapsed)}
          className="w-full"
        >
          {isCollapsed ? (
            <ChevronRight className="h-5 w-5" />
          ) : (
            <ChevronLeft className="h-5 w-5" />
          )}
        </Button>
      </div>
    </motion.aside>
  );
}
