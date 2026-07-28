---
tags: [adr, decisao]
data: 2026-07-28
status: aceito
---

# ADR-002 — Menu e conteúdo editáveis via banco

## Contexto
Advogada quer autonomia: mudar foto, texto e menu sem depender de dev. Tínhamos duas opções:

1. **Tudo hardcoded** — arquivos `.ts` com strings; simples mas cada mudança = PR
2. **CMS embutido** — colocar dados no banco, renderizar dinamicamente
3. **CMS externo** (Sanity, Contentful) — poderoso, mas dependência extra

## Decisão
**Opção 2** para os campos mais mudados: identidade, textos, foto, menu, blog.
**Opção 1** ainda para: áreas de atuação, "como funciona", FAQ.

Rationale:
- Áreas mudam raramente e envolvem SEO / URL. PR é aceitável.
- Menu e textos mudam com frequência → precisam ser autoatendíveis.

## Como funciona
- Tabela `site_settings` (singleton `id='default'`)
- Tabela `nav_items` (rows com `position`, `visible`)
- `getBrand()` e `getNavItems()` leem com **fallback** para os defaults em código
- Se o banco não tem row, o site ainda renderiza normal

## Consequências
- Novos deploys funcionam mesmo antes de rodar `migrations.sql`
- Preciso lembrar de expor os campos novos em `/admin/site` e `/admin/menu`
- Áreas de atuação vão continuar demandando dev — [[Backlog - Ideias]] tem "CMS de páginas fixas" para eliminar isso
