-- Create site_content table for storing portfolio content as JSONB
-- Run this in Supabase SQL Editor

create table if not exists site_content (
  id   integer primary key,
  data jsonb   not null
);

-- Disable RLS (only accessed from server-side via anon key + service role)
-- Allow anon reads and writes since we guard with ADMIN_TOKEN in our API
alter table site_content enable row level security;

-- Allow public read (GET /api/content is public)
create policy "Allow public read" on site_content
  for select using (true);

-- Allow anon insert/update (protected at API layer by ADMIN_TOKEN)
create policy "Allow anon upsert" on site_content
  for all using (true) with check (true);
