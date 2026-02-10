'use client';

import * as React from 'react';
import { Search, X } from 'lucide-react';
import { cn, debounce } from '@/lib/utils';
import { Button } from '../ui/Button';

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  onSearch?: (value: string) => void;
  debounceMs?: number;
  showShortcut?: boolean;
}

export const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, onSearch, debounceMs = 300, showShortcut = false, ...props }, ref) => {
    const [value, setValue] = React.useState('');

    const debouncedSearch = React.useMemo(
      () => debounce((query: string) => onSearch?.(query), debounceMs),
      [onSearch, debounceMs]
    );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value;
      setValue(newValue);
      debouncedSearch(newValue);
    };

    const handleClear = () => {
      setValue('');
      onSearch?.('');
    };

    return (
      <div className="relative flex-1">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
        <input
          ref={ref}
          type="text"
          placeholder="Search..."
          value={value}
          onChange={handleChange}
          className={cn(
            'h-10 w-full rounded-xl border px-10 py-2 text-sm transition-all duration-200',
            'glass backdrop-blur-md bg-white/50 dark:bg-slate-800/30 border-white/40 dark:border-slate-700/40',
            'placeholder:text-slate-400 dark:placeholder:text-slate-500',
            'focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent focus:bg-white/70 dark:focus:bg-slate-800/50',
            className
          )}
          {...props}
        />
        {showShortcut && !value && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">cmd+K</span>
        )}
        {value && (
          <Button
            variant="ghost"
            size="icon"
            onClick={handleClear}
            className="absolute right-1 top-1/2 h-8 w-8 -translate-y-1/2"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    );
  }
);
SearchInput.displayName = 'SearchInput';
