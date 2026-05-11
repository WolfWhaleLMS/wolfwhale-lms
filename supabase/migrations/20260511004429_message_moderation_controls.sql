ALTER TABLE public.messages
  ADD COLUMN IF NOT EXISTS moderation_status text NOT NULL DEFAULT 'visible',
  ADD COLUMN IF NOT EXISTS moderation_note text,
  ADD COLUMN IF NOT EXISTS moderated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS moderated_at timestamptz;

ALTER TABLE public.messages
  DROP CONSTRAINT IF EXISTS messages_moderation_status_check;

ALTER TABLE public.messages
  ADD CONSTRAINT messages_moderation_status_check
  CHECK (moderation_status IN ('visible', 'flagged', 'hidden'));

CREATE INDEX IF NOT EXISTS idx_messages_moderation_review
  ON public.messages(tenant_id, moderation_status, created_at DESC)
  WHERE moderation_status <> 'visible';

COMMENT ON COLUMN public.messages.moderation_status IS 'Staff review state for school communication moderation.';
COMMENT ON COLUMN public.messages.moderation_note IS 'Staff-only note explaining moderation decisions.';
COMMENT ON COLUMN public.messages.moderated_by IS 'Staff user who last changed the moderation state.';
COMMENT ON COLUMN public.messages.moderated_at IS 'Timestamp of the last moderation state change.';
