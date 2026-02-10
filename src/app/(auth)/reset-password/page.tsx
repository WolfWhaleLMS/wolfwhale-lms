import type { Metadata } from 'next';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { ResetPasswordForm } from '@/components/auth/ResetPasswordForm';

export const metadata: Metadata = {
  title: 'Reset Password',
  description: 'Set a new password for your Wolf Whale LMS account',
};

export default function ResetPasswordPage() {
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
        <h2 className="text-2xl font-bold text-white font-display">Reset Your Password</h2>
        <p className="text-sm text-blue-200/70">
          Choose a strong password to keep your account secure.
        </p>
      </div>

      {/* Reset password form */}
      <ResetPasswordForm />

      {/* Login link */}
      <div className="text-center">
        <Link
          href="/login"
          className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
        >
          Return to sign in
        </Link>
      </div>
    </div>
  );
}
