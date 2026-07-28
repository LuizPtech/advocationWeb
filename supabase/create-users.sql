-- Usuários reais da plataforma Laura Eva
-- Execute no SQL Editor do Supabase DEPOIS de supabase/schema.sql
-- Senhas já estão com hash bcrypt (não use a senha em texto puro no banco).

-- Remove contas de demonstração, se existirem
delete from messages
where author_id in (
  select id from users
  where email in ('admin@lauraeva.adv.br', 'cliente@exemplo.com')
);

delete from notes
where author_id in (
  select id from users
  where email in ('admin@lauraeva.adv.br', 'cliente@exemplo.com')
);

delete from documents
where uploaded_by_id in (
  select id from users
  where email in ('admin@lauraeva.adv.br', 'cliente@exemplo.com')
);

delete from payments
where client_id in (
  select id from users
  where email in ('admin@lauraeva.adv.br', 'cliente@exemplo.com')
);

delete from bookings
where user_id in (
  select id from users
  where email in ('admin@lauraeva.adv.br', 'cliente@exemplo.com')
);

delete from cases
where client_id in (
  select id from users
  where email in ('admin@lauraeva.adv.br', 'cliente@exemplo.com')
);

delete from users
where email in ('admin@lauraeva.adv.br', 'cliente@exemplo.com');

-- Advogada (admin)
insert into users (id, name, email, password_hash, role, phone, updated_at)
values (
  'usr_laura_eva_admin',
  'Dra. Laura Eva',
  'lauraadv@lauraeva.adv.br',
  '$2b$10$WJHVQGYQDWqGHHcmgb1vo.NBcCtU4ZPsP49clR9M0HxwjBWDrX5WK',
  'ADMIN',
  null,
  now()
)
on conflict (email) do update set
  name = excluded.name,
  password_hash = excluded.password_hash,
  role = 'ADMIN',
  updated_at = now();

-- Luiz Phelipe (admin)
insert into users (id, name, email, password_hash, role, phone, updated_at)
values (
  'usr_luiz_phelipe_admin',
  'Luiz Phelipe',
  'luizphelipe@lauraeva.adv.br',
  '$2b$10$WJHVQGYQDWqGHHcmgb1vo.NBcCtU4ZPsP49clR9M0HxwjBWDrX5WK',
  'ADMIN',
  null,
  now()
)
on conflict (email) do update set
  name = excluded.name,
  password_hash = excluded.password_hash,
  role = 'ADMIN',
  updated_at = now();
