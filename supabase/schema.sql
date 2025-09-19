-- Schema definition for Ma & Co CRM workspace tables
-- Execute with: supabase db remote commit supabase/schema.sql

create extension if not exists pgcrypto;

create table if not exists clients (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  utr text,
  vat_number text,
  paye_reference text,
  companies_house_number text,
  email text,
  phone text,
  created_at timestamptz not null default now()
);

create index if not exists clients_owner_id_idx on clients(owner_id);

create table if not exists workers (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  email text,
  specialties text[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists workers_owner_id_idx on workers(owner_id);

create table if not exists tasks (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid references clients(id) on delete set null,
  assignee_id uuid references workers(id) on delete set null,
  title text not null,
  description text,
  due_date date,
  category text not null default 'General',
  status text not null default 'Pending',
  suggested_assignee_role text,
  created_at timestamptz not null default now()
);

create index if not exists tasks_owner_id_idx on tasks(owner_id);
create index if not exists tasks_client_id_idx on tasks(client_id);

create table if not exists documents (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid references clients(id) on delete set null,
  filename text not null,
  original_name text,
  storage_path text not null,
  description text,
  category text,
  uploaded_at timestamptz not null default now()
);

create index if not exists documents_owner_id_idx on documents(owner_id);
create index if not exists documents_client_id_idx on documents(client_id);

create table if not exists payments (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  client_id uuid references clients(id) on delete set null,
  stripe_session_id text not null unique,
  amount numeric(12,2) not null,
  currency text not null default 'gbp',
  description text,
  status text,
  url text,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

create index if not exists payments_owner_id_idx on payments(owner_id);
create index if not exists payments_client_id_idx on payments(client_id);
