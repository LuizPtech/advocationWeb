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

## Documentação / base de conhecimento

Vault Obsidian em [`docs/vault/`](docs/vault/) — abra a pasta no Obsidian e comece por [`00 - Início`](docs/vault/00-inicio/00%20-%20Início.md). Contém:

- Visão geral do produto e personas
- Arquitetura (stack, dados, auth, storage, deploy)
- Playbooks operacionais (editar site, agenda, financeiro, modelos, blog)
- Roadmap priorizado + backlog de ideias
- Riscos e ADRs (decisões técnicas)

## Editável no painel

- `/admin/site` — nome, OAB, textos, contato
- Blog, leads, agenda, casos, clientes, honorários
- Documentos no **Supabase Storage** (bucket `documents`)

## Deploy na Vercel

Projeto já conectado: [advocation-web](https://vercel.com/luiz-ph-tech/advocation-web)  
URL: https://advocation-web.vercel.app

### Variáveis de ambiente (obrigatório)

Em **Project → Settings → Environment Variables**, cadastre para Production/Preview:

| Nome | Valor |
|------|--------|
| `AUTH_SECRET` | string longa aleatória (`openssl rand -base64 32`) |
| `AUTH_TRUST_HOST` | `true` |
| `NEXT_PUBLIC_APP_URL` | `https://advocation-web.vercel.app` |
| `SUPABASE_URL` | `https://yqzofdehjsskrojditwy.supabase.co` |
| `SUPABASE_PUBLISHABLE_KEY` | sua publishable key |
| `SUPABASE_SECRET_KEY` | sua secret key |
| `SUPABASE_JWKS_URL` | `https://yqzofdehjsskrojditwy.supabase.co/auth/v1/.well-known/jwks.json` |

Depois de salvar, faça **Redeploy**.

### Usuários admin

- `lauraadv@lauraeva.adv.br`
- `luizphelipe@lauraeva.adv.br`

SQL de criação: [`supabase/create-users.sql`](supabase/create-users.sql)
