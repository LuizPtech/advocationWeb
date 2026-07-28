---
tags: [roadmap, riscos]
---

# Riscos e pendências

Coisas que **podem quebrar** ou faltam antes de escalar.

## 🔴 Alto risco

### Sem CAPTCHA no formulário público
`/api/contact` e `/api/bookings` aceitam qualquer POST → **risco de spam** em escala. Prioridade se aparecer um bot.

Solução: hCaptcha ou Cloudflare Turnstile (gratuito).

### Uploads passam pelo servidor Vercel
Vercel Functions têm limite de payload (~4.5 MB). Arquivos maiores dão erro.

Solução: assinar URL direta no Supabase Storage e subir do browser.

### Sem versionamento do banco
Não temos rollback de migrations. Se `ALTER TABLE` quebrar, é manual.

Solução: adotar [Supabase CLI](https://supabase.com/docs/guides/cli) com `db diff` + migrations versionadas.

## 🟡 Médio risco

### AUTH_SECRET não rotacionado
Se vazar, invalida sessões todos os clientes. Rotacionar `AUTH_SECRET` uma vez ao ano ou após acesso indevido.

### Sem backup off-Supabase
Se conta Supabase for suspensa, perdemos dados. Backup semanal via `pg_dump` para outro storage seria ideal.

### Cliente-side ainda usa placeholder image
Foto padrão vem do Unsplash. Se caírem, quebra. Migrar para asset local em `public/`.

## 🟢 Baixo risco / dívida técnica

### Áreas de atuação em código
Se a advogada mudar de foco (ex.: começar a fazer criminal), precisa PR. Ver [[Backlog - Ideias]] → CMS.

### FAQ em código
Idem — perguntas frequentes hardcoded em `src/lib/brand.ts`. Tabela `faq_items` já existe no schema mas ainda não usada.

### Middleware deprecated warning
Next.js 16 recomenda `proxy.ts` no lugar de `middleware.ts`. Funciona, mas sai warning no build.

### Sem tests
Zero cobertura. Vale começar pelos server actions críticos: `createBooking`, `saveSite`, upload de docs.

---

Ver [[Roadmap - Próximas entregas]] para priorização.
