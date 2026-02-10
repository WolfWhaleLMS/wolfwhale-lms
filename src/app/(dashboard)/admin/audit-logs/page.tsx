'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import {
  Search,
  Shield,
  Download,
  Filter,
  Clock,
  User,
  ChevronLeft,
  ChevronRight,
  Activity,
  AlertTriangle,
  Settings,
  Database,
  Lock,
  FileText,
} from 'lucide-react';
import { mockAuditLogs } from '@/data/admin-mock-data';
import { formatRelativeTime } from '@/lib/utils';
import type { MockAuditLog } from '@/data/admin-mock-data';

const resourceTypeIcons: Record<string, React.ReactNode> = {
  user: <User className="w-4 h-4" />,
  class: <FileText className="w-4 h-4" />,
  settings: <Settings className="w-4 h-4" />,
  auth: <Lock className="w-4 h-4" />,
  data: <Database className="w-4 h-4" />,
  consent: <Shield className="w-4 h-4" />,
  announcement: <FileText className="w-4 h-4" />,
  security: <Lock className="w-4 h-4" />,
  billing: <FileText className="w-4 h-4" />,
  system: <Activity className="w-4 h-4" />,
};

const resourceTypeColors: Record<string, string> = {
  user: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  class: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  settings: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  auth: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
  data: 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300',
  consent: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  announcement: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/30 dark:text-indigo-300',
  security: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  billing: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300',
  system: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300',
};

const actionSeverity: Record<string, 'info' | 'warning' | 'error'> = {
  'user.created': 'info',
  'user.updated': 'info',
  'user.deactivated': 'warning',
  'user.password_reset': 'warning',
  'class.created': 'info',
  'class.updated': 'info',
  'class.enrollment_changed': 'info',
  'settings.updated': 'warning',
  'settings.grading_updated': 'warning',
  'auth.login': 'info',
  'auth.failed_login': 'error',
  'data.exported': 'warning',
  'data.imported': 'info',
  'consent.approved': 'info',
  'announcement.created': 'info',
  'role.changed': 'warning',
  'security.2fa_enabled': 'info',
  'billing.invoice_paid': 'info',
  'system.backup': 'info',
  'system.maintenance': 'warning',
};

const severityDot: Record<string, string> = {
  info: 'bg-blue-400',
  warning: 'bg-amber-400',
  error: 'bg-red-500',
};

const PAGE_SIZE = 15;

export default function AdminAuditLogsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedResource, setSelectedResource] = useState<string>('all');
  const [page, setPage] = useState(1);

  const resourceTypes = useMemo(() => {
    const types = new Set(mockAuditLogs.map((l) => l.resourceType));
    return ['all', ...Array.from(types).sort()];
  }, []);

  const filteredLogs = useMemo(() => {
    return mockAuditLogs.filter((log) => {
      const matchesSearch =
        log.action.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.details.toLowerCase().includes(searchQuery.toLowerCase()) ||
        log.ipAddress.includes(searchQuery);

      const matchesResource = selectedResource === 'all' || log.resourceType === selectedResource;

      return matchesSearch && matchesResource;
    });
  }, [searchQuery, selectedResource]);

  const totalPages = Math.ceil(filteredLogs.length / PAGE_SIZE);
  const paginatedLogs = filteredLogs.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const actionCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    mockAuditLogs.forEach((log) => {
      const type = log.resourceType;
      counts[type] = (counts[type] || 0) + 1;
    });
    return counts;
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 dark:from-slate-950 dark:via-cyan-950 dark:to-blue-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
              Audit Logs
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Track and review all system activities and changes
            </p>
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Logs
          </Button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Events</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{mockAuditLogs.length}</p>
                </div>
                <div className="p-3 rounded-xl bg-blue-100/60 dark:bg-blue-900/30">
                  <Activity className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Security Events</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {mockAuditLogs.filter((l) => l.resourceType === 'auth' || l.resourceType === 'security').length}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-amber-100/60 dark:bg-amber-900/30">
                  <Shield className="w-6 h-6 text-amber-600 dark:text-amber-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Failed Logins</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {mockAuditLogs.filter((l) => l.action === 'auth.failed_login').length}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-red-100/60 dark:bg-red-900/30">
                  <AlertTriangle className="w-6 h-6 text-red-600 dark:text-red-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Data Exports</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {mockAuditLogs.filter((l) => l.action === 'data.exported').length}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-cyan-100/60 dark:bg-cyan-900/30">
                  <Database className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-slate-400" />
            <Input
              placeholder="Search by action, user, details, or IP..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2 flex-wrap">
            {resourceTypes.map((type) => (
              <Button
                key={type}
                variant={selectedResource === type ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setSelectedResource(type);
                  setPage(1);
                }}
                className="capitalize"
              >
                {type === 'all' ? 'All' : type}
                {type !== 'all' && actionCounts[type] && (
                  <span className="ml-1 text-xs opacity-70">({actionCounts[type]})</span>
                )}
              </Button>
            ))}
          </div>
        </div>

        {/* Audit Log Table */}
        <div className="overflow-x-auto rounded-xl border border-white/30 dark:border-slate-700/30 glass backdrop-blur-lg bg-white/50 dark:bg-slate-800/30">
          <table className="w-full">
            <thead>
              <tr className="border-b border-white/20 dark:border-slate-700/50 bg-white/30 dark:bg-slate-800/50">
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Timestamp
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  User
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Action
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden md:table-cell">
                  Resource
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden lg:table-cell">
                  Details
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 hidden xl:table-cell">
                  IP Address
                </th>
              </tr>
            </thead>
            <tbody>
              {paginatedLogs.map((log) => {
                const severity = actionSeverity[log.action] || 'info';
                return (
                  <tr
                    key={log.id}
                    className="border-b border-white/10 dark:border-slate-700/20 hover:bg-white/20 dark:hover:bg-slate-700/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full flex-shrink-0 ${severityDot[severity]}`} />
                        <div>
                          <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-nowrap">
                            {new Date(log.timestamp).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </p>
                          <p className="text-xs text-slate-500 dark:text-slate-400">
                            {new Date(log.timestamp).toLocaleTimeString('en-US', {
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-sm font-medium text-slate-900 dark:text-white">
                        {log.userName}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <code className="text-xs font-mono px-2 py-1 rounded bg-slate-100 dark:bg-slate-700/50 text-slate-700 dark:text-slate-300">
                        {log.action}
                      </code>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <Badge className={resourceTypeColors[log.resourceType] || 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'}>
                        <span className="mr-1">{resourceTypeIcons[log.resourceType]}</span>
                        {log.resourceType}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-sm text-slate-600 dark:text-slate-400 max-w-[250px] truncate block">
                        {log.details}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell">
                      <code className="text-xs font-mono text-slate-500 dark:text-slate-400">
                        {log.ipAddress}
                      </code>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {paginatedLogs.length === 0 && (
            <div className="p-12 text-center">
              <Shield className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
              <p className="text-slate-600 dark:text-slate-400">
                No audit logs found matching your search
              </p>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredLogs.length > PAGE_SIZE && (
          <div className="flex items-center justify-between px-2 py-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing {(page - 1) * PAGE_SIZE + 1} - {Math.min(page * PAGE_SIZE, filteredLogs.length)} of {filteredLogs.length} events
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page <= 1}
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                let pageNum: number;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (page <= 3) {
                  pageNum = i + 1;
                } else if (page >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = page - 2 + i;
                }
                return (
                  <Button
                    key={pageNum}
                    variant={pageNum === page ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPage(pageNum)}
                    className="w-8 h-8 p-0"
                  >
                    {pageNum}
                  </Button>
                );
              })}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
