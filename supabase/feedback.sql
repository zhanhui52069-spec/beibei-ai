create table if not exists public.feedback (
  id uuid primary key default gen_random_uuid(),
  name text not null default 'Anonymous',
  email text not null default '',
  role text not null default '',
  category text not null default '',
  message text not null,
  locale text not null default 'en',
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists feedback_created_at_idx on public.feedback (created_at desc);
create index if not exists feedback_status_idx on public.feedback (status);

alter table public.feedback enable row level security;

-- Keep browser clients out of this table. The server uses SUPABASE_SERVICE_ROLE_KEY,
-- which bypasses row level security and should only be stored in Vercel env vars.
