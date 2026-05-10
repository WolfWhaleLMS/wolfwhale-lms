-- Course sections are represented as durable metadata on courses for the
-- single-school beta. This gives admins a real section/term setup path without
-- introducing a separate scheduling service before the web MVP is stable.

ALTER TABLE public.courses
  ADD COLUMN IF NOT EXISTS section_label varchar(80);

CREATE INDEX IF NOT EXISTS idx_courses_tenant_section
  ON public.courses (tenant_id, section_label)
  WHERE section_label IS NOT NULL;

COMMENT ON COLUMN public.courses.section_label IS
  'School-facing course section label such as 8A, Block 2, or Lab B.';

COMMENT ON COLUMN public.courses.semester IS
  'School-facing term label used by WolfWhale LMS course setup and SIS exports.';
