-- Enable RLS (safe if already enabled)
alter table public.contact_messages enable row level security;

-- Public (anon) can submit messages
drop policy if exists "Public can insert contact messages" on public.contact_messages;
create policy "Public can insert contact messages"
  on public.contact_messages
  for insert
  to anon, authenticated
  with check (true);

-- Authenticated users (dashboard) can read/manage messages
drop policy if exists "Authenticated can view contact messages" on public.contact_messages;
create policy "Authenticated can view contact messages"
  on public.contact_messages
  for select
  to authenticated
  using (true);

drop policy if exists "Authenticated can update contact messages" on public.contact_messages;
create policy "Authenticated can update contact messages"
  on public.contact_messages
  for update
  to authenticated
  using (true)
  with check (true);

drop policy if exists "Authenticated can delete contact messages" on public.contact_messages;
create policy "Authenticated can delete contact messages"
  on public.contact_messages
  for delete
  to authenticated
  using (true);
