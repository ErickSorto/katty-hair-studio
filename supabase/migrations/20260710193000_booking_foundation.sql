create extension if not exists btree_gist;
create extension if not exists pgcrypto;

create type public.admin_role as enum ('owner', 'technical_admin', 'manager');
create type public.booking_status as enum (
  'pending',
  'confirmed',
  'cancelled',
  'completed',
  'no_show',
  'failed'
);
create type public.notification_channel as enum ('email', 'sms');
create type public.notification_status as enum ('pending', 'sent', 'delivered', 'failed');

create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table public.salon_settings (
  id smallint primary key default 1 check (id = 1),
  salon_name text not null default 'Katty Hair Studio',
  address text not null default '3816 Bladensburg Rd, Brentwood, MD 20722',
  phone text not null default '+12405826622',
  email text not null default 'kattyhairstudio@gmail.com',
  timezone text not null default 'America/New_York',
  operations_calendar_id text,
  slot_interval_minutes integer not null default 30 check (slot_interval_minutes between 5 and 120),
  minimum_notice_minutes integer not null default 120 check (minimum_notice_minutes >= 0),
  booking_window_days integer not null default 60 check (booking_window_days between 1 and 365),
  hold_minutes integer not null default 10 check (hold_minutes between 2 and 30),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.admin_profiles (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null unique,
  role public.admin_role not null default 'manager',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.staff (
  id uuid primary key default gen_random_uuid(),
  external_key text not null unique,
  display_name text not null,
  email text,
  phone text,
  google_calendar_id text unique,
  calendar_color text,
  active boolean not null default true,
  accepts_online_bookings boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.services (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text,
  duration_minutes integer not null check (duration_minutes between 10 and 720),
  buffer_before_minutes integer not null default 0 check (buffer_before_minutes between 0 and 180),
  buffer_after_minutes integer not null default 15 check (buffer_after_minutes between 0 and 180),
  price_from numeric(10, 2),
  requires_quote boolean not null default true,
  active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.staff_services (
  staff_id uuid not null references public.staff(id) on delete cascade,
  service_id uuid not null references public.services(id) on delete cascade,
  duration_minutes integer check (duration_minutes between 10 and 720),
  buffer_before_minutes integer check (buffer_before_minutes between 0 and 180),
  buffer_after_minutes integer check (buffer_after_minutes between 0 and 180),
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  primary key (staff_id, service_id)
);

create table public.weekly_availability (
  id uuid primary key default gen_random_uuid(),
  staff_id uuid not null references public.staff(id) on delete cascade,
  day_of_week smallint not null check (day_of_week between 0 and 6),
  start_time time not null,
  end_time time not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (start_time < end_time),
  unique (staff_id, day_of_week, start_time, end_time)
);

create table public.calendar_connections (
  id smallint primary key default 1 check (id = 1),
  provider text not null default 'google' check (provider = 'google'),
  connected_email text not null,
  refresh_token_ciphertext text not null,
  refresh_token_iv text not null,
  refresh_token_tag text not null,
  scopes text[] not null default '{}',
  connected_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.bookings (
  id uuid primary key default gen_random_uuid(),
  confirmation_code text not null unique,
  staff_id uuid not null references public.staff(id),
  service_id uuid not null references public.services(id),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  customer_notes text,
  sms_consent_at timestamptz,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  blocked_starts_at timestamptz not null,
  blocked_ends_at timestamptz not null,
  hold_expires_at timestamptz,
  status public.booking_status not null default 'pending',
  google_event_id text unique,
  google_event_link text,
  cancellation_token_hash text not null,
  cancelled_at timestamptz,
  cancellation_reason text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (starts_at < ends_at),
  check (blocked_starts_at <= starts_at),
  check (blocked_ends_at >= ends_at),
  check (blocked_starts_at < blocked_ends_at)
);

alter table public.bookings
  add constraint bookings_prevent_staff_overlap
  exclude using gist (
    staff_id with =,
    tstzrange(blocked_starts_at, blocked_ends_at, '[)') with &&
  )
  where (status in ('pending', 'confirmed'));

create table public.notification_deliveries (
  id uuid primary key default gen_random_uuid(),
  booking_id uuid not null references public.bookings(id) on delete cascade,
  channel public.notification_channel not null,
  template_key text not null,
  recipient text not null,
  provider_message_id text,
  status public.notification_status not null default 'pending',
  error_message text,
  sent_at timestamptz,
  delivered_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (booking_id, channel, template_key)
);

create index bookings_staff_start_idx on public.bookings (staff_id, starts_at);
create index bookings_customer_email_idx on public.bookings (lower(customer_email));
create index bookings_status_idx on public.bookings (status, starts_at);
create index weekly_availability_staff_day_idx
  on public.weekly_availability (staff_id, day_of_week);

create trigger salon_settings_updated_at
before update on public.salon_settings
for each row execute function public.set_updated_at();

create trigger admin_profiles_updated_at
before update on public.admin_profiles
for each row execute function public.set_updated_at();

create trigger staff_updated_at
before update on public.staff
for each row execute function public.set_updated_at();

create trigger services_updated_at
before update on public.services
for each row execute function public.set_updated_at();

create trigger staff_services_updated_at
before update on public.staff_services
for each row execute function public.set_updated_at();

create trigger weekly_availability_updated_at
before update on public.weekly_availability
for each row execute function public.set_updated_at();

create trigger calendar_connections_updated_at
before update on public.calendar_connections
for each row execute function public.set_updated_at();

create trigger bookings_updated_at
before update on public.bookings
for each row execute function public.set_updated_at();

create trigger notification_deliveries_updated_at
before update on public.notification_deliveries
for each row execute function public.set_updated_at();

alter table public.salon_settings enable row level security;
alter table public.admin_profiles enable row level security;
alter table public.staff enable row level security;
alter table public.services enable row level security;
alter table public.staff_services enable row level security;
alter table public.weekly_availability enable row level security;
alter table public.calendar_connections enable row level security;
alter table public.bookings enable row level security;
alter table public.notification_deliveries enable row level security;

revoke all on all tables in schema public from anon, authenticated;
grant all on all tables in schema public to service_role;
grant usage, select on all sequences in schema public to service_role;

insert into public.salon_settings (id) values (1)
on conflict (id) do nothing;

insert into public.services (
  slug,
  name,
  description,
  duration_minutes,
  buffer_after_minutes,
  requires_quote,
  sort_order
)
values
  ('dominican-blowout', 'Dominican blowout', 'Wash, condition, and signature blowout.', 90, 15, true, 10),
  ('color-highlights', 'Color or highlights', 'Color consultation and customized color service.', 180, 30, true, 20),
  ('extensions-wig', 'Extensions or wig service', 'Consultation-led extensions or wig appointment.', 180, 30, true, 30),
  ('braids', 'Braids', 'Braiding appointment tailored to the requested style.', 180, 30, true, 40),
  ('cut-barber', 'Cut or barber service', 'Haircut or barber appointment.', 45, 10, true, 50),
  ('beauty-supply', 'Beauty supply question', 'Short product consultation.', 20, 5, false, 60)
on conflict (slug) do update set
  name = excluded.name,
  description = excluded.description,
  duration_minutes = excluded.duration_minutes,
  buffer_after_minutes = excluded.buffer_after_minutes,
  requires_quote = excluded.requires_quote,
  sort_order = excluded.sort_order;
