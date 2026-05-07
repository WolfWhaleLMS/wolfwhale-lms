export interface LaunchSecurityCheck {
  id: string
  description: string
  sql: string
}

export const LAUNCH_SENSITIVE_TABLES = [
  'profiles',
  'tenant_memberships',
  'tenants',
  'student_parents',
  'consent_records',
  'privacy_policy_acceptances',
  'data_deletion_requests',
  'courses',
  'course_enrollments',
  'class_codes',
  'assignments',
  'submissions',
  'grades',
  'attendance_records',
  'rubrics',
  'conversations',
  'conversation_members',
  'messages',
  'message_read_receipts',
  'notifications',
  'notification_preferences',
  'audit_logs',
] as const

export const SECURITY_INVOKER_VIEWS = ['student_course_progress', 'course_student_count'] as const

export const PUBLIC_STORAGE_BUCKETS_REQUIRING_REVIEW = [
  'course-thumbnails',
  'profile-avatars',
  'certificates',
] as const

export const HIGH_RISK_SECURITY_DEFINER_RPCS = [
  { name: 'create_grade_notification', arguments: '', identityArguments: '' },
  {
    name: 'get_attendance_summary',
    arguments: 'uuid, date, date',
    identityArguments: 'p_tenant_id uuid, p_start_date date, p_end_date date',
  },
  { name: 'get_course_enrollment_counts', arguments: 'uuid', identityArguments: 'p_tenant_id uuid' },
  { name: 'get_module_lesson_counts', arguments: 'uuid', identityArguments: 'p_course_id uuid' },
  {
    name: 'get_student_attendance_summary',
    arguments: 'uuid, uuid',
    identityArguments: 'p_student_id uuid, p_tenant_id uuid',
  },
  { name: 'get_tenant_role_counts', arguments: 'uuid', identityArguments: 'p_tenant_id uuid' },
  {
    name: 'get_token_leaderboard',
    arguments: 'uuid, timestamp with time zone, integer',
    identityArguments: 'p_tenant_id uuid, p_start_date timestamp with time zone, p_limit integer',
  },
  { name: 'get_user_courses', arguments: 'uuid', identityArguments: 'p_user_id uuid' },
  { name: 'handle_new_user', arguments: '', identityArguments: '' },
  {
    name: 'reorder_items',
    arguments: 'text, text, uuid, uuid[]',
    identityArguments: 'p_table_name text, p_parent_column text, p_parent_id uuid, p_item_ids uuid[]',
  },
] as const

function valuesList(values: readonly string[]) {
  return values.map((value) => `('${value.replace(/'/g, "''")}')`).join(',\n    ')
}

function rpcValuesList() {
  return HIGH_RISK_SECURITY_DEFINER_RPCS.map(
    (rpc) => `('${rpc.name.replace(/'/g, "''")}', '${rpc.identityArguments.replace(/'/g, "''")}')`
  ).join(',\n    ')
}

export function buildLaunchSecurityChecks(): LaunchSecurityCheck[] {
  return [
    {
      id: 'anon_sensitive_table_select',
      description: 'Sensitive public tables must not be directly selectable by the anon role.',
      sql: `with sensitive_table(table_name) as (
  values
    ${valuesList(LAUNCH_SENSITIVE_TABLES)}
)
select n.nspname as schema_name, c.relname as object_name
from sensitive_table
join pg_class c on c.relname = sensitive_table.table_name
join pg_namespace n on n.oid = c.relnamespace and n.nspname = 'public'
where has_table_privilege('anon', c.oid, 'SELECT')
order by c.relname;`,
    },
    {
      id: 'anon_public_function_execute',
      description: 'Anonymous users must not be able to execute public functions directly.',
      sql: `select n.nspname as schema_name, p.proname as function_name, pg_get_function_identity_arguments(p.oid) as arguments
from pg_proc p
join pg_namespace n on n.oid = p.pronamespace
where n.nspname = 'public'
  and has_function_privilege('anon', p.oid, 'EXECUTE')
order by p.proname, arguments;`,
    },
    {
      id: 'security_invoker_views',
      description: 'Launch-sensitive public views must run with invoker permissions and not be anon-readable.',
      sql: `with launch_view(view_name) as (
  values
    ${valuesList(SECURITY_INVOKER_VIEWS)}
)
select c.relname as view_name, coalesce(array_to_string(c.reloptions, ','), '') as reloptions
from launch_view
join pg_class c on c.relname = launch_view.view_name
join pg_namespace n on n.oid = c.relnamespace and n.nspname = 'public'
where c.relkind in ('v', 'm')
  and (
    coalesce(array_to_string(c.reloptions, ','), '') not like '%security_invoker=true%'
    or has_table_privilege('anon', c.oid, 'SELECT')
  )
order by c.relname;`,
    },
    {
      id: 'authenticated_high_risk_security_definer_rpc_execute',
      description: 'Signed-in users must not directly execute high-risk SECURITY DEFINER RPCs.',
      sql: `with high_risk_rpc(function_name, identity_arguments) as (
  values
    ${rpcValuesList()}
)
select p.proname as function_name, pg_get_function_identity_arguments(p.oid) as arguments
from high_risk_rpc
join pg_proc p
  on p.proname = high_risk_rpc.function_name
  and pg_get_function_identity_arguments(p.oid) = high_risk_rpc.identity_arguments
join pg_namespace n on n.oid = p.pronamespace and n.nspname = 'public'
where p.prosecdef
  and has_function_privilege('authenticated', p.oid, 'EXECUTE')
order by p.proname, arguments;`,
    },
    {
      id: 'public_storage_bucket_listing',
      description: 'Reviewed storage buckets must be private and must not have broad storage.objects SELECT policies.',
      sql: `with reviewed_bucket(bucket_id) as (
  values
    ${valuesList(PUBLIC_STORAGE_BUCKETS_REQUIRING_REVIEW)}
)
select b.id as bucket_id, b.public, p.policyname, p.qual
from reviewed_bucket
join storage.buckets b on b.id = reviewed_bucket.bucket_id
left join pg_policies p
  on p.schemaname = 'storage'
  and p.tablename = 'objects'
  and p.cmd = 'SELECT'
  and (
    p.qual is null
    or p.qual = 'true'
    or (
      p.qual like '%' || quote_literal(reviewed_bucket.bucket_id) || '%'
      and p.qual not like '%auth.uid()%'
    )
  )
where b.public or p.policyname is not null
order by b.id, p.policyname;`,
    },
  ]
}
