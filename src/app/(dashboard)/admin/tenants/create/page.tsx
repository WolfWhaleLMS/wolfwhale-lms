'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/Select';
import {
  ArrowLeft,
  Building2,
  UserPlus,
  Globe,
  MapPin,
  Phone,
  Mail,
  Shield,
  CheckCircle,
  AlertCircle,
} from 'lucide-react';
import { toast } from 'sonner';
import { slugify } from '@/lib/utils';

interface FormData {
  // School fields
  name: string;
  slug: string;
  email: string;
  website: string;
  city: string;
  state: string;
  country: string;
  timezone: string;
  principal: string;
  phone: string;
  subscriptionPlan: string;
  // Admin fields
  adminName: string;
  adminEmail: string;
  adminPassword: string;
  adminPasswordConfirm: string;
}

const initialFormData: FormData = {
  name: '',
  slug: '',
  email: '',
  website: '',
  city: '',
  state: '',
  country: 'United States',
  timezone: 'America/New_York',
  principal: '',
  phone: '',
  subscriptionPlan: 'free',
  adminName: '',
  adminEmail: '',
  adminPassword: '',
  adminPasswordConfirm: '',
};

const timezones = [
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'America/Anchorage',
  'Pacific/Honolulu',
  'America/Toronto',
  'America/Vancouver',
  'Europe/London',
  'Europe/Berlin',
  'Europe/Paris',
  'Asia/Tokyo',
  'Asia/Shanghai',
  'Asia/Kolkata',
  'Australia/Sydney',
  'UTC',
];

export default function CreateTenantPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>(initialFormData);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => {
      const updated = { ...prev, [field]: value };
      // Auto-generate slug from name
      if (field === 'name') {
        updated.slug = slugify(value);
      }
      return updated;
    });
    // Clear error for this field
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateStep1 = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.name.trim()) newErrors.name = 'School name is required';
    if (!formData.slug.trim()) newErrors.slug = 'Slug is required';
    else if (!/^[a-z0-9-]+$/.test(formData.slug))
      newErrors.slug = 'Slug must be lowercase letters, numbers, and hyphens only';
    if (!formData.email.trim()) newErrors.email = 'School email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email))
      newErrors.email = 'Invalid email address';
    if (formData.website && !/^https?:\/\/.+/.test(formData.website))
      newErrors.website = 'Website must start with http:// or https://';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.adminName.trim()) newErrors.adminName = 'Admin name is required';
    if (!formData.adminEmail.trim()) newErrors.adminEmail = 'Admin email is required';
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.adminEmail))
      newErrors.adminEmail = 'Invalid email address';
    if (!formData.adminPassword) newErrors.adminPassword = 'Password is required';
    else if (formData.adminPassword.length < 8)
      newErrors.adminPassword = 'Password must be at least 8 characters';
    if (formData.adminPassword !== formData.adminPasswordConfirm)
      newErrors.adminPasswordConfirm = 'Passwords do not match';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep1()) {
      setStep(2);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep2()) return;

    setIsSubmitting(true);
    try {
      const response = await fetch('/api/admin/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: formData.name,
          slug: formData.slug,
          email: formData.email,
          website: formData.website || undefined,
          city: formData.city || undefined,
          state: formData.state || undefined,
          country: formData.country || undefined,
          timezone: formData.timezone || undefined,
          principal: formData.principal || undefined,
          phone: formData.phone || undefined,
          subscriptionPlan: formData.subscriptionPlan,
          adminName: formData.adminName,
          adminEmail: formData.adminEmail,
          adminPassword: formData.adminPassword,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        toast.error(result.error?.message || 'Failed to create school');
        return;
      }

      toast.success('School created successfully!');
      router.push('/admin/tenants');
    } catch (error) {
      console.error('Error creating school:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 dark:from-slate-950 dark:via-cyan-950 dark:to-blue-950 p-4 md:p-8">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.push('/admin/tenants')}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white">
              Create New School
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-1">
              Set up a new school/tenant and assign an administrator
            </p>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="flex items-center gap-4">
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              step === 1
                ? 'glass-card backdrop-blur-lg bg-indigo-100/70 dark:bg-indigo-900/50 border border-indigo-200/50 dark:border-indigo-700/30 text-indigo-700 dark:text-indigo-300'
                : step === 2
                ? 'text-green-600 dark:text-green-400'
                : 'text-slate-400'
            }`}
          >
            {step > 1 ? (
              <CheckCircle className="w-5 h-5" />
            ) : (
              <Building2 className="w-5 h-5" />
            )}
            <span className="font-medium text-sm">1. School Details</span>
          </div>
          <div className="h-px w-8 bg-slate-300 dark:bg-slate-600" />
          <div
            className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
              step === 2
                ? 'glass-card backdrop-blur-lg bg-indigo-100/70 dark:bg-indigo-900/50 border border-indigo-200/50 dark:border-indigo-700/30 text-indigo-700 dark:text-indigo-300'
                : 'text-slate-400'
            }`}
          >
            <UserPlus className="w-5 h-5" />
            <span className="font-medium text-sm">2. Admin Account</span>
          </div>
        </div>

        {/* Step 1: School Details */}
        {step === 1 && (
          <Card className="glass-card backdrop-blur-lg bg-white/70 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/30 rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5 text-indigo-500" />
                School Information
              </CardTitle>
              <CardDescription>
                Enter the basic details for the new school
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* School Name & Slug */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="text-slate-700 dark:text-slate-300">
                    School Name *
                  </Label>
                  <Input
                    id="name"
                    placeholder="e.g. Riverside Elementary"
                    value={formData.name}
                    onChange={(e) => handleChange('name', e.target.value)}
                    error={errors.name}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-slate-700 dark:text-slate-300">
                    URL Slug *
                  </Label>
                  <Input
                    id="slug"
                    placeholder="e.g. riverside-elementary"
                    value={formData.slug}
                    onChange={(e) => handleChange('slug', e.target.value)}
                    error={errors.slug}
                  />
                  <p className="text-xs text-slate-500">
                    Used in URLs: yourapp.com/{formData.slug || 'school-slug'}
                  </p>
                </div>
              </div>

              {/* Email & Website */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">
                    <Mail className="w-3.5 h-3.5 inline mr-1" />
                    School Email *
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="contact@school.edu"
                    value={formData.email}
                    onChange={(e) => handleChange('email', e.target.value)}
                    error={errors.email}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="website" className="text-slate-700 dark:text-slate-300">
                    <Globe className="w-3.5 h-3.5 inline mr-1" />
                    Website
                  </Label>
                  <Input
                    id="website"
                    placeholder="https://school.edu"
                    value={formData.website}
                    onChange={(e) => handleChange('website', e.target.value)}
                    error={errors.website}
                  />
                </div>
              </div>

              {/* Location */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city" className="text-slate-700 dark:text-slate-300">
                    <MapPin className="w-3.5 h-3.5 inline mr-1" />
                    City
                  </Label>
                  <Input
                    id="city"
                    placeholder="City"
                    value={formData.city}
                    onChange={(e) => handleChange('city', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="state" className="text-slate-700 dark:text-slate-300">
                    State
                  </Label>
                  <Input
                    id="state"
                    placeholder="State"
                    value={formData.state}
                    onChange={(e) => handleChange('state', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="country" className="text-slate-700 dark:text-slate-300">
                    Country
                  </Label>
                  <Input
                    id="country"
                    placeholder="Country"
                    value={formData.country}
                    onChange={(e) => handleChange('country', e.target.value)}
                  />
                </div>
              </div>

              {/* Principal, Phone, Timezone */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="principal" className="text-slate-700 dark:text-slate-300">
                    Principal
                  </Label>
                  <Input
                    id="principal"
                    placeholder="Dr. Jane Doe"
                    value={formData.principal}
                    onChange={(e) => handleChange('principal', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-slate-700 dark:text-slate-300">
                    <Phone className="w-3.5 h-3.5 inline mr-1" />
                    Phone
                  </Label>
                  <Input
                    id="phone"
                    placeholder="(555) 123-4567"
                    value={formData.phone}
                    onChange={(e) => handleChange('phone', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-slate-700 dark:text-slate-300">
                    Timezone
                  </Label>
                  <Select
                    value={formData.timezone}
                    onValueChange={(v) => handleChange('timezone', v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select timezone" />
                    </SelectTrigger>
                    <SelectContent>
                      {timezones.map((tz) => (
                        <SelectItem key={tz} value={tz}>
                          {tz.replace(/_/g, ' ')}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Subscription Plan */}
              <div className="space-y-2">
                <Label className="text-slate-700 dark:text-slate-300">
                  Subscription Plan
                </Label>
                <Select
                  value={formData.subscriptionPlan}
                  onValueChange={(v) => handleChange('subscriptionPlan', v)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="free">Free - Up to 10 students</SelectItem>
                    <SelectItem value="starter">Starter ($99/mo) - Up to 100 students</SelectItem>
                    <SelectItem value="growth">Growth ($299/mo) - Up to 500 students</SelectItem>
                    <SelectItem value="enterprise">Enterprise ($999/mo) - Unlimited</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-700/30">
                <Button
                  variant="outline"
                  onClick={() => router.push('/admin/tenants')}
                >
                  Cancel
                </Button>
                <Button onClick={handleNext}>
                  Continue to Admin Setup
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Step 2: Admin Account */}
        {step === 2 && (
          <Card className="glass-card backdrop-blur-lg bg-white/70 dark:bg-slate-800/50 border border-white/20 dark:border-slate-700/30 rounded-2xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-indigo-500" />
                School Administrator
              </CardTitle>
              <CardDescription>
                Create the initial admin account for {formData.name || 'this school'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Summary of school */}
              <div className="p-4 rounded-xl bg-indigo-50/50 dark:bg-indigo-900/20 border border-indigo-200/30 dark:border-indigo-700/20">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-indigo-100 dark:bg-indigo-800/50">
                    <Building2 className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  </div>
                  <div>
                    <p className="font-semibold text-slate-900 dark:text-white">{formData.name}</p>
                    <p className="text-xs text-slate-500">{formData.slug} | {formData.email}</p>
                  </div>
                </div>
              </div>

              {/* Admin Name */}
              <div className="space-y-2">
                <Label htmlFor="adminName" className="text-slate-700 dark:text-slate-300">
                  Admin Full Name *
                </Label>
                <Input
                  id="adminName"
                  placeholder="Dr. Michael Thompson"
                  value={formData.adminName}
                  onChange={(e) => handleChange('adminName', e.target.value)}
                  error={errors.adminName}
                />
              </div>

              {/* Admin Email */}
              <div className="space-y-2">
                <Label htmlFor="adminEmail" className="text-slate-700 dark:text-slate-300">
                  Admin Email *
                </Label>
                <Input
                  id="adminEmail"
                  type="email"
                  placeholder="admin@school.edu"
                  value={formData.adminEmail}
                  onChange={(e) => handleChange('adminEmail', e.target.value)}
                  error={errors.adminEmail}
                />
                <p className="text-xs text-slate-500">
                  This will be the login email for the school administrator
                </p>
              </div>

              {/* Passwords */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="adminPassword" className="text-slate-700 dark:text-slate-300">
                    Password *
                  </Label>
                  <Input
                    id="adminPassword"
                    type="password"
                    placeholder="Min 8 characters"
                    value={formData.adminPassword}
                    onChange={(e) => handleChange('adminPassword', e.target.value)}
                    error={errors.adminPassword}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="adminPasswordConfirm" className="text-slate-700 dark:text-slate-300">
                    Confirm Password *
                  </Label>
                  <Input
                    id="adminPasswordConfirm"
                    type="password"
                    placeholder="Repeat password"
                    value={formData.adminPasswordConfirm}
                    onChange={(e) => handleChange('adminPasswordConfirm', e.target.value)}
                    error={errors.adminPasswordConfirm}
                  />
                </div>
              </div>

              {/* Info box */}
              <div className="p-4 rounded-xl bg-amber-50/50 dark:bg-amber-900/20 border border-amber-200/30 dark:border-amber-700/20">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
                  <div className="text-sm text-amber-800 dark:text-amber-200">
                    <p className="font-medium mb-1">What happens next:</p>
                    <ul className="list-disc list-inside space-y-1 text-amber-700 dark:text-amber-300">
                      <li>A new school tenant will be created on the platform</li>
                      <li>An admin account will be created with the credentials above</li>
                      <li>The admin can then log in and create teachers, students, and parents</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-between gap-3 pt-4 border-t border-slate-200/50 dark:border-slate-700/30">
                <Button variant="outline" onClick={() => setStep(1)}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
                <Button
                  onClick={handleSubmit}
                  isLoading={isSubmitting}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Create School & Admin
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
