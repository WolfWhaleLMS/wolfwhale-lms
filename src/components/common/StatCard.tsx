import * as React from 'react';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '../ui/Card';

export interface StatCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  variant?: 'default' | 'xp' | 'coins' | 'achievement' | 'health';
  className?: string;
}

const variantStyles = {
  default: 'bg-gradient-to-br from-indigo-100/50 to-purple-100/50 dark:from-indigo-900/20 dark:to-purple-900/20',
  xp: 'bg-gradient-to-br from-gold-100/50 to-orange-100/50 dark:from-gold-900/20 dark:to-orange-900/20',
  coins: 'bg-gradient-to-br from-yellow-100/50 to-amber-100/50 dark:from-yellow-900/20 dark:to-amber-900/20',
  achievement: 'bg-gradient-to-br from-pink-100/50 to-purple-100/50 dark:from-pink-900/20 dark:to-purple-900/20',
  health: 'bg-gradient-to-br from-success-100/50 to-green-100/50 dark:from-success-900/20 dark:to-green-900/20',
};

const iconColorStyles = {
  default: 'text-indigo-600 dark:text-indigo-400',
  xp: 'text-gold-600 dark:text-gold-400',
  coins: 'text-yellow-600 dark:text-yellow-400',
  achievement: 'text-pink-600 dark:text-pink-400',
  health: 'text-success-600 dark:text-success-400',
};

export function StatCard({
  label,
  value,
  icon,
  trend,
  variant = 'default',
  className,
}: StatCardProps) {
  return (
    <Card className={cn('overflow-hidden', variantStyles[variant], className)}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-600 dark:text-slate-400">{label}</p>
            <p className="mt-2 text-3xl font-bold text-slate-900 dark:text-white">{value}</p>
            {trend && (
              <div
                className={cn(
                  'mt-2 inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-semibold',
                  trend.isPositive
                    ? 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300'
                    : 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-300'
                )}
              >
                {trend.isPositive ? (
                  <ArrowUp className="h-3 w-3" />
                ) : (
                  <ArrowDown className="h-3 w-3" />
                )}
                {trend.value}%
              </div>
            )}
          </div>
          {icon && (
            <div
              className={cn(
                'rounded-full p-3',
                'bg-white/50 dark:bg-slate-800/50',
                iconColorStyles[variant]
              )}
            >
              {icon}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
