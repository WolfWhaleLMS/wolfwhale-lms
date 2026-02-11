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
          'liquid-glass-elevated rounded-xl',
      }}
    />
  );
}
