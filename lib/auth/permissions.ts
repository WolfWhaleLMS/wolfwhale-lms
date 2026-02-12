// Wolf Whale LMS - Role-Permission Matrix
// Phase C: Auth & permissions system
// Based on blueprint 07_Config_Examples.ts

// ---------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------

export type UserRole = 'student' | 'teacher' | 'parent' | 'admin' | 'super_admin'

export type Resource =
  | 'courses'
  | 'lessons'
  | 'assignments'
  | 'submissions'
  | 'grades'
  | 'attendance'
  | 'messages'
  | 'notifications'
  | 'users'
  | 'settings'
  | 'billing'
  | 'audit_logs'
  | 'reports'
  | 'gamification'
  | 'plaza'
  | 'skill_trees'

export type Action =
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'publish'
  | 'grade'
  | 'export'

// ---------------------------------------------------------------------
// Permission Matrix
// ---------------------------------------------------------------------

/**
 * Master permission map.
 *
 * Student:      Read courses/lessons/assignments. CRUD own submissions. Read own grades/messages. Update own profile.
 * Teacher:      CRUD own courses, publish lessons, create assignments, grade submissions, take attendance, manage gradebook.
 * Parent:       Read child's courses/assignments/submissions/grades/attendance. Messaging.
 * Admin:        Full control within tenant (everything except super_admin-only audit log deletion).
 * Super Admin:  Unrestricted across all resources and actions.
 */
const PERMISSION_MATRIX: Record<UserRole, Record<Resource, Action[]>> = {
  student: {
    courses:       ['read'],
    lessons:       ['read'],
    assignments:   ['read'],
    submissions:   ['create', 'read', 'update'],
    grades:        ['read'],
    attendance:    ['read'],
    messages:      ['create', 'read'],
    notifications: ['read', 'update'],
    users:         ['read', 'update'],           // own profile only
    settings:      [],
    billing:       [],
    audit_logs:    [],
    reports:       [],
    gamification:  ['read'],
    plaza:         ['read', 'create'],
    skill_trees:   ['read'],
  },

  teacher: {
    courses:       ['create', 'read', 'update', 'delete'],
    lessons:       ['create', 'read', 'update', 'delete', 'publish'],
    assignments:   ['create', 'read', 'update', 'delete'],
    submissions:   ['read', 'update', 'grade'],
    grades:        ['create', 'read', 'update', 'export'],
    attendance:    ['create', 'read', 'update'],
    messages:      ['create', 'read'],
    notifications: ['create', 'read', 'update'],
    users:         ['read'],
    settings:      ['read'],
    billing:       [],
    audit_logs:    [],
    reports:       ['read', 'export'],
    gamification:  ['create', 'read', 'update'],
    plaza:         ['read', 'create', 'update'],
    skill_trees:   ['create', 'read', 'update', 'delete'],
  },

  parent: {
    courses:       ['read'],
    lessons:       ['read'],
    assignments:   ['read'],
    submissions:   ['read'],
    grades:        ['read'],
    attendance:    ['read'],
    messages:      ['create', 'read'],
    notifications: ['read', 'update'],
    users:         ['read', 'update'],           // own profile only
    settings:      [],
    billing:       [],
    audit_logs:    [],
    reports:       [],
    gamification:  ['read'],
    plaza:         ['read'],
    skill_trees:   ['read'],
  },

  admin: {
    courses:       ['create', 'read', 'update', 'delete', 'publish', 'export'],
    lessons:       ['create', 'read', 'update', 'delete', 'publish'],
    assignments:   ['create', 'read', 'update', 'delete'],
    submissions:   ['read', 'update', 'grade', 'delete'],
    grades:        ['create', 'read', 'update', 'delete', 'export'],
    attendance:    ['create', 'read', 'update', 'delete', 'export'],
    messages:      ['create', 'read', 'delete'],
    notifications: ['create', 'read', 'update', 'delete'],
    users:         ['create', 'read', 'update', 'delete'],
    settings:      ['read', 'update'],
    billing:       ['read', 'update'],
    audit_logs:    ['read', 'export'],
    reports:       ['create', 'read', 'export'],
    gamification:  ['create', 'read', 'update', 'delete'],
    plaza:         ['create', 'read', 'update', 'delete'],
    skill_trees:   ['create', 'read', 'update', 'delete'],
  },

  super_admin: {
    courses:       ['create', 'read', 'update', 'delete', 'publish', 'export'],
    lessons:       ['create', 'read', 'update', 'delete', 'publish'],
    assignments:   ['create', 'read', 'update', 'delete'],
    submissions:   ['read', 'update', 'grade', 'delete'],
    grades:        ['create', 'read', 'update', 'delete', 'export'],
    attendance:    ['create', 'read', 'update', 'delete', 'export'],
    messages:      ['create', 'read', 'update', 'delete'],
    notifications: ['create', 'read', 'update', 'delete'],
    users:         ['create', 'read', 'update', 'delete'],
    settings:      ['create', 'read', 'update', 'delete'],
    billing:       ['create', 'read', 'update', 'delete', 'export'],
    audit_logs:    ['create', 'read', 'update', 'delete', 'export'],
    reports:       ['create', 'read', 'update', 'delete', 'export'],
    gamification:  ['create', 'read', 'update', 'delete', 'export'],
    plaza:         ['create', 'read', 'update', 'delete', 'export'],
    skill_trees:   ['create', 'read', 'update', 'delete', 'export'],
  },
}

// ---------------------------------------------------------------------
// Permission check
// ---------------------------------------------------------------------

/**
 * Checks whether `role` is allowed to perform `action` on `resource`.
 *
 * ```ts
 * hasPermission('student', 'courses', 'read')   // true
 * hasPermission('student', 'courses', 'delete')  // false
 * hasPermission('admin', 'billing', 'read')      // true
 * ```
 */
export function hasPermission(role: UserRole, resource: Resource, action: Action): boolean {
  const allowed = PERMISSION_MATRIX[role]?.[resource]
  if (!allowed) return false
  return allowed.includes(action)
}

// ---------------------------------------------------------------------
// Role helpers
// ---------------------------------------------------------------------

/** Returns the default post-login dashboard path for a given role. */
export function getRouteForRole(role: UserRole): string {
  const routes: Record<UserRole, string> = {
    student:     '/student/dashboard',
    teacher:     '/teacher/dashboard',
    parent:      '/parent/dashboard',
    admin:       '/admin/dashboard',
    super_admin: '/admin/dashboard',
  }
  return routes[role] ?? '/dashboard'
}

/** Human-readable label for a role value. */
export function getRoleLabel(role: UserRole): string {
  const labels: Record<UserRole, string> = {
    student:     'Student',
    teacher:     'Teacher',
    parent:      'Parent / Guardian',
    admin:       'School Admin',
    super_admin: 'Super Admin',
  }
  return labels[role] ?? role
}

// ---------------------------------------------------------------------
// Sidebar / nav menu items per role
// ---------------------------------------------------------------------

export interface MenuItem {
  label: string
  href: string
  icon: string
}

/** Returns the primary navigation menu items for a given role. */
export function getRoleMenuItems(role: UserRole): MenuItem[] {
  const common: MenuItem[] = [
    { label: 'Dashboard',     href: getRouteForRole(role), icon: 'LayoutDashboard' },
    { label: 'Messages',      href: '/messaging',           icon: 'MessageSquare' },
  ]

  const roleSpecific: Record<UserRole, MenuItem[]> = {
    student: [
      { label: 'Courses',        href: '/student/courses',         icon: 'BookOpen' },
      { label: 'Assignments',    href: '/student/assignments',     icon: 'ClipboardList' },
      { label: 'Grades',         href: '/student/grades',          icon: 'GraduationCap' },
      { label: 'Achievements',   href: '/student/achievements',    icon: 'Trophy' },
      { label: 'Plaza',          href: '/plaza',                   icon: 'Map' },
    ],

    teacher: [
      { label: 'Courses',       href: '/teacher/courses',        icon: 'BookOpen' },
      { label: 'Assignments',   href: '/teacher/assignments',    icon: 'ClipboardList' },
      { label: 'Gradebook',     href: '/teacher/gradebook',      icon: 'GraduationCap' },
      { label: 'Students',      href: '/teacher/students',       icon: 'Users' },
      { label: 'Virtual Plaza', href: '/plaza',                  icon: 'Map' },
      { label: 'Calendar',      href: '/calendar',               icon: 'Calendar' },
    ],

    parent: [
      { label: 'My Children',   href: '/parent/children',        icon: 'Users' },
      { label: 'Progress',      href: '/parent/progress',        icon: 'BarChart3' },
    ],

    admin: [
      { label: 'Users',          href: '/admin/users',            icon: 'Users' },
      { label: 'Classes',        href: '/admin/classes',          icon: 'BookOpen' },
      { label: 'Reports',        href: '/admin/reports',          icon: 'BarChart3' },
      { label: 'Attendance',     href: '/admin/attendance',        icon: 'CalendarCheck' },
      { label: 'Settings',       href: '/admin/settings',         icon: 'Settings' },
      { label: 'Plaza Settings', href: '/admin/plaza',            icon: 'Map' },
      { label: 'Compliance',     href: '/admin/compliance',       icon: 'Shield' },
      { label: 'Audit Logs',     href: '/admin/audit-logs',       icon: 'FileText' },
      { label: 'Calendar',       href: '/calendar',               icon: 'Calendar' },
      { label: 'Announcements',  href: '/announcements',          icon: 'Megaphone' },
    ],

    super_admin: [
      { label: 'Tenants',       href: '/admin/tenants',          icon: 'Building2' },
      { label: 'All Users',     href: '/admin/users',            icon: 'Users' },
      { label: 'Courses',       href: '/teacher/courses',        icon: 'BookOpen' },
      { label: 'Assignments',   href: '/teacher/assignments',    icon: 'ClipboardList' },
      { label: 'Gradebook',     href: '/teacher/gradebook',      icon: 'GraduationCap' },
      { label: 'Classes',       href: '/admin/classes',          icon: 'BookOpen' },
      { label: 'Reports',       href: '/admin/reports',          icon: 'BarChart3' },
      { label: 'Attendance',    href: '/admin/attendance',        icon: 'CalendarCheck' },
      { label: 'Settings',      href: '/admin/settings',         icon: 'Settings' },
      { label: 'Compliance',    href: '/admin/compliance',       icon: 'Shield' },
      { label: 'Audit Logs',    href: '/admin/audit-logs',       icon: 'FileText' },
      { label: 'Calendar',      href: '/calendar',               icon: 'Calendar' },
      { label: 'Announcements', href: '/announcements',          icon: 'Megaphone' },
    ],
  }

  return [...common, ...(roleSpecific[role] ?? [])]
}

// ---------------------------------------------------------------------
// Role hierarchy (useful for "at least admin" style checks)
// ---------------------------------------------------------------------

const ROLE_HIERARCHY: Record<UserRole, number> = {
  student:     0,
  parent:      1,
  teacher:     2,
  admin:       3,
  super_admin: 4,
}

/** Returns true when `role` has equal or higher privilege than `minimumRole`. */
export function isAtLeast(role: UserRole, minimumRole: UserRole): boolean {
  return (ROLE_HIERARCHY[role] ?? -1) >= (ROLE_HIERARCHY[minimumRole] ?? Infinity)
}

/** All available roles, ordered lowest to highest privilege. */
export const ALL_ROLES: UserRole[] = ['student', 'parent', 'teacher', 'admin', 'super_admin']
