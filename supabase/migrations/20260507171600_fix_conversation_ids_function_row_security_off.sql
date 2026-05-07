-- Ensure the security-definer helper can read conversation_members without
-- recursively applying the policy it supports.

CREATE OR REPLACE FUNCTION public.current_user_conversation_ids()
RETURNS SETOF uuid
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
BEGIN
  RETURN QUERY
  SELECT cm.conversation_id
  FROM public.conversation_members cm
  WHERE cm.user_id = auth.uid();
END
$$;

REVOKE ALL ON FUNCTION public.current_user_conversation_ids() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.current_user_conversation_ids() FROM anon;
GRANT EXECUTE ON FUNCTION public.current_user_conversation_ids() TO authenticated;
