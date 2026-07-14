alter table public.bookings
  add column if not exists customer_locale text not null default 'en';

alter table public.bookings
  drop constraint if exists bookings_customer_locale_check;

alter table public.bookings
  add constraint bookings_customer_locale_check
  check (customer_locale in ('en', 'es'));

drop function if exists public.reserve_salon_booking(
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
);

create function public.reserve_salon_booking(
  p_confirmation_code text,
  p_service_id uuid,
  p_customer_name text,
  p_customer_email text,
  p_customer_locale text,
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
  if p_customer_locale is null or p_customer_locale not in ('en', 'es') then
    raise exception using
      errcode = '22023',
      message = 'INVALID_CUSTOMER_LOCALE';
  end if;

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
    customer_locale,
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
    p_customer_locale,
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
  text,
  timestamptz,
  timestamptz,
  timestamptz,
  timestamptz,
  timestamptz,
  timestamptz,
  text
) is 'Atomically reserves one salon booking and preserves the customer notification locale.';
