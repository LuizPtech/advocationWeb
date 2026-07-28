-- Migração incremental: fotos e FAQ editáveis
-- Execute no SQL Editor do Supabase (após supabase/schema.sql).

alter table site_settings
  add column if not exists photo_url text,
  add column if not exists hero_image_url text,
  add column if not exists show_photo boolean not null default true,
  add column if not exists faq text not null default '[]';

create table if not exists faq_items (
  id text primary key,
  question text not null,
  answer text not null,
  position integer not null default 0,
  created_at timestamptz not null default now()
);

alter table faq_items enable row level security;
drop policy if exists "Public read faq" on faq_items;
create policy "Public read faq"
  on faq_items for select
  using (true);

create table if not exists expenses (
  id text primary key,
  description text not null,
  amount double precision not null,
  category text not null default 'geral',
  incurred_at timestamptz not null default now(),
  notes text,
  created_at timestamptz not null default now()
);

alter table expenses enable row level security;

create table if not exists document_templates (
  id text primary key,
  name text not null,
  category text not null default 'geral',
  content text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table document_templates enable row level security;

create table if not exists nav_items (
  id text primary key,
  label text not null,
  href text not null,
  position integer not null default 0,
  visible boolean not null default true,
  created_at timestamptz not null default now()
);

alter table nav_items enable row level security;
drop policy if exists "Public read nav" on nav_items;
create policy "Public read nav"
  on nav_items for select
  using (visible = true);
