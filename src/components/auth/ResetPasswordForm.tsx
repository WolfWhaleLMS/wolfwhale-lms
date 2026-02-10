'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { resetPasswordAction } from '@/lib/auth/actions';
import { toast } from 'sonner';

/**
 * Reset password form component
 * Allows users to set a new password after clicking the reset link
 */
export function ResetPasswordForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    try {
      // Validate passwords match
      if (formData.password !== formData.confirmPassword) {
        setErrors({ confirmPassword: 'Passwords do not match' });
        setLoading(false);
        return;
      }

      // Validate password strength
      if (formData.password.length < 8) {
        setErrors({ password: 'Password must be at least 8 characters' });
        setLoading(false);
        return;
      }

      const formDataObj = new FormData();
      formDataObj.append('password', formData.password);
      formDataObj.append('confirmPassword', formData.confirmPassword);

      const result = await resetPasswordAction(formDataObj);

      if (!result.success) {
        const errorMessage = result.error?.message || 'Failed to reset password';
        toast.error(errorMessage);
        setErrors({ submit: errorMessage });
      } else {
        toast.success('Password reset successfully!');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(errorMessage);
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Password field */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-white">
          New Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            disabled={loading}
            className={cn(
              'w-full pl-10 pr-10 py-2.5 rounded-lg',
              'bg-white/5 border border-white/10',
              'text-white placeholder-blue-200/50',
              'focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-all',
              errors.password && 'border-red-500 focus:ring-red-500'
            )}
            aria-label="New password"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-blue-200 disabled:opacity-50"
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="text-xs text-red-400">{errors.password}</p>
        )}
        <p className="text-xs text-blue-200">
          Password must be at least 8 characters with uppercase, lowercase, numbers, and special characters.
        </p>
      </div>

      {/* Confirm password field */}
      <div className="space-y-2">
        <label htmlFor="confirmPassword" className="block text-sm font-medium text-white">
          Confirm Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
          <input
            id="confirmPassword"
            type={showConfirmPassword ? 'text' : 'password'}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="••••••••"
            required
            disabled={loading}
            className={cn(
              'w-full pl-10 pr-10 py-2.5 rounded-lg',
              'bg-white/5 border border-white/10',
              'text-white placeholder-blue-200/50',
              'focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-all',
              errors.confirmPassword && 'border-red-500 focus:ring-red-500'
            )}
            aria-label="Confirm password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={loading}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300 hover:text-blue-200 disabled:opacity-50"
            aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="text-xs text-red-400">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Error message */}
      {errors.submit && (
        <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20">
          <p className="text-sm text-red-300">{errors.submit}</p>
        </div>
      )}

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
        aria-label="Reset password"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Resetting...
          </>
        ) : (
          'Reset Password'
        )}
      </button>
    </form>
  );
}
