-- Schema da plataforma Laura Eva (Supabase/Postgres)
-- Cole e execute no SQL Editor: https://supabase.com/dashboard/project/yqzofdehjsskrojditwy/sql

create extension if not exists "pgcrypto";

create table if not exists users (
  id text primary key,
  name text not null,
  email text not null unique,
  password_hash text not null,
  role text not null default 'CLIENT',
  phone text,
  cpf text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists leads (
  id text primary key,
  name text not null,
  email text not null,
  phone text,
  subject text not null,
  message text not null,
  area text,
  lgpd_consent boolean not null default false,
  status text not null default 'NEW',
  created_at timestamptz not null default now()
);

create table if not exists bookings (
  id text primary key,
  name text not null,
  email text not null,
  phone text,
  type text not null,
  area text not null,
  notes text,
  scheduled_at timestamptz not null,
  status text not null default 'PENDING',
  lgpd_consent boolean not null default false,
  user_id text references users(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists cases (
  id text primary key,
  title text not null,
  description text,
  area text not null,
  status text not null default 'OPEN',
  next_step text,
  deadline timestamptz,
  tags text not null default '[]',
  client_id text not null references users(id) on delete cascade,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists documents (
  id text primary key,
  name text not null,
  filename text not null,
  mime_type text not null,
  size integer not null,
  path text not null,
  visible_to_client boolean not null default true,
  case_id text references cases(id) on delete cascade,
  uploaded_by_id text not null references users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists messages (
  id text primary key,
  body text not null,
  case_id text not null references cases(id) on delete cascade,
  author_id text not null references users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists payments (
  id text primary key,
  description text not null,
  amount double precision not null,
  status text not null default 'PENDING',
  due_date timestamptz,
  paid_at timestamptz,
  receipt_url text,
  case_id text references cases(id) on delete set null,
  client_id text not null references users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists notes (
  id text primary key,
  body text not null,
  case_id text not null references cases(id) on delete cascade,
  author_id text not null references users(id) on delete cascade,
  created_at timestamptz not null default now()
);

create table if not exists blog_posts (
  id text primary key,
  slug text not null unique,
  title text not null,
  excerpt text not null,
  content text not null,
  area text,
  published boolean not null default true,
  published_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists availability_slots (
  id text primary key,
  weekday integer not null,
  start_time text not null,
  end_time text not null,
  active boolean not null default true
);

create table if not exists site_settings (
  id text primary key default 'default',
  name text not null,
  short_name text not null,
  title text not null,
  oab text not null,
  tagline text not null,
  headline text not null,
  about text not null,
  email text not null,
  phone text not null,
  whatsapp text not null,
  address text not null,
  city text not null,
  updated_at timestamptz not null default now()
);

create index if not exists bookings_scheduled_at_idx on bookings (scheduled_at);
create index if not exists cases_client_id_idx on cases (client_id);
create index if not exists documents_case_id_idx on documents (case_id);
create index if not exists messages_case_id_idx on messages (case_id);
create index if not exists payments_client_id_idx on payments (client_id);

-- Storage bucket for case documents
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict (id) do nothing;

-- Server uses secret key (bypasses RLS). Keep RLS on for safety with publishable key.
alter table users enable row level security;
alter table leads enable row level security;
alter table bookings enable row level security;
alter table cases enable row level security;
alter table documents enable row level security;
alter table messages enable row level security;
alter table payments enable row level security;
alter table notes enable row level security;
alter table blog_posts enable row level security;
alter table availability_slots enable row level security;
alter table site_settings enable row level security;

-- Public read for published blog + site settings (optional via publishable key)
drop policy if exists "Public read published blog" on blog_posts;
create policy "Public read published blog"
  on blog_posts for select
  using (published = true);

drop policy if exists "Public read site settings" on site_settings;
create policy "Public read site settings"
  on site_settings for select
  using (true);
