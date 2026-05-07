-- Fix messaging RLS recursion: conversation_members policies cannot query the
-- same table directly without triggering recursive policy evaluation.

CREATE OR REPLACE FUNCTION public.current_user_conversation_ids()
RETURNS SETOF uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT conversation_id
  FROM public.conversation_members
  WHERE user_id = auth.uid()
$$;

REVOKE ALL ON FUNCTION public.current_user_conversation_ids() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.current_user_conversation_ids() FROM anon;
GRANT EXECUTE ON FUNCTION public.current_user_conversation_ids() TO authenticated;

DROP POLICY IF EXISTS cm_select ON public.conversation_members;
CREATE POLICY cm_select ON public.conversation_members FOR SELECT
  USING (
    user_id = auth.uid() OR
    conversation_id IN (SELECT public.current_user_conversation_ids())
  );

DROP POLICY IF EXISTS conv_select ON public.conversations;
CREATE POLICY conv_select ON public.conversations FOR SELECT
  USING (
    id IN (SELECT public.current_user_conversation_ids()) OR
    public.is_tenant_member(tenant_id)
  );

DROP POLICY IF EXISTS msg_select ON public.messages;
CREATE POLICY msg_select ON public.messages FOR SELECT
  USING (
    conversation_id IN (SELECT public.current_user_conversation_ids())
  );

DROP POLICY IF EXISTS msg_insert ON public.messages;
CREATE POLICY msg_insert ON public.messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid() AND
    conversation_id IN (SELECT public.current_user_conversation_ids())
  );
