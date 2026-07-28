---
tags: [adr, decisao]
data: 2026-07-28
status: aceito
---

# ADR-001 — Supabase como banco

## Contexto
Precisávamos de banco relacional + storage + autenticação. Opções consideradas:

- **SQLite local** — usado no MVP inicial, mas não escala para produção multi-servidor
- **Postgres direto (Neon/Railway)** — bom, mas storage e auth ficam por conta
- **Supabase** — Postgres + Storage + Auth num pacote só, generous free tier
- **Firebase** — NoSQL, ecossistema Google

## Decisão
**Supabase**. Motivos:

- Postgres real (SQL, transactions, foreign keys)
- Storage privado por bucket pronto (documentos jurídicos = sensíveis)
- API REST auto-gerada (PostgREST) reduz boilerplate
- Custo previsível: free tier cobre projeto solo por bastante tempo

## Consequências
- Cliente Supabase JS é bem simples — sem ORM (Prisma) para reduzir dependências
- Row Level Security disponível se um dia precisarmos client-side direct access
- **Vendor lock-in moderado** — schema é Postgres puro, dá pra migrar. Mas Storage precisaria reescrever

## O que **não** aproveitamos (ainda)
- **Supabase Auth** — usamos Auth.js porque queremos JWT próprio e credenciais custom. Migrar para Supabase Auth abriria OAuth, magic link, mas custa refatoração.
- **Realtime** — poderia ser usado no chat cliente ⇄ advogada
- **Edge Functions** — nossos endpoints ficam na Vercel; sem motivo para duplicar
