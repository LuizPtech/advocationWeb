---
tags: [arquitetura, deploy]
---

# Ambientes e deploy

## Vercel

- Projeto: `advocation-web`
- Time: `luiz-ph-tech`
- Produção: https://advocation-web.vercel.app
- Preview: URL por commit no dashboard

## Branches

| Branch | Ambiente |
|---|---|
| `main` | Produção |
| qualquer outra | Preview automático |

## Variáveis de ambiente

Cadastradas em **Vercel → Settings → Environment Variables**:

| Nome | Uso |
|---|---|
| `AUTH_SECRET` | Assinar JWT do Auth.js (`openssl rand -base64 32`) |
| `AUTH_TRUST_HOST` | `true` (necessário fora do localhost) |
| `NEXT_PUBLIC_APP_URL` | URL pública do site |
| `SUPABASE_URL` | Endpoint do projeto |
| `SUPABASE_PUBLISHABLE_KEY` | Chave pública (client-side) |
| `SUPABASE_SECRET_KEY` | Chave secreta (server) |
| `SUPABASE_JWKS_URL` | JWKS para verificar tokens Supabase Auth (futuro) |

Ver `.env.example` na raiz.

## Fluxo de deploy

1. Commit push para branch
2. Vercel roda `next build` — cerca de 40 s
3. Preview publicado automaticamente
4. Merge para `main` → deploy em produção

## Rollback

Vercel → Deployments → deployment antigo → **Promote to Production**.

Sem migrations reversíveis por enquanto — cuidado com breaking changes de schema. Ver [[Riscos e pendências]].
