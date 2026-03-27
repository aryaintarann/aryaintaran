-- =============================================================================
-- Fix: Tighten overly-permissive RLS policies on the `messages` table.
-- The previous policies used USING(true)/WITH CHECK(true) for mutating ops,
-- which the Supabase linter flags as a security risk.
--
-- Strategy:
--   - Public INSERT (contact form) → still allowed via anon role, but scoped
--     so callers cannot read back or alter other rows.
--   - SELECT, UPDATE, DELETE → service_role only (admin API uses service role).
-- =============================================================================

-- Drop the old always-true policies
DROP POLICY IF EXISTS "Allow anon delete"   ON public.messages;
DROP POLICY IF EXISTS "Allow anon update"   ON public.messages;
DROP POLICY IF EXISTS "Allow public insert" ON public.messages;
-- Drop any pre-existing select policy to avoid conflicts
DROP POLICY IF EXISTS "Allow public read"   ON public.messages;
DROP POLICY IF EXISTS "Allow anon read"     ON public.messages;

-- 1. PUBLIC: Anyone can INSERT a new message (contact form submissions).
--    WITH CHECK (true) on INSERT is acceptable as the lint rule only warns
--    about USING(true) on UPDATE/DELETE, and the anon role cannot SELECT back.
CREATE POLICY "Allow public contact form insert"
  ON public.messages
  FOR INSERT
  WITH CHECK (true);

-- No SELECT/UPDATE/DELETE policies for anon/authenticated roles.
-- The admin API routes use the service_role key which bypasses RLS entirely.
