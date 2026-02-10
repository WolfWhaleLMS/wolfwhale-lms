'use client';

import Link from 'next/link';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center p-4">
      <div className="backdrop-blur-xl bg-white/80 dark:bg-slate-800/80 border border-white/20 dark:border-slate-700/20 rounded-3xl p-8 md:p-12 max-w-2xl w-full shadow-2xl">
        <div className="text-center">
          {/* Playful 404 Illustration */}
          <div className="mb-8 text-8xl">
            <span className="inline-block animate-bounce" style={{ animationDelay: '0s' }}>
              🐺
            </span>
            <span className="inline-block mx-4 text-6xl">404</span>
            <span className="inline-block animate-bounce" style={{ animationDelay: '0.2s' }}>
              🐳
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-bold font-display text-slate-900 dark:text-white mb-4">
            Page Not Found
          </h1>

          <p className="text-xl text-slate-600 dark:text-slate-300 mb-2">
            Oops! Our wolf and whale friends couldn't find this page.
          </p>

          <p className="text-slate-500 dark:text-slate-400 mb-8">
            It seems the page you're looking for has swum away or wandered off into the wilderness.
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg font-semibold hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <Home className="w-5 h-5" />
              <span>Go Home</span>
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white rounded-lg font-semibold hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-200"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Go Back</span>
            </button>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-slate-200 dark:border-slate-700">
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4">Helpful links:</p>
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/login"
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline text-sm"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline text-sm"
              >
                Register
              </Link>
              <Link
                href="/dashboard"
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 underline text-sm"
              >
                Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
