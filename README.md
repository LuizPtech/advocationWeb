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

## Deploy na Vercel

1. Execute `supabase/schema.sql` no SQL Editor e rode `npm run db:seed` (localmente, uma vez).
2. Em [vercel.com/new](https://vercel.com/new), importe o repositório `LuizPtech/advocationWeb`.
3. Em **Environment Variables**, cadastre:

| Nome | Valor |
|------|--------|
| `AUTH_SECRET` | string longa aleatória (ex.: `openssl rand -base64 32`) |
| `AUTH_TRUST_HOST` | `true` |
| `NEXT_PUBLIC_APP_URL` | URL do projeto (ex.: `https://seu-app.vercel.app`) |
| `SUPABASE_URL` | `https://yqzofdehjsskrojditwy.supabase.co` |
| `SUPABASE_PUBLISHABLE_KEY` | sua publishable key |
| `SUPABASE_SECRET_KEY` | sua secret key |
| `SUPABASE_JWKS_URL` | `https://yqzofdehjsskrojditwy.supabase.co/auth/v1/.well-known/jwks.json` |

4. Branch de produção: a que contém o app (ex.: `cursor/plataforma-advocacia-mvp-80ab` ou `main` após o merge).
5. Deploy → aguarde o build → abra a URL da Vercel.
6. Atualize `NEXT_PUBLIC_APP_URL` com a URL final e faça **Redeploy**.
