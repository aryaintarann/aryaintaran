create table if not exists public.articles (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  slug text not null unique,
  description text,
  content text not null,
  cover_image text,
  original_url text,
  published_at timestamp with time zone default now(),
  created_at timestamp with time zone default now()
);

-- Enable Row Level Security
alter table public.articles enable row level security;

-- Policy to allow public read access
create policy "Allow public read access on articles"
  on public.articles for select
  to public
  using (true);

-- Policy to allow service role to manage articles (insert/update/delete)
-- Notice that anon and auth users cannot insert, which is correct for a cron job inserting via service role.
create policy "Allow service role to manage articles"
  on public.articles
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');
