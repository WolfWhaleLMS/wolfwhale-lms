'use client';

import React from 'react';
import { ThemeProvider } from './ThemeProvider';
import { QueryProvider } from './QueryProvider';
import { AuthProvider } from './AuthProvider';

/**
 * Root providers composition.
 * Wraps the application with all necessary providers in the correct order.
 * Order matters:
 * 1. ThemeProvider - for styling
 * 2. QueryProvider - for data management
 * 3. AuthProvider - for authentication
 */
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider>
      <QueryProvider>
        <AuthProvider>
          {children}
        </AuthProvider>
      </QueryProvider>
    </ThemeProvider>
  );
}
