'use client';

import { ReactNode } from 'react';
import { DashboardLayout } from '@/components/layouts/DashboardLayout';
import { useGradeLevel } from '@/hooks/useGradeLevel';
import { mockXPData, mockStudentProfile } from '@/lib/mock-data';

interface DashboardLayoutWrapperProps {
  children: ReactNode;
}

export default function DashboardLayoutWrapper({ children }: DashboardLayoutWrapperProps) {
  const { variant } = useGradeLevel();

  // Note: This is a placeholder that should be enhanced with:
  // 1. requireAuth() call to protect all dashboard routes
  // 2. User profile fetch from Supabase
  // 3. Role-based rendering
  // 4. Proper error handling

  return (
    <DashboardLayout
      userRole="student"
      userLevel={mockXPData.currentLevel}
      userXP={mockXPData.totalXP}
      userInitials={`${mockStudentProfile.firstName[0]}${mockStudentProfile.lastName[0]}`}
      userName={`${mockStudentProfile.firstName} ${mockStudentProfile.lastName}`}
      userCoins={mockXPData.coinsBalance}
      notificationCount={2}
      gradeVariant={variant}
    >
      {children}
    </DashboardLayout>
  );
}
