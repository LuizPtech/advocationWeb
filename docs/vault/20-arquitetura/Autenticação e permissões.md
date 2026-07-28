---
tags: [arquitetura, seguranca]
---

# Autenticação e permissões

## Provider

Auth.js v5 com **Credentials** (email + senha). Sem OAuth por enquanto — a maioria dos clientes não tem conta Google/GitHub associada ao processo.

Arquivo: [`src/lib/auth.ts`](../../../src/lib/auth.ts)

## Fluxo

1. Cliente submete `/login`
2. `authorize()` busca `user` por email no Supabase
3. Compara senha com `bcrypt.compare`
4. Retorna `{ id, name, email, role }` — vai pro JWT
5. Callbacks colocam `id` e `role` no `session.user`

## Papéis

| Role | Acesso |
|---|---|
| `ADMIN` | Painel `/admin/*` completo |
| `CLIENT` | `/area-cliente` e apenas seus próprios dados |

## Middleware

[`src/middleware.ts`](../../../src/middleware.ts):
- `/admin/*` → precisa `ADMIN` (redireciona `CLIENT` para `/area-cliente`)
- `/area-cliente` → precisa qualquer login

## Onde clientes veem só o próprio

- `db.cases.byClient(session.user.id)` — todas queries filtram por `clientId`
- `db.documents.findById()` valida `case.clientId === session.user.id` na rota `/api/documents/[id]`
- Uploads (`/api/documents/upload`) checam ownership antes de gravar

## Contas atuais

- `lauraadv@lauraeva.adv.br` — ADMIN
- `luizphelipe@lauraeva.adv.br` — ADMIN

Senha em [[Contatos e acessos]].
