import * as React from 'react';
import { cn } from '@/lib/utils';

export interface PageHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
  title: string;
  description?: string;
  action?: React.ReactNode;
}

const PageHeader = React.forwardRef<HTMLDivElement, PageHeaderProps>(
  ({ className, title, description, action, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(
        'mb-8 flex flex-col items-start justify-between gap-4 md:flex-row md:items-center md:gap-0',
        className
      )}
      {...props}
    >
      <div className="flex-1">
        <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">{title}</h1>
        {description && (
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">{description}</p>
        )}
      </div>
      {action && <div className="w-full md:w-auto">{action}</div>}
    </div>
  )
);
PageHeader.displayName = 'PageHeader';

export { PageHeader };
