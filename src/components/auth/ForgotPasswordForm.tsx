'use client';

import React, { useState } from 'react';
import { Mail, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { forgotPasswordAction } from '@/lib/auth/actions';
import { toast } from 'sonner';

/**
 * Forgot password form component
 * Allows users to request a password reset email
 */
export function ForgotPasswordForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (error) setError('');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('email', email);

      const result = await forgotPasswordAction(formData);

      if (!result.success) {
        const errorMessage = result.error?.message || 'Failed to send reset email';
        toast.error(errorMessage);
        setError(errorMessage);
      } else {
        toast.success('Check your email for password reset instructions');
        setSuccess(true);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An unexpected error occurred';
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="w-16 h-16 bg-cyan-500/20 rounded-full flex items-center justify-center mx-auto">
          <Mail className="w-8 h-8 text-cyan-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-white">Check Your Email</h3>
          <p className="text-sm text-blue-200">
            We've sent a password reset link to <span className="font-medium">{email}</span>
          </p>
          <p className="text-xs text-blue-300 pt-2">
            The link will expire in 24 hours. If you don't see the email, check your spam folder.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Email field */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-medium text-white">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
          <input
            id="email"
            type="email"
            value={email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
            disabled={loading}
            className={cn(
              'w-full pl-10 pr-4 py-2.5 rounded-lg',
              'bg-white/5 border border-white/10',
              'text-white placeholder-blue-200/50',
              'focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-all',
              error && 'border-red-500 focus:ring-red-500'
            )}
            aria-label="Email address"
          />
        </div>
        {error && (
          <p className="text-xs text-red-400">{error}</p>
        )}
      </div>

      {/* Info text */}
      <p className="text-xs text-blue-200">
        Enter the email address associated with your account, and we'll send you a link to reset your password.
      </p>

      {/* Submit button */}
      <button
        type="submit"
        disabled={loading}
        className={cn(
          'w-full py-2.5 px-4 rounded-lg font-semibold',
          'bg-gradient-to-r from-cyan-500 to-blue-500',
          'text-white',
          'hover:from-cyan-600 hover:to-blue-600',
          'focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 focus:ring-offset-slate-900',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          'transition-all flex items-center justify-center gap-2',
          'shadow-lg hover:shadow-xl'
        )}
        aria-label="Send password reset email"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Sending...
          </>
        ) : (
          'Send Reset Link'
        )}
      </button>
    </form>
  );
}
