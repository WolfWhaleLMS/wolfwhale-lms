alter table public.student_parents
  add column if not exists is_primary_contact boolean not null default false,
  add column if not exists consent_notes text not null default '',
  add column if not exists custody_notes text not null default '';

create index if not exists idx_student_parents_primary_contact
  on public.student_parents (tenant_id, student_id)
  where is_primary_contact is true and status = 'active';

comment on column public.student_parents.is_primary_contact is
  'Marks the preferred guardian contact for school operations.';
comment on column public.student_parents.consent_notes is
  'Administrative notes about guardian consent records. Sensitive student-record data.';
comment on column public.student_parents.custody_notes is
  'Administrative custody/pickup notes. Sensitive student-record data.';
