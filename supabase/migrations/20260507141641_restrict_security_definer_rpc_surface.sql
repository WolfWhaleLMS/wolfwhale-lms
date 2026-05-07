-- Emergency launch hardening: restrict direct RPC access to security-definer
-- functions that currently bypass row-level permissions and accept tenant,
-- student, or table identifiers from callers.
--
-- Supabase advisors and catalog checks on 2026-05-07 showed these functions
-- were callable by anon and authenticated roles. RLS helper functions used
-- inside policies are intentionally not revoked from authenticated here; they
-- need a later private-schema refactor with policy updates.

REVOKE EXECUTE ON FUNCTION public.create_grade_notification() FROM anon;
REVOKE EXECUTE ON FUNCTION public.create_grade_notification() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.create_grade_notification() FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION public.get_attendance_summary(uuid, date, date) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_attendance_summary(uuid, date, date) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.get_attendance_summary(uuid, date, date) FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION public.get_course_enrollment_counts(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_course_enrollment_counts(uuid) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.get_course_enrollment_counts(uuid) FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION public.get_module_lesson_counts(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_module_lesson_counts(uuid) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.get_module_lesson_counts(uuid) FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION public.get_student_attendance_summary(uuid, uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_student_attendance_summary(uuid, uuid) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.get_student_attendance_summary(uuid, uuid) FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION public.get_tenant_role_counts(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_tenant_role_counts(uuid) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.get_tenant_role_counts(uuid) FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION public.get_token_leaderboard(uuid, timestamp with time zone, integer) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_token_leaderboard(uuid, timestamp with time zone, integer) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.get_token_leaderboard(uuid, timestamp with time zone, integer) FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION public.get_user_courses(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_user_courses(uuid) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.get_user_courses(uuid) FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM anon;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC;

REVOKE EXECUTE ON FUNCTION public.reorder_items(text, text, uuid, uuid[]) FROM anon;
REVOKE EXECUTE ON FUNCTION public.reorder_items(text, text, uuid, uuid[]) FROM authenticated;
REVOKE EXECUTE ON FUNCTION public.reorder_items(text, text, uuid, uuid[]) FROM PUBLIC;

-- Remove anonymous/public direct RPC access from helper functions while keeping
-- authenticated execution available for existing RLS policies that call them.
REVOKE EXECUTE ON FUNCTION public.get_tenant_role(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_tenant_role(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_tenant_role(uuid) TO authenticated;

REVOKE EXECUTE ON FUNCTION public.get_user_tenant_ids() FROM anon;
REVOKE EXECUTE ON FUNCTION public.get_user_tenant_ids() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.get_user_tenant_ids() TO authenticated;

REVOKE EXECUTE ON FUNCTION public.is_tenant_member(uuid) FROM anon;
REVOKE EXECUTE ON FUNCTION public.is_tenant_member(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.is_tenant_member(uuid) TO authenticated;

-- Close mutable search_path warnings on known security-definer functions. A
-- later migration should move policy helpers out of the exposed public schema.
ALTER FUNCTION public.create_grade_notification() SET search_path = public;
ALTER FUNCTION public.get_user_courses(uuid) SET search_path = public;
ALTER FUNCTION public.handle_new_user() SET search_path = public;
