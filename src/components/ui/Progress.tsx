'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const progressVariants = cva('h-3 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700', {
  variants: {
    variant: {
      default: '',
      xp: '',
      health: '',
      energy: '',
      happiness: '',
      knowledge: '',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

const indicatorVariants = cva('h-full w-full flex-1 transition-all', {
  variants: {
    variant: {
      default: 'bg-indigo-600',
      xp: 'bg-gradient-to-r from-gold-400 to-gold-500 animate-shimmer',
      health: 'bg-gradient-to-r from-success-400 to-success-600',
      energy: 'bg-gradient-to-r from-ocean-400 to-ocean-600',
      happiness: 'bg-gradient-to-r from-pink-400 to-pink-600',
      knowledge: 'bg-gradient-to-r from-aurora-400 to-aurora-600',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface ProgressProps
  extends React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>,
    VariantProps<typeof progressVariants> {}

const Progress = React.forwardRef<React.ElementRef<typeof ProgressPrimitive.Root>, ProgressProps>(
  ({ className, value, variant, ...props }, ref) => (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn(progressVariants({ variant }), className)}
      {...props}
      aria-label={`Progress: ${value}%`}
    >
      <ProgressPrimitive.Indicator
        className={cn(indicatorVariants({ variant }))}
        style={{ transform: `translateX(-${100 - (value || 0)}%)` }}
      />
    </ProgressPrimitive.Root>
  )
);
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
