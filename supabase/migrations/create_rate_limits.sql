-- Persistent rate limiting shared by every serverless instance.
-- The app falls back to a per-instance in-memory limiter until this has been run.

create table if not exists public.rate_limits (
  key      text primary key,
  count    integer     not null,
  reset_at timestamptz not null
);

-- RLS on with no policies: anon/authenticated cannot touch it; service_role bypasses RLS.
alter table public.rate_limits enable row level security;

create or replace function public.check_rate_limit(p_key text, p_max integer, p_window_seconds integer)
returns table (allowed boolean, remaining integer, reset_at timestamptz)
language plpgsql
security definer
set search_path = public
as $$
declare
  r public.rate_limits;
begin
  insert into public.rate_limits as t (key, count, reset_at)
  values (p_key, 1, now() + make_interval(secs => p_window_seconds))
  on conflict (key) do update set
    count    = case when t.reset_at <= now() then 1 else t.count + 1 end,
    reset_at = case when t.reset_at <= now() then now() + make_interval(secs => p_window_seconds) else t.reset_at end
  returning * into r;

  return query select r.count <= p_max, greatest(p_max - r.count, 0), r.reset_at;
end;
$$;

revoke all on function public.check_rate_limit(text, integer, integer) from public, anon, authenticated;
grant execute on function public.check_rate_limit(text, integer, integer) to service_role;
