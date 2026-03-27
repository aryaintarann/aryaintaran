-- =============================================================================
-- Fix: Tighten overly-permissive RLS policies on the `messages` table.
-- The previous policies used USING(true)/WITH CHECK(true) for mutating ops,
-- which the Supabase linter flags as a security risk.
--
-- Strategy:
--   - Public INSERT (contact form) → allowed for anon role only, scoped to
--     rows where required fields are present (real validation, not just `true`).
--   - SELECT, UPDATE, DELETE → service_role only (admin API uses service role).
-- =============================================================================

-- Drop the old always-true policies
DROP POLICY IF EXISTS "Allow anon delete"                  ON public.messages;
DROP POLICY IF EXISTS "Allow anon update"                  ON public.messages;
DROP POLICY IF EXISTS "Allow public insert"                ON public.messages;
DROP POLICY IF EXISTS "Allow public contact form insert"   ON public.messages;
DROP POLICY IF EXISTS "Allow public read"                  ON public.messages;
DROP POLICY IF EXISTS "Allow anon read"                    ON public.messages;

-- 1. PUBLIC: Allow anon to INSERT a contact form message.
--    Scoped to the `anon` role and gated on required fields being non-empty,
--    so the WITH CHECK clause is a real condition (not literally `true`).
CREATE POLICY "Public contact form insert"
  ON public.messages
  FOR INSERT
  TO anon
  WITH CHECK (
    name    IS NOT NULL AND char_length(trim(name))    > 0 AND
    email   IS NOT NULL AND char_length(trim(email))   > 0 AND
    message IS NOT NULL AND char_length(trim(message)) > 0
  );

-- No SELECT/UPDATE/DELETE policies for anon/authenticated roles.
-- The admin API routes use the service_role key which bypasses RLS entirely.
