'use client';

import { useEffect } from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-orange-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-white/20 dark:border-slate-700/20 rounded-3xl p-8 md:p-12 max-w-2xl w-full shadow-2xl">
        <div className="text-center">
          {/* Error Icon */}
          <div className="mb-6 flex justify-center">
            <div className="bg-red-100 dark:bg-red-900/30 p-4 rounded-full">
              <AlertCircle className="w-12 h-12 text-red-600 dark:text-red-400" />
            </div>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold font-display text-slate-900 dark:text-white mb-4">
            Oops! Something Went Wrong
          </h1>

          <p className="text-lg text-slate-600 dark:text-slate-300 mb-6">
            {error.message ||
              'An unexpected error occurred. Our team has been notified and we are working on a fix.'}
          </p>

          {error.digest && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 font-mono bg-slate-100 dark:bg-slate-900 p-3 rounded text-xs break-all">
              Error ID: {error.digest}
            </p>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => reset()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <RefreshCw className="w-5 h-5" />
              <span>Try Again</span>
            </button>
            <a
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-200"
            >
              <span>Go Home</span>
            </a>
          </div>

          {/* Support Information */}
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">
              Need help? Contact our support team at{' '}
              <a
                href="mailto:support@wolfwhale-lms.com"
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline font-medium"
              >
                support@wolfwhale-lms.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
