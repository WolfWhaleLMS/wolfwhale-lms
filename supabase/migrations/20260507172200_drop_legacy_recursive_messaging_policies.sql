-- Remove older recursive messaging policies left by earlier hardening passes.

DROP POLICY IF EXISTS cm_select_member ON public.conversation_members;
DROP POLICY IF EXISTS conv_select_member ON public.conversations;
DROP POLICY IF EXISTS messages_select_member ON public.messages;
DROP POLICY IF EXISTS messages_insert_sender ON public.messages;
DROP POLICY IF EXISTS messages_update_own ON public.messages;
