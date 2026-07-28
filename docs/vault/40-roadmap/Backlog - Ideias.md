---
tags: [roadmap, backlog]
---

# Backlog — Ideias

Coisas que **podem** entrar, mas ainda não estão priorizadas. Sinta-se livre para adicionar / mover para [[Roadmap - Próximas entregas]].

## Site / marketing
- Depoimentos de clientes (com foto opcional e case)
- Formulário multi-etapa para triagem antes de agendar
- Landing pages por área (SEO específico para "advogada divórcio SP")
- Chat com IA para tirar dúvidas frequentes 24/7
- Modo escuro
- Trocar paleta pelo painel (dourado/verde/azul)

## Área do cliente
- Notificação push / e-mail quando entra documento novo
- Assinatura digital (cliente assina contrato pelo painel)
- Timeline visual do caso ("hoje: aguardando decisão do juiz")
- Boletos / PIX para pagar honorários

## Painel admin
- Editor rich text (negrito, listas) no blog e templates
- Templates com formatação avançada (cabeçalho com logo, rodapé com contato)
- Preview do documento gerado antes de imprimir
- Bulk upload de clientes por CSV
- Exportar tudo para backup (LGPD — direito à portabilidade)

## Automação
- Lembrete de consulta 24h antes (e-mail + WhatsApp)
- Aniversário de cliente → mensagem automática
- Deadline se aproximando → notificação
- Follow-up de lead que não respondeu em 48h

## Financeiro
- Categorização automática de despesas por regex
- Conciliação bancária (upload OFX)
- DRE mensal / anual
- Emitir NF-e / NFS-e
- Comissões para parceiros/indicadores

## Jurídico específico
- Integração com **PJe** (leitura de andamentos)
- Integração com **e-SAJ**
- Consulta de CPF/CNPJ na Receita
- Cálculo de correção monetária (BACEN)
- Modelo de petições com preenchimento de dados do processo

## Técnico
- Migrar uploads para signed URL direto no Storage
- Adicionar testes E2E (Playwright)
- Rate limit nos endpoints públicos (`/api/contact`, `/api/bookings`)
- CAPTCHA no formulário de contato (spam)
- Backup automático do banco
- Logs estruturados (Vercel Log Drain ou Axiom)
