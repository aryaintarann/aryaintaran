-- =============================================================================
-- Fix: Enable RLS on all public tables that were missing it, and add explicit
-- deny-all policies to silence the `rls_enabled_no_policy` INFO warning.
--
-- These tables are not used by this Next.js app via the anon/authenticated key.
-- USING (false) means no rows are visible/accessible to external roles.
-- Service role bypasses RLS entirely and retains full access.
-- =============================================================================

ALTER TABLE public."_prisma_migrations" ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Tip"                ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."User"               ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Block"              ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Product"            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Purchase"           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Membership"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Subscriber"         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."QnAQuestion"        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."EmailSubscriber"    ENABLE ROW LEVEL SECURITY;
ALTER TABLE public."Analytics"          ENABLE ROW LEVEL SECURITY;

-- Explicit deny-all policies (silences rls_enabled_no_policy INFO warning).
-- USING (false) → no rows are ever accessible to external roles.
DROP POLICY IF EXISTS "Deny all access" ON public."_prisma_migrations";
DROP POLICY IF EXISTS "Deny all access" ON public."Tip";
DROP POLICY IF EXISTS "Deny all access" ON public."User";
DROP POLICY IF EXISTS "Deny all access" ON public."Block";
DROP POLICY IF EXISTS "Deny all access" ON public."Product";
DROP POLICY IF EXISTS "Deny all access" ON public."Purchase";
DROP POLICY IF EXISTS "Deny all access" ON public."Membership";
DROP POLICY IF EXISTS "Deny all access" ON public."Subscriber";
DROP POLICY IF EXISTS "Deny all access" ON public."QnAQuestion";
DROP POLICY IF EXISTS "Deny all access" ON public."EmailSubscriber";
DROP POLICY IF EXISTS "Deny all access" ON public."Analytics";

CREATE POLICY "Deny all access" ON public."_prisma_migrations" FOR SELECT USING (false);
CREATE POLICY "Deny all access" ON public."Tip"                FOR SELECT USING (false);
CREATE POLICY "Deny all access" ON public."User"               FOR SELECT USING (false);
CREATE POLICY "Deny all access" ON public."Block"              FOR SELECT USING (false);
CREATE POLICY "Deny all access" ON public."Product"            FOR SELECT USING (false);
CREATE POLICY "Deny all access" ON public."Purchase"           FOR SELECT USING (false);
CREATE POLICY "Deny all access" ON public."Membership"         FOR SELECT USING (false);
CREATE POLICY "Deny all access" ON public."Subscriber"         FOR SELECT USING (false);
CREATE POLICY "Deny all access" ON public."QnAQuestion"        FOR SELECT USING (false);
CREATE POLICY "Deny all access" ON public."EmailSubscriber"    FOR SELECT USING (false);
CREATE POLICY "Deny all access" ON public."Analytics"          FOR SELECT USING (false);

