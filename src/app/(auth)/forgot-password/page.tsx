import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export const metadata: Metadata = {
  title: 'Forgot Password',
  description: 'Reset your Wolf Whale LMS account password',
};

export default function ForgotPasswordPage() {
  return (
    <div className="space-y-6">
      {/* Back to login */}
      <Link
        href="/login"
        className="inline-flex items-center gap-2 text-sm text-blue-200/70 hover:text-cyan-400 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to sign in
      </Link>

      {/* Page header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white font-display">Forgot Password?</h2>
        <p className="text-sm text-blue-200/70">
          No worries! Enter your email and we&apos;ll send you a reset link.
        </p>
      </div>

      {/* Forgot password form */}
      <ForgotPasswordForm />

      {/* Login link */}
      <div className="text-center">
        <Link
          href="/login"
          className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
        >
          Remember your password? Sign in
        </Link>
      </div>
    </div>
  );
}
