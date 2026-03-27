-- =============================================================================
-- Fix: Enable RLS on all public tables that were missing it.
-- These tables are not used by this Next.js app via the anon key,
-- so no permissive policies are added → default-deny for all external roles.
-- Service role still has full access (bypasses RLS), so Prisma migrations
-- and any admin operations are unaffected.
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
