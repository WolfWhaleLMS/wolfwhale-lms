import { cn } from '@/lib/utils';

function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-lg bg-gradient-to-r from-slate-200 dark:from-slate-700 via-slate-100 dark:via-slate-600 to-slate-200 dark:to-slate-700',
        'bg-[length:200px_100%] animate-shimmer',
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
