/* Main Type Exports */

export * from './database.types';

/* Session and User Types */

export interface SessionUser {
  id: string;
  email: string;
  role: 'student' | 'teacher' | 'parent' | 'admin' | 'super_admin';
  tenant_id: string;
  profile?: {
    first_name: string | null;
    last_name: string | null;
    avatar_url?: string | null;
  };
}

/* Navigation Types */

export interface NavigationItem {
  label: string;
  href: string;
  icon?: React.ComponentType<{ className?: string }>;
  roles?: string[];
  badge?: string | number;
  children?: NavigationItem[];
}

/* API Response Types */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  pagination?: {
    page: number;
    pageSize: number;
    total: number;
    totalPages: number;
  };
}

/* Dashboard Statistics */

export interface StudentDashboardStats {
  totalXP: number;
  currentLevel: number;
  currentTier: string;
  nextLevelXP: number;
  coinsBalance: number;
  streakDays: number;
  pendingAssignments: number;
  completionRate: number;
  averageGrade: number;
  petData: {
    name: string;
    species: string;
    stage: string;
    happiness: number;
    energy: number;
    knowledge: number;
    health: number;
  };
}

export interface TeacherDashboardStats {
  totalClasses: number;
  totalStudents: number;
  averageAttendance: number;
  pendingGrades: number;
  classGradeDistribution: {
    letterGrade: string;
    count: number;
    percentage: number;
  }[];
  recentSubmissions: {
    id: string;
    studentName: string;
    assignmentTitle: string;
    submittedAt: string;
    status: string;
  }[];
  studentEngagementTrend: {
    week: string;
    averageXP: number;
    activeStudents: number;
  }[];
}

export interface ParentDashboardStats {
  childrenCount: number;
  overallAverageGrade: number;
  childrenProgress: {
    id: string;
    name: string;
    averageGrade: number;
    currentLevel: number;
    xp: number;
    attendanceRate: number;
  }[];
  recentActivities: {
    id: string;
    studentName: string;
    activity: string;
    timestamp: string;
  }[];
  upcomingAssignments: {
    id: string;
    studentName: string;
    title: string;
    dueDate: string;
    status: string;
  }[];
}

export interface AdminDashboardStats {
  totalTenants: number;
  activeUsers: number;
  totalCourses: number;
  totalStudents: number;
  subscriptionRevenue: number;
  systemHealth: {
    uptime: number;
    apiLatency: number;
    errorRate: number;
  };
  tenantActivity: {
    name: string;
    activeUsers: number;
    tier: string;
    status: string;
  }[];
  platformMetrics: {
    date: string;
    newUsers: number;
    activeUsers: number;
    xpEarned: number;
    assignmentsCompleted: number;
  }[];
}

/* Form and Validation Types */

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  role: 'student' | 'parent' | 'teacher';
  acceptTerms: boolean;
  acceptCOPPA?: boolean;
}

export interface CreateClassFormData {
  name: string;
  code: string;
  description: string;
  courseId: string;
  academicTermId: string;
  roomNumber?: string;
  maxStudents: number;
}

export interface CreateAssignmentFormData {
  title: string;
  description: string;
  type: 'file_upload' | 'text_entry' | 'quiz' | 'discussion' | 'external_url';
  dueDate: string;
  pointsPossible: number;
  xpReward: number;
  allowLate: boolean;
  latePenaltyPercent?: number;
}

/* Gamification Types */

export interface XPRewardEvent {
  type: string;
  studentId: string;
  xpAmount: number;
  coinAmount: number;
  sourceType: string;
  sourceId?: string;
  description: string;
}

export interface LevelUpEvent {
  studentId: string;
  previousLevel: number;
  newLevel: number;
  totalXP: number;
  tierName: string;
  rewardCoin: number;
}

export interface PetInteraction {
  petId: string;
  type: 'feed' | 'play' | 'study' | 'rest';
  happinessChange: number;
  energyChange: number;
  knowledgeChange: number;
  healthChange: number;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  iconUrl?: string;
  category: string;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum' | 'legendary';
  xpReward: number;
  coinReward: number;
  requirement: Record<string, any>;
}

export interface StudentAchievementUnlocked {
  achievementId: string;
  studentId: string;
  unlockedAt: string;
  notificationSent: boolean;
}

/* Notification Types */

export interface Notification {
  id: string;
  type: 'assignment' | 'grade' | 'achievement' | 'system' | 'message' | 'attendance';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

/* Pagination and Sorting */

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface SortParams {
  sortBy: string;
  sortOrder: 'asc' | 'desc';
}

export interface FilterParams {
  [key: string]: any;
}

/* File Upload Types */

export interface FileUploadProgress {
  id: string;
  fileName: string;
  progress: number;
  status: 'pending' | 'uploading' | 'completed' | 'error';
  error?: string;
}

/* Error Types */

export interface AppError {
  code: string;
  message: string;
  statusCode: number;
  details?: Record<string, any>;
}

/* Theme Types */

export type Theme = 'light' | 'dark' | 'system';

export interface ThemeConfig {
  primary: string;
  secondary: string;
  accent: string;
  destructive: string;
}
