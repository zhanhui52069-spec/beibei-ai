create table if not exists public.usage_accounts (
  subject_id text primary key,
  email text not null default '',
  plan text not null default 'free' check (plan in ('free', 'seller', 'team')),
  team_active boolean not null default false,
  free_used integer not null default 0 check (free_used >= 0),
  free_reset_at timestamptz not null default (now() + interval '24 hours'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.credit_lots (
  id uuid primary key default gen_random_uuid(),
  subject_id text not null references public.usage_accounts(subject_id) on delete cascade,
  original_amount integer not null check (original_amount > 0),
  remaining integer not null check (remaining >= 0),
  source text not null default 'purchase',
  reference text not null default '',
  expires_at timestamptz not null default (now() + interval '12 months'),
  created_at timestamptz not null default now()
);

create table if not exists public.task_reservations (
  request_id uuid primary key,
  subject_id text not null references public.usage_accounts(subject_id) on delete cascade,
  source text not null check (source in ('free', 'credit', 'team')),
  credit_lot_id uuid references public.credit_lots(id) on delete set null,
  status text not null default 'pending' check (status in ('pending', 'completed', 'released')),
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create table if not exists public.usage_events (
  id uuid primary key default gen_random_uuid(),
  subject_id text not null references public.usage_accounts(subject_id) on delete cascade,
  event_type text not null,
  amount integer not null default 0,
  request_id uuid,
  note text not null default '',
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.payment_fulfillments (
  provider_reference text primary key,
  subject_id text not null references public.usage_accounts(subject_id) on delete cascade,
  email text not null default '',
  pack_id text not null,
  tasks integer not null check (tasks > 0),
  amount_cents integer not null check (amount_cents > 0),
  currency text not null default 'usd',
  created_at timestamptz not null default now()
);

create index if not exists credit_lots_subject_expiry_idx
  on public.credit_lots (subject_id, expires_at) where remaining > 0;
create index if not exists task_reservations_subject_idx
  on public.task_reservations (subject_id, created_at desc);
create index if not exists usage_events_subject_idx
  on public.usage_events (subject_id, created_at desc);

alter table public.usage_accounts enable row level security;
alter table public.credit_lots enable row level security;
alter table public.task_reservations enable row level security;
alter table public.usage_events enable row level security;
alter table public.payment_fulfillments enable row level security;

create or replace function public.get_ai_balance(p_subject_id text)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  account_row public.usage_accounts%rowtype;
  credit_total integer;
begin
  insert into public.usage_accounts(subject_id)
  values (p_subject_id)
  on conflict (subject_id) do nothing;

  select * into account_row
  from public.usage_accounts
  where subject_id = p_subject_id
  for update;

  if account_row.free_reset_at <= now() then
    update public.usage_accounts
    set free_used = 0,
        free_reset_at = now() + interval '24 hours',
        updated_at = now()
    where subject_id = p_subject_id
    returning * into account_row;
  end if;

  select coalesce(sum(remaining), 0)::integer into credit_total
  from public.credit_lots
  where subject_id = p_subject_id
    and remaining > 0
    and expires_at > now();

  return jsonb_build_object(
    'subjectId', account_row.subject_id,
    'plan', account_row.plan,
    'unlimited', account_row.plan = 'team' and account_row.team_active,
    'freeRemaining', greatest(0, 5 - account_row.free_used),
    'creditRemaining', credit_total,
    'totalRemaining', greatest(0, 5 - account_row.free_used) + credit_total,
    'nextResetAt', account_row.free_reset_at
  );
end;
$$;

create or replace function public.reserve_ai_task(p_subject_id text, p_request_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  account_row public.usage_accounts%rowtype;
  lot_row public.credit_lots%rowtype;
  existing_row public.task_reservations%rowtype;
  balance jsonb;
begin
  insert into public.usage_accounts(subject_id)
  values (p_subject_id)
  on conflict (subject_id) do nothing;

  select * into existing_row
  from public.task_reservations
  where request_id = p_request_id;

  if found then
    balance := public.get_ai_balance(p_subject_id);
    return balance || jsonb_build_object('allowed', existing_row.status <> 'released', 'reservationId', p_request_id);
  end if;

  select * into account_row
  from public.usage_accounts
  where subject_id = p_subject_id
  for update;

  if account_row.free_reset_at <= now() then
    update public.usage_accounts
    set free_used = 0,
        free_reset_at = now() + interval '24 hours',
        updated_at = now()
    where subject_id = p_subject_id
    returning * into account_row;
  end if;

  if account_row.plan = 'team' and account_row.team_active then
    insert into public.task_reservations(request_id, subject_id, source)
    values (p_request_id, p_subject_id, 'team');
  elsif account_row.free_used < 5 then
    update public.usage_accounts
    set free_used = free_used + 1, updated_at = now()
    where subject_id = p_subject_id;

    insert into public.task_reservations(request_id, subject_id, source)
    values (p_request_id, p_subject_id, 'free');
  else
    select * into lot_row
    from public.credit_lots
    where subject_id = p_subject_id
      and remaining > 0
      and expires_at > now()
    order by expires_at asc, created_at asc
    limit 1
    for update skip locked;

    if not found then
      balance := public.get_ai_balance(p_subject_id);
      return balance || jsonb_build_object('allowed', false, 'reason', 'quota_exhausted');
    end if;

    update public.credit_lots set remaining = remaining - 1 where id = lot_row.id;
    insert into public.task_reservations(request_id, subject_id, source, credit_lot_id)
    values (p_request_id, p_subject_id, 'credit', lot_row.id);
  end if;

  balance := public.get_ai_balance(p_subject_id);
  return balance || jsonb_build_object('allowed', true, 'reservationId', p_request_id);
end;
$$;

create or replace function public.complete_ai_task(p_subject_id text, p_request_id uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  reservation_row public.task_reservations%rowtype;
begin
  select * into reservation_row
  from public.task_reservations
  where request_id = p_request_id and subject_id = p_subject_id
  for update;

  if found and reservation_row.status = 'pending' then
    update public.task_reservations
    set status = 'completed', completed_at = now()
    where request_id = p_request_id;

    insert into public.usage_events(subject_id, event_type, amount, request_id, metadata)
    values (p_subject_id, 'task_completed', -1, p_request_id, jsonb_build_object('source', reservation_row.source));
  end if;

  return public.get_ai_balance(p_subject_id);
end;
$$;

create or replace function public.release_ai_task(p_subject_id text, p_request_id uuid, p_reason text default '')
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  reservation_row public.task_reservations%rowtype;
begin
  select * into reservation_row
  from public.task_reservations
  where request_id = p_request_id and subject_id = p_subject_id
  for update;

  if found and reservation_row.status = 'pending' then
    if reservation_row.source = 'free' then
      update public.usage_accounts
      set free_used = greatest(0, free_used - 1), updated_at = now()
      where subject_id = p_subject_id;
    elsif reservation_row.source = 'credit' and reservation_row.credit_lot_id is not null then
      update public.credit_lots
      set remaining = remaining + 1
      where id = reservation_row.credit_lot_id;
    end if;

    update public.task_reservations
    set status = 'released', completed_at = now()
    where request_id = p_request_id;

    insert into public.usage_events(subject_id, event_type, amount, request_id, note)
    values (p_subject_id, 'task_released', 1, p_request_id, coalesce(p_reason, ''));
  end if;

  return public.get_ai_balance(p_subject_id);
end;
$$;

create or replace function public.adjust_ai_credits(
  p_subject_id text,
  p_amount integer,
  p_event_type text default 'adjustment',
  p_note text default '',
  p_email text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  remaining_to_remove integer;
  lot_row public.credit_lots%rowtype;
  remove_now integer;
begin
  insert into public.usage_accounts(subject_id, email, plan)
  values (p_subject_id, coalesce(p_email, ''), case when p_amount > 0 then 'seller' else 'free' end)
  on conflict (subject_id) do update
    set email = case when excluded.email <> '' then excluded.email else usage_accounts.email end,
        plan = case when p_amount > 0 and usage_accounts.plan = 'free' then 'seller' else usage_accounts.plan end,
        updated_at = now();

  if p_amount > 0 then
    insert into public.credit_lots(subject_id, original_amount, remaining, source, reference)
    values (p_subject_id, p_amount, p_amount, p_event_type, coalesce(p_note, ''));
  elsif p_amount < 0 then
    remaining_to_remove := abs(p_amount);
    for lot_row in
      select * from public.credit_lots
      where subject_id = p_subject_id and remaining > 0 and expires_at > now()
      order by expires_at asc, created_at asc
      for update
    loop
      exit when remaining_to_remove = 0;
      remove_now := least(lot_row.remaining, remaining_to_remove);
      update public.credit_lots set remaining = remaining - remove_now where id = lot_row.id;
      remaining_to_remove := remaining_to_remove - remove_now;
    end loop;
  end if;

  insert into public.usage_events(subject_id, event_type, amount, note)
  values (p_subject_id, p_event_type, p_amount, coalesce(p_note, ''));

  return public.get_ai_balance(p_subject_id);
end;
$$;

create or replace function public.set_team_access(p_subject_id text, p_active boolean, p_email text default '')
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.usage_accounts(subject_id, email, plan, team_active)
  values (p_subject_id, coalesce(p_email, ''), 'team', p_active)
  on conflict (subject_id) do update
    set email = case when excluded.email <> '' then excluded.email else usage_accounts.email end,
        plan = case when p_active then 'team' else 'seller' end,
        team_active = p_active,
        updated_at = now();

  insert into public.usage_events(subject_id, event_type, amount, note)
  values (p_subject_id, case when p_active then 'team_enabled' else 'team_disabled' end, 0, 'Admin change');

  return public.get_ai_balance(p_subject_id);
end;
$$;

create or replace function public.fulfill_ai_purchase(
  p_provider_reference text,
  p_subject_id text,
  p_email text,
  p_pack_id text,
  p_tasks integer,
  p_amount_cents integer,
  p_currency text default 'usd'
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_tasks <= 0 or p_amount_cents <= 0 then
    raise exception 'Invalid purchase amount';
  end if;

  insert into public.usage_accounts(subject_id, email, plan)
  values (p_subject_id, coalesce(p_email, ''), 'seller')
  on conflict (subject_id) do update
    set email = case when excluded.email <> '' then excluded.email else usage_accounts.email end,
        plan = case when usage_accounts.plan = 'team' then 'team' else 'seller' end,
        updated_at = now();

  insert into public.payment_fulfillments(
    provider_reference,
    subject_id,
    email,
    pack_id,
    tasks,
    amount_cents,
    currency
  ) values (
    p_provider_reference,
    p_subject_id,
    coalesce(p_email, ''),
    p_pack_id,
    p_tasks,
    p_amount_cents,
    lower(coalesce(p_currency, 'usd'))
  ) on conflict (provider_reference) do nothing;

  if found then
    insert into public.credit_lots(subject_id, original_amount, remaining, source, reference)
    values (p_subject_id, p_tasks, p_tasks, 'stripe_purchase', p_provider_reference);

    insert into public.usage_events(subject_id, event_type, amount, note, metadata)
    values (
      p_subject_id,
      'purchase',
      p_tasks,
      'Stripe payment completed',
      jsonb_build_object(
        'providerReference', p_provider_reference,
        'packId', p_pack_id,
        'amountCents', p_amount_cents,
        'currency', lower(coalesce(p_currency, 'usd'))
      )
    );
  end if;

  return public.get_ai_balance(p_subject_id);
end;
$$;

create or replace function public.merge_usage_subject(
  p_source_subject_id text,
  p_target_subject_id text,
  p_email text default ''
)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
  source_account public.usage_accounts%rowtype;
begin
  if coalesce(p_source_subject_id, '') = '' or coalesce(p_target_subject_id, '') = '' then
    raise exception 'Source and target subject IDs are required';
  end if;

  if p_source_subject_id = p_target_subject_id then
    return public.get_ai_balance(p_target_subject_id);
  end if;

  select * into source_account
  from public.usage_accounts
  where subject_id = p_source_subject_id
  for update;

  insert into public.usage_accounts(subject_id, email)
  values (p_target_subject_id, coalesce(p_email, ''))
  on conflict (subject_id) do update
    set email = case when excluded.email <> '' then excluded.email else usage_accounts.email end,
        updated_at = now();

  if source_account.subject_id is null then
    return public.get_ai_balance(p_target_subject_id);
  end if;

  update public.usage_accounts
  set email = case when coalesce(p_email, '') <> '' then p_email else email end,
      plan = case
        when team_active or source_account.team_active then 'team'
        when plan = 'seller' or source_account.plan = 'seller' then 'seller'
        else 'free'
      end,
      team_active = team_active or source_account.team_active,
      free_used = greatest(free_used, source_account.free_used),
      free_reset_at = greatest(free_reset_at, source_account.free_reset_at),
      updated_at = now()
  where subject_id = p_target_subject_id;

  update public.credit_lots set subject_id = p_target_subject_id where subject_id = p_source_subject_id;
  update public.task_reservations set subject_id = p_target_subject_id where subject_id = p_source_subject_id;
  update public.usage_events set subject_id = p_target_subject_id where subject_id = p_source_subject_id;
  update public.payment_fulfillments set subject_id = p_target_subject_id where subject_id = p_source_subject_id;

  delete from public.usage_accounts where subject_id = p_source_subject_id;

  insert into public.usage_events(subject_id, event_type, amount, note, metadata)
  values (
    p_target_subject_id,
    'account_merged',
    0,
    'Guest device balance merged into signed-in account',
    jsonb_build_object('sourceSubjectId', p_source_subject_id)
  );

  return public.get_ai_balance(p_target_subject_id);
end;
$$;

revoke all on public.usage_accounts from anon, authenticated;
revoke all on public.credit_lots from anon, authenticated;
revoke all on public.task_reservations from anon, authenticated;
revoke all on public.usage_events from anon, authenticated;
revoke all on public.payment_fulfillments from anon, authenticated;
revoke execute on function public.get_ai_balance(text) from public, anon, authenticated;
revoke execute on function public.reserve_ai_task(text, uuid) from public, anon, authenticated;
revoke execute on function public.complete_ai_task(text, uuid) from public, anon, authenticated;
revoke execute on function public.release_ai_task(text, uuid, text) from public, anon, authenticated;
revoke execute on function public.adjust_ai_credits(text, integer, text, text, text) from public, anon, authenticated;
revoke execute on function public.set_team_access(text, boolean, text) from public, anon, authenticated;
revoke execute on function public.fulfill_ai_purchase(text, text, text, text, integer, integer, text) from public, anon, authenticated;
revoke execute on function public.merge_usage_subject(text, text, text) from public, anon, authenticated;

grant select, insert, update, delete on public.usage_accounts to service_role;
grant select, insert, update, delete on public.credit_lots to service_role;
grant select, insert, update, delete on public.task_reservations to service_role;
grant select, insert, update, delete on public.usage_events to service_role;
grant select, insert, update, delete on public.payment_fulfillments to service_role;
grant execute on function public.get_ai_balance(text) to service_role;
grant execute on function public.reserve_ai_task(text, uuid) to service_role;
grant execute on function public.complete_ai_task(text, uuid) to service_role;
grant execute on function public.release_ai_task(text, uuid, text) to service_role;
grant execute on function public.adjust_ai_credits(text, integer, text, text, text) to service_role;
grant execute on function public.set_team_access(text, boolean, text) to service_role;
grant execute on function public.fulfill_ai_purchase(text, text, text, text, integer, integer, text) to service_role;
grant execute on function public.merge_usage_subject(text, text, text) to service_role;
