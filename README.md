# Advocacia Web — Dra. Laura Eva

Plataforma de advocacia com site editável, agendamento, área do cliente e painel admin — agora no **Supabase**.

## Stack

- Next.js (App Router) + TypeScript + Tailwind CSS
- Auth.js (credenciais)
- Supabase (Postgres + Storage)

## Configuração do banco (obrigatório 1x)

1. Abra o [SQL Editor](https://supabase.com/dashboard/project/yqzofdehjsskrojditwy/sql) do projeto
2. Cole e execute o arquivo [`supabase/schema.sql`](supabase/schema.sql)
3. Rode o seed:

```bash
npm install
npm run db:seed
npm run dev
```

Variáveis já esperadas no `.env`:

```env
SUPABASE_URL=...
SUPABASE_PUBLISHABLE_KEY=...
SUPABASE_SECRET_KEY=...
SUPABASE_JWKS_URL=...
```

## Contas demo

| Perfil  | E-mail                | Senha      |
|---------|-----------------------|------------|
| Admin   | admin@lauraeva.adv.br | admin123   |
| Cliente | cliente@exemplo.com   | cliente123 |

## Editável no painel

- `/admin/site` — nome, OAB, textos, contato
- Blog, leads, agenda, casos, clientes, honorários
- Documentos no **Supabase Storage** (bucket `documents`)
