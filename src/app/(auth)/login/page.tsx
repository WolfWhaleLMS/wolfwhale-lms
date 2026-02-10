import type { Metadata } from 'next';
import Link from 'next/link';
import { LoginForm } from '@/components/auth/LoginForm';

export const metadata: Metadata = {
  title: 'Sign In',
  description: 'Sign in to your Wolf Whale LMS account',
};

export default function LoginPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white font-display">Welcome Back</h2>
        <p className="text-sm text-blue-200/70">
          Sign in to continue your learning adventure
        </p>
      </div>

      {/* Login form */}
      <LoginForm />

      {/* Forgot password link */}
      <div className="text-center">
        <Link
          href="/forgot-password"
          className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
        >
          Forgot your password?
        </Link>
      </div>

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-transparent px-4 text-blue-200/50">New to Wolf Whale LMS?</span>
        </div>
      </div>

      {/* Register link */}
      <div className="text-center">
        <Link
          href="/register"
          className="inline-block w-full py-2.5 px-4 rounded-lg font-semibold border border-white/20 text-white hover:bg-white/5 transition-all text-center"
        >
          Create an Account
        </Link>
      </div>
    </div>
  );
}
