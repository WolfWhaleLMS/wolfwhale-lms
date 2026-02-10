import React from 'react';
import { Card, CardContent } from '@/components/ui/Card';
import { Shield } from 'lucide-react';

export default function AdminBillingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 dark:from-slate-950 dark:via-cyan-950 dark:to-blue-950 p-4 md:p-8">
      <div className="max-w-3xl mx-auto">
        <Card>
          <CardContent className="p-12 text-center">
            <div className="flex justify-center mb-4">
              <div className="p-4 rounded-2xl bg-slate-100 dark:bg-slate-800">
                <Shield className="w-8 h-8 text-slate-600 dark:text-slate-400" />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">
              Billing
            </h1>
            <p className="text-slate-600 dark:text-slate-400">
              Billing is managed by the platform administrator.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
