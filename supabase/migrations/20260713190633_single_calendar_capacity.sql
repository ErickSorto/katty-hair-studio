alter table public.salon_settings
  add column if not exists booking_calendar_id text,
  add column if not exists max_concurrent_bookings integer not null default 4
    check (max_concurrent_bookings between 1 and 20);

update public.salon_settings
set booking_calendar_id = operations_calendar_id
where booking_calendar_id is null
  and operations_calendar_id is not null;

insert into public.staff (
  external_key,
  display_name,
  active,
  accepts_online_bookings,
  sort_order
)
values ('salon-team', 'Katty Hair Studio team', true, true, 0)
on conflict (external_key) do update set
  display_name = excluded.display_name,
  active = true,
  accepts_online_bookings = true,
  sort_order = excluded.sort_order;

update public.staff
set active = false,
    accepts_online_bookings = false
where external_key <> 'salon-team';

insert into public.staff_services (staff_id, service_id, active)
select staff.id, services.id, true
from public.staff
cross join public.services
where staff.external_key = 'salon-team'
  and services.active = true
on conflict (staff_id, service_id) do update set active = true;

alter table public.bookings
  drop constraint if exists bookings_prevent_staff_overlap;

create index if not exists bookings_active_blocked_range_idx
  on public.bookings using gist (tstzrange(blocked_starts_at, blocked_ends_at, '[)'))
  where status in ('pending', 'confirmed');

create or replace function public.reserve_salon_booking(
  p_confirmation_code text,
  p_service_id uuid,
  p_customer_name text,
  p_customer_email text,
  p_customer_phone text,
  p_customer_notes text,
  p_sms_consent_at timestamptz,
  p_starts_at timestamptz,
  p_ends_at timestamptz,
  p_blocked_starts_at timestamptz,
  p_blocked_ends_at timestamptz,
  p_hold_expires_at timestamptz,
  p_cancellation_token_hash text
)
returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_booking_id uuid;
  v_capacity integer;
  v_capacity_reached boolean;
  v_staff_id uuid;
begin
  if p_starts_at >= p_ends_at
    or p_blocked_starts_at > p_starts_at
    or p_blocked_ends_at < p_ends_at
    or p_blocked_starts_at >= p_blocked_ends_at then
    raise exception using
      errcode = '22023',
      message = 'INVALID_BOOKING_INTERVAL';
  end if;

  select salon_settings.max_concurrent_bookings
  into v_capacity
  from public.salon_settings as salon_settings
  where salon_settings.id = 1
  for update;

  if v_capacity is null then
    raise exception using
      errcode = 'P0001',
      message = 'SALON_SETTINGS_NOT_CONFIGURED';
  end if;

  select staff.id
  into v_staff_id
  from public.staff as staff
  where staff.external_key = 'salon-team'
    and staff.active = true
    and staff.accepts_online_bookings = true;

  if v_staff_id is null then
    raise exception using
      errcode = 'P0001',
      message = 'SALON_TEAM_NOT_CONFIGURED';
  end if;

  if not exists (
    select 1
    from public.services as services
    where services.id = p_service_id
      and services.active = true
  ) then
    raise exception using
      errcode = 'P0001',
      message = 'SERVICE_NOT_AVAILABLE';
  end if;

  update public.bookings
  set status = 'failed'::public.booking_status
  where status = 'pending'::public.booking_status
    and hold_expires_at < now();

  select exists (
    select 1
    from (
      select p_blocked_starts_at as checkpoint
      union
      select greatest(bookings.blocked_starts_at, p_blocked_starts_at) as checkpoint
      from public.bookings as bookings
      where bookings.status in (
        'pending'::public.booking_status,
        'confirmed'::public.booking_status
      )
        and tstzrange(bookings.blocked_starts_at, bookings.blocked_ends_at, '[)')
          && tstzrange(p_blocked_starts_at, p_blocked_ends_at, '[)')
    ) as checkpoints
    where (
      select count(*)
      from public.bookings as concurrent_bookings
      where concurrent_bookings.status in (
        'pending'::public.booking_status,
        'confirmed'::public.booking_status
      )
        and tstzrange(
          concurrent_bookings.blocked_starts_at,
          concurrent_bookings.blocked_ends_at,
          '[)'
        ) @> checkpoints.checkpoint
    ) >= v_capacity
  ) into v_capacity_reached;

  if v_capacity_reached then
    raise exception using
      errcode = 'P0001',
      message = 'BOOKING_CAPACITY_REACHED';
  end if;

  insert into public.bookings (
    confirmation_code,
    staff_id,
    service_id,
    customer_name,
    customer_email,
    customer_phone,
    customer_notes,
    sms_consent_at,
    starts_at,
    ends_at,
    blocked_starts_at,
    blocked_ends_at,
    hold_expires_at,
    status,
    cancellation_token_hash
  )
  values (
    p_confirmation_code,
    v_staff_id,
    p_service_id,
    p_customer_name,
    p_customer_email,
    p_customer_phone,
    p_customer_notes,
    p_sms_consent_at,
    p_starts_at,
    p_ends_at,
    p_blocked_starts_at,
    p_blocked_ends_at,
    p_hold_expires_at,
    'pending'::public.booking_status,
    p_cancellation_token_hash
  )
  returning id into v_booking_id;

  return v_booking_id;
end;
$$;

revoke all on function public.reserve_salon_booking(
  text,
  uuid,
  text,
  text,
  text,
  text,
  timestamptz,
  timestamptz,
  timestamptz,
  timestamptz,
  timestamptz,
  timestamptz,
  text
) from public, anon, authenticated;

grant execute on function public.reserve_salon_booking(
  text,
  uuid,
  text,
  text,
  text,
  text,
  timestamptz,
  timestamptz,
  timestamptz,
  timestamptz,
  timestamptz,
  timestamptz,
  text
) to service_role;

comment on function public.reserve_salon_booking(
  text,
  uuid,
  text,
  text,
  text,
  text,
  timestamptz,
  timestamptz,
  timestamptz,
  timestamptz,
  timestamptz,
  timestamptz,
  text
) is 'Atomically reserves one of the salon concurrent-booking spots.';
