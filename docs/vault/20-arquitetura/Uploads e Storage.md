---
tags: [arquitetura, storage]
---

# Uploads e Storage

## Bucket
`documents` no Supabase Storage — **privado** (sem leitura pública).

Criado por [`supabase/schema.sql`](../../../supabase/schema.sql):

```sql
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false);
```

## Upload

Rota: `POST /api/documents/upload`

1. Requer sessão (`ADMIN` ou dono do caso)
2. Arquivo vai para `documents/{caseId}/{timestamp}-{nome-sanitizado}`
3. Metadados salvos em `documents` (nome, mime, tamanho, path, `visible_to_client`)

Ver [`src/app/api/documents/upload/route.ts`](../../../src/app/api/documents/upload/route.ts).

## Download

Rota: `GET /api/documents/[id]`

1. Valida ownership (mesma lógica de [[Autenticação e permissões]])
2. `supabase.storage.from('documents').download(path)` — pega o arquivo
3. Devolve como `Content-Disposition: attachment`

## Limites e considerações

- Uploads passam pelo servidor (Next.js) — arquivos muito grandes (>10 MB) podem estourar limite da Vercel
- Ideal migrar para **signed URL** direto no Storage no futuro (ver [[Backlog - Ideias]])
