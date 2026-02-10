import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface LoadingSpinnerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: 'sm' | 'default' | 'lg';
  label?: string;
}

export function LoadingSpinner({ className, size = 'default', label, ...props }: LoadingSpinnerProps) {
  const sizeMap = {
    sm: 'h-6 w-6',
    default: 'h-10 w-10',
    lg: 'h-16 w-16',
  };

  return (
    <div className={cn('flex flex-col items-center justify-center gap-3', className)} {...props}>
      <Loader2 className={cn('animate-spin text-indigo-600 dark:text-indigo-400', sizeMap[size])} />
      {label && <p className="text-sm text-slate-600 dark:text-slate-400">{label}</p>}
    </div>
  );
}
