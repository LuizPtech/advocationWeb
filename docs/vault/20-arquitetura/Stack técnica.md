---
tags: [arquitetura, stack]
---

# Stack técnica

## Frontend
- **Next.js 16** (App Router) — SSR + Server Actions
- **TypeScript** + **Tailwind CSS 4**
- **lucide-react** para ícones
- **date-fns** (pt-BR) para datas
- **Cormorant Garamond** (títulos) + **Source Sans 3** (corpo)

## Backend / Dados
- **Supabase** (Postgres + Storage + Auth)
- Camada de acesso em [`src/lib/db.ts`](../../../src/lib/db.ts) — sem ORM
- Cliente Supabase configurado em [`src/lib/supabase.ts`](../../../src/lib/supabase.ts)

Ver [[Modelo de dados]].

## Autenticação
- **Auth.js v5 (NextAuth beta)** com provider `Credentials`
- Hash `bcrypt` para senhas
- JWT em sessão, sem tabela `sessions`
- Ver [[Autenticação e permissões]]

## Deploy
- **Vercel** — projeto `advocation-web`
- Preview automático por branch, produção no `main`
- Ver [[Ambientes e deploy]]

## Estrutura de pastas

```
src/
├── app/
│   ├── (site)/          # site público (route group)
│   ├── admin/           # painel autenticado
│   └── api/             # rotas de API
├── components/
├── lib/                 # brand, db, supabase, auth, templates, nav
└── types/
supabase/
├── schema.sql           # schema inicial
└── migrations.sql       # ALTERs incrementais
scripts/
└── seed-*.ts            # seeds e utilitários
```

## Convenções

- Server components por padrão; `"use client"` só quando precisa
- Server Actions inline para forms simples; extraídos para `actions.ts` quando complexos
- Feedback de forms com `useActionState` + `useFormStatus`
- Placeholders de documento em `{{escopo.campo}}` (ver [[Playbook - Gerar documentos]])
