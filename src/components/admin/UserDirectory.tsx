'use client';

import * as React from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MoreHorizontal,
  Edit2,
  Eye,
  KeyRound,
  UserX,
  UserCheck,
  Mail,
  Download,
  CheckSquare,
  Square,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn, formatRelativeTime } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Avatar, AvatarFallback } from '@/components/ui/Avatar';
import { Checkbox } from '@/components/ui/Checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/DropdownMenu';
import type { MockUser } from '@/data/admin-mock-data';

interface UserDirectoryProps {
  users: MockUser[];
  totalCount: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  selectedIds: Set<string>;
  onSelectionChange: (ids: Set<string>) => void;
  onEditUser: (user: MockUser) => void;
  onDeactivateUser: (user: MockUser) => void;
  onReactivateUser: (user: MockUser) => void;
  sortBy: string;
  sortDirection: 'asc' | 'desc' | null;
  onSort: (key: string) => void;
}

const roleColors: Record<string, string> = {
  student: 'bg-whale-100 text-whale-700 dark:bg-whale-900/30 dark:text-whale-300',
  teacher: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300',
  parent: 'bg-aurora-100 text-aurora-700 dark:bg-aurora-900/30 dark:text-aurora-300',
  admin: 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-300',
};

const statusColors: Record<string, string> = {
  active: 'bg-success-100 text-success-700 dark:bg-success-900/30 dark:text-success-300',
  inactive: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  invited: 'bg-gold-100 text-gold-700 dark:bg-gold-900/30 dark:text-gold-300',
  suspended: 'bg-danger-100 text-danger-700 dark:bg-danger-900/30 dark:text-danger-300',
};

function SortableHeader({
  label,
  sortKey,
  currentSort,
  currentDirection,
  onSort,
}: {
  label: string;
  sortKey: string;
  currentSort: string;
  currentDirection: 'asc' | 'desc' | null;
  onSort: (key: string) => void;
}) {
  const isActive = currentSort === sortKey;
  return (
    <button
      onClick={() => onSort(sortKey)}
      className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 transition-colors"
    >
      {label}
      {isActive && (
        <span className="text-indigo-500">
          {currentDirection === 'asc' ? '\u2191' : '\u2193'}
        </span>
      )}
    </button>
  );
}

export function UserDirectory({
  users,
  totalCount,
  page,
  pageSize,
  onPageChange,
  selectedIds,
  onSelectionChange,
  onEditUser,
  onDeactivateUser,
  onReactivateUser,
  sortBy,
  sortDirection,
  onSort,
}: UserDirectoryProps) {
  const totalPages = Math.ceil(totalCount / pageSize);
  const allSelected = users.length > 0 && users.every((u) => selectedIds.has(u.id));
  const someSelected = users.some((u) => selectedIds.has(u.id));

  const toggleAll = () => {
    if (allSelected) {
      const newSet = new Set(selectedIds);
      users.forEach((u) => newSet.delete(u.id));
      onSelectionChange(newSet);
    } else {
      const newSet = new Set(selectedIds);
      users.forEach((u) => newSet.add(u.id));
      onSelectionChange(newSet);
    }
  };

  const toggleOne = (id: string) => {
    const newSet = new Set(selectedIds);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    onSelectionChange(newSet);
  };

  return (
    <div className="space-y-0">
      {/* Table */}
      <div className="overflow-x-auto rounded-xl border border-white/30 dark:border-slate-700/30 glass backdrop-blur-lg bg-white/50 dark:bg-slate-800/30">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/20 dark:border-slate-700/50 bg-white/30 dark:bg-slate-800/50">
              <th className="w-10 px-4 py-3">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={toggleAll}
                  aria-label="Select all"
                />
              </th>
              <th className="px-4 py-3 text-left">
                <SortableHeader label="Name" sortKey="name" currentSort={sortBy} currentDirection={sortDirection} onSort={onSort} />
              </th>
              <th className="px-4 py-3 text-left hidden md:table-cell">
                <SortableHeader label="Email" sortKey="email" currentSort={sortBy} currentDirection={sortDirection} onSort={onSort} />
              </th>
              <th className="px-4 py-3 text-left">
                <SortableHeader label="Role" sortKey="role" currentSort={sortBy} currentDirection={sortDirection} onSort={onSort} />
              </th>
              <th className="px-4 py-3 text-left hidden sm:table-cell">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Status</span>
              </th>
              <th className="px-4 py-3 text-left hidden lg:table-cell">
                <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Grade</span>
              </th>
              <th className="px-4 py-3 text-left hidden xl:table-cell">
                <SortableHeader label="Last Login" sortKey="lastLogin" currentSort={sortBy} currentDirection={sortDirection} onSort={onSort} />
              </th>
              <th className="px-4 py-3 text-left hidden xl:table-cell">
                <SortableHeader label="Created" sortKey="createdAt" currentSort={sortBy} currentDirection={sortDirection} onSort={onSort} />
              </th>
              <th className="w-12 px-4 py-3" />
            </tr>
          </thead>
          <tbody>
            <AnimatePresence mode="popLayout">
              {users.map((user, idx) => {
                const initials = `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
                return (
                  <motion.tr
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.15, delay: idx * 0.02 }}
                    className={cn(
                      'border-b border-white/10 dark:border-slate-700/20 transition-colors',
                      selectedIds.has(user.id)
                        ? 'bg-indigo-50/50 dark:bg-indigo-900/10'
                        : 'hover:bg-white/20 dark:hover:bg-slate-700/20'
                    )}
                  >
                    <td className="px-4 py-3">
                      <Checkbox
                        checked={selectedIds.has(user.id)}
                        onCheckedChange={() => toggleOne(user.id)}
                        aria-label={`Select ${user.firstName} ${user.lastName}`}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/admin/users/${user.id}`}
                        className="flex items-center gap-3 group"
                      >
                        <Avatar className="h-8 w-8">
                          <AvatarFallback className="text-xs bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300">
                            {initials}
                          </AvatarFallback>
                        </Avatar>
                        <span className="font-medium text-sm text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                          {user.firstName} {user.lastName}
                        </span>
                      </Link>
                    </td>
                    <td className="px-4 py-3 hidden md:table-cell">
                      <span className="text-sm text-slate-600 dark:text-slate-400 truncate max-w-[200px] block">
                        {user.email}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <Badge className={cn('capitalize text-[11px]', roleColors[user.role])}>
                        {user.role}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden sm:table-cell">
                      <Badge className={cn('capitalize text-[11px]', statusColors[user.status])}>
                        {user.status}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 hidden lg:table-cell">
                      <span className="text-sm text-slate-600 dark:text-slate-400">
                        {user.grade ? (user.grade === 'K' ? 'Kindergarten' : `Grade ${user.grade}`) : '--'}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell">
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {formatRelativeTime(user.lastLogin)}
                      </span>
                    </td>
                    <td className="px-4 py-3 hidden xl:table-cell">
                      <span className="text-sm text-slate-500 dark:text-slate-400">
                        {new Date(user.createdAt).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/users/${user.id}`} className="flex items-center gap-2">
                              <Eye className="h-4 w-4" /> View Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => onEditUser(user)} className="flex items-center gap-2">
                            <Edit2 className="h-4 w-4" /> Edit
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <KeyRound className="h-4 w-4" /> Reset Password
                          </DropdownMenuItem>
                          <DropdownMenuItem className="flex items-center gap-2">
                            <Mail className="h-4 w-4" /> Send Message
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          {user.status === 'active' ? (
                            <DropdownMenuItem
                              onClick={() => onDeactivateUser(user)}
                              className="flex items-center gap-2 text-danger-600 dark:text-danger-400"
                            >
                              <UserX className="h-4 w-4" /> Deactivate
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => onReactivateUser(user)}
                              className="flex items-center gap-2 text-success-600 dark:text-success-400"
                            >
                              <UserCheck className="h-4 w-4" /> Reactivate
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </motion.tr>
                );
              })}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-2 py-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Showing {Math.min((page - 1) * pageSize + 1, totalCount)}
          {' '}-{' '}
          {Math.min(page * pageSize, totalCount)} of {totalCount} users
          {selectedIds.size > 0 && (
            <span className="ml-2 font-medium text-indigo-600 dark:text-indigo-400">
              ({selectedIds.size} selected)
            </span>
          )}
        </p>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page - 1)}
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
                onClick={() => onPageChange(pageNum)}
                className="w-8 h-8 p-0"
              >
                {pageNum}
              </Button>
            );
          })}
          <Button
            variant="outline"
            size="sm"
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
