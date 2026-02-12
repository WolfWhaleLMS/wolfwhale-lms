import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-[#00BFFF]/15 text-[#00BFFF] dark:bg-[#00BFFF]/20 dark:text-[#00BFFF]',
        secondary: 'border-transparent bg-[#E8F8FF] text-[#6B8FA3] dark:bg-[#041428] dark:text-[#6B8FA3]',
        destructive: 'border-transparent bg-[#FF3366]/15 text-[#FF3366] dark:bg-[#FF3366]/20 dark:text-[#FF3366]',
        outline: 'text-[#0A2540] dark:text-[#E8F8FF] border-[#00BFFF]/30 dark:border-[#00BFFF]/20',
        xp: 'border-transparent bg-gradient-to-r from-[#33FF33] to-[#00FFFF] text-[#0A2540] shadow-md shadow-[#33FF33]/20',
        achievement: 'border-transparent bg-gradient-to-r from-[#00FFFF] to-[#00BFFF] text-white shadow-md neon-pulse-cyan',
        level: 'border-transparent bg-gradient-to-r from-[#00BFFF] to-[#33FF33] text-white shadow-md',
        streak: 'border-transparent bg-gradient-to-r from-[#FFAA00] to-[#FF3366] text-white shadow-md shadow-[#FFAA00]/20',
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
