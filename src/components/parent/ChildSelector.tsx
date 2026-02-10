'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/Avatar';
import { cn } from '@/lib/utils';

export interface ChildOption {
  id: string;
  firstName: string;
  lastName: string;
  gradeLevel: string;
  avatarUrl: string | null;
  gpa: number;
}

interface ChildSelectorProps {
  children: ChildOption[];
  selectedChildId: string;
  onSelect: (childId: string) => void;
  className?: string;
}

export function ChildSelector({ children, selectedChildId, onSelect, className }: ChildSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedChild = children.find((c) => c.id === selectedChildId);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!selectedChild) return null;

  return (
    <div ref={containerRef} className={cn('relative', className)}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'flex items-center gap-3 px-4 py-3 rounded-2xl w-full md:w-auto',
          'glass backdrop-blur-xl bg-white/80 dark:bg-slate-800/60',
          'border-2 border-emerald-200/60 dark:border-emerald-700/40',
          'hover:border-emerald-400 dark:hover:border-emerald-500',
          'transition-all duration-200 shadow-sm hover:shadow-md',
          isOpen && 'border-emerald-500 dark:border-emerald-400 shadow-md'
        )}
      >
        <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
          Viewing
        </span>
        <div className="flex items-center gap-2.5">
          <Avatar size="sm">
            <AvatarImage src={selectedChild.avatarUrl || undefined} />
            <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-xs">
              {selectedChild.firstName[0]}
              {selectedChild.lastName[0]}
            </AvatarFallback>
          </Avatar>
          <div className="text-left">
            <p className="font-semibold text-slate-900 dark:text-white text-sm leading-tight">
              {selectedChild.firstName} {selectedChild.lastName}
            </p>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Grade {selectedChild.gradeLevel}
            </p>
          </div>
        </div>
        <ChevronDown
          className={cn(
            'w-4 h-4 text-slate-400 transition-transform duration-200',
            isOpen && 'rotate-180'
          )}
        />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.15 }}
            className={cn(
              'absolute top-full left-0 mt-2 w-full md:w-80 z-50',
              'glass backdrop-blur-xl bg-white/95 dark:bg-slate-800/95',
              'border border-white/40 dark:border-slate-700/40',
              'rounded-2xl shadow-xl overflow-hidden'
            )}
          >
            <div className="p-2">
              {children.map((child) => {
                const isSelected = child.id === selectedChildId;
                return (
                  <button
                    key={child.id}
                    onClick={() => {
                      onSelect(child.id);
                      setIsOpen(false);
                    }}
                    className={cn(
                      'w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-150',
                      isSelected
                        ? 'bg-emerald-50 dark:bg-emerald-900/30 border border-emerald-200/60 dark:border-emerald-700/40'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 border border-transparent'
                    )}
                  >
                    <Avatar size="default">
                      <AvatarImage src={child.avatarUrl || undefined} />
                      <AvatarFallback className="bg-gradient-to-br from-emerald-400 to-teal-500 text-white text-sm">
                        {child.firstName[0]}
                        {child.lastName[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-left">
                      <p className="font-semibold text-slate-900 dark:text-white text-sm">
                        {child.firstName} {child.lastName}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        Grade {child.gradeLevel} &middot; GPA {child.gpa.toFixed(1)}
                      </p>
                    </div>
                    {isSelected && (
                      <div className="flex-shrink-0 w-5 h-5 rounded-full bg-emerald-500 flex items-center justify-center">
                        <Check className="w-3 h-3 text-white" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
