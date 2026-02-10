'use client';

import * as React from 'react';
import { ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/Button';
import { EmptyState } from '../ui/EmptyState';
import { Skeleton } from '../ui/Skeleton';

export type SortDirection = 'asc' | 'desc' | null;

export interface Column<T> {
  key: keyof T;
  label: string;
  sortable?: boolean;
  width?: string;
  render?: (value: any, row: T) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  isLoading?: boolean;
  emptyState?: {
    icon?: React.ReactNode;
    title: string;
    description?: string;
    action?: {
      label: string;
      onClick: () => void;
    };
  };
  onRowClick?: (row: T) => void;
  sortBy?: keyof T | null;
  sortDirection?: SortDirection;
  onSort?: (key: keyof T, direction: SortDirection) => void;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  isLoading = false,
  emptyState,
  onRowClick,
  sortBy,
  sortDirection,
  onSort,
}: DataTableProps<T>) {
  if (isLoading) {
    return (
      <div className="w-full overflow-x-auto rounded-xl">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-slate-700 dark:text-slate-300"
                  style={{ width: column.width }}
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {Array.from({ length: 5 }).map((_, idx) => (
              <tr key={idx} className="border-b border-slate-200 dark:border-slate-700">
                {columns.map((column) => (
                  <td key={String(column.key)} className="px-6 py-4">
                    <Skeleton className="h-4 w-full" />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (data.length === 0) {
    return (
      <EmptyState
        title={emptyState?.title || 'No data found'}
        description={emptyState?.description}
        icon={emptyState?.icon}
        action={emptyState?.action}
      />
    );
  }

  const handleSort = (key: keyof T) => {
    if (!onSort) return;

    let newDirection: SortDirection = 'asc';
    if (sortBy === key && sortDirection === 'asc') {
      newDirection = 'desc';
    } else if (sortBy === key && sortDirection === 'desc') {
      newDirection = null;
    }

    onSort(key, newDirection);
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-white/30 dark:border-slate-700/30 glass backdrop-blur-lg bg-white/50 dark:bg-slate-800/30">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/20 dark:border-slate-700/50 bg-white/20 dark:bg-slate-800/50">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className="px-6 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700 dark:text-slate-300"
                style={{ width: column.width }}
              >
                {column.sortable ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleSort(column.key)}
                    className="h-auto w-full justify-start gap-2 px-0"
                  >
                    {column.label}
                    {sortBy === column.key ? (
                      sortDirection === 'asc' ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )
                    ) : (
                      <ArrowUpDown className="h-4 w-4 opacity-40" />
                    )}
                  </Button>
                ) : (
                  column.label
                )}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr
              key={idx}
              className={cn(
                'border-b border-white/10 dark:border-slate-700/30 transition-colors',
                'hover:bg-white/10 dark:hover:bg-slate-700/20',
                onRowClick && 'cursor-pointer'
              )}
              onClick={() => onRowClick?.(row)}
            >
              {columns.map((column) => (
                <td
                  key={String(column.key)}
                  className="px-6 py-4 text-sm text-slate-900 dark:text-slate-100"
                  style={{ width: column.width }}
                >
                  {column.render ? column.render(row[column.key], row) : row[column.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
