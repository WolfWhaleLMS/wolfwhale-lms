import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';
import { cn } from '@/lib/utils';

const cardVariants = cva('rounded-2xl transition-all duration-200', {
  variants: {
    variant: {
      default: 'liquid-glass liquid-glass-hover',
      solid: 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700',
      fun: 'liquid-glass bg-gradient-to-br from-[#00BFFF]/15 via-[#33FF33]/10 to-[#00FFFF]/15 dark:from-[#00BFFF]/10 dark:via-[#33FF33]/8 dark:to-[#00FFFF]/10 border-2 border-[#00BFFF]/25 dark:border-[#00BFFF]/15 rounded-3xl',
      pet: 'liquid-glass relative bg-gradient-to-br from-[#FFAA00]/15 to-[#FFD700]/15 dark:from-[#FFAA00]/10 dark:to-[#FFD700]/10 border-2 border-[#FFAA00]/25 dark:border-[#FFAA00]/15 rounded-3xl overflow-hidden',
    },
  },
  defaultVariants: {
    variant: 'default',
  },
});

export interface CardProps extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof cardVariants> {}

const Card = React.forwardRef<HTMLDivElement, CardProps>(
  ({ className, variant, ...props }, ref) => (
    <div ref={ref} className={cn(cardVariants({ variant }), className)} {...props} />
  )
);
Card.displayName = 'Card';

const CardHeader = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex flex-col space-y-1.5 p-6', className)} {...props} />
  )
);
CardHeader.displayName = 'CardHeader';

const CardTitle = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLHeadingElement>>(
  ({ className, ...props }, ref) => (
    <h2
      ref={ref}
      className={cn('text-2xl font-semibold leading-none tracking-tight text-[#0A2540] dark:text-[#E8F8FF] font-display', className)}
      {...props}
    />
  )
);
CardTitle.displayName = 'CardTitle';

const CardDescription = React.forwardRef<HTMLParagraphElement, React.HTMLAttributes<HTMLParagraphElement>>(
  ({ className, ...props }, ref) => (
    <p ref={ref} className={cn('text-sm text-muted-foreground', className)} {...props} />
  )
);
CardDescription.displayName = 'CardDescription';

const CardContent = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => <div ref={ref} className={cn('p-6 pt-0', className)} {...props} />
);
CardContent.displayName = 'CardContent';

const CardFooter = React.forwardRef<HTMLDivElement, React.HTMLAttributes<HTMLDivElement>>(
  ({ className, ...props }, ref) => (
    <div ref={ref} className={cn('flex items-center p-6 pt-0', className)} {...props} />
  )
);
CardFooter.displayName = 'CardFooter';

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent };
