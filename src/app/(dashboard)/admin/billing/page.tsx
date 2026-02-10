'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Progress } from '@/components/ui/Progress';
import {
  CreditCard,
  Download,
  CheckCircle,
  Users,
  HardDrive,
  Calendar,
  ArrowUpRight,
  FileText,
  Shield,
  Zap,
  Star,
} from 'lucide-react';
import { SUBSCRIPTION_TIERS } from '@/config/constants';
import { mockSubscription, dashboardStats } from '@/data/admin-mock-data';

// Mock invoice data
interface MockInvoice {
  id: string;
  date: string;
  amount: number;
  status: 'paid' | 'pending' | 'failed';
  description: string;
  downloadUrl: string;
}

const mockInvoices: MockInvoice[] = [
  { id: 'inv_001', date: '2026-02-01', amount: 299.00, status: 'paid', description: 'Growth Plan - February 2026', downloadUrl: '#' },
  { id: 'inv_002', date: '2026-01-01', amount: 299.00, status: 'paid', description: 'Growth Plan - January 2026', downloadUrl: '#' },
  { id: 'inv_003', date: '2025-12-01', amount: 299.00, status: 'paid', description: 'Growth Plan - December 2025', downloadUrl: '#' },
  { id: 'inv_004', date: '2025-11-01', amount: 299.00, status: 'paid', description: 'Growth Plan - November 2025', downloadUrl: '#' },
  { id: 'inv_005', date: '2025-10-01', amount: 299.00, status: 'paid', description: 'Growth Plan - October 2025', downloadUrl: '#' },
  { id: 'inv_006', date: '2025-09-01', amount: 299.00, status: 'paid', description: 'Growth Plan - September 2025', downloadUrl: '#' },
];

const invoiceStatusColors: Record<string, string> = {
  paid: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  pending: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  failed: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
};

const planHighlightColors: Record<string, string> = {
  free: 'border-slate-200 dark:border-slate-700',
  starter: 'border-blue-300 dark:border-blue-700',
  growth: 'border-purple-400 dark:border-purple-600 ring-2 ring-purple-200 dark:ring-purple-800',
  enterprise: 'border-amber-400 dark:border-amber-600',
};

export default function AdminBillingPage() {
  const [selectedPlan, setSelectedPlan] = useState<string>('growth');

  const userUsagePercent = Math.min(100, (dashboardStats.activeUsers / mockSubscription.maxUsers) * 100);
  const storageUsagePercent = Math.min(100, (mockSubscription.storageUsedGb / mockSubscription.storageMaxGb) * 100);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 dark:from-slate-950 dark:via-cyan-950 dark:to-blue-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
              Billing & Subscription
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Manage your plan, payment methods, and invoices
            </p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Download All Invoices
          </Button>
        </div>

        {/* Current Plan Overview */}
        <Card>
          <CardContent className="p-6">
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-100 to-indigo-100 dark:from-purple-900/30 dark:to-indigo-900/30">
                  <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                      {mockSubscription.plan} Plan
                    </h2>
                    <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300">
                      Active
                    </Badge>
                  </div>
                  <p className="text-slate-600 dark:text-slate-400 mt-1">
                    ${mockSubscription.price}/month &middot; Renews on {new Date(mockSubscription.renewalDate).toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div className="flex gap-3">
                <Button variant="outline">
                  Cancel Plan
                </Button>
                <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  Upgrade Plan
                </Button>
              </div>
            </div>

            {/* Usage Bars */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6 pt-6 border-t border-white/20 dark:border-slate-700/30">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-900 dark:text-white">Active Users</span>
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {dashboardStats.activeUsers.toLocaleString()} / {mockSubscription.maxUsers.toLocaleString()}
                  </span>
                </div>
                <Progress value={userUsagePercent} className="h-2" />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {(mockSubscription.maxUsers - dashboardStats.activeUsers).toLocaleString()} seats remaining
                </p>
              </div>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-slate-500" />
                    <span className="text-sm font-medium text-slate-900 dark:text-white">Storage</span>
                  </div>
                  <span className="text-sm text-slate-600 dark:text-slate-400">
                    {mockSubscription.storageUsedGb} GB / {mockSubscription.storageMaxGb} GB
                  </span>
                </div>
                <Progress value={storageUsagePercent} className="h-2" />
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {(mockSubscription.storageMaxGb - mockSubscription.storageUsedGb).toFixed(1)} GB remaining
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Plan Comparison */}
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white mb-4">
            Available Plans
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {(Object.entries(SUBSCRIPTION_TIERS) as [string, typeof SUBSCRIPTION_TIERS[keyof typeof SUBSCRIPTION_TIERS]][]).map(([key, tier]) => {
              const isCurrentPlan = key === 'growth';
              return (
                <Card
                  key={key}
                  className={`relative overflow-hidden transition-all duration-200 hover:shadow-lg ${
                    planHighlightColors[key]
                  }`}
                >
                  {isCurrentPlan && (
                    <div className="absolute top-0 right-0 bg-purple-600 text-white text-xs font-semibold px-3 py-1 rounded-bl-lg">
                      Current Plan
                    </div>
                  )}
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg flex items-center gap-2">
                      {key === 'enterprise' && <Star className="w-5 h-5 text-amber-500" />}
                      {tier.label}
                    </CardTitle>
                    <div className="mt-2">
                      <span className="text-3xl font-bold text-slate-900 dark:text-white">
                        ${tier.price}
                      </span>
                      {tier.price > 0 && (
                        <span className="text-slate-500 dark:text-slate-400">/mo</span>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 mb-4">
                      {tier.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                          <span className="text-slate-600 dark:text-slate-400">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button
                      variant={isCurrentPlan ? 'outline' : 'default'}
                      className="w-full"
                      disabled={isCurrentPlan}
                    >
                      {isCurrentPlan ? 'Current Plan' : tier.price === 0 ? 'Downgrade' : 'Select Plan'}
                    </Button>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Payment Method */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CreditCard className="w-5 h-5" />
              Payment Method
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 border border-white/20 dark:border-slate-700/30">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-lg bg-white dark:bg-slate-700 shadow-sm">
                  <CreditCard className="w-6 h-6 text-slate-600 dark:text-slate-300" />
                </div>
                <div>
                  <p className="font-medium text-slate-900 dark:text-white">
                    Visa ending in 4242
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">
                    Expires 12/2027
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  Update
                </Button>
                <Button variant="outline" size="sm">
                  Add New
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Billing Contact */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Billing Contact
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 border border-white/20 dark:border-slate-700/30">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Contact Name</p>
                <p className="font-medium text-slate-900 dark:text-white">Sarah Mitchell</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 border border-white/20 dark:border-slate-700/30">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Billing Email</p>
                <p className="font-medium text-slate-900 dark:text-white">billing@hillside-academy.edu</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 border border-white/20 dark:border-slate-700/30">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Address</p>
                <p className="font-medium text-slate-900 dark:text-white">123 Academy Dr, Suite 100, San Francisco, CA 94105</p>
              </div>
              <div className="p-4 rounded-xl bg-slate-50/50 dark:bg-slate-800/30 border border-white/20 dark:border-slate-700/30">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-1">Tax ID</p>
                <p className="font-medium text-slate-900 dark:text-white">US-EIN: 12-3456789</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Invoice History */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Invoice History
                </CardTitle>
                <CardDescription className="mt-1">
                  View and download your past invoices
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto rounded-xl border border-white/30 dark:border-slate-700/30">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/20 dark:border-slate-700/50 bg-white/30 dark:bg-slate-800/50">
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Date
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Description
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Amount
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                      Invoice
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockInvoices.map((invoice) => (
                    <tr
                      key={invoice.id}
                      className="border-b border-white/10 dark:border-slate-700/20 hover:bg-white/20 dark:hover:bg-slate-700/20 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-slate-400" />
                          <span className="text-sm text-slate-700 dark:text-slate-300">
                            {new Date(invoice.date).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm text-slate-900 dark:text-white font-medium">
                          {invoice.description}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <span className="text-sm font-semibold text-slate-900 dark:text-white">
                          ${invoice.amount.toFixed(2)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <Badge className={invoiceStatusColors[invoice.status]}>
                          <CheckCircle className="w-3 h-3 mr-1" />
                          {invoice.status}
                        </Badge>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <Button variant="ghost" size="sm">
                          <Download className="w-4 h-4 mr-1" />
                          PDF
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
