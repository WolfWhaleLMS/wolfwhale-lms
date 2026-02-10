'use client';

import * as React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Sidebar } from './Sidebar';
import { TopNav } from './TopNav';
import { MobileNav } from './MobileNav';
import { UserRole } from '@/types';
import { BreadcrumbsProps } from './Breadcrumbs';
import type { DashboardVariant } from '@/hooks/useGradeLevel';

export interface DashboardLayoutProps {
  children: React.ReactNode;
  userRole?: UserRole;
  userLevel?: number;
  userXP?: number;
  userInitials?: string;
  userImage?: string;
  userName?: string;
  userCoins?: number;
  notificationCount?: number;
  gradeVariant?: DashboardVariant;
  onSearch?: (query: string) => void;
  onLogout?: () => void;
  breadcrumbItems?: BreadcrumbsProps['items'];
}

export function DashboardLayout({
  children,
  userRole = 'student',
  userLevel = 1,
  userXP = 0,
  userInitials = 'JD',
  userImage,
  userName = 'John Doe',
  userCoins = 0,
  notificationCount = 0,
  gradeVariant,
  onSearch,
  onLogout,
  breadcrumbItems,
}: DashboardLayoutProps) {
  const [isCollapsed, setIsCollapsed] = React.useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-950 dark:to-slate-900">
      {/* Sidebar */}
      <Sidebar
        isCollapsed={isCollapsed}
        onCollapsedChange={setIsCollapsed}
        userRole={userRole}
        userLevel={userLevel}
        userXP={userXP}
        gradeVariant={gradeVariant}
      />

      {/* Top Navigation */}
      <TopNav
        userRole={userRole}
        userInitials={userInitials}
        userImage={userImage}
        userName={userName}
        userXP={userXP}
        userCoins={userCoins}
        notificationCount={notificationCount}
        onSearch={onSearch}
        onLogout={onLogout}
        breadcrumbItems={breadcrumbItems}
      />

      {/* Mobile Navigation */}
      <MobileNav userRole={userRole} />

      {/* Main Content */}
      <motion.main
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className={cn(
          'transition-all duration-300',
          isCollapsed ? 'ml-72 md:ml-[72px]' : 'ml-280 md:ml-[280px]',
          'mt-16 mb-20 md:mb-0 px-4 md:px-8 py-6'
        )}
        style={{
          marginLeft: isCollapsed ? '72px' : '280px',
        }}
      >
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </motion.main>
    </div>
  );
}
