'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Mail, Lock, Loader2, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { loginAction } from '@/lib/auth/actions';
import { toast } from 'sonner';

/**
 * Login form component
 * Handles email/password authentication with validation and error handling
 */
export function LoginForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    // Clear error for this field when user starts typing
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
      const formDataObj = new FormData();
      formDataObj.append('email', formData.email);
      formDataObj.append('password', formData.password);

      const result = await loginAction(formDataObj);

      if (!result.success) {
        const errorMessage = result.error?.message || 'Login failed';
        toast.error(errorMessage);
        setErrors({ submit: errorMessage });
      } else {
        toast.success('Sign in successful!');
        // Redirect based on role
        const redirectUrl = result.data?.redirectUrl || '/dashboard';
        router.push(redirectUrl);
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
            name="email"
            value={formData.email}
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
              errors.email && 'border-red-500 focus:ring-red-500'
            )}
            aria-label="Email address"
          />
        </div>
        {errors.email && (
          <p className="text-xs text-red-400">{errors.email}</p>
        )}
      </div>

      {/* Password field */}
      <div className="space-y-2">
        <label htmlFor="password" className="block text-sm font-medium text-white">
          Password
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
            aria-label="Password"
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
      </div>

      {/* Remember me checkbox */}
      <div className="flex items-center">
        <input
          id="rememberMe"
          type="checkbox"
          name="rememberMe"
          checked={formData.rememberMe}
          onChange={handleChange}
          disabled={loading}
          className="w-4 h-4 rounded border-white/20 bg-white/5 text-cyan-500 focus:ring-2 focus:ring-cyan-500"
          aria-label="Remember me"
        />
        <label htmlFor="rememberMe" className="ml-2 text-sm text-blue-200">
          Remember me for 30 days
        </label>
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
        aria-label="Sign in to your account"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            Signing in...
          </>
        ) : (
          'Sign In'
        )}
      </button>
    </form>
  );
}
