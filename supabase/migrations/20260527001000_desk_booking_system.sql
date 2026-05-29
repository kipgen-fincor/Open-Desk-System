create extension if not exists "pgcrypto";
create extension if not exists "btree_gist";

do $$ begin
  create type public.user_role as enum ('user', 'admin');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.resource_kind as enum ('desk', 'meeting_room');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.booking_status as enum ('reserved', 'booked', 'completed', 'cancelled');
exception when duplicate_object then null;
end $$;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  role public.user_role not null default 'user',
  full_name text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.resources (
  id uuid primary key default gen_random_uuid(),
  section text not null check (section in ('A', 'B', 'MR')),
  seat_number integer not null,
  label text not null unique,
  kind public.resource_kind not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (section, seat_number)
);

create table if not exists public.bookings (
  id uuid primary key default gen_random_uuid(),
  resource_id uuid not null references public.resources(id),
  user_id uuid not null references auth.users(id),
  user_email text,
  created_by uuid references auth.users(id),
  status public.booking_status not null default 'booked',
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  note text,
  cancelled_at timestamptz,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (starts_at < ends_at)
);

create index if not exists bookings_user_id_idx on public.bookings(user_id);
create index if not exists bookings_resource_id_idx on public.bookings(resource_id);
create index if not exists bookings_starts_at_idx on public.bookings(starts_at);
create index if not exists bookings_status_idx on public.bookings(status);

alter table public.bookings
drop constraint if exists bookings_no_resource_overlap;

alter table public.bookings
add constraint bookings_no_resource_overlap
exclude using gist (
  resource_id with =,
  tstzrange(starts_at, ends_at, '[)') with &&
)
where (status in ('reserved', 'booked'));

create or replace function public.is_admin(user_uuid uuid default auth.uid())
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = user_uuid and role = 'admin'
  );
$$;

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, full_name)
  values (
    new.id,
    coalesce(new.email, ''),
    coalesce(new.raw_user_meta_data->>'full_name', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists touch_profiles_updated_at on public.profiles;
create trigger touch_profiles_updated_at
before update on public.profiles
for each row execute function public.touch_updated_at();

drop trigger if exists touch_bookings_updated_at on public.bookings;
create trigger touch_bookings_updated_at
before update on public.bookings
for each row execute function public.touch_updated_at();

create or replace function public.prevent_invalid_booking()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  resource_record public.resources%rowtype;
  acting_user uuid := coalesce(new.created_by, auth.uid());
  target_user uuid := new.user_id;
  acting_is_admin boolean := public.is_admin(acting_user);
begin
  select * into resource_record
  from public.resources
  where id = new.resource_id and is_active = true;

  if not found then
    raise exception 'Resource is not active or does not exist';
  end if;

  if new.status in ('reserved', 'booked') then
    if resource_record.kind = 'desk' and not acting_is_admin then
      if exists (
        select 1
        from public.bookings b
        join public.resources r on r.id = b.resource_id
        where b.id <> coalesce(new.id, '00000000-0000-0000-0000-000000000000'::uuid)
          and b.user_id = target_user
          and b.status in ('reserved', 'booked')
          and r.kind = 'desk'
          and b.starts_at::date = new.starts_at::date
      ) then
        raise exception 'Users can book only one desk per day';
      end if;
    end if;

    if resource_record.kind = 'meeting_room' then
      if exists (
        select 1
        from public.bookings b
        join public.resources r on r.id = b.resource_id
        where b.id <> coalesce(new.id, '00000000-0000-0000-0000-000000000000'::uuid)
          and b.user_id = target_user
          and b.status in ('reserved', 'booked')
          and r.kind = 'meeting_room'
          and tstzrange(b.starts_at, b.ends_at, '[)') && tstzrange(new.starts_at, new.ends_at, '[)')
      ) then
        raise exception 'A user cannot hold overlapping meeting-room bookings';
      end if;
    end if;
  end if;

  if new.status = 'cancelled' and new.cancelled_at is null then
    new.cancelled_at = now();
  end if;

  if new.status = 'completed' and new.completed_at is null then
    new.completed_at = now();
  end if;

  return new;
end;
$$;

drop trigger if exists prevent_invalid_booking_trigger on public.bookings;
create trigger prevent_invalid_booking_trigger
before insert or update on public.bookings
for each row execute function public.prevent_invalid_booking();

create or replace function public.create_booking(
  p_resource_id uuid,
  p_starts_at timestamptz,
  p_ends_at timestamptz,
  p_status public.booking_status default 'booked',
  p_note text default null,
  p_user_id uuid default null
)
returns public.bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  actor uuid := auth.uid();
  target_user uuid := coalesce(p_user_id, auth.uid());
  actor_is_admin boolean := public.is_admin(actor);
  inserted_booking public.bookings;
  target_email text;
begin
  if actor is null then
    raise exception 'Authentication required';
  end if;

  if target_user <> actor and not actor_is_admin then
    raise exception 'Only admins can book for another user';
  end if;

  select email into target_email from public.profiles where id = target_user;

  insert into public.bookings (
    resource_id,
    user_id,
    user_email,
    created_by,
    status,
    starts_at,
    ends_at,
    note
  )
  values (
    p_resource_id,
    target_user,
    target_email,
    actor,
    p_status,
    p_starts_at,
    p_ends_at,
    p_note
  )
  returning * into inserted_booking;

  return inserted_booking;
end;
$$;

create or replace function public.update_booking_admin(
  p_booking_id uuid,
  p_status public.booking_status default null,
  p_starts_at timestamptz default null,
  p_ends_at timestamptz default null,
  p_resource_id uuid default null,
  p_user_id uuid default null
)
returns public.bookings
language plpgsql
security definer
set search_path = public
as $$
declare
  actor uuid := auth.uid();
  actor_is_admin boolean := public.is_admin(actor);
  updated_booking public.bookings;
begin
  if actor is null then
    raise exception 'Authentication required';
  end if;

  if not actor_is_admin and exists (
    select 1 from public.bookings where id = p_booking_id and user_id <> actor
  ) then
    raise exception 'Only admins can update another user booking';
  end if;

  if p_user_id is not null and not actor_is_admin then
    raise exception 'Only admins can reassign bookings';
  end if;

  update public.bookings
  set
    status = coalesce(p_status, status),
    starts_at = coalesce(p_starts_at, starts_at),
    ends_at = coalesce(p_ends_at, ends_at),
    resource_id = coalesce(p_resource_id, resource_id),
    user_id = coalesce(p_user_id, user_id),
    user_email = coalesce((select email from public.profiles where id = p_user_id), user_email)
  where id = p_booking_id
  returning * into updated_booking;

  return updated_booking;
end;
$$;

create or replace function public.cleanup_daily_booking_activity()
returns void
language sql
security definer
set search_path = public
as $$
  delete from public.bookings
  where status = 'cancelled'
     or ends_at < date_trunc('day', now());
$$;

insert into public.resources (section, seat_number, label, kind)
select 'A', seat_number, 'A-' || seat_number, 'desk'::public.resource_kind
from generate_series(1, 18) as seat_number
on conflict (section, seat_number) do nothing;

insert into public.resources (section, seat_number, label, kind)
select 'B', seat_number, 'B-' || seat_number, 'desk'::public.resource_kind
from generate_series(1, 12) as seat_number
on conflict (section, seat_number) do nothing;

insert into public.resources (section, seat_number, label, kind)
select 'MR', seat_number, 'MR-' || seat_number, 'meeting_room'::public.resource_kind
from generate_series(1, 7) as seat_number
on conflict (section, seat_number) do nothing;

alter table public.profiles enable row level security;
alter table public.resources enable row level security;
alter table public.bookings enable row level security;

drop policy if exists "Users can read own profile" on public.profiles;
create policy "Users can read own profile"
on public.profiles for select
to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists "Admins can update profiles" on public.profiles;
create policy "Admins can update profiles"
on public.profiles for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Authenticated users can read resources" on public.resources;
create policy "Authenticated users can read resources"
on public.resources for select
to authenticated
using (true);

drop policy if exists "Admins can manage resources" on public.resources;
create policy "Admins can manage resources"
on public.resources for all
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Users can read relevant bookings" on public.bookings;
drop policy if exists "Authenticated users can read booking availability" on public.bookings;
create policy "Authenticated users can read booking availability"
on public.bookings for select
to authenticated
using (true);

drop policy if exists "Users can insert own bookings" on public.bookings;
create policy "Users can insert own bookings"
on public.bookings for insert
to authenticated
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "Users can update own bookings" on public.bookings;
create policy "Users can update own bookings"
on public.bookings for update
to authenticated
using (user_id = auth.uid() or public.is_admin())
with check (user_id = auth.uid() or public.is_admin());

drop policy if exists "Admins can delete bookings" on public.bookings;
create policy "Admins can delete bookings"
on public.bookings for delete
to authenticated
using (public.is_admin());

grant usage on schema public to anon, authenticated;
grant select on public.resources to anon, authenticated;
grant select, insert, update on public.bookings to authenticated;
grant select, update on public.profiles to authenticated;
grant execute on function public.create_booking(uuid, timestamptz, timestamptz, public.booking_status, text, uuid) to authenticated;
grant execute on function public.update_booking_admin(uuid, public.booking_status, timestamptz, timestamptz, uuid, uuid) to authenticated;
grant execute on function public.cleanup_daily_booking_activity() to service_role;

-- Optional Supabase scheduled cleanup:
-- Enable pg_cron in Database Extensions, then run:
-- select cron.schedule(
--   'cleanup-desk-booking-activity-noon',
--   '0 12 * * *',
--   $$select public.cleanup_daily_booking_activity();$$
-- );
