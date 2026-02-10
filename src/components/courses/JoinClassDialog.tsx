'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/Dialog';
import { Button } from '@/components/ui/Button';
import { Plus, Sparkles, KeyRound } from 'lucide-react';
import { cn } from '@/lib/utils';

interface JoinClassDialogProps {
  variant: 'k5' | '6-12';
}

export function JoinClassDialog({ variant }: JoinClassDialogProps) {
  const [open, setOpen] = useState(false);
  const [code, setCode] = useState<string[]>(['', '', '', '', '', '']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    if (open) {
      setCode(['', '', '', '', '', '']);
      setError('');
      setTimeout(() => inputRefs.current[0]?.focus(), 100);
    }
  }, [open]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) {
      // Handle paste
      const pasted = value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
      const newCode = [...code];
      for (let i = 0; i < 6; i++) {
        newCode[i] = pasted[i] || '';
      }
      setCode(newCode);
      const nextIndex = Math.min(pasted.length, 5);
      inputRefs.current[nextIndex]?.focus();
      return;
    }

    const char = value.toUpperCase().replace(/[^A-Z0-9]/g, '');
    const newCode = [...code];
    newCode[index] = char;
    setCode(newCode);
    setError('');

    if (char && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = () => {
    const fullCode = code.join('');
    if (fullCode.length !== 6) {
      setError('Please enter all 6 characters');
      return;
    }
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setError('Class not found. Check the code and try again.');
    }, 1500);
  };

  const fullCode = code.join('');

  if (variant === 'k5') {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <motion.div
            className="fixed bottom-24 md:bottom-8 right-6 z-30"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <Button
              variant="fun"
              size="lg"
              className="rounded-full h-16 w-16 shadow-2xl text-xl p-0"
            >
              <Plus className="w-7 h-7" />
            </Button>
          </motion.div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-purple-500" />
              Join a Class!
            </DialogTitle>
            <DialogDescription className="text-base">
              Ask your teacher for the secret code, then type it here!
            </DialogDescription>
          </DialogHeader>

          <div className="py-6">
            {/* Code input boxes */}
            <div className="flex justify-center gap-2.5">
              {code.map((char, index) => (
                <motion.input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  maxLength={6}
                  value={char}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  whileFocus={{ scale: 1.1 }}
                  className={cn(
                    'w-12 h-14 text-center text-2xl font-extrabold rounded-xl border-2 transition-all duration-200',
                    'bg-white/60 dark:bg-slate-800/40 focus:outline-none focus:ring-2 focus:ring-purple-500',
                    char
                      ? 'border-purple-400 text-purple-700 dark:text-purple-300 bg-purple-50/50 dark:bg-purple-900/20'
                      : 'border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white',
                    error && 'border-red-400'
                  )}
                />
              ))}
            </div>

            <AnimatePresence>
              {error && (
                <motion.p
                  initial={{ opacity: 0, y: -5 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="text-center text-sm text-red-500 mt-3"
                >
                  {error}
                </motion.p>
              )}
            </AnimatePresence>

            <p className="text-center text-xs text-slate-400 mt-4">
              Example: WOLF42
            </p>
          </div>

          <DialogFooter>
            <Button
              variant="fun"
              className="w-full text-lg py-5 font-bold"
              onClick={handleSubmit}
              disabled={fullCode.length !== 6}
              isLoading={isSubmitting}
            >
              Join Class!
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    );
  }

  // 6-12 variant
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="default" className="gap-2">
          <Plus className="w-4 h-4" />
          Join Class
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <KeyRound className="w-5 h-5 text-indigo-500" />
            Join a Class
          </DialogTitle>
          <DialogDescription>
            Enter the 6-character class code provided by your teacher.
          </DialogDescription>
        </DialogHeader>

        <div className="py-4">
          <div className="flex justify-center gap-2">
            {code.map((char, index) => (
              <input
                key={index}
                ref={(el) => { inputRefs.current[index] = el; }}
                type="text"
                maxLength={6}
                value={char}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                className={cn(
                  'w-11 h-12 text-center text-xl font-mono font-bold rounded-lg border transition-all duration-150',
                  'bg-white/50 dark:bg-slate-800/30 focus:outline-none focus:ring-2 focus:ring-indigo-500',
                  char
                    ? 'border-indigo-400 text-indigo-700 dark:text-indigo-300'
                    : 'border-slate-300 dark:border-slate-600 text-slate-900 dark:text-white',
                  error && 'border-red-400'
                )}
              />
            ))}
          </div>

          <AnimatePresence>
            {error && (
              <motion.p
                initial={{ opacity: 0, y: -5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center text-sm text-red-500 mt-3"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <p className="text-center text-xs text-slate-400 mt-3">
            e.g., WOLF42
          </p>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="ghost" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={fullCode.length !== 6}
            isLoading={isSubmitting}
          >
            Join Class
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
