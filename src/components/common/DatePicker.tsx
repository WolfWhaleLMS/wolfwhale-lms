import * as React from 'react';
import { Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '../ui/Input';

export interface DatePickerProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
}

const DatePicker = React.forwardRef<HTMLInputElement, DatePickerProps>(
  ({ className, label, error, ...props }, ref) => (
    <div className="relative">
      {label && (
        <label htmlFor={props.id} className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        <Input
          ref={ref}
          type="date"
          className={cn('pr-10', className)}
          {...props}
          error={error}
        />
        <Calendar className="absolute right-3 top-3 h-5 w-5 text-slate-400 pointer-events-none" />
      </div>
    </div>
  )
);
DatePicker.displayName = 'DatePicker';

export { DatePicker };
