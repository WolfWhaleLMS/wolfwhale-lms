import type { Metadata } from 'next';
import Link from 'next/link';
import { RegisterForm } from '@/components/auth/RegisterForm';

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create your Wolf Whale LMS account and start your learning journey',
};

export default function RegisterPage() {
  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold text-white font-display">Create Your Account</h2>
        <p className="text-sm text-blue-200/70">
          Join the adventure and start learning today
        </p>
      </div>

      {/* Registration form */}
      <RegisterForm />

      {/* Divider */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/10" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="bg-transparent px-4 text-blue-200/50">Already have an account?</span>
        </div>
      </div>

      {/* Login link */}
      <div className="text-center">
        <Link
          href="/login"
          className="text-sm text-cyan-400 hover:text-cyan-300 transition-colors font-medium"
        >
          Sign in instead
        </Link>
      </div>
    </div>
  );
}
