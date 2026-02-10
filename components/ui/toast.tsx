'use client';

import { Toaster } from 'sonner';

export function Toast() {
  return (
    <Toaster
      position="top-right"
      expand
      richColors
      theme="system"
      closeButton
      visibleToasts={3}
      toastOptions={{
        className:
          'glass backdrop-blur-lg bg-white/90 dark:bg-slate-900/90 border border-white/40 dark:border-slate-700/40 rounded-xl shadow-lg',
      }}
    />
  );
}
