-- Row Level Security policies for Ma & Co CRM
-- Run after confirming your schema is created: supabase db remote commit supabase/rls.sql

alter table clients enable row level security;
alter table workers enable row level security;
alter table tasks enable row level security;
alter table documents enable row level security;
alter table payments enable row level security;

create policy "select own clients" on clients
  for select using (owner_id = auth.uid());
create policy "mutate own clients" on clients
  for all using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "select own workers" on workers
  for select using (owner_id = auth.uid());
create policy "mutate own workers" on workers
  for all using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "select own tasks" on tasks
  for select using (owner_id = auth.uid());
create policy "insert own tasks" on tasks
  for insert with check (owner_id = auth.uid());
create policy "update own tasks" on tasks
  for update using (owner_id = auth.uid())
  with check (owner_id = auth.uid());
create policy "delete own tasks" on tasks
  for delete using (owner_id = auth.uid());

create policy "select own documents" on documents
  for select using (owner_id = auth.uid());
create policy "mutate own documents" on documents
  for all using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "select own payments" on payments
  for select using (owner_id = auth.uid());
create policy "insert own payments" on payments
  for insert with check (owner_id = auth.uid());
create policy "update own payments" on payments
  for update using (owner_id = auth.uid())
  with check (owner_id = auth.uid());
create policy "delete own payments" on payments
  for delete using (owner_id = auth.uid());
