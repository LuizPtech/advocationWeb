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
