import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
        secondary: 'border-transparent bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-300',
        destructive: 'border-transparent bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
        outline: 'text-slate-700 dark:text-slate-300 border-slate-300 dark:border-slate-600',
        xp: 'border-transparent bg-gradient-to-r from-gold-400 to-gold-500 text-gold-900 dark:from-gold-600 dark:to-gold-700 dark:text-gold-100 shadow-md',
        achievement: 'border-transparent bg-gradient-to-r from-purple-400 to-pink-400 text-white dark:from-purple-600 dark:to-pink-600 shadow-md animate-pulse',
        level: 'border-transparent bg-gradient-to-r from-indigo-500 to-purple-600 text-white shadow-md',
        streak: 'border-transparent bg-gradient-to-r from-orange-400 to-red-500 text-white dark:from-orange-600 dark:to-red-700 shadow-md',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        default: 'px-2.5 py-0.5 text-xs',
        lg: 'px-3 py-1 text-sm',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, size, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant, size }), className)} {...props} />;
}

export { Badge, badgeVariants };
