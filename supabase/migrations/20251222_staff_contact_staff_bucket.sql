-- Create/update timestamps helper
create extension if not exists pgcrypto;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- staff_members
create table if not exists public.staff_members (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  email text,
  phone text,
  specialties text[] not null default '{}'::text[],
  status text not null default 'published' check (status in ('published','draft')),
  "order" integer not null default 0,
  image_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_staff_members_updated_at on public.staff_members;
create trigger set_staff_members_updated_at
before update on public.staff_members
for each row execute function public.set_updated_at();

create index if not exists staff_members_status_idx on public.staff_members (status);
create index if not exists staff_members_order_idx on public.staff_members ("order");

alter table public.staff_members enable row level security;

do $$
begin
  create policy "Public can read published staff"
  on public.staff_members
  for select
  using (status = 'published');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create policy "Authenticated can manage staff"
  on public.staff_members
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
exception
  when duplicate_object then null;
end $$;

-- church_info (singleton by slug)
create table if not exists public.church_info (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  church_name text,
  email text,
  phone_primary text,
  phone_secondary text,
  whatsapp text,
  address_line1 text,
  address_line2 text,
  city text,
  region text,
  country text,
  map_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_church_info_updated_at on public.church_info;
create trigger set_church_info_updated_at
before update on public.church_info
for each row execute function public.set_updated_at();

alter table public.church_info enable row level security;

do $$
begin
  create policy "Public can read church info"
  on public.church_info
  for select
  using (true);
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create policy "Authenticated can manage church info"
  on public.church_info
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
exception
  when duplicate_object then null;
end $$;

-- service_times
create table if not exists public.service_times (
  id uuid primary key default gen_random_uuid(),
  day text not null,
  times text not null,
  special text,
  status text not null default 'published' check (status in ('published','draft')),
  "order" integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_service_times_updated_at on public.service_times;
create trigger set_service_times_updated_at
before update on public.service_times
for each row execute function public.set_updated_at();

create index if not exists service_times_status_idx on public.service_times (status);
create index if not exists service_times_order_idx on public.service_times ("order");

alter table public.service_times enable row level security;

do $$
begin
  create policy "Public can read published service times"
  on public.service_times
  for select
  using (status = 'published');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create policy "Authenticated can manage service times"
  on public.service_times
  for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
exception
  when duplicate_object then null;
end $$;

-- Storage bucket for staff photos
-- Note: requires Storage enabled in Supabase project
insert into storage.buckets (id, name, public)
values ('staff', 'staff', true)
on conflict (id) do nothing;

-- Do not ALTER storage.objects (see 20251221000000_initial_schema.sql).

do $$
begin
  create policy "Public read staff photos"
  on storage.objects
  for select
  using (bucket_id = 'staff');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create policy "Authenticated can upload staff photos"
  on storage.objects
  for insert
  with check (bucket_id = 'staff' and auth.role() = 'authenticated');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create policy "Authenticated can update staff photos"
  on storage.objects
  for update
  using (bucket_id = 'staff' and auth.role() = 'authenticated')
  with check (bucket_id = 'staff' and auth.role() = 'authenticated');
exception
  when duplicate_object then null;
end $$;

do $$
begin
  create policy "Authenticated can delete staff photos"
  on storage.objects
  for delete
  using (bucket_id = 'staff' and auth.role() = 'authenticated');
exception
  when duplicate_object then null;
end $$;

-- Seed defaults (won't overwrite existing values)

insert into public.church_info (
  slug,
  church_name,
  email,
  phone_primary,
  phone_secondary,
  whatsapp,
  address_line1,
  address_line2,
  city,
  region,
  country
)
values (
  'default',
  'GraceLife Mission International',
  'info@gracelifemission.org',
  '+233505983499',
  '+233244892719',
  '+233505983499',
  'Pomakrom, Oppsite VRA Quaters',
  'Techiman BE, Ghana',
  'Techiman',
  'Bono East',
  'Ghana'
)
on conflict (slug) do update set
  church_name = coalesce(public.church_info.church_name, excluded.church_name),
  email = coalesce(public.church_info.email, excluded.email),
  phone_primary = coalesce(public.church_info.phone_primary, excluded.phone_primary),
  phone_secondary = coalesce(public.church_info.phone_secondary, excluded.phone_secondary),
  whatsapp = coalesce(public.church_info.whatsapp, excluded.whatsapp),
  address_line1 = coalesce(public.church_info.address_line1, excluded.address_line1),
  address_line2 = coalesce(public.church_info.address_line2, excluded.address_line2),
  city = coalesce(public.church_info.city, excluded.city),
  region = coalesce(public.church_info.region, excluded.region),
  country = coalesce(public.church_info.country, excluded.country);

insert into public.service_times (day, times, special, status, "order")
select 'Sunday', '8:00 AM & 11:00 AM', 'Worship Services', 'published', 0
where not exists (select 1 from public.service_times);

insert into public.service_times (day, times, special, status, "order")
select 'Friday', '7:00 PM', 'Evening Service', 'published', 1
where exists (select 1 from public.service_times)
  and not exists (
    select 1 from public.service_times where day = 'Friday' and times = '7:00 PM'
  );
