import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | Wolf Whale LMS',
    default: 'Authentication | Wolf Whale LMS',
  },
  description: 'Sign in to Wolf Whale LMS - Where Learning Comes Alive',
};

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl" />
      </div>

      {/* Branding header */}
      <div className="relative z-10 mb-8 text-center">
        <div className="flex items-center justify-center gap-3 mb-2">
          <span className="text-4xl" role="img" aria-label="Wolf">
            🐺
          </span>
          <h1 className="text-3xl font-bold font-display bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">
            Wolf Whale LMS
          </h1>
          <span className="text-4xl" role="img" aria-label="Whale">
            🐳
          </span>
        </div>
        <p className="text-sm text-blue-200/70 font-medium">Where Learning Comes Alive</p>
      </div>

      {/* Auth card container */}
      <div className="relative z-10 w-full max-w-md">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-2xl shadow-black/20 p-8">
          {children}
        </div>
      </div>

      {/* Footer */}
      <div className="relative z-10 mt-8 text-center">
        <p className="text-xs text-blue-300/50">
          &copy; {new Date().getFullYear()} Wolf Whale LMS. All rights reserved.
        </p>
      </div>
    </div>
  );
}
