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
    if new.starts_at >= new.ends_at then
      raise exception 'End time must be after start time';
    end if;

    if new.starts_at <= now() then
      raise exception 'Bookings must start in the future';
    end if;

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

create or replace function public.cleanup_daily_booking_activity()
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update public.bookings
  set status = 'completed'
  where status in ('reserved', 'booked')
    and ends_at <= now();

  delete from public.bookings
  where status = 'cancelled'
    and starts_at::date = now()::date;
end;
$$;
