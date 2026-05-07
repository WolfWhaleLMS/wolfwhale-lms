-- Replace recursive messaging policies with direct membership checks.

DROP POLICY IF EXISTS cm_select ON public.conversation_members;
CREATE POLICY cm_select ON public.conversation_members FOR SELECT
  USING (user_id = auth.uid());

DROP POLICY IF EXISTS conv_select ON public.conversations;
CREATE POLICY conv_select ON public.conversations FOR SELECT
  USING (
    id IN (
      SELECT conversation_id FROM public.conversation_members
      WHERE user_id = auth.uid()
    ) OR
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_memberships
      WHERE user_id = auth.uid()
        AND role IN ('admin', 'super_admin')
        AND status = 'active'
    )
  );

DROP POLICY IF EXISTS msg_select ON public.messages;
CREATE POLICY msg_select ON public.messages FOR SELECT
  USING (
    conversation_id IN (
      SELECT conversation_id FROM public.conversation_members
      WHERE user_id = auth.uid()
    ) OR
    tenant_id IN (
      SELECT tenant_id FROM public.tenant_memberships
      WHERE user_id = auth.uid()
        AND role IN ('admin', 'super_admin')
        AND status = 'active'
    )
  );

DROP POLICY IF EXISTS msg_insert ON public.messages;
CREATE POLICY msg_insert ON public.messages FOR INSERT
  WITH CHECK (
    sender_id = auth.uid() AND
    conversation_id IN (
      SELECT conversation_id FROM public.conversation_members
      WHERE user_id = auth.uid()
    )
  );

DROP FUNCTION IF EXISTS public.current_user_conversation_ids();
