'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Lock, User, School, CheckCircle2, Loader2, Eye, EyeOff, ArrowRight, ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { registerAction } from '@/lib/auth/actions';
import { toast } from 'sonner';
import type { UserRole } from '@/types/database.types';

type RegistrationStep = 'role' | 'school' | 'personal' | 'confirmation';

interface StepData {
  role?: 'student' | 'parent' | 'teacher' | 'admin';
  schoolCode?: string;
  schoolName?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  acceptTerms?: boolean;
  acceptCOPPA?: boolean;
}

/**
 * Multi-step registration form component
 * Guides users through account creation with role-based steps
 */
export function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState<RegistrationStep>('role');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState<StepData>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: '',
      }));
    }
  };

  const validateStep = (): boolean => {
    const stepErrors: Record<string, string> = {};

    if (step === 'role') {
      if (!formData.role) {
        stepErrors.role = 'Please select a role';
      }
    } else if (step === 'school') {
      if (formData.role === 'admin') {
        if (!formData.schoolName) {
          stepErrors.schoolName = 'School name is required';
        }
      } else {
        if (!formData.schoolCode) {
          stepErrors.schoolCode = 'School code is required';
        }
      }
    } else if (step === 'personal') {
      if (!formData.firstName) stepErrors.firstName = 'First name is required';
      if (!formData.lastName) stepErrors.lastName = 'Last name is required';
      if (!formData.email) stepErrors.email = 'Email is required';
      if (!formData.password) stepErrors.password = 'Password is required';
      if (formData.password !== formData.confirmPassword) {
        stepErrors.confirmPassword = 'Passwords do not match';
      }
      if (formData.password && formData.password.length < 8) {
        stepErrors.password = 'Password must be at least 8 characters';
      }
      if (!formData.acceptTerms) {
        stepErrors.acceptTerms = 'You must accept the terms';
      }
      if (formData.role === 'parent' && !formData.acceptCOPPA) {
        stepErrors.acceptCOPPA = 'COPPA consent is required for parent accounts';
      }
    }

    setErrors(stepErrors);
    return Object.keys(stepErrors).length === 0;
  };

  const handleNext = () => {
    if (!validateStep()) return;

    if (step === 'role') {
      setStep('school');
    } else if (step === 'school') {
      setStep('personal');
    } else if (step === 'personal') {
      setStep('confirmation');
    }
  };

  const handleBack = () => {
    if (step === 'school') {
      setStep('role');
    } else if (step === 'personal') {
      setStep('school');
    } else if (step === 'confirmation') {
      setStep('personal');
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const formDataObj = new FormData();
      Object.entries(formData).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formDataObj.append(key, String(value));
        }
      });

      const result = await registerAction(formDataObj);

      if (!result.success) {
        toast.error(result.error?.message || 'Registration failed');
      } else {
        toast.success('Account created! Please check your email to confirm.');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'student', label: 'I\'m a Student', icon: '📚' },
    { value: 'parent', label: 'I\'m a Parent', icon: '👨‍👩‍👧' },
    { value: 'teacher', label: 'I\'m a Teacher', icon: '🎓' },
    { value: 'admin', label: 'I\'m a School Admin', icon: '🏫' },
  ];

  // Progress indicator
  const steps: RegistrationStep[] = ['role', 'school', 'personal', 'confirmation'];
  const currentStepIndex = steps.indexOf(step);
  const progress = ((currentStepIndex + 1) / steps.length) * 100;

  return (
    <div className="space-y-6">
      {/* Progress bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs text-blue-200">
          <span>Step {currentStepIndex + 1} of {steps.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3 }}
          />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Role Selection */}
        {step === 'role' && (
          <motion.div
            key="role"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <h3 className="font-semibold text-white">What's your role?</h3>
            <div className="grid grid-cols-2 gap-3">
              {roleOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    setFormData((prev) => ({
                      ...prev,
                      role: option.value as any,
                    }));
                    if (errors.role) {
                      setErrors((prev) => ({
                        ...prev,
                        role: '',
                      }));
                    }
                  }}
                  className={cn(
                    'p-4 rounded-lg border-2 transition-all text-center',
                    formData.role === option.value
                      ? 'border-cyan-500 bg-cyan-500/10'
                      : 'border-white/10 bg-white/5 hover:border-white/20'
                  )}
                >
                  <div className="text-2xl mb-2">{option.icon}</div>
                  <div className="text-sm font-medium text-white">{option.label}</div>
                </button>
              ))}
            </div>
            {errors.role && (
              <p className="text-xs text-red-400">{errors.role}</p>
            )}
          </motion.div>
        )}

        {/* Step 2: School Selection */}
        {step === 'school' && (
          <motion.div
            key="school"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <h3 className="font-semibold text-white">
              {formData.role === 'admin' ? 'Create Your School' : 'Join a School'}
            </h3>

            {formData.role === 'admin' ? (
              <div className="space-y-2">
                <label htmlFor="schoolName" className="block text-sm font-medium text-white">
                  School Name
                </label>
                <div className="relative">
                  <School className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                  <input
                    id="schoolName"
                    type="text"
                    name="schoolName"
                    value={formData.schoolName || ''}
                    onChange={handleChange}
                    placeholder="e.g., Lincoln High School"
                    className={cn(
                      'w-full pl-10 pr-4 py-2.5 rounded-lg',
                      'bg-white/5 border border-white/10',
                      'text-white placeholder-blue-200/50',
                      'focus:outline-none focus:ring-2 focus:ring-cyan-500',
                      errors.schoolName && 'border-red-500'
                    )}
                  />
                </div>
                {errors.schoolName && (
                  <p className="text-xs text-red-400">{errors.schoolName}</p>
                )}
              </div>
            ) : (
              <div className="space-y-2">
                <label htmlFor="schoolCode" className="block text-sm font-medium text-white">
                  School Code
                </label>
                <div className="relative">
                  <School className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                  <input
                    id="schoolCode"
                    type="text"
                    name="schoolCode"
                    value={formData.schoolCode || ''}
                    onChange={handleChange}
                    placeholder="Ask your teacher or admin"
                    className={cn(
                      'w-full pl-10 pr-4 py-2.5 rounded-lg',
                      'bg-white/5 border border-white/10',
                      'text-white placeholder-blue-200/50',
                      'focus:outline-none focus:ring-2 focus:ring-cyan-500',
                      errors.schoolCode && 'border-red-500'
                    )}
                  />
                </div>
                {errors.schoolCode && (
                  <p className="text-xs text-red-400">{errors.schoolCode}</p>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Step 3: Personal Information */}
        {step === 'personal' && (
          <motion.div
            key="personal"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <h3 className="font-semibold text-white">Your Information</h3>

            {/* First Name */}
            <div className="space-y-2">
              <label htmlFor="firstName" className="block text-sm font-medium text-white">
                First Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                <input
                  id="firstName"
                  type="text"
                  name="firstName"
                  value={formData.firstName || ''}
                  onChange={handleChange}
                  placeholder="First name"
                  className={cn(
                    'w-full pl-10 pr-4 py-2.5 rounded-lg',
                    'bg-white/5 border border-white/10',
                    'text-white placeholder-blue-200/50',
                    'focus:outline-none focus:ring-2 focus:ring-cyan-500',
                    errors.firstName && 'border-red-500'
                  )}
                />
              </div>
              {errors.firstName && (
                <p className="text-xs text-red-400">{errors.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div className="space-y-2">
              <label htmlFor="lastName" className="block text-sm font-medium text-white">
                Last Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-blue-300" />
                <input
                  id="lastName"
                  type="text"
                  name="lastName"
                  value={formData.lastName || ''}
                  onChange={handleChange}
                  placeholder="Last name"
                  className={cn(
                    'w-full pl-10 pr-4 py-2.5 rounded-lg',
                    'bg-white/5 border border-white/10',
                    'text-white placeholder-blue-200/50',
                    'focus:outline-none focus:ring-2 focus:ring-cyan-500',
                    errors.lastName && 'border-red-500'
                  )}
                />
              </div>
              {errors.lastName && (
                <p className="text-xs text-red-400">{errors.lastName}</p>
              )}
            </div>

            {/* Email */}
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
                  value={formData.email || ''}
                  onChange={handleChange}
                  placeholder="your@email.com"
                  className={cn(
                    'w-full pl-10 pr-4 py-2.5 rounded-lg',
                    'bg-white/5 border border-white/10',
                    'text-white placeholder-blue-200/50',
                    'focus:outline-none focus:ring-2 focus:ring-cyan-500',
                    errors.email && 'border-red-500'
                  )}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-red-400">{errors.email}</p>
              )}
            </div>

            {/* Password */}
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
                  value={formData.password || ''}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={cn(
                    'w-full pl-10 pr-10 py-2.5 rounded-lg',
                    'bg-white/5 border border-white/10',
                    'text-white placeholder-blue-200/50',
                    'focus:outline-none focus:ring-2 focus:ring-cyan-500',
                    errors.password && 'border-red-500'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-red-400">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
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
                  value={formData.confirmPassword || ''}
                  onChange={handleChange}
                  placeholder="••••••••"
                  className={cn(
                    'w-full pl-10 pr-10 py-2.5 rounded-lg',
                    'bg-white/5 border border-white/10',
                    'text-white placeholder-blue-200/50',
                    'focus:outline-none focus:ring-2 focus:ring-cyan-500',
                    errors.confirmPassword && 'border-red-500'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-blue-300"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-red-400">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start gap-2">
              <input
                id="acceptTerms"
                type="checkbox"
                name="acceptTerms"
                checked={formData.acceptTerms || false}
                onChange={handleChange}
                className="w-4 h-4 mt-1 rounded border-white/20 bg-white/5 text-cyan-500"
              />
              <label htmlFor="acceptTerms" className="text-xs text-blue-200">
                I agree to the Terms of Service and Privacy Policy
              </label>
            </div>
            {errors.acceptTerms && (
              <p className="text-xs text-red-400">{errors.acceptTerms}</p>
            )}

            {/* COPPA consent for parents */}
            {formData.role === 'parent' && (
              <div className="space-y-2 p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
                <div className="flex items-start gap-2">
                  <input
                    id="acceptCOPPA"
                    type="checkbox"
                    name="acceptCOPPA"
                    checked={formData.acceptCOPPA || false}
                    onChange={handleChange}
                    className="w-4 h-4 mt-1 rounded border-white/20 bg-white/5 text-cyan-500"
                  />
                  <label htmlFor="acceptCOPPA" className="text-xs text-blue-200">
                    I confirm I am the parent/guardian of a child under 13 and agree to COPPA compliance
                  </label>
                </div>
                {errors.acceptCOPPA && (
                  <p className="text-xs text-red-400">{errors.acceptCOPPA}</p>
                )}
              </div>
            )}
          </motion.div>
        )}

        {/* Step 4: Confirmation */}
        {step === 'confirmation' && (
          <motion.div
            key="confirmation"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="space-y-4"
          >
            <div className="text-center space-y-4">
              <CheckCircle2 className="w-16 h-16 text-cyan-400 mx-auto" />
              <h3 className="font-semibold text-white text-lg">Review Your Information</h3>

              <div className="space-y-3 text-left bg-white/5 p-4 rounded-lg border border-white/10">
                <div className="flex justify-between text-sm">
                  <span className="text-blue-200">Role:</span>
                  <span className="text-white font-medium capitalize">{formData.role}</span>
                </div>
                <div className="border-t border-white/10" />
                <div className="flex justify-between text-sm">
                  <span className="text-blue-200">Name:</span>
                  <span className="text-white font-medium">{formData.firstName} {formData.lastName}</span>
                </div>
                <div className="border-t border-white/10" />
                <div className="flex justify-between text-sm">
                  <span className="text-blue-200">Email:</span>
                  <span className="text-white font-medium">{formData.email}</span>
                </div>
              </div>

              <p className="text-xs text-blue-200">
                A confirmation email will be sent to verify your account.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation buttons */}
      <div className="flex gap-3 pt-4">
        {step !== 'role' && (
          <button
            type="button"
            onClick={handleBack}
            disabled={loading}
            className={cn(
              'flex-1 py-2.5 px-4 rounded-lg font-semibold',
              'border border-white/20 text-white',
              'hover:bg-white/5',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-all flex items-center justify-center gap-2'
            )}
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}

        {step !== 'confirmation' && (
          <button
            type="button"
            onClick={handleNext}
            disabled={loading}
            className={cn(
              'flex-1 py-2.5 px-4 rounded-lg font-semibold',
              'bg-gradient-to-r from-cyan-500 to-blue-500',
              'text-white',
              'hover:from-cyan-600 hover:to-blue-600',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-all flex items-center justify-center gap-2',
              'shadow-lg hover:shadow-xl'
            )}
          >
            Next
            <ArrowRight className="w-4 h-4" />
          </button>
        )}

        {step === 'confirmation' && (
          <button
            type="button"
            onClick={handleSubmit}
            disabled={loading}
            className={cn(
              'flex-1 py-2.5 px-4 rounded-lg font-semibold',
              'bg-gradient-to-r from-cyan-500 to-blue-500',
              'text-white',
              'hover:from-cyan-600 hover:to-blue-600',
              'disabled:opacity-50 disabled:cursor-not-allowed',
              'transition-all flex items-center justify-center gap-2',
              'shadow-lg hover:shadow-xl'
            )}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Create Account
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
