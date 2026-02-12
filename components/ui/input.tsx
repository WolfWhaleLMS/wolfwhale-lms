import * as React from 'react';
import { cn } from '@/lib/utils';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
  label?: string;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, error, label, id, ...props }, ref) => (
    <div className="w-full">
      {label && (
        <label htmlFor={id} className="block text-sm font-medium text-[#0A2540] dark:text-[#E8F8FF] mb-2">
          {label}
        </label>
      )}
      <input
        type={type}
        id={id}
        className={cn(
          'flex h-10 w-full rounded-xl border px-3 py-2 text-sm transition-all duration-200',
          'glass backdrop-blur-md bg-white/30 dark:bg-white/5 border-[#00BFFF]/20 dark:border-[#00BFFF]/15',
          'placeholder:text-[#6B8FA3] dark:placeholder:text-[#6B8FA3]/60',
          'focus:outline-none focus:ring-2 focus:ring-[#00BFFF]/30 focus:border-[#00BFFF]/50 focus:bg-white/50 dark:focus:bg-white/10',
          'disabled:cursor-not-allowed disabled:opacity-50',
          error && 'border-red-500 focus:ring-red-500',
          className
        )}
        ref={ref}
        {...props}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  )
);
Input.displayName = 'Input';

export { Input };
