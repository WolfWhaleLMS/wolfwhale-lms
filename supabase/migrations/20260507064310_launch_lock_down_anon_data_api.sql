-- Emergency launch hardening: remove anonymous Data API access to school data.
--
-- Supabase advisors on 2026-05-07 showed the anon role could SELECT 72 public
-- objects, including grades, submissions, messages, attendance, audit logs,
-- profiles, student-parent links, and class codes. For a school launch, the
-- safe default is no anonymous access to application tables or RPC functions.
--
-- Authenticated grants remain in place here because the application should use
-- authenticated Supabase clients with RLS. Individual authenticated
-- SECURITY DEFINER RPCs still need follow-up review before a full LMS launch.

REVOKE SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public FROM anon;
REVOKE USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public FROM anon;
REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public FROM anon;
REVOKE EXECUTE ON ALL FUNCTIONS IN SCHEMA public FROM PUBLIC;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE SELECT, INSERT, UPDATE, DELETE ON TABLES FROM anon;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE USAGE, SELECT ON SEQUENCES FROM anon;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE EXECUTE ON FUNCTIONS FROM anon;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
  REVOKE EXECUTE ON FUNCTIONS FROM PUBLIC;

-- Public views should evaluate permissions/RLS as the querying user.
ALTER VIEW IF EXISTS public.student_course_progress SET (security_invoker = true);
ALTER VIEW IF EXISTS public.course_student_count SET (security_invoker = true);
