'use client';

import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const progressVariants = cva('h-3 w-full overflow-hidden rounded-full bg-[#00BFFF]/10 dark:bg-[#00BFFF]/15', {
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
      default: 'bg-[#00BFFF] shadow-[0_0_10px_rgba(0,191,255,0.4)]',
      xp: 'bg-[#33FF33] shadow-[0_0_10px_rgba(51,255,51,0.4)] animate-shimmer',
      health: 'bg-gradient-to-r from-[#33FF33] to-[#00FFFF]',
      energy: 'bg-gradient-to-r from-[#00BFFF] to-[#00FFFF]',
      happiness: 'bg-gradient-to-r from-[#FF3366] to-[#FFAA00]',
      knowledge: 'bg-gradient-to-r from-[#00FFFF] to-[#33FF33]',
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
