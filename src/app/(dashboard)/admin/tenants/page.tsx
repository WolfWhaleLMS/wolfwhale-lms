'use client';

import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Progress } from '@/components/ui/Progress';
import {
  Search,
  Plus,
  Building2,
  Users,
  HardDrive,
  MoreVertical,
  Download,
  Globe,
  CheckCircle,
  AlertTriangle,
  XCircle,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';

// Mock tenant/school data for super admin view
interface MockTenant {
  id: string;
  name: string;
  slug: string;
  domain: string;
  plan: 'free' | 'starter' | 'growth' | 'enterprise';
  status: 'active' | 'trial' | 'suspended' | 'cancelled';
  studentCount: number;
  teacherCount: number;
  adminCount: number;
  storageUsedGb: number;
  storageMaxGb: number;
  createdAt: string;
  lastActivity: string;
  region: string;
}

const mockTenants: MockTenant[] = [
  {
    id: 'ten_001',
    name: 'Hillside Academy',
    slug: 'hillside-academy',
    domain: 'hillside-academy.edu',
    plan: 'growth',
    status: 'active',
    studentCount: 450,
    teacherCount: 48,
    adminCount: 2,
    storageUsedGb: 18.4,
    storageMaxGb: 50,
    createdAt: '2024-08-15T00:00:00Z',
    lastActivity: '2026-02-09T10:30:00Z',
    region: 'US West',
  },
  {
    id: 'ten_002',
    name: 'Riverside Elementary',
    slug: 'riverside-elementary',
    domain: 'riverside-elem.edu',
    plan: 'starter',
    status: 'active',
    studentCount: 85,
    teacherCount: 12,
    adminCount: 1,
    storageUsedGb: 2.1,
    storageMaxGb: 5,
    createdAt: '2025-01-10T00:00:00Z',
    lastActivity: '2026-02-08T15:45:00Z',
    region: 'US East',
  },
  {
    id: 'ten_003',
    name: 'Oakwood Prep School',
    slug: 'oakwood-prep',
    domain: 'oakwoodprep.org',
    plan: 'enterprise',
    status: 'active',
    studentCount: 1200,
    teacherCount: 95,
    adminCount: 5,
    storageUsedGb: 82.3,
    storageMaxGb: 999,
    createdAt: '2024-03-22T00:00:00Z',
    lastActivity: '2026-02-09T12:00:00Z',
    region: 'US East',
  },
  {
    id: 'ten_004',
    name: 'Sunrise Learning Center',
    slug: 'sunrise-learning',
    domain: 'sunrise-lc.edu',
    plan: 'free',
    status: 'trial',
    studentCount: 8,
    teacherCount: 2,
    adminCount: 1,
    storageUsedGb: 0.3,
    storageMaxGb: 1,
    createdAt: '2026-01-28T00:00:00Z',
    lastActivity: '2026-02-07T09:15:00Z',
    region: 'US Central',
  },
  {
    id: 'ten_005',
    name: 'Pine Valley School District',
    slug: 'pine-valley-sd',
    domain: 'pinevalleysd.edu',
    plan: 'enterprise',
    status: 'active',
    studentCount: 3500,
    teacherCount: 210,
    adminCount: 12,
    storageUsedGb: 245.8,
    storageMaxGb: 999,
    createdAt: '2023-11-01T00:00:00Z',
    lastActivity: '2026-02-09T11:30:00Z',
    region: 'US West',
  },
  {
    id: 'ten_006',
    name: 'Maple Grove School',
    slug: 'maple-grove',
    domain: 'maplegrove.edu',
    plan: 'growth',
    status: 'active',
    studentCount: 320,
    teacherCount: 28,
    adminCount: 2,
    storageUsedGb: 12.7,
    storageMaxGb: 50,
    createdAt: '2025-04-15T00:00:00Z',
    lastActivity: '2026-02-09T08:45:00Z',
    region: 'US Central',
  },
  {
    id: 'ten_007',
    name: 'Harbor View Academy',
    slug: 'harbor-view',
    domain: 'harborview.org',
    plan: 'starter',
    status: 'suspended',
    studentCount: 60,
    teacherCount: 8,
    adminCount: 1,
    storageUsedGb: 1.8,
    storageMaxGb: 5,
    createdAt: '2025-06-01T00:00:00Z',
    lastActivity: '2026-01-15T14:20:00Z',
    region: 'US East',
  },
  {
    id: 'ten_008',
    name: 'Coastal Academy',
    slug: 'coastal-academy',
    domain: 'coastalacademy.edu',
    plan: 'growth',
    status: 'active',
    studentCount: 410,
    teacherCount: 35,
    adminCount: 3,
    storageUsedGb: 22.1,
    storageMaxGb: 50,
    createdAt: '2024-09-01T00:00:00Z',
    lastActivity: '2026-02-09T09:00:00Z',
    region: 'US West',
  },
  {
    id: 'ten_009',
    name: 'Horizon Learning',
    slug: 'horizon-learning',
    domain: 'horizon-learning.com',
    plan: 'free',
    status: 'cancelled',
    studentCount: 0,
    teacherCount: 1,
    adminCount: 1,
    storageUsedGb: 0.1,
    storageMaxGb: 1,
    createdAt: '2025-11-20T00:00:00Z',
    lastActivity: '2025-12-30T10:00:00Z',
    region: 'US Central',
  },
  {
    id: 'ten_010',
    name: 'Greenfield International School',
    slug: 'greenfield-intl',
    domain: 'greenfield-intl.edu',
    plan: 'enterprise',
    status: 'active',
    studentCount: 2100,
    teacherCount: 150,
    adminCount: 8,
    storageUsedGb: 156.2,
    storageMaxGb: 999,
    createdAt: '2024-01-15T00:00:00Z',
    lastActivity: '2026-02-09T13:00:00Z',
    region: 'US East',
  },
];

const planColors: Record<string, string> = {
  free: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  starter: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  growth: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300',
  enterprise: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300',
};

const statusColors: Record<string, string> = {
  active: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300',
  trial: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300',
  suspended: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300',
  cancelled: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
};

const statusIcons: Record<string, React.ReactNode> = {
  active: <CheckCircle className="w-3 h-3" />,
  trial: <TrendingUp className="w-3 h-3" />,
  suspended: <AlertTriangle className="w-3 h-3" />,
  cancelled: <XCircle className="w-3 h-3" />,
};

const PAGE_SIZE = 10;

export default function AdminTenantsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPlan, setSelectedPlan] = useState<string>('all');
  const [page, setPage] = useState(1);

  const filteredTenants = useMemo(() => {
    return mockTenants.filter((tenant) => {
      const matchesSearch =
        tenant.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.domain.toLowerCase().includes(searchQuery.toLowerCase()) ||
        tenant.slug.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesPlan = selectedPlan === 'all' || tenant.plan === selectedPlan;

      return matchesSearch && matchesPlan;
    });
  }, [searchQuery, selectedPlan]);

  const totalPages = Math.ceil(filteredTenants.length / PAGE_SIZE);
  const paginatedTenants = filteredTenants.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const totalStudents = mockTenants.reduce((sum, t) => sum + t.studentCount, 0);
  const totalTeachers = mockTenants.reduce((sum, t) => sum + t.teacherCount, 0);
  const activeTenants = mockTenants.filter((t) => t.status === 'active').length;
  const totalStorage = mockTenants.reduce((sum, t) => sum + t.storageUsedGb, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-cyan-50 to-blue-50 dark:from-slate-950 dark:via-cyan-950 dark:to-blue-950 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">
              Tenant Management
            </h1>
            <p className="text-lg text-slate-600 dark:text-slate-400">
              Manage schools and organizations on the platform
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700 text-white">
              <Plus className="w-4 h-4 mr-2" />
              Add Tenant
            </Button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Tenants</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{mockTenants.length}</p>
                  <p className="text-xs text-green-600 dark:text-green-400 font-semibold mt-1">
                    {activeTenants} active
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-blue-100/60 dark:bg-blue-900/30">
                  <Building2 className="w-6 h-6 text-blue-600 dark:text-blue-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Students</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {totalStudents.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-green-100/60 dark:bg-green-900/30">
                  <Users className="w-6 h-6 text-green-600 dark:text-green-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Teachers</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {totalTeachers.toLocaleString()}
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-purple-100/60 dark:bg-purple-900/30">
                  <Users className="w-6 h-6 text-purple-600 dark:text-purple-400" />
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-600 dark:text-slate-400 mb-1">Storage Used</p>
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">
                    {totalStorage.toFixed(1)} GB
                  </p>
                </div>
                <div className="p-3 rounded-xl bg-orange-100/60 dark:bg-orange-900/30">
                  <HardDrive className="w-6 h-6 text-orange-600 dark:text-orange-400" />
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
              placeholder="Search by school name, domain, or slug..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1);
              }}
              className="pl-10"
            />
          </div>
          <div className="flex gap-2">
            {['all', 'free', 'starter', 'growth', 'enterprise'].map((plan) => (
              <Button
                key={plan}
                variant={selectedPlan === plan ? 'default' : 'outline'}
                size="sm"
                onClick={() => {
                  setSelectedPlan(plan);
                  setPage(1);
                }}
                className="capitalize"
              >
                {plan}
              </Button>
            ))}
          </div>
        </div>

        {/* Tenants List */}
        <div className="space-y-4">
          {paginatedTenants.map((tenant) => (
            <Card key={tenant.id} className="hover:shadow-lg transition-shadow duration-200">
              <CardContent className="p-6">
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  {/* Left: Info */}
                  <div className="flex items-start gap-4 flex-1 min-w-0">
                    <div className="p-3 rounded-xl bg-indigo-100/60 dark:bg-indigo-900/30 flex-shrink-0">
                      <Building2 className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-3 flex-wrap">
                        <h3 className="font-semibold text-lg text-slate-900 dark:text-white truncate">
                          {tenant.name}
                        </h3>
                        <Badge className={planColors[tenant.plan]}>
                          {tenant.plan}
                        </Badge>
                        <Badge className={statusColors[tenant.status]}>
                          <span className="mr-1">{statusIcons[tenant.status]}</span>
                          {tenant.status}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 mt-1 text-sm text-slate-500 dark:text-slate-400">
                        <span className="flex items-center gap-1">
                          <Globe className="w-3 h-3" />
                          {tenant.domain}
                        </span>
                        <span>{tenant.region}</span>
                        <span>
                          Joined {new Date(tenant.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            year: 'numeric',
                          })}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Center: Stats */}
                  <div className="flex gap-6 lg:gap-8 items-center">
                    <div className="text-center">
                      <p className="text-xl font-bold text-slate-900 dark:text-white">
                        {tenant.studentCount.toLocaleString()}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Students</p>
                    </div>
                    <div className="text-center">
                      <p className="text-xl font-bold text-slate-900 dark:text-white">
                        {tenant.teacherCount}
                      </p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Teachers</p>
                    </div>
                    <div className="min-w-[120px]">
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-slate-500 dark:text-slate-400">Storage</span>
                        <span className="text-slate-700 dark:text-slate-300 font-medium">
                          {tenant.storageUsedGb.toFixed(1)} / {tenant.storageMaxGb === 999 ? 'Unlimited' : `${tenant.storageMaxGb} GB`}
                        </span>
                      </div>
                      <Progress
                        value={tenant.storageMaxGb === 999 ? 25 : Math.min(100, (tenant.storageUsedGb / tenant.storageMaxGb) * 100)}
                        className="h-2"
                      />
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex-shrink-0">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-48">
                        <DropdownMenuItem>View Dashboard</DropdownMenuItem>
                        <DropdownMenuItem>Edit Settings</DropdownMenuItem>
                        <DropdownMenuItem>Manage Users</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        {tenant.status === 'active' ? (
                          <DropdownMenuItem className="text-red-600 dark:text-red-400">
                            Suspend Tenant
                          </DropdownMenuItem>
                        ) : tenant.status === 'suspended' ? (
                          <DropdownMenuItem className="text-green-600 dark:text-green-400">
                            Reactivate Tenant
                          </DropdownMenuItem>
                        ) : (
                          <DropdownMenuItem className="text-red-600 dark:text-red-400">
                            Delete Tenant
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {paginatedTenants.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <Building2 className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
                <p className="text-slate-600 dark:text-slate-400">
                  No tenants found matching your search
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Pagination */}
        {filteredTenants.length > PAGE_SIZE && (
          <div className="flex items-center justify-between px-2 py-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Showing {(page - 1) * PAGE_SIZE + 1} - {Math.min(page * PAGE_SIZE, filteredTenants.length)} of {filteredTenants.length} tenants
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
