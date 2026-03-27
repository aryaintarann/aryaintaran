-- Create site_content table for storing portfolio content as JSONB
-- Run this in Supabase SQL Editor

create table if not exists site_content (
  id   integer primary key,
  data jsonb   not null
);

-- Enable RLS
alter table site_content enable row level security;

-- Allow public read (GET /api/content is public).
-- SELECT with USING(true) is intentionally public and excluded from lint checks.
create policy "Allow public read" on site_content
  for select using (true);

-- Writes (INSERT/UPDATE via upsert) are performed exclusively by server-side
-- API routes using the SUPABASE_SERVICE_ROLE_KEY, which bypasses RLS entirely.
-- No permissive anon write policy is needed or added here.
