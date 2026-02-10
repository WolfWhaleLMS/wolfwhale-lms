import { UserRole, GradeLevel, PetSpecies, SubscriptionTier } from '@/types';
import { Users, Book, Settings, GraduationCap, PieChart, Shield, Zap, Crown, Medal, Trophy } from 'lucide-react';

/* Application Metadata */
export const APP_NAME = 'Wolf Whale LMS';
export const APP_DESCRIPTION = 'A K-12 Learning Management System with gamification';
export const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';

/* User Roles - matching tenant_memberships.role constraint */
export const USER_ROLES: Record<UserRole, { label: string; description: string; icon: any }> = {
  student: {
    label: 'Student',
    description: 'Learn and earn XP through assignments and lessons',
    icon: GraduationCap,
  },
  teacher: {
    label: 'Teacher',
    description: 'Create courses, assignments, and track student progress',
    icon: Book,
  },
  parent: {
    label: 'Parent',
    description: 'Monitor your child\'s progress and achievements',
    icon: Users,
  },
  admin: {
    label: 'School Administrator',
    description: 'Manage school settings, staff, and students',
    icon: Settings,
  },
  super_admin: {
    label: 'Platform Administrator',
    description: 'Manage the entire Wolf Whale platform',
    icon: Shield,
  },
};

/* Grade Levels */
export const GRADE_LEVELS: GradeLevel[] = [
  'K', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12',
];

export const GRADE_LEVEL_NAMES: Record<GradeLevel, string> = {
  K: 'Kindergarten',
  '1': '1st Grade',
  '2': '2nd Grade',
  '3': '3rd Grade',
  '4': '4th Grade',
  '5': '5th Grade',
  '6': '6th Grade',
  '7': '7th Grade',
  '8': '8th Grade',
  '9': '9th Grade',
  '10': '10th Grade',
  '11': '11th Grade',
  '12': '12th Grade',
};

/* Pet Species */
export const PET_SPECIES: Record<PetSpecies, { label: string; family: 'wolf' | 'whale' | 'hybrid' | 'mythical'; emoji: string; description: string }> = {
  silver_wolf: {
    label: 'Silver Wolf',
    family: 'wolf',
    emoji: '🐺',
    description: 'A majestic wolf with silver fur',
  },
  timber_wolf: {
    label: 'Timber Wolf',
    family: 'wolf',
    emoji: '🐺',
    description: 'A strong and resilient timber wolf',
  },
  shadow_wolf: {
    label: 'Shadow Wolf',
    family: 'wolf',
    emoji: '🐺',
    description: 'A mysterious wolf of the night',
  },
  lunar_wolf: {
    label: 'Lunar Wolf',
    family: 'wolf',
    emoji: '🐺',
    description: 'A mystical wolf touched by moonlight',
  },
  blue_whale: {
    label: 'Blue Whale',
    family: 'whale',
    emoji: '🐋',
    description: 'The largest animal on Earth',
  },
  beluga: {
    label: 'Beluga',
    family: 'whale',
    emoji: '🐋',
    description: 'A gentle Arctic whale',
  },
  humpback: {
    label: 'Humpback Whale',
    family: 'whale',
    emoji: '🐋',
    description: 'A whale known for acrobatic breaches',
  },
  orca: {
    label: 'Orca',
    family: 'whale',
    emoji: '🐋',
    description: 'An intelligent apex predator',
  },
  wolphin: {
    label: 'Wolphin',
    family: 'hybrid',
    emoji: '🌊',
    description: 'A hybrid between wolf and dolphin',
  },
  whale_wolf: {
    label: 'Whale Wolf',
    family: 'hybrid',
    emoji: '🌊',
    description: 'A mystical hybrid creature',
  },
  aurora_guardian: {
    label: 'Aurora Guardian',
    family: 'mythical',
    emoji: '✨',
    description: 'A legendary mystical being',
  },
};

/* Pet Stages */
export const PET_STAGES: Record<'hatchling' | 'juvenile' | 'adolescent' | 'majestic', { label: string; xpRequired: number; description: string }> = {
  hatchling: {
    label: 'Hatchling',
    xpRequired: 0,
    description: 'Just born, needs lots of care',
  },
  juvenile: {
    label: 'Juvenile',
    xpRequired: 500,
    description: 'Growing and learning',
  },
  adolescent: {
    label: 'Adolescent',
    xpRequired: 1500,
    description: 'Becoming stronger and wiser',
  },
  majestic: {
    label: 'Majestic',
    xpRequired: 3000,
    description: 'Reached peak potential',
  },
};

/* XP Rewards */
export const XP_REWARDS = {
  assignment_submit: 20,
  on_time_bonus: 10,
  grade_a: 25,
  grade_b: 15,
  grade_c: 5,
  lesson_completion: 30,
  quiz_perfect: 50,
  quiz_good: 20,
  discussion_post: 10,
  attendance_perfect_week: 40,
  attendance_perfect_month: 100,
  achievement_unlock: 'varies',
  daily_login: 5,
  weekly_streak: 25,
  monthly_streak: 100,
} as const;

/* Coin Rewards */
export const COIN_REWARDS = {
  assignment_submit: 5,
  grade_a: 10,
  grade_b: 5,
  lesson_completion: 10,
  quiz_perfect: 20,
  daily_login: 2,
  achievement_unlock: 'varies',
} as const;

/* Gamification Limits */
export const GAMIFICATION_LIMITS = {
  daily_xp_cap: 300,
  weekly_xp_cap: 1800,
  daily_coin_cap: 100,
  max_streak_days: 365,
  pet_happiness_max: 100,
  pet_energy_max: 100,
  pet_knowledge_max: 100,
  pet_health_max: 100,
} as const;

/* Level Thresholds (40 levels) */
export const LEVEL_THRESHOLDS: number[] = [
  0, 100, 250, 450, 700, 1000, 1350, 1750, 2200, 2700, 3250, 3850, 4500, 5200,
  5950, 6750, 7600, 8500, 9450, 10450, 11500, 12600, 13750, 14950, 16200, 17500,
  18850, 20250, 21700, 23200, 24750, 26350, 28000, 29700, 31450, 33250, 35100,
  37000, 38950, 40960,
];

/* Tier Names */
export const TIER_NAMES: string[] = [
  'Pup Recruit',
  'Wave Runner',
  'Pack Scout',
  'Ocean Voyager',
  'Alpha Tracker',
  'Deep Diver',
  'Mythic Guardian',
];

/* Subscription Tiers - matches tenants.subscription_plan constraint */
export const SUBSCRIPTION_TIERS: Record<SubscriptionTier, {
  label: string;
  price: number;
  billing_period: 'monthly' | 'annual';
  features: string[];
  max_users: number;
  max_storage_gb: number;
}> = {
  free: {
    label: 'Free',
    price: 0,
    billing_period: 'monthly',
    features: [
      'Up to 10 students',
      '2 classes',
      'Basic features',
      'Community support',
      '1GB storage',
    ],
    max_users: 10,
    max_storage_gb: 1,
  },
  starter: {
    label: 'Starter',
    price: 99,
    billing_period: 'monthly',
    features: [
      'Up to 100 students',
      '10 classes',
      'Basic analytics',
      'Email support',
      '5GB storage',
    ],
    max_users: 100,
    max_storage_gb: 5,
  },
  growth: {
    label: 'Growth',
    price: 299,
    billing_period: 'monthly',
    features: [
      'Up to 500 students',
      'Unlimited classes',
      'Advanced analytics',
      'Priority support',
      '50GB storage',
      'Gamification features',
      'Custom branding',
    ],
    max_users: 500,
    max_storage_gb: 50,
  },
  enterprise: {
    label: 'Enterprise',
    price: 999,
    billing_period: 'monthly',
    features: [
      'Unlimited students',
      'Unlimited classes',
      'Custom analytics',
      '24/7 support',
      'Unlimited storage',
      'All features included',
      'Dedicated account manager',
      'Custom integrations',
      'White-label options',
    ],
    max_users: Infinity,
    max_storage_gb: Infinity,
  },
};

/* Date Formats */
export const DATE_FORMATS = {
  display_date: 'MMM d, yyyy',
  display_datetime: 'MMM d, yyyy h:mm a',
  input_date: 'yyyy-MM-dd',
  iso_date: "yyyy-MM-dd'T'HH:mm:ss.SSSxxx",
  month_year: 'MMMM yyyy',
  day_short: 'EEE',
  day_long: 'EEEE',
} as const;

/* File Upload Limits */
export const FILE_UPLOAD_LIMITS = {
  max_file_size_mb: 100,
  max_total_storage_per_user_mb: 5120,
  allowed_extensions: [
    'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
    'jpg', 'jpeg', 'png', 'gif', 'webp',
    'mp4', 'mov', 'avi', 'mkv',
    'mp3', 'wav', 'flac',
    'zip', 'rar', '7z',
    'txt', 'csv', 'json', 'xml',
  ],
  allowed_mime_types: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'application/vnd.ms-powerpoint',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'image/jpeg',
    'image/png',
    'image/gif',
    'image/webp',
    'video/mp4',
    'video/quicktime',
    'video/x-msvideo',
    'video/x-matroska',
    'audio/mpeg',
    'audio/wav',
    'audio/flac',
    'application/zip',
    'application/x-rar-compressed',
    'application/x-7z-compressed',
    'text/plain',
    'text/csv',
    'application/json',
    'application/xml',
  ],
} as const;

/* Navigation Items per Role */
export const NAV_ITEMS: Record<UserRole, Array<{ label: string; href: string; icon: any; badge?: string }>> = {
  student: [
    { label: 'Dashboard', href: '/student/dashboard', icon: PieChart },
    { label: 'Classes', href: '/student/courses', icon: Book },
    { label: 'Assignments', href: '/student/assignments', icon: Zap },
    { label: 'Pet', href: '/student/pet', icon: Crown },
    { label: 'Achievements', href: '/student/achievements', icon: Trophy },
    { label: 'Messages', href: '/student/messages', icon: Users },
  ],
  teacher: [
    { label: 'Dashboard', href: '/teacher/dashboard', icon: PieChart },
    { label: 'Classes', href: '/teacher/courses', icon: Book },
    { label: 'Assignments', href: '/teacher/assignments', icon: Zap },
    { label: 'Grades', href: '/teacher/grades', icon: Medal },
    { label: 'Attendance', href: '/teacher/attendance', icon: Users },
    { label: 'Messages', href: '/teacher/messages', icon: Users },
  ],
  parent: [
    { label: 'Dashboard', href: '/parent/dashboard', icon: PieChart },
    { label: 'Children', href: '/parent/children', icon: Users },
    { label: 'Progress', href: '/parent/progress', icon: Zap },
    { label: 'Messages', href: '/parent/messages', icon: Users },
  ],
  admin: [
    { label: 'Dashboard', href: '/admin/dashboard', icon: PieChart },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Classes', href: '/admin/classes', icon: Book },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
    { label: 'Audit Logs', href: '/admin/audit-logs', icon: Shield },
  ],
  super_admin: [
    { label: 'Dashboard', href: '/admin/dashboard', icon: PieChart },
    { label: 'Tenants', href: '/admin/tenants', icon: Building },
    { label: 'Users', href: '/admin/users', icon: Users },
    { label: 'Billing', href: '/admin/billing', icon: CreditCard },
    { label: 'Settings', href: '/admin/settings', icon: Settings },
  ],
};

/* HTTP Status Codes */
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
} as const;

/* Assignment Types Display */
export const ASSIGNMENT_TYPE_LABELS: Record<string, string> = {
  file_upload: 'File Upload',
  text_entry: 'Text Entry',
  quiz: 'Quiz',
  discussion: 'Discussion',
  external_url: 'External URL',
};

/* Attendance Status Labels */
export const ATTENDANCE_STATUS_LABELS: Record<string, string> = {
  present: 'Present',
  absent: 'Absent',
  late: 'Late',
  excused_absent: 'Excused Absent',
  excused_late: 'Excused Late',
};

/* Grade Letter Mapping */
export const GRADE_LETTERS: Record<number, string> = {
  90: 'A',
  80: 'B',
  70: 'C',
  60: 'D',
  0: 'F',
};

/* Notification Types */
export const NOTIFICATION_TYPES = {
  assignment_created: 'Assignment Created',
  assignment_due_soon: 'Assignment Due Soon',
  assignment_submitted: 'Assignment Submitted',
  grade_posted: 'Grade Posted',
  achievement_unlocked: 'Achievement Unlocked',
  level_up: 'Level Up',
  message_received: 'New Message',
  attendance_marked: 'Attendance Marked',
  parent_notification: 'Parent Notification',
  system: 'System',
} as const;

// Icon imports for nav (moved to separate line to avoid import issues)
import { Building, CreditCard } from 'lucide-react';
