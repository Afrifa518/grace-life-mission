-- Baseline schema for Grace Life Mission (runs before 20251222_* migrations)
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

-- sermons
create table if not exists public.sermons (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  speaker text,
  date date,
  duration text,
  description text,
  status text not null default 'draft',
  "youtubeUrl" text,
  "imageUrl" text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_sermons_updated_at on public.sermons;
create trigger set_sermons_updated_at
before update on public.sermons
for each row execute function public.set_updated_at();

create index if not exists sermons_status_date_idx on public.sermons (status, date desc);

alter table public.sermons enable row level security;

do $$ begin
  create policy "Public can read published sermons"
  on public.sermons for select
  using (status = 'published');
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Authenticated can manage sermons"
  on public.sermons for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
exception when duplicate_object then null;
end $$;

-- events
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  date date,
  time text,
  location text,
  description text,
  category text,
  recurring text,
  status text not null default 'draft',
  "imageUrl" text,
  schedule jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_events_updated_at on public.events;
create trigger set_events_updated_at
before update on public.events
for each row execute function public.set_updated_at();

create index if not exists events_status_date_idx on public.events (status, date);

alter table public.events enable row level security;

do $$ begin
  create policy "Public can read published events"
  on public.events for select
  using (status = 'published');
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Authenticated can manage events"
  on public.events for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
exception when duplicate_object then null;
end $$;

-- gallery
create table if not exists public.gallery (
  id uuid primary key default gen_random_uuid(),
  title text,
  date date,
  description text,
  type text not null default 'photo',
  status text not null default 'published',
  "imageUrl" text,
  "youtubeUrl" text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_gallery_updated_at on public.gallery;
create trigger set_gallery_updated_at
before update on public.gallery
for each row execute function public.set_updated_at();

create index if not exists gallery_status_date_idx on public.gallery (status, date desc);

alter table public.gallery enable row level security;

do $$ begin
  create policy "Public can read published gallery"
  on public.gallery for select
  using (status = 'published');
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Authenticated can manage gallery"
  on public.gallery for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
exception when duplicate_object then null;
end $$;

-- leaders
create table if not exists public.leaders (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  role text,
  "order" integer not null default 0,
  bio text,
  status text not null default 'published',
  "imageUrl" text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_leaders_updated_at on public.leaders;
create trigger set_leaders_updated_at
before update on public.leaders
for each row execute function public.set_updated_at();

create index if not exists leaders_status_order_idx on public.leaders (status, "order");

alter table public.leaders enable row level security;

do $$ begin
  create policy "Public can read published leaders"
  on public.leaders for select
  using (status = 'published');
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Authenticated can manage leaders"
  on public.leaders for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
exception when duplicate_object then null;
end $$;

-- ministries
create table if not exists public.ministries (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  subtitle text,
  leader text,
  "meetingTime" text,
  description text,
  color text,
  status text not null default 'published',
  "order" integer not null default 0,
  features text[] not null default '{}'::text[],
  "imageUrl" text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists set_ministries_updated_at on public.ministries;
create trigger set_ministries_updated_at
before update on public.ministries
for each row execute function public.set_updated_at();

create index if not exists ministries_status_order_idx on public.ministries (status, "order");

alter table public.ministries enable row level security;

do $$ begin
  create policy "Public can read published ministries"
  on public.ministries for select
  using (status = 'published');
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Authenticated can manage ministries"
  on public.ministries for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
exception when duplicate_object then null;
end $$;

-- site_config (key/value hero images etc.)
create table if not exists public.site_config (
  key text primary key,
  value text,
  updated_at timestamptz not null default now()
);

drop trigger if exists set_site_config_updated_at on public.site_config;
create trigger set_site_config_updated_at
before update on public.site_config
for each row execute function public.set_updated_at();

alter table public.site_config enable row level security;

do $$ begin
  create policy "Public can read site config"
  on public.site_config for select
  using (true);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Authenticated can manage site config"
  on public.site_config for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
exception when duplicate_object then null;
end $$;

-- contact_messages (RLS details finalized in 20251222_contact_messages_rls.sql)
create table if not exists public.contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  subject text,
  message text not null,
  visit_reason text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists contact_messages_created_idx on public.contact_messages (created_at desc);
create index if not exists contact_messages_status_idx on public.contact_messages (status);

alter table public.contact_messages enable row level security;

do $$ begin
  create policy "Public can insert contact messages"
  on public.contact_messages for insert
  to anon, authenticated
  with check (true);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Authenticated can view contact messages"
  on public.contact_messages for select
  to authenticated
  using (true);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Authenticated can update contact messages"
  on public.contact_messages for update
  to authenticated
  using (true)
  with check (true);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Authenticated can delete contact messages"
  on public.contact_messages for delete
  to authenticated
  using (true);
exception when duplicate_object then null;
end $$;

-- event_rsvps
create table if not exists public.event_rsvps (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.events(id) on delete set null,
  event_title text,
  event_date date,
  name text not null,
  email text not null,
  phone text,
  guests integer not null default 1,
  message text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists event_rsvps_created_idx on public.event_rsvps (created_at desc);

alter table public.event_rsvps enable row level security;

do $$ begin
  create policy "Public can insert event rsvps"
  on public.event_rsvps for insert
  to anon, authenticated
  with check (true);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Authenticated can manage event rsvps"
  on public.event_rsvps for all
  to authenticated
  using (true)
  with check (true);
exception when duplicate_object then null;
end $$;

-- ministry_registrations
create table if not exists public.ministry_registrations (
  id uuid primary key default gen_random_uuid(),
  ministry_id uuid references public.ministries(id) on delete set null,
  ministry_title text,
  name text not null,
  email text not null,
  phone text,
  message text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

create index if not exists ministry_registrations_created_idx on public.ministry_registrations (created_at desc);

alter table public.ministry_registrations enable row level security;

do $$ begin
  create policy "Public can insert ministry registrations"
  on public.ministry_registrations for insert
  to anon, authenticated
  with check (true);
exception when duplicate_object then null;
end $$;

do $$ begin
  create policy "Authenticated can manage ministry registrations"
  on public.ministry_registrations for all
  to authenticated
  using (true)
  with check (true);
exception when duplicate_object then null;
end $$;

-- Storage buckets used by the app (public URLs)
insert into storage.buckets (id, name, public)
values
  ('site', 'site', true),
  ('sermons', 'sermons', true),
  ('events', 'events', true),
  ('gallery', 'gallery', true),
  ('leaders', 'leaders', true),
  ('ministries', 'ministries', true)
on conflict (id) do nothing;

-- Do not ALTER storage.objects here: hosted Supabase owns that table; enabling RLS requires owner
-- and fails in SQL Editor (42501). RLS on storage.objects is already enabled by default.

-- Storage policies: public read, authenticated write (explicit names for idempotency)
do $$ begin create policy "Public read site storage" on storage.objects for select using (bucket_id = 'site'); exception when duplicate_object then null; end $$;
do $$ begin create policy "Authenticated insert site storage" on storage.objects for insert with check (bucket_id = 'site' and auth.role() = 'authenticated'); exception when duplicate_object then null; end $$;
do $$ begin create policy "Authenticated update site storage" on storage.objects for update using (bucket_id = 'site' and auth.role() = 'authenticated') with check (bucket_id = 'site' and auth.role() = 'authenticated'); exception when duplicate_object then null; end $$;
do $$ begin create policy "Authenticated delete site storage" on storage.objects for delete using (bucket_id = 'site' and auth.role() = 'authenticated'); exception when duplicate_object then null; end $$;

do $$ begin create policy "Public read sermons storage" on storage.objects for select using (bucket_id = 'sermons'); exception when duplicate_object then null; end $$;
do $$ begin create policy "Authenticated insert sermons storage" on storage.objects for insert with check (bucket_id = 'sermons' and auth.role() = 'authenticated'); exception when duplicate_object then null; end $$;
do $$ begin create policy "Authenticated update sermons storage" on storage.objects for update using (bucket_id = 'sermons' and auth.role() = 'authenticated') with check (bucket_id = 'sermons' and auth.role() = 'authenticated'); exception when duplicate_object then null; end $$;
do $$ begin create policy "Authenticated delete sermons storage" on storage.objects for delete using (bucket_id = 'sermons' and auth.role() = 'authenticated'); exception when duplicate_object then null; end $$;

do $$ begin create policy "Public read events storage" on storage.objects for select using (bucket_id = 'events'); exception when duplicate_object then null; end $$;
do $$ begin create policy "Authenticated insert events storage" on storage.objects for insert with check (bucket_id = 'events' and auth.role() = 'authenticated'); exception when duplicate_object then null; end $$;
do $$ begin create policy "Authenticated update events storage" on storage.objects for update using (bucket_id = 'events' and auth.role() = 'authenticated') with check (bucket_id = 'events' and auth.role() = 'authenticated'); exception when duplicate_object then null; end $$;
do $$ begin create policy "Authenticated delete events storage" on storage.objects for delete using (bucket_id = 'events' and auth.role() = 'authenticated'); exception when duplicate_object then null; end $$;

do $$ begin create policy "Public read gallery storage" on storage.objects for select using (bucket_id = 'gallery'); exception when duplicate_object then null; end $$;
do $$ begin create policy "Authenticated insert gallery storage" on storage.objects for insert with check (bucket_id = 'gallery' and auth.role() = 'authenticated'); exception when duplicate_object then null; end $$;
do $$ begin create policy "Authenticated update gallery storage" on storage.objects for update using (bucket_id = 'gallery' and auth.role() = 'authenticated') with check (bucket_id = 'gallery' and auth.role() = 'authenticated'); exception when duplicate_object then null; end $$;
do $$ begin create policy "Authenticated delete gallery storage" on storage.objects for delete using (bucket_id = 'gallery' and auth.role() = 'authenticated'); exception when duplicate_object then null; end $$;

do $$ begin create policy "Public read leaders storage" on storage.objects for select using (bucket_id = 'leaders'); exception when duplicate_object then null; end $$;
do $$ begin create policy "Authenticated insert leaders storage" on storage.objects for insert with check (bucket_id = 'leaders' and auth.role() = 'authenticated'); exception when duplicate_object then null; end $$;
do $$ begin create policy "Authenticated update leaders storage" on storage.objects for update using (bucket_id = 'leaders' and auth.role() = 'authenticated') with check (bucket_id = 'leaders' and auth.role() = 'authenticated'); exception when duplicate_object then null; end $$;
do $$ begin create policy "Authenticated delete leaders storage" on storage.objects for delete using (bucket_id = 'leaders' and auth.role() = 'authenticated'); exception when duplicate_object then null; end $$;

do $$ begin create policy "Public read ministries storage" on storage.objects for select using (bucket_id = 'ministries'); exception when duplicate_object then null; end $$;
do $$ begin create policy "Authenticated insert ministries storage" on storage.objects for insert with check (bucket_id = 'ministries' and auth.role() = 'authenticated'); exception when duplicate_object then null; end $$;
do $$ begin create policy "Authenticated update ministries storage" on storage.objects for update using (bucket_id = 'ministries' and auth.role() = 'authenticated') with check (bucket_id = 'ministries' and auth.role() = 'authenticated'); exception when duplicate_object then null; end $$;
do $$ begin create policy "Authenticated delete ministries storage" on storage.objects for delete using (bucket_id = 'ministries' and auth.role() = 'authenticated'); exception when duplicate_object then null; end $$;
